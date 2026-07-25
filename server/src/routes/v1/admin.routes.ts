import { Router } from 'express';
import * as adminController from '../../controllers/admin.controller';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';

const router = Router();

// Apply authentication and admin authorization to all admin routes
router.use(authenticate);
router.use(authorize('admin'));

// Dashboard Stats
router.get('/stats', adminController.getDashboardStats);

// Image Upload
router.post('/upload', adminController.upload, adminController.uploadImage);

// Banners
router.get('/banners', adminController.getBanners);
router.post('/banners', adminController.createBanner);
router.put('/banners/:id', adminController.updateBanner);
router.delete('/banners/:id', adminController.deleteBanner);

// Notifications
router.get('/notifications', adminController.getNotifications);
router.post('/notifications', adminController.createNotification);
router.put('/notifications/:id', adminController.updateNotification);
router.delete('/notifications/:id', adminController.deleteNotification);

// Star Students
router.get('/stars', adminController.getStarStudents);
router.post('/stars', adminController.createStarStudent);
router.put('/stars/:id', adminController.updateStarStudent);
router.delete('/stars/:id', adminController.deleteStarStudent);

// Articles & Blog Posts
router.get('/articles', adminController.getArticles);
router.post('/articles', adminController.createArticle);
router.delete('/articles/:id', adminController.deleteArticle);

// Video Uploads
router.get('/videos', adminController.getVideos);
router.post('/videos', adminController.createVideo);
router.delete('/videos/:id', adminController.deleteVideo);

// Courses Management
router.get('/courses', adminController.getCourses);
router.post('/courses', adminController.createCourse);

// Scholarships Management
router.get('/scholarships', adminController.getScholarships);
router.post('/scholarships', adminController.createScholarship);

// Results Management
router.get('/results', adminController.getResults);
router.post('/results', adminController.createResult);
router.put('/results/:id', adminController.updateResult);
router.delete('/results/:id', adminController.deleteResult);

// Site Settings
router.get('/settings', adminController.getSettings);
router.put('/settings', adminController.updateSettings);

// Database Viewers / Leads
router.get('/database/users', adminController.getUsers);
router.get('/database/course-forms', adminController.getCourseForms);
router.get('/database/scholarship-forms', adminController.getScholarshipForms);
router.get('/database/contact-messages', adminController.getContactMessages);
router.get('/leads', adminController.searchLeads);

export default router;
