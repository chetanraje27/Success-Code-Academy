import { Router } from 'express';
import * as adminController from '../../controllers/admin.controller';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { validate } from '../../middlewares/validate';
import {
  adminListQuerySchema,
  bannerCreateSchema,
  bannerUpdateSchema,
  idParamsSchema,
  notificationCreateSchema,
  notificationUpdateSchema,
  resultCreateSchema,
  resultListQuerySchema,
  resultUpdateSchema,
  settingsUpdateSchema,
  starCreateSchema,
  starUpdateSchema,
  uploadQuerySchema,
  pageContentParamsSchema,
  contentBlockParamsSchema,
  contentBlockUpdateSchema,
} from '../../validation/admin.schemas';

const router = Router();

// Apply authentication and admin authorization to all admin routes
router.use(authenticate);
router.use(authorize('admin'));

// Dashboard Stats
router.get('/stats', adminController.getDashboardStats);

// Image Upload
router.post(
  '/upload',
  validate(uploadQuerySchema, 'query'),
  adminController.upload,
  adminController.uploadImage,
);

// Banners
router.get('/banners', adminController.getBanners);
router.post('/banners', validate(bannerCreateSchema), adminController.createBanner);
router.put(
  '/banners/:id',
  validate(idParamsSchema, 'params'),
  validate(bannerUpdateSchema),
  adminController.updateBanner,
);
router.delete(
  '/banners/:id',
  validate(idParamsSchema, 'params'),
  adminController.deleteBanner,
);

// Notifications
router.get('/notifications', adminController.getNotifications);
router.post(
  '/notifications',
  validate(notificationCreateSchema),
  adminController.createNotification,
);
router.put(
  '/notifications/:id',
  validate(idParamsSchema, 'params'),
  validate(notificationUpdateSchema),
  adminController.updateNotification,
);
router.delete(
  '/notifications/:id',
  validate(idParamsSchema, 'params'),
  adminController.deleteNotification,
);

// Star Students
router.get('/stars', adminController.getStarStudents);
router.post('/stars', validate(starCreateSchema), adminController.createStarStudent);
router.put(
  '/stars/:id',
  validate(idParamsSchema, 'params'),
  validate(starUpdateSchema),
  adminController.updateStarStudent,
);
router.delete(
  '/stars/:id',
  validate(idParamsSchema, 'params'),
  adminController.deleteStarStudent,
);

// Results Management
router.get(
  '/results',
  validate(resultListQuerySchema, 'query'),
  adminController.getResults,
);
router.post('/results', validate(resultCreateSchema), adminController.createResult);
router.put(
  '/results/:id',
  validate(idParamsSchema, 'params'),
  validate(resultUpdateSchema),
  adminController.updateResult,
);
router.delete(
  '/results/:id',
  validate(idParamsSchema, 'params'),
  adminController.deleteResult,
);

// Site Settings
router.get('/settings', adminController.getSettings);
router.put('/settings', validate(settingsUpdateSchema), adminController.updateSettings);

// On-page visual editor. Deleting an override restores the code default.
router.get(
  '/page-content/:pageKey',
  validate(pageContentParamsSchema, 'params'),
  adminController.getPageContent,
);
router.put(
  '/page-content/:pageKey/:contentKey',
  validate(contentBlockParamsSchema, 'params'),
  validate(contentBlockUpdateSchema),
  adminController.updateContentBlock,
);
router.delete(
  '/page-content/:pageKey/:contentKey',
  validate(contentBlockParamsSchema, 'params'),
  adminController.deleteContentBlock,
);

// Database Viewers / Leads
router.get(
  '/database/users',
  validate(adminListQuerySchema, 'query'),
  adminController.getUsers,
);
router.get(
  '/database/course-forms',
  validate(adminListQuerySchema, 'query'),
  adminController.getCourseForms,
);
router.get(
  '/database/scholarship-forms',
  validate(adminListQuerySchema, 'query'),
  adminController.getScholarshipForms,
);
router.get(
  '/database/contact-messages',
  validate(adminListQuerySchema, 'query'),
  adminController.getContactMessages,
);
router.get(
  '/leads',
  validate(adminListQuerySchema, 'query'),
  adminController.searchLeads,
);

export default router;
