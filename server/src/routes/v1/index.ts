import { Router } from 'express';
import healthRoutes from './health.routes';
import scholarshipRoutes from './scholarship.routes';
import authRoutes from './auth.routes';
import formRoutes from './form.routes';
import adminRoutes from './admin.routes';
import contentRoutes from './content.routes';
import newsletterRoutes from './newsletter.routes';
import notificationRoutes from './notification.routes';

/**
 * V1 API route aggregator.
 *
 * All V1 sub-routes are mounted here.  Future feature routes
 * (courses, leads, auth, etc.) will be added as new lines below.
 */
const v1Router = Router();

v1Router.use('/health', healthRoutes);
v1Router.use('/scholarships', scholarshipRoutes);
v1Router.use('/auth', authRoutes);
v1Router.use('/forms', formRoutes);
v1Router.use('/admin', adminRoutes);
v1Router.use('/content', contentRoutes);
v1Router.use('/newsletter', newsletterRoutes);
v1Router.use('/admin/notifications', notificationRoutes);

export default v1Router;
