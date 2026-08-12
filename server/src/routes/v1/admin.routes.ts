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
  newsCreateSchema,
  newsUpdateSchema,
  videoCreateSchema,
  videoUpdateSchema,
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
  mediaHistoryParamsSchema,
  mediaResourceParamsSchema,
  mediaRestoreParamsSchema,
  adminCreateUserSchema,
  adminUpdateUserSchema,
  adminAccountCreateSchema,
  adminAccountUpdateSchema,
  adminCreateCourseFormSchema,
  adminUpdateCourseFormSchema,
  adminCreateScholarshipFormSchema,
  adminUpdateScholarshipFormSchema,
  adminCreateContactMessageSchema,
  adminUpdateContactMessageSchema,
  courseCreateSchema,
  courseUpdateSchema,
} from '../../validation/admin.schemas';

const router = Router();

// Apply authentication and admin authorization to all admin routes
router.use(authenticate);
router.use(authorize('admin'));

// Dashboard Stats
router.get('/stats', adminController.getDashboardStats);

// Signed URL Upload (Direct to Supabase)
router.post('/upload/signed-url', adminController.getSignedUploadUrl);

// Image Upload (Legacy/Memory)
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

// News Articles
router.get('/news', adminController.getNewsArticles);
router.post('/news', validate(newsCreateSchema), adminController.createNewsArticle);
router.put(
  '/news/:id',
  validate(idParamsSchema, 'params'),
  validate(newsUpdateSchema),
  adminController.updateNewsArticle,
);
router.delete(
  '/news/:id',
  validate(idParamsSchema, 'params'),
  adminController.deleteNewsArticle,
);

// Academy Videos
router.get('/videos', adminController.getAcademyVideos);
router.post('/videos', validate(videoCreateSchema), adminController.createAcademyVideo);
router.put(
  '/videos/:id',
  validate(idParamsSchema, 'params'),
  validate(videoUpdateSchema),
  adminController.updateAcademyVideo,
);
router.delete(
  '/videos/:id',
  validate(idParamsSchema, 'params'),
  adminController.deleteAcademyVideo,
);

// Courses
router.get('/courses', adminController.getCourses);
router.post('/courses', validate(courseCreateSchema), adminController.createCourse);
router.put(
  '/courses/:id',
  validate(idParamsSchema, 'params'),
  validate(courseUpdateSchema),
  adminController.updateCourse,
);
router.delete(
  '/courses/:id',
  validate(idParamsSchema, 'params'),
  adminController.deleteCourse,
);

// Media history and rollback
router.get(
  '/history/:resourceType',
  validate(mediaResourceParamsSchema, 'params'),
  adminController.getMediaHistory,
);
router.get(
  '/history/:resourceType/:id',
  validate(mediaHistoryParamsSchema, 'params'),
  adminController.getMediaHistory,
);
router.post(
  '/history/:resourceType/:id/:revisionId/restore',
  validate(mediaRestoreParamsSchema, 'params'),
  adminController.restoreMediaRevision,
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
  '/database/admins',
  validate(adminListQuerySchema, 'query'),
  adminController.getAdminAccounts,
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

// Database Management mutations
router.post('/database/users', validate(adminCreateUserSchema), adminController.createUser);
router.put('/database/users/:id', validate(idParamsSchema, 'params'), validate(adminUpdateUserSchema), adminController.updateUser);
router.delete('/database/users/:id', validate(idParamsSchema, 'params'), adminController.deleteUser);

// Administrator accounts. Passwords are set once at creation and afterwards
// rotated only through a single-use reset link.
router.post('/database/admins', validate(adminAccountCreateSchema), adminController.createAdminAccount);
router.put('/database/admins/:id', validate(idParamsSchema, 'params'), validate(adminAccountUpdateSchema), adminController.updateAdminAccount);
router.delete('/database/admins/:id', validate(idParamsSchema, 'params'), adminController.deleteAdminAccount);
router.post(
  '/database/admins/:id/password-reset',
  validate(idParamsSchema, 'params'),
  adminController.sendAdminPasswordReset,
);

router.post('/database/course-forms', validate(adminCreateCourseFormSchema), adminController.createCourseForm);
router.put('/database/course-forms/:id', validate(idParamsSchema, 'params'), validate(adminUpdateCourseFormSchema), adminController.updateCourseForm);
router.delete('/database/course-forms/:id', validate(idParamsSchema, 'params'), adminController.deleteCourseForm);

router.post('/database/scholarship-forms', validate(adminCreateScholarshipFormSchema), adminController.createScholarshipForm);
router.put('/database/scholarship-forms/:id', validate(idParamsSchema, 'params'), validate(adminUpdateScholarshipFormSchema), adminController.updateScholarshipForm);
router.delete('/database/scholarship-forms/:id', validate(idParamsSchema, 'params'), adminController.deleteScholarshipForm);

router.post('/database/contact-messages', validate(adminCreateContactMessageSchema), adminController.createContactMessage);
router.put('/database/contact-messages/:id', validate(idParamsSchema, 'params'), validate(adminUpdateContactMessageSchema), adminController.updateContactMessage);
router.delete('/database/contact-messages/:id', validate(idParamsSchema, 'params'), adminController.deleteContactMessage);

export default router;
