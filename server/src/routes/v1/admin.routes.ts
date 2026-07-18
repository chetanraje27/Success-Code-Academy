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

// Database Viewers
router.get('/database/users', adminController.getUsers);
router.get('/database/course-forms', adminController.getCourseForms);
router.get('/database/scholarship-forms', adminController.getScholarshipForms);

export default router;
