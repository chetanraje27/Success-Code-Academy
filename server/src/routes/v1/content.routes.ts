import { Router } from 'express';
import { Banner, Notification, StarStudent, SiteSetting, TopperResult } from '../../models';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();

// Get active banners for home/results pages
router.get('/banners', asyncHandler(async (req, res) => {
  const banners = await Banner.findAll({
    where: { isActive: true },
    order: [['orderIndex', 'ASC']],
  });
  res.status(200).json({ status: 'success', data: banners });
}));

// Get active notifications
router.get('/notifications', asyncHandler(async (req, res) => {
  const notifications = await Notification.findAll({
    where: { isActive: true },
    order: [['orderIndex', 'ASC']],
  });
  res.status(200).json({ status: 'success', data: notifications });
}));

// Get active star students
router.get('/stars', asyncHandler(async (req, res) => {
  const stars = await StarStudent.findAll({
    where: { isActive: true },
    order: [['orderIndex', 'ASC']],
  });
  res.status(200).json({ status: 'success', data: stars });
}));

// Get active CMS topper results (optional year filter)
router.get('/results', asyncHandler(async (req, res) => {
  const where: Record<string, unknown> = { isActive: true };
  if (req.query.year) {
    where.year = Number(req.query.year);
  }
  const results = await TopperResult.findAll({
    where,
    order: [
      ['orderIndex', 'ASC'],
      ['id', 'DESC'],
    ],
  });
  res.status(200).json({ status: 'success', data: results });
}));

// Public site settings (contact / social)
router.get('/settings', asyncHandler(async (_req, res) => {
  const rows = await SiteSetting.findAll();
  const map: Record<string, string> = {};
  for (const row of rows) {
    map[row.key] = row.value;
  }
  res.status(200).json({ status: 'success', data: map });
}));

export default router;
