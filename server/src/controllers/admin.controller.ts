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
} from '../models';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import multer from 'multer';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { Op } from 'sequelize';

let supabase: ReturnType<typeof createClient> | null = null;
const getSupabase = () => {
  if (supabase) return supabase;
  const supabaseUrl = process.env.SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
  if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
  }
  return supabase;
};

// --- File Upload Setup (Supabase Storage) ---
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
}).single('image');

// --- Image Upload Endpoint ---
export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError('No image file provided.', 400);
  }

  const client = getSupabase();
  if (!client) {
    throw new AppError('Storage is not configured on the server.', 500);
  }

  let folder = 'uploads';
  if (req.query.type === 'banner') folder = 'banners';
  else if (req.query.type === 'star') folder = 'stars';
  else if (req.query.type === 'result') folder = 'results';

  // Generate unique filename
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const ext = path.extname(req.file.originalname);
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

// --- Dashboard Stats ---
export const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
  const totalStudents = await User.count();
  const totalCourseForms = await CourseRegistration.count();
  const totalScholarshipForms = await ScholarshipRegistration.count();
  
  // Get recent registrations
  const recentStudents = await User.findAll({
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
  const banner = await Banner.findByPk(id as string);
  if (!banner) throw new AppError('Banner not found', 404);
  await banner.update(req.body);
  res.status(200).json({ status: 'success', data: banner });
});

export const deleteBanner = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const banner = await Banner.findByPk(id as string);
  if (!banner) throw new AppError('Banner not found', 404);
  await banner.destroy();
  res.status(204).json({ status: 'success', data: null });
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
  const star = await StarStudent.findByPk(id as string);
  if (!star) throw new AppError('Star Student not found', 404);
  await star.update(req.body);
  res.status(200).json({ status: 'success', data: star });
});

export const deleteStarStudent = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const star = await StarStudent.findByPk(id as string);
  if (!star) throw new AppError('Star Student not found', 404);
  await star.destroy();
  res.status(204).json({ status: 'success', data: null });
});

// --- Articles & Blog Posts ---
export const getArticles = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ status: 'success', data: [] });
});

export const createArticle = asyncHandler(async (req: Request, res: Response) => {
  res.status(201).json({ status: 'success', data: req.body });
});

export const deleteArticle = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ status: 'success', data: null });
});

// --- Video Uploads ---
export const getVideos = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ status: 'success', data: [] });
});

export const createVideo = asyncHandler(async (req: Request, res: Response) => {
  res.status(201).json({ status: 'success', data: req.body });
});

export const deleteVideo = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ status: 'success', data: null });
});

// --- Courses CMS ---
export const getCourses = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ status: 'success', data: [] });
});

export const createCourse = asyncHandler(async (req: Request, res: Response) => {
  res.status(201).json({ status: 'success', data: req.body });
});

// --- Scholarships CMS ---
export const getScholarships = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ status: 'success', data: [] });
});

export const createScholarship = asyncHandler(async (req: Request, res: Response) => {
  res.status(201).json({ status: 'success', data: req.body });
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
  const result = await TopperResult.findByPk(id as string);
  if (!result) throw new AppError('Result not found', 404);
  await result.update(req.body);
  res.status(200).json({ status: 'success', data: result });
});

export const deleteResult = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TopperResult.findByPk(id as string);
  if (!result) throw new AppError('Result not found', 404);
  await result.destroy();
  res.status(204).json({ status: 'success', data: null });
});

// --- Site Settings ---
const SETTINGS_KEYS = [
  'phone',
  'email',
  'address',
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
  for (const key of SETTINGS_KEYS) {
    if (Object.prototype.hasOwnProperty.call(body, key) && body[key] !== undefined) {
      const value = String(body[key] ?? '');
      const existing = await SiteSetting.findOne({ where: { key } });
      if (existing) {
        await existing.update({ value });
      } else {
        await SiteSetting.create({ key, value });
      }
    }
  }
  const map = await loadSettingsMap();
  res.status(200).json({ status: 'success', data: map });
});

// --- Database Viewer Endpoints ---
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.findAll({ order: [['createdAt', 'DESC']] });
  res.status(200).json({ status: 'success', data: users });
});

export const getCourseForms = asyncHandler(async (req: Request, res: Response) => {
  const forms = await CourseRegistration.findAll({ order: [['createdAt', 'DESC']] });
  res.status(200).json({ status: 'success', data: forms });
});

export const getScholarshipForms = asyncHandler(async (req: Request, res: Response) => {
  const forms = await ScholarshipRegistration.findAll({ order: [['createdAt', 'DESC']] });
  res.status(200).json({ status: 'success', data: forms });
});

export const getContactMessages = asyncHandler(async (_req: Request, res: Response) => {
  const messages = await ContactMessage.findAll({ order: [['createdAt', 'DESC']] });
  res.status(200).json({ status: 'success', data: messages });
});

export const searchLeads = asyncHandler(async (req: Request, res: Response) => {
  const q = String(req.query.q || '').trim();
  const like = q ? { [Op.iLike]: `%${q}%` } : null;

  const [users, courseForms, scholarshipForms, contactMessages] = await Promise.all([
    User.findAll({
      ...(like ? {
        where: {
          [Op.or]: [
            { firstName: like },
            { lastName: like },
            { email: like },
            { mobileNumber: like },
          ],
        }
      } : {}),
      order: [['createdAt', 'DESC']],
      limit: 200,
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
      limit: 200,
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
      limit: 200,
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
      limit: 200,
    }),
  ]);

  res.status(200).json({
    status: 'success',
    data: { users, courseForms, scholarshipForms, contactMessages },
  });
});
