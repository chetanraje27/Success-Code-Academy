import type { Request, Response } from 'express';
import {
  User,
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
import bcrypt from 'bcrypt';
import { AppError } from '../utils/AppError';
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
  const totalStudents = await User.count({ where: { role: 'student' } });
  const totalCourseForms = await CourseRegistration.count();
  const totalScholarshipForms = await ScholarshipRegistration.count();
  
  // Get recent registrations
  const recentStudents = await User.findAll({
    where: { role: 'student' },
    limit: 5,
    order: [['createdAt', 'DESC']],
    attributes: ['id', 'firstName', 'lastName', 'email', 'mobileNumber', 'createdAt']
  });

  res.status(200).json({
    status: 'success',
    data: {
      totalStudents,
      totalCourseForms,
      totalScholarshipForms,
      recentStudents,
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


export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body;
  if (data.password) {
    data.passwordHash = await bcrypt.hash(data.password, 10);
    delete data.password;
  }
  const user = await User.create(data);
  res.status(201).json({ status: 'success', data: { user } });
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const data = req.body;
  const user = await User.findByPk(id);
  if (!user) throw new AppError('User not found', 404);

  if (data.password) {
    data.passwordHash = await bcrypt.hash(data.password, 10);
    delete data.password;
  }
  await user.update(data);
  res.status(200).json({ status: 'success', data: { user } });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const user = await User.findByPk(id);
  if (!user) throw new AppError('User not found', 404);
  await user.destroy();
  res.status(200).json({ status: 'success', data: null });
});

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
