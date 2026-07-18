import type { Request, Response } from 'express';
import { User, CourseRegistration, ScholarshipRegistration, Banner, Notification, StarStudent } from '../models';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// --- File Upload Setup (Option B: Local Disk) ---
const getUploadDir = (req: Request) => {
  let folder = 'uploads';
  if (req.query.type === 'banner') folder = 'banners';
  else if (req.query.type === 'star') folder = 'stars';
  
  const dir = path.join(__dirname, '../../../client/public/images', folder);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
};

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    cb(null, getUploadDir(req));
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
}).single('image');

// --- Image Upload Endpoint ---
export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError('No image file provided.', 400);
  }
  
  let folder = 'uploads';
  if (req.query.type === 'banner') folder = 'banners';
  else if (req.query.type === 'star') folder = 'stars';

  // Return the public URL for the image (since it's served by Next.js from public/images/)
  const imageUrl = `/images/${folder}/${req.file.filename}`;
  
  res.status(200).json({
    status: 'success',
    data: { url: imageUrl },
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
