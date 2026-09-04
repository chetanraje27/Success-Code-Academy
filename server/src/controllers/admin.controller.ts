import type { Request, Response } from 'express';
import {
  User,
  Admin,
  CourseRegistration,
  ScholarshipRegistration,
  Banner,
  Notification,
  StarStudent,
  ContactMessage,
  SiteSetting,
  TopperResult,
  ContentBlock,
  MediaRevision,
  NewsArticle,
  AcademyVideo,
  Course,
  sequelize,
} from '../models';
import type {
  MediaRevisionAction,
  MediaResourceType,
} from '../models/MediaRevision';
import type { BannerCreationAttributes } from '../models/Banner';
import type { StarStudentCreationAttributes } from '../models/StarStudent';
import type { TopperResultCreationAttributes } from '../models/TopperResult';
import type { NewsArticleCreationAttributes } from '../models/NewsArticle';
import type { AcademyVideoCreationAttributes } from '../models/AcademyVideo';
import { restoreValues } from '../utils/mediaRevision';
import { asyncHandler } from '../utils/asyncHandler';
import { ADMIN, SUPER_ADMIN } from '../config/roles';
import bcrypt from 'bcrypt';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';
import { sendMail } from '../utils/mailer';
import { adminPasswordResetEmail, contactFormStaffAlert } from '../utils/emailTemplates';
import {
  buildResetUrl,
  issueAdminPasswordReset,
  checkResetCooldown,
} from '../utils/adminPasswordReset';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';
import { Op } from 'sequelize';
import type { Transaction } from 'sequelize';

let supabase: ReturnType<typeof createClient> | null = null;
const getSupabase = () => {
  if (supabase) return supabase;
  const supabaseUrl = process.env.SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
  console.log('getSupabase debug: url=', supabaseUrl ? 'exists' : 'empty', 'key=', supabaseKey ? 'exists' : 'empty');
  if (supabaseUrl && supabaseKey) {
    try {
      supabase = createClient(supabaseUrl, supabaseKey);
    } catch (e) {
      console.error('getSupabase error:', e);
    }
  }
  return supabase;
};

// --- File Upload Setup (Supabase Storage) ---
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
  fileFilter: (_req, file, callback) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'];
    if (!allowed.includes(file.mimetype)) {
      callback(new AppError('Upload a JPG, PNG, WebP, GIF image, or MP4/WebM video.', 415));
      return;
    }
    callback(null, true);
  },
}).single('image');

const MEDIA_SIGNATURES: Record<string, (buffer: Buffer) => boolean> = {
  'image/jpeg': (buffer) =>
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff,
  'image/png': (buffer) =>
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    ),
  'image/webp': (buffer) =>
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buffer.subarray(8, 12).toString('ascii') === 'WEBP',
  'image/gif': (buffer) =>
    buffer.length >= 6 &&
    ['GIF87a', 'GIF89a'].includes(buffer.subarray(0, 6).toString('ascii')),
  'video/mp4': (buffer) =>
    buffer.length >= 8 &&
    buffer.subarray(4, 8).toString('ascii') === 'ftyp',
  'video/webm': (buffer) =>
    buffer.length >= 4 &&
    buffer[0] === 0x1a && buffer[1] === 0x45 && buffer[2] === 0xdf && buffer[3] === 0xa3,
};

const MEDIA_EXTENSIONS: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'video/mp4': '.mp4',
  'video/webm': '.webm',
};

type RevisionableMedia = Banner | StarStudent | TopperResult | NewsArticle | AcademyVideo;

async function recordMediaRevision(
  resourceType: MediaResourceType,
  item: RevisionableMedia,
  action: MediaRevisionAction,
  createdBy: number | undefined,
  transaction: Transaction,
) {
  return MediaRevision.create(
    {
      resourceType,
      resourceId: item.id,
      action,
      snapshot: item.toJSON() as Record<string, unknown>,
      createdBy: createdBy ?? null,
    },
    { transaction },
  );
}

// --- Image Upload Endpoint ---
export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError('No image file provided.', 400);
  }

  const signatureMatches = MEDIA_SIGNATURES[req.file.mimetype]?.(req.file.buffer);
  if (!signatureMatches) {
    throw new AppError('The uploaded file is not a valid image or video.', 415);
  }

  const client = getSupabase();
  if (!client) {
    throw new AppError('Storage is not configured on the server.', 500);
  }

  let folder = 'uploads';
  if (req.query.type === 'banner') folder = 'banners';
  else if (req.query.type === 'star') folder = 'stars';
  else if (req.query.type === 'result') folder = 'results';
  else if (req.query.type === 'news') folder = 'news';
  else if (req.query.type === 'video') folder = 'videos';

  // Generate unique filename
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const ext = MEDIA_EXTENSIONS[req.file.mimetype];
  const filename = `${folder}/${uniqueSuffix}${ext}`;

  // Upload to Supabase Storage bucket named 'images'
  const { data, error } = await client.storage
    .from('images')
    .upload(filename, req.file.buffer, {
      contentType: req.file.mimetype,
      upsert: false
    });

  if (error) {
    console.error("Supabase storage upload error:", error);
    throw new AppError(`Failed to upload image: ${error.message}`, 500);
  }

  // Get public URL
  const { data: publicUrlData } = client.storage
    .from('images')
    .getPublicUrl(filename);

  res.status(200).json({
    status: 'success',
    data: {
      url: publicUrlData.publicUrl,
    },
  });
});

// --- Signed URL Endpoint (Direct Upload) ---
export const getSignedUploadUrl = asyncHandler(async (req: Request, res: Response) => {
  const { fileName, contentType, type = 'uploads' } = req.body;

  if (!fileName || !contentType) {
    throw new AppError('fileName and contentType are required in the body.', 400);
  }

  const client = getSupabase();
  if (!client) {
    throw new AppError('Storage is not configured on the server.', 500);
  }

  let folder = 'uploads';
  if (type === 'banner') folder = 'banners';
  else if (type === 'star') folder = 'stars';
  else if (type === 'result') folder = 'results';
  else if (type === 'news') folder = 'news';
  else if (type === 'video') folder = 'videos';

  const extMatch = fileName.match(/\.[0-9a-z]+$/i);
  const ext = extMatch ? extMatch[0] : '';
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const storagePath = `${folder}/${uniqueSuffix}${ext}`;

  const { data, error } = await client.storage
    .from('images')
    .createSignedUploadUrl(storagePath);

  if (error || !data) {
    console.error("Supabase signed URL error:", error);
    throw new AppError(`Failed to generate signed URL: ${error?.message || 'Unknown error'}`, 500);
  }

  const { data: publicUrlData } = client.storage
    .from('images')
    .getPublicUrl(storagePath);

  res.status(200).json({
    status: 'success',
    data: {
      signedUrl: data.signedUrl,
      publicUrl: publicUrlData.publicUrl,
    },
  });
});

// --- Dashboard Stats ---
export const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
  const [
    totalStudents,
    totalCourseForms,
    totalScholarshipForms,
    totalContactMessages,
    totalCourses,
    recentStudents,
    recentCourseRegistrations,
    recentScholarships,
    recentContactMessages,
    courseBreakdown,
  ] = await Promise.all([
    User.count({ where: { role: 'student' } }),
    CourseRegistration.count(),
    ScholarshipRegistration.count(),
    ContactMessage.count().catch(() => 0),
    Course.count().catch(() => 0),
    User.findAll({
      where: { role: 'student' },
      limit: 10,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'firstName', 'lastName', 'email', 'mobileNumber', 'createdAt'],
    }),
    CourseRegistration.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'courseTitle', 'studentName', 'studentEmail', 'studentPhone', 'createdAt'],
    }).catch(() => []),
    ScholarshipRegistration.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'studentName', 'studentPhone', 'studentClass', 'preferredCourse', 'createdAt'],
    }).catch(() => []),
    ContactMessage.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'name', 'email', 'phone', 'message', 'createdAt'],
    }).catch(() => []),
    CourseRegistration.findAll({
      attributes: [
        'courseTitle',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['courseTitle'],
      order: [[sequelize.literal('count'), 'DESC']],
      limit: 6,
      raw: true,
    }).catch(() => []),
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      totalStudents: totalStudents ?? 0,
      totalCourseForms: totalCourseForms ?? 0,
      totalScholarshipForms: totalScholarshipForms ?? 0,
      totalContactMessages: totalContactMessages ?? 0,
      totalCourses: totalCourses ?? 0,
      recentStudents: recentStudents ?? [],
      recentCourseRegistrations: recentCourseRegistrations ?? [],
      recentScholarships: recentScholarships ?? [],
      recentContactMessages: recentContactMessages ?? [],
      courseBreakdown: courseBreakdown ?? [],
    },
  });
});

// --- Banners CRUD ---
export const getBanners = asyncHandler(async (req: Request, res: Response) => {
  const banners = await Banner.findAll({ order: [['orderIndex', 'ASC']] });
  res.status(200).json({ status: 'success', data: banners });
});

export const createBanner = asyncHandler(async (req: Request, res: Response) => {
  const banner = await Banner.create(req.body);
  res.status(201).json({ status: 'success', data: banner });
});

export const updateBanner = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const banner = await sequelize.transaction(async (transaction) => {
    const current = await Banner.findByPk(id as string, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    if (!current) throw new AppError('Banner not found', 404);
    await recordMediaRevision('banner', current, 'update', req.user?.id, transaction);
    return current.update(req.body, { transaction });
  });
  res.status(200).json({ status: 'success', data: banner });
});

export const deleteBanner = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const revision = await sequelize.transaction(async (transaction) => {
    const banner = await Banner.findByPk(id as string, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    if (!banner) throw new AppError('Banner not found', 404);
    const saved = await recordMediaRevision(
      'banner',
      banner,
      'delete',
      req.user?.id,
      transaction,
    );
    await banner.destroy({ transaction });
    return saved;
  });
  res.status(200).json({ status: 'success', data: { revisionId: revision.id } });
});

// --- Notifications CRUD ---
export const getNotifications = asyncHandler(async (req: Request, res: Response) => {
  const notifs = await Notification.findAll({ order: [['orderIndex', 'ASC']] });
  res.status(200).json({ status: 'success', data: notifs });
});

export const createNotification = asyncHandler(async (req: Request, res: Response) => {
  const notif = await Notification.create(req.body);
  res.status(201).json({ status: 'success', data: notif });
});

export const updateNotification = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const notif = await Notification.findByPk(id as string);
  if (!notif) throw new AppError('Notification not found', 404);
  await notif.update(req.body);
  res.status(200).json({ status: 'success', data: notif });
});

export const deleteNotification = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const notif = await Notification.findByPk(id as string);
  if (!notif) throw new AppError('Notification not found', 404);
  await notif.destroy();
  res.status(204).json({ status: 'success', data: null });
});

// --- Star Students CRUD ---
export const getStarStudents = asyncHandler(async (req: Request, res: Response) => {
  const stars = await StarStudent.findAll({ order: [['orderIndex', 'ASC']] });
  res.status(200).json({ status: 'success', data: stars });
});

export const createStarStudent = asyncHandler(async (req: Request, res: Response) => {
  const star = await StarStudent.create(req.body);
  res.status(201).json({ status: 'success', data: star });
});

export const updateStarStudent = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const star = await sequelize.transaction(async (transaction) => {
    const current = await StarStudent.findByPk(id as string, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    if (!current) throw new AppError('Star Student not found', 404);
    await recordMediaRevision('star', current, 'update', req.user?.id, transaction);
    return current.update(req.body, { transaction });
  });
  res.status(200).json({ status: 'success', data: star });
});

export const deleteStarStudent = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const revision = await sequelize.transaction(async (transaction) => {
    const star = await StarStudent.findByPk(id as string, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    if (!star) throw new AppError('Star Student not found', 404);
    const saved = await recordMediaRevision(
      'star',
      star,
      'delete',
      req.user?.id,
      transaction,
    );
    await star.destroy({ transaction });
    return saved;
  });
  res.status(200).json({ status: 'success', data: { revisionId: revision.id } });
});

// --- Results CMS (TopperResult) ---
export const getResults = asyncHandler(async (req: Request, res: Response) => {
  const where: Record<string, unknown> = {};
  if (req.query.year) {
    where.year = Number(req.query.year);
  }
  const results = await TopperResult.findAll({
    where,
    order: [
      ['year', 'DESC'],
      ['orderIndex', 'ASC'],
      ['id', 'DESC'],
    ],
  });
  res.status(200).json({ status: 'success', data: results });
});

export const createResult = asyncHandler(async (req: Request, res: Response) => {
  const result = await TopperResult.create(req.body);
  res.status(201).json({ status: 'success', data: result });
});

export const updateResult = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await sequelize.transaction(async (transaction) => {
    const current = await TopperResult.findByPk(id as string, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    if (!current) throw new AppError('Result not found', 404);
    await recordMediaRevision('result', current, 'update', req.user?.id, transaction);
    return current.update(req.body, { transaction });
  });
  res.status(200).json({ status: 'success', data: result });
});

export const deleteResult = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const revision = await sequelize.transaction(async (transaction) => {
    const result = await TopperResult.findByPk(id as string, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    if (!result) throw new AppError('Result not found', 404);
    const saved = await recordMediaRevision(
      'result',
      result,
      'delete',
      req.user?.id,
      transaction,
    );
    await result.destroy({ transaction });
    return saved;
  });
  res.status(200).json({ status: 'success', data: { revisionId: revision.id } });
});

// --- News Articles CRUD ---
export const getNewsArticles = asyncHandler(async (req: Request, res: Response) => {
  const news = await NewsArticle.findAll({ order: [['orderIndex', 'ASC'], ['id', 'DESC']] });
  res.status(200).json({ status: 'success', data: news });
});

export const createNewsArticle = asyncHandler(async (req: Request, res: Response) => {
  const news = await NewsArticle.create(req.body);
  res.status(201).json({ status: 'success', data: news });
});

export const updateNewsArticle = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const news = await sequelize.transaction(async (transaction) => {
    const current = await NewsArticle.findByPk(id as string, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    if (!current) throw new AppError('News article not found', 404);
    await recordMediaRevision('news', current, 'update', req.user?.id, transaction);
    return current.update(req.body, { transaction });
  });
  res.status(200).json({ status: 'success', data: news });
});

export const deleteNewsArticle = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const revision = await sequelize.transaction(async (transaction) => {
    const news = await NewsArticle.findByPk(id as string, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    if (!news) throw new AppError('News article not found', 404);
    const saved = await recordMediaRevision(
      'news',
      news,
      'delete',
      req.user?.id,
      transaction,
    );
    await news.destroy({ transaction });
    return saved;
  });
  res.status(200).json({ status: 'success', data: { revisionId: revision.id } });
});

// --- Academy Videos CRUD ---
export const getAcademyVideos = asyncHandler(async (req: Request, res: Response) => {
  const videos = await AcademyVideo.findAll({ order: [['orderIndex', 'ASC'], ['id', 'DESC']] });
  res.status(200).json({ status: 'success', data: videos });
});

export const createAcademyVideo = asyncHandler(async (req: Request, res: Response) => {
  const video = await AcademyVideo.create(req.body);
  res.status(201).json({ status: 'success', data: video });
});

export const updateAcademyVideo = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const video = await sequelize.transaction(async (transaction) => {
    const current = await AcademyVideo.findByPk(id as string, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    if (!current) throw new AppError('Academy video not found', 404);
    await recordMediaRevision('video', current, 'update', req.user?.id, transaction);
    return current.update(req.body, { transaction });
  });
  res.status(200).json({ status: 'success', data: video });
});

export const deleteAcademyVideo = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const revision = await sequelize.transaction(async (transaction) => {
    const video = await AcademyVideo.findByPk(id as string, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    if (!video) throw new AppError('Academy video not found', 404);
    const saved = await recordMediaRevision(
      'video',
      video,
      'delete',
      req.user?.id,
      transaction,
    );
    await video.destroy({ transaction });
    return saved;
  });
  res.status(200).json({ status: 'success', data: { revisionId: revision.id } });
});

// --- Media revision history ---
export const getMediaHistory = asyncHandler(async (req: Request, res: Response) => {
  const { resourceType, id } = req.params;
  const where: { resourceType: MediaResourceType; resourceId?: number } = {
    resourceType: resourceType as MediaResourceType,
  };
  if (id) where.resourceId = Number(id);

  const revisions = await MediaRevision.findAll({
    where,
    order: [['createdAt', 'DESC']],
    limit: 100,
  });
  res.status(200).json({ status: 'success', data: revisions });
});

export const restoreMediaRevision = asyncHandler(
  async (req: Request, res: Response) => {
    const resourceType = req.params.resourceType as MediaResourceType;
    const resourceId = Number(req.params.id);
    const revisionId = Number(req.params.revisionId);

    const restored = await sequelize.transaction(async (transaction) => {
      const revision = await MediaRevision.findOne({
        where: { id: revisionId, resourceType, resourceId },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (!revision) throw new AppError('Saved version not found', 404);

      const values = restoreValues(resourceType, revision.snapshot);

      if (resourceType === 'banner') {
        const current = await Banner.findByPk(resourceId, {
          transaction,
          lock: transaction.LOCK.UPDATE,
        });
        if (current) {
          await recordMediaRevision('banner', current, 'restore', req.user?.id, transaction);
          return current.update(values, { transaction });
        }
        return Banner.create(
          { id: resourceId, ...values } as BannerCreationAttributes,
          { transaction },
        );
      }

      if (resourceType === 'star') {
        const current = await StarStudent.findByPk(resourceId, {
          transaction,
          lock: transaction.LOCK.UPDATE,
        });
        if (current) {
          await recordMediaRevision('star', current, 'restore', req.user?.id, transaction);
          return current.update(values, { transaction });
        }
        return StarStudent.create(
          { id: resourceId, ...values } as StarStudentCreationAttributes,
          { transaction },
        );
      }

      if (resourceType === 'news') {
        const current = await NewsArticle.findByPk(resourceId, {
          transaction,
          lock: transaction.LOCK.UPDATE,
        });
        if (current) {
          await recordMediaRevision('news', current, 'restore', req.user?.id, transaction);
          return current.update(values, { transaction });
        }
        return NewsArticle.create(
          { id: resourceId, ...values } as NewsArticleCreationAttributes,
          { transaction },
        );
      }

      if (resourceType === 'video') {
        const current = await AcademyVideo.findByPk(resourceId, {
          transaction,
          lock: transaction.LOCK.UPDATE,
        });
        if (current) {
          await recordMediaRevision('video', current, 'restore', req.user?.id, transaction);
          return current.update(values, { transaction });
        }
        return AcademyVideo.create(
          { id: resourceId, ...values } as AcademyVideoCreationAttributes,
          { transaction },
        );
      }

      const current = await TopperResult.findByPk(resourceId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (current) {
        await recordMediaRevision('result', current, 'restore', req.user?.id, transaction);
        return current.update(values, { transaction });
      }
      return TopperResult.create(
        { id: resourceId, ...values } as TopperResultCreationAttributes,
        { transaction },
      );
    });

    res.status(200).json({ status: 'success', data: restored });
  },
);

// --- Site Settings ---
const SETTINGS_KEYS = [
  'phone',
  'email',
  'address1',
  'address2',
  'whatsapp',
  'facebook',
  'instagram',
  'youtube',
  'linkedin',
  'twitter',
  'page_banner_scholarships',
  'page_banner_contact',
  'page_banner_results',
] as const;

async function loadSettingsMap(): Promise<Record<string, string>> {
  const rows = await SiteSetting.findAll();
  const map: Record<string, string> = {};
  for (const row of rows) {
    map[row.key] = row.value;
  }
  return map;
}

export const getSettings = asyncHandler(async (_req: Request, res: Response) => {
  const map = await loadSettingsMap();
  res.status(200).json({ status: 'success', data: map });
});

export const updateSettings = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body || {};
  const rows: Array<{ key: string; value: string }> = [];

  for (const key of SETTINGS_KEYS) {
    if (Object.prototype.hasOwnProperty.call(body, key) && body[key] !== undefined) {
      rows.push({ key, value: String(body[key] ?? '') });
    }
  }

  if (rows.length > 0) {
    await SiteSetting.bulkCreate(rows, {
      updateOnDuplicate: ['value', 'updatedAt'],
    });
  }

  const map = await loadSettingsMap();
  res.status(200).json({ status: 'success', data: map });
});

function serializeContentBlocks(
  rows: ContentBlock[],
): Record<string, { value: string; kind: string; updatedAt: Date }> {
  const map: Record<
    string,
    { value: string; kind: string; updatedAt: Date }
  > = {};
  for (const row of rows) {
    map[row.contentKey] = {
      value: row.value,
      kind: row.kind,
      updatedAt: row.updatedAt,
    };
  }
  return map;
}

export const getPageContent = asyncHandler(
  async (req: Request, res: Response) => {
    const rows = await ContentBlock.findAll({
      where: { pageKey: req.params.pageKey },
      order: [['contentKey', 'ASC']],
    });
    res.status(200).json({
      status: 'success',
      data: serializeContentBlocks(rows),
    });
  },
);

export const updateContentBlock = asyncHandler(
  async (req: Request, res: Response) => {
    const pageKey = String(req.params.pageKey);
    const contentKey = String(req.params.contentKey);
    const [row] = await ContentBlock.upsert(
      {
        pageKey,
        contentKey,
        kind: req.body.kind,
        value: req.body.value,
      },
      { returning: true },
    );
    res.status(200).json({ status: 'success', data: row });
  },
);

export const deleteContentBlock = asyncHandler(
  async (req: Request, res: Response) => {
    await ContentBlock.destroy({
      where: {
        pageKey: req.params.pageKey,
        contentKey: req.params.contentKey,
      },
    });
    res.status(200).json({
      status: 'success',
      data: null,
      message: 'The original website content has been restored.',
    });
  },
);

// --- Database Viewer Endpoints ---
function getListOptions(req: Request) {
  return {
    q: String(req.query.q || '').trim(),
    cursor: req.query.cursor ? Number(req.query.cursor) : undefined,
    limit: Math.min(Number(req.query.limit) || 50, 100),
  };
}

function sendPaginated(
  res: Response,
  rows: Array<{ id: number }>,
  limit: number,
): void {
  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;
  const lastItem = items.at(-1);
  const nextCursor = hasMore ? lastItem?.id ?? null : null;

  res.status(200).json({
    status: 'success',
    data: items,
    pagination: {
      nextCursor,
      hasMore,
      limit,
    },
  });
}

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const { q, cursor, limit } = getListOptions(req);
  const like = q ? { [Op.iLike]: `%${q}%` } : null;
  const users = await User.findAll({
    where: {
      role: 'student',
      ...(cursor ? { id: { [Op.lt]: cursor } } : {}),
      ...(like
        ? {
            [Op.or]: [
              { firstName: like },
              { lastName: like },
              { email: like },
              { mobileNumber: like },
            ],
          }
        : {}),
    },
    attributes: [
      'id',
      'firstName',
      'lastName',
      'email',
      'mobileNumber',
      'age',
      'createdAt',
    ],
    order: [['id', 'DESC']],
    limit: limit + 1,
  });
  sendPaginated(res, users, limit);
});

export const getCourseForms = asyncHandler(async (req: Request, res: Response) => {
  const { q, cursor, limit } = getListOptions(req);
  const like = q ? { [Op.iLike]: `%${q}%` } : null;
  const forms = await CourseRegistration.findAll({
    where: {
      ...(cursor ? { id: { [Op.lt]: cursor } } : {}),
      ...(like
        ? {
            [Op.or]: [
              { studentName: like },
              { studentEmail: like },
              { studentPhone: like },
              { courseTitle: like },
            ],
          }
        : {}),
    },
    order: [['id', 'DESC']],
    limit: limit + 1,
  });
  sendPaginated(res, forms, limit);
});

export const getScholarshipForms = asyncHandler(async (req: Request, res: Response) => {
  const { q, cursor, limit } = getListOptions(req);
  const like = q ? { [Op.iLike]: `%${q}%` } : null;
  const forms = await ScholarshipRegistration.findAll({
    where: {
      ...(cursor ? { id: { [Op.lt]: cursor } } : {}),
      ...(like
        ? {
            [Op.or]: [
              { studentName: like },
              { studentPhone: like },
              { parentPhone: like },
              { preferredCourse: like },
              { schoolName: like },
              { city: like },
            ],
          }
        : {}),
    },
    order: [['id', 'DESC']],
    limit: limit + 1,
  });
  sendPaginated(res, forms, limit);
});

export const getContactMessages = asyncHandler(async (req: Request, res: Response) => {
  const { q, cursor, limit } = getListOptions(req);
  const like = q ? { [Op.iLike]: `%${q}%` } : null;
  const messages = await ContactMessage.findAll({
    where: {
      ...(cursor ? { id: { [Op.lt]: cursor } } : {}),
      ...(like
        ? {
            [Op.or]: [
              { name: like },
              { email: like },
              { phone: like },
              { message: like },
            ],
          }
        : {}),
    },
    order: [['id', 'DESC']],
    limit: limit + 1,
  });
  sendPaginated(res, messages, limit);
});

export const searchLeads = asyncHandler(async (req: Request, res: Response) => {
  const { q, limit } = getListOptions(req);
  const like = q ? { [Op.iLike]: `%${q}%` } : null;

  const [users, courseForms, scholarshipForms, contactMessages] = await Promise.all([
    User.findAll({
      where: {
        role: 'student',
        ...(like ? {
          [Op.or]: [
            { firstName: like },
            { lastName: like },
            { email: like },
            { mobileNumber: like },
          ],
        } : {}),
      },
      attributes: [
        'id',
        'firstName',
        'lastName',
        'email',
        'mobileNumber',
        'createdAt',
      ],
      order: [['createdAt', 'DESC']],
      limit,
    }),
    CourseRegistration.findAll({
      ...(like ? {
        where: {
          [Op.or]: [
            { studentName: like },
            { studentEmail: like },
            { studentPhone: like },
            { courseTitle: like },
          ],
        }
      } : {}),
      order: [['createdAt', 'DESC']],
      limit,
    }),
    ScholarshipRegistration.findAll({
      ...(like ? {
        where: {
          [Op.or]: [
            { studentName: like },
            { studentPhone: like },
            { parentPhone: like },
            { preferredCourse: like },
            { schoolName: like },
            { city: like },
          ],
        }
      } : {}),
      order: [['createdAt', 'DESC']],
      limit,
    }),
    ContactMessage.findAll({
      ...(like ? {
        where: {
          [Op.or]: [
            { name: like },
            { email: like },
            { phone: like },
            { message: like },
          ],
        }
      } : {}),
      order: [['createdAt', 'DESC']],
      limit,
    }),
  ]);

  res.status(200).json({
    status: 'success',
    data: { users, courseForms, scholarshipForms, contactMessages },
  });
});


// --- Database Management CRUD ---


// The dormant `users.passwordHash` column is never written, but it would still
// be serialized by a bare `res.json(user)`. Every student response goes through
// this whitelist instead.
function publicStudent(user: User) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    mobileNumber: user.mobileNumber,
    age: user.age,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  // Students authenticate with a mobile number and an OTP, so no password is
  // accepted or stored here. `role` is pinned rather than taken from input:
  // administrators are managed through /database/admins.
  const user = await User.create({ ...req.body, role: 'student' });
  res.status(201).json({ status: 'success', data: { user: publicStudent(user) } });
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const user = await User.findByPk(id);
  if (!user || user.role !== 'student') throw new AppError('Student not found', 404);

  await user.update(req.body);
  res.status(200).json({ status: 'success', data: { user: publicStudent(user) } });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const user = await User.findByPk(id);
  if (!user || user.role !== 'student') throw new AppError('Student not found', 404);
  await user.destroy();
  res.status(200).json({ status: 'success', data: null });
});

/* --- Administrator accounts (the `admins` table backing admin sign-in) --- */

const ADMIN_PUBLIC_ATTRIBUTES = [
  'id',
  'name',
  'email',
  'mobileNumber',
  'role',
  'createdAt',
  'updatedAt',
] as const;

function publicAdminAccount(admin: Admin) {
  return {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    mobileNumber: admin.mobileNumber,
    role: admin.role,
    // Two-factor authentication is not built yet. The field is reported so the
    // dashboard can show an honest status instead of implying it is on.
    totpEnabled: false,
    createdAt: admin.createdAt,
    updatedAt: admin.updatedAt,
  };
}

/** How many accounts can currently manage administrators and delete records. */
function countSuperAdmins(): Promise<number> {
  return Admin.count({ where: { role: SUPER_ADMIN } });
}

/**
 * Refuses any change that would leave the system without a super administrator.
 *
 * Demoting or removing the last one is unrecoverable through the dashboard:
 * nobody left could manage administrators, restore content, or promote a
 * replacement. That includes a super administrator acting on their own account,
 * which is the easiest version of this mistake to make.
 */
async function assertNotLastSuperAdmin(
  target: Admin,
  actorId: number | undefined,
  action: 'demote' | 'delete',
): Promise<void> {
  if (target.role !== SUPER_ADMIN) return;
  if ((await countSuperAdmins()) > 1) return;

  const isSelf = actorId === target.id;
  const subject = isSelf ? 'your own account' : 'this account';
  throw new AppError(
    action === 'demote'
      ? `${target.name} is the only super administrator. Promote another account to super administrator before changing ${subject} to a standard administrator.`
      : `${target.name} is the only super administrator. Promote another account to super administrator before removing ${subject}.`,
    400,
  );
}

/**
 * Rejects an email or mobile number already held by a different administrator.
 * The unique indexes would also catch this, but a checked 409 reads better in
 * the dashboard than a raw constraint error.
 */
async function assertAdminIdentityIsFree(
  fields: { email?: string; mobileNumber?: string },
  excludeId?: number,
): Promise<void> {
  const candidates = [
    fields.email ? { email: fields.email } : null,
    fields.mobileNumber ? { mobileNumber: fields.mobileNumber } : null,
  ].filter(Boolean) as Array<Record<string, string>>;

  if (candidates.length === 0) return;

  const clash = await Admin.findOne({
    where: {
      [Op.or]: candidates,
      ...(excludeId ? { id: { [Op.ne]: excludeId } } : {}),
    },
  });

  if (!clash) return;

  throw new AppError(
    clash.email === fields.email
      ? 'Another administrator already uses that email address.'
      : 'Another administrator already uses that mobile number.',
    409,
  );
}

export const getAdminAccounts = asyncHandler(async (req: Request, res: Response) => {
  const { q, cursor, limit } = getListOptions(req);
  const like = q ? { [Op.iLike]: `%${q}%` } : null;
  const admins = await Admin.findAll({
    where: {
      ...(cursor ? { id: { [Op.lt]: cursor } } : {}),
      ...(like
        ? {
            [Op.or]: [{ name: like }, { email: like }, { mobileNumber: like }],
          }
        : {}),
    },
    attributes: [...ADMIN_PUBLIC_ATTRIBUTES],
    order: [['id', 'DESC']],
    limit: limit + 1,
  });
  sendPaginated(res, admins.map(publicAdminAccount), limit);
});

export const createAdminAccount = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, mobileNumber, password, role } = req.body;
  await assertAdminIdentityIsFree({ email, mobileNumber });

  const admin = await Admin.create({
    name,
    email,
    mobileNumber,
    passwordHash: await bcrypt.hash(password, 12),
    // Validated against the role enum and defaulted to the restricted level by
    // adminAccountCreateSchema. Only a super administrator reaches this line.
    role,
  });

  logger.info('[Admin] Administrator account created', {
    adminId: admin.id,
    role: admin.role,
    by: req.user?.id,
  });
  res.status(201).json({ status: 'success', data: { admin: publicAdminAccount(admin) } });
});

export const updateAdminAccount = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const admin = await Admin.findByPk(id);
  if (!admin) throw new AppError('Administrator not found', 404);

  // Passwords are never set from this form; they are rotated through a reset
  // link so a plain-text password is never typed into the dashboard.
  const { name, email, mobileNumber, role } = req.body;
  await assertAdminIdentityIsFree({ email, mobileNumber }, id);

  if (role !== undefined && role !== admin.role && role === ADMIN) {
    await assertNotLastSuperAdmin(admin, req.user?.id, 'demote');
  }

  await admin.update({
    ...(name === undefined ? {} : { name }),
    ...(email === undefined ? {} : { email }),
    ...(mobileNumber === undefined ? {} : { mobileNumber }),
    ...(role === undefined ? {} : { role }),
  });

  logger.info('[Admin] Administrator account updated', {
    adminId: admin.id,
    role: admin.role,
    by: req.user?.id,
  });
  res.status(200).json({ status: 'success', data: { admin: publicAdminAccount(admin) } });
});

export const deleteAdminAccount = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const admin = await Admin.findByPk(id);
  if (!admin) throw new AppError('Administrator not found', 404);

  if (req.user?.id === id) {
    throw new AppError('You cannot delete the account you are signed in with.', 400);
  }

  // Losing the last administrator would lock everyone out of the dashboard.
  const remaining = await Admin.count();
  if (remaining <= 1) {
    throw new AppError(
      'At least one administrator account must remain. Add another administrator first.',
      400,
    );
  }

  // Losing the last *super* administrator is just as final: the remaining
  // accounts could sign in but could not manage administrators again.
  await assertNotLastSuperAdmin(admin, req.user?.id, 'delete');

  await admin.destroy();
  logger.info('[Admin] Administrator account deleted', {
    adminId: id,
    by: req.user?.id,
  });
  res.status(200).json({ status: 'success', data: null });
});

/**
 * POST /database/admins/:id/password-reset
 *
 * Issues a single-use reset link. When no email transport is configured the
 * link comes back in the response so the signed-in administrator can copy it
 * and pass it on directly.
 */
export const sendAdminPasswordReset = asyncHandler(
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const admin = await Admin.findByPk(id);
    if (!admin) throw new AppError('Administrator not found', 404);

    const { rawToken, expiresAt, ttlMinutes } = await issueAdminPasswordReset({
      adminId: admin.id,
      requestedByAdminId: req.user?.id ?? null,
    });
    const resetUrl = buildResetUrl(rawToken);

    const template = adminPasswordResetEmail({
      name: admin.name,
      resetUrl,
      ttlMinutes,
    });
    const mail = await sendMail({
      to: admin.email,
      subject: 'Reset your Success Code Academy admin password',
      text: template.text,
      html: template.html,
    });

    logger.info('[Admin] Password reset link issued', {
      adminId: admin.id,
      by: req.user?.id,
      emailed: mail.delivered,
    });

    res.status(200).json({
      status: 'success',
      message: mail.delivered
        ? `A reset link was emailed to ${admin.email}.`
        : 'A reset link was created. Copy it and share it with the administrator directly.',
      data: {
        emailed: mail.delivered,
        // Returned only because email is not wired up yet. Once a transport is
        // configured, drop this field so the raw token stays in the mailbox.
        resetUrl,
        expiresAt,
        ttlMinutes,
      },
    });
  },
);

/**
 * POST /api/v1/admin/request-password-reset
 *
 * Lets the signed-in administrator request a password reset email for their own account from Settings.
 */
export const requestSelfPasswordReset = asyncHandler(
  async (req: Request, res: Response) => {
    const admin = await Admin.findByPk(req.user?.id);
    if (!admin) throw new AppError('Administrator not found', 404);

    await checkResetCooldown(admin.id, 60);

    const { rawToken, expiresAt, ttlMinutes } = await issueAdminPasswordReset({
      adminId: admin.id,
      requestedByAdminId: admin.id,
    });
    const resetUrl = buildResetUrl(rawToken);

    const template = adminPasswordResetEmail({
      name: admin.name || 'Administrator',
      resetUrl,
      ttlMinutes,
    });
    const mail = await sendMail({
      to: admin.email,
      subject: 'Reset your Success Code Academy admin password',
      text: template.text,
      html: template.html,
    });

    logger.info('[Admin] Self-requested password reset link', {
      adminId: admin.id,
      email: admin.email,
      delivered: mail.delivered,
    });

    res.status(200).json({
      status: 'success',
      message: mail.delivered
        ? `A reset link was emailed to ${admin.email}.`
        : 'A reset link was created.',
      data: {
        emailed: mail.delivered,
        email: admin.email,
        ttlMinutes,
        expiresAt,
        ...(process.env.NODE_ENV !== 'production' && !mail.delivered ? { resetUrl } : {}),
      },
    });
  },
);

export const createCourseForm = asyncHandler(async (req: Request, res: Response) => {
  const form = await CourseRegistration.create(req.body);
  res.status(201).json({ status: 'success', data: { form } });
});

export const updateCourseForm = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const form = await CourseRegistration.findByPk(id);
  if (!form) throw new AppError('Course form not found', 404);
  await form.update(req.body);
  res.status(200).json({ status: 'success', data: { form } });
});

export const deleteCourseForm = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const form = await CourseRegistration.findByPk(id);
  if (!form) throw new AppError('Course form not found', 404);
  await form.destroy();
  res.status(200).json({ status: 'success', data: null });
});

export const createScholarshipForm = asyncHandler(async (req: Request, res: Response) => {
  const form = await ScholarshipRegistration.create(req.body);
  res.status(201).json({ status: 'success', data: { form } });
});

export const updateScholarshipForm = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const form = await ScholarshipRegistration.findByPk(id);
  if (!form) throw new AppError('Scholarship form not found', 404);
  await form.update(req.body);
  res.status(200).json({ status: 'success', data: { form } });
});

export const deleteScholarshipForm = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const form = await ScholarshipRegistration.findByPk(id);
  if (!form) throw new AppError('Scholarship form not found', 404);
  await form.destroy();
  res.status(200).json({ status: 'success', data: null });
});

export const createContactMessage = asyncHandler(async (req: Request, res: Response) => {
  const msg = await ContactMessage.create(req.body);
  res.status(201).json({ status: 'success', data: { message: msg } });
});

export const updateContactMessage = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const msg = await ContactMessage.findByPk(id);
  if (!msg) throw new AppError('Contact message not found', 404);
  await msg.update(req.body);
  res.status(200).json({ status: 'success', data: { message: msg } });
});

export const deleteContactMessage = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const msg = await ContactMessage.findByPk(id);
  if (!msg) throw new AppError('Contact message not found', 404);
  await msg.destroy();
  res.status(200).json({ status: 'success', data: null });
});

export const getCourses = asyncHandler(async (req: Request, res: Response) => {
  const { q, cursor, limit } = getListOptions(req);
  const like = q ? { [Op.iLike]: `%${q}%` } : null;
  const courses = await Course.findAll({
    where: {
      ...(cursor ? { id: { [Op.lt]: cursor } } : {}),
      ...(like
        ? {
            [Op.or]: [
              { title: like },
              { slug: like },
              { category: like },
              { type: like },
            ],
          }
        : {}),
    },
    order: [['id', 'DESC']],
    limit: limit + 1,
  });
  sendPaginated(res, courses, limit);
});

export const createCourse = asyncHandler(async (req: Request, res: Response) => {
  const course = await Course.create(req.body);
  res.status(201).json({ status: 'success', data: course });
});

export const updateCourse = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const course = await Course.findByPk(id);
  if (!course) throw new AppError('Course not found', 404);
  await course.update(req.body);
  res.status(200).json({ status: 'success', data: course });
});

export const deleteCourse = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const course = await Course.findByPk(id);
  if (!course) throw new AppError('Course not found', 404);
  await course.destroy();
  res.status(200).json({ status: 'success', data: null });
});
