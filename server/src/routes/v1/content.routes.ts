import { Router } from 'express';
import { Banner, Notification, StarStudent } from '../../models';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();

// Get active banners for home/results pages
router.get('/banners', asyncHandler(async (req, res) => {
  const banners = await Banner.findAll({
    where: { isActive: true },
    order: [['orderIndex', 'ASC']]
  });
  res.status(200).json({ status: 'success', data: banners });
}));

// Get active notifications
router.get('/notifications', asyncHandler(async (req, res) => {
  const notifications = await Notification.findAll({
    where: { isActive: true },
    order: [['orderIndex', 'ASC']]
  });
  res.status(200).json({ status: 'success', data: notifications });
}));

// Get active star students
router.get('/stars', asyncHandler(async (req, res) => {
  const stars = await StarStudent.findAll({
    where: { isActive: true },
    order: [['orderIndex', 'ASC']]
  });
  res.status(200).json({ status: 'success', data: stars });
}));

export default router;
