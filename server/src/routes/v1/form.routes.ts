import { Router } from 'express';
import { z } from 'zod';
import { submitContactForm, submitCourseRegistration, getMyCourseRegistration, updateMyCourseRegistration } from '../../controllers/form.controller';
import { validate } from '../../middlewares/validate';
import { submissionLimiter } from '../../middlewares/rateLimiter';
import { authenticate } from '../../middlewares/authenticate';

const router = Router();

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('A valid email address is required'),
  phone: z.string().min(10, 'A valid contact number is required'),
  message: z.string().min(5, 'Message must be at least 5 characters'),
});

const courseRegistrationSchema = z.object({
  courseTitle: z.string().min(2, 'Course title is required'),
  studentName: z.string().min(2, 'Student name must be at least 2 characters'),
  studentEmail: z.string().email('A valid email address is required'),
  studentPhone: z.string().min(10, 'A valid contact number is required'),
  visitingDate: z.string().min(1, 'Visiting date is required'),
  visitingTime: z.string().min(1, 'Visiting time is required'),
});
const updateCourseRegistrationSchema = courseRegistrationSchema.partial().refine((value) => Object.keys(value).length > 0, 'At least one field is required');

router.post('/contact', submissionLimiter, validate(contactFormSchema), submitContactForm);
router.post('/course-register', authenticate, submissionLimiter, validate(courseRegistrationSchema), submitCourseRegistration);
router.get('/course-register/me', authenticate, getMyCourseRegistration);
router.put('/course-register/me', authenticate, validate(updateCourseRegistrationSchema), updateMyCourseRegistration);

export default router;
