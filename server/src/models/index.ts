import { Sequelize } from 'sequelize';
import dbConfig from '../config/database';
import logger from '../utils/logger';

const sequelize = new Sequelize(dbConfig);

// Import models and initialize them to ensure they are registered on the sequelize instance
import ScholarshipRegistration, { initScholarshipRegistration } from './ScholarshipRegistration';
import User, { initUser } from './User';
import OtpVerification, { initOtpVerification } from './OtpVerification';
import ContactMessage, { initContactMessage } from './ContactMessage';
import CourseRegistration, { initCourseRegistration } from './CourseRegistration';
import Banner, { initBanner } from './Banner';
import Notification, { initNotification } from './Notification';
import StarStudent, { initStarStudent } from './StarStudent';

initScholarshipRegistration(sequelize);
initUser(sequelize);
initOtpVerification(sequelize);
initContactMessage(sequelize);
initCourseRegistration(sequelize);
initBanner(sequelize);
initNotification(sequelize);
initStarStudent(sequelize);

export async function testConnection(): Promise<boolean> {
  try {
    await sequelize.authenticate();
    logger.info('✅ Database connection established successfully.');
    
    // Automatically create/alter tables to match models
    await sequelize.sync({ alter: true });
    logger.info('🔄 Database tables synchronized successfully.');
    
    return true;
  } catch (error) {
    logger.error('❌ Unable to connect to the database:', { error });
    return false;
  }
}

export { sequelize, ScholarshipRegistration, User, OtpVerification, ContactMessage, CourseRegistration, Banner, Notification, StarStudent };
export default sequelize;
