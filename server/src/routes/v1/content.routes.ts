import { Router } from 'express';
import { Banner, ContentBlock, Notification, StarStudent, SiteSetting, TopperResult, NewsArticle, AcademyVideo, Course } from '../../models';
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

// Get active news articles
router.get('/news', asyncHandler(async (req, res) => {
  const news = await NewsArticle.findAll({
    where: { isActive: true },
    order: [['orderIndex', 'ASC'], ['id', 'DESC']],
  });
  res.status(200).json({ status: 'success', data: news });
}));

// Get active academy videos
router.get('/videos', asyncHandler(async (req, res) => {
  const videos = await AcademyVideo.findAll({
    where: { isActive: true },
    order: [['orderIndex', 'ASC'], ['id', 'DESC']],
  });
  res.status(200).json({ status: 'success', data: videos });
}));

// Get active courses
router.get('/courses', asyncHandler(async (req, res) => {
  const courses = await Course.findAll({
    where: { isActive: true },
    order: [['id', 'ASC']],
  });
  res.status(200).json({ status: 'success', data: courses });
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

// Public content overrides for the visual editor. Values are rendered as
// plain React text; HTML is intentionally not accepted.
router.get('/page/:pageKey', asyncHandler(async (req, res) => {
  const pageKey = String(req.params.pageKey || '').trim();
  if (
    !pageKey ||
    pageKey.length > 160 ||
    !/^[a-z0-9][a-z0-9._:-]*$/.test(pageKey)
  ) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid page key.',
    });
    return;
  }

  const rows = await ContentBlock.findAll({
    where: { pageKey },
    attributes: ['contentKey', 'kind', 'value', 'updatedAt'],
    order: [['contentKey', 'ASC']],
  });
  const map: Record<string, { value: string; kind: string; updatedAt: Date }> =
    {};
  for (const row of rows) {
    map[row.contentKey] = {
      value: row.value,
      kind: row.kind,
      updatedAt: row.updatedAt,
    };
  }
  res.status(200).json({ status: 'success', data: map });
}));

export default router;
