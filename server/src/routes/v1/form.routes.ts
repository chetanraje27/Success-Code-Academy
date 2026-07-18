import { Router } from 'express';
import { z } from 'zod';
import { submitContactForm, submitCourseRegistration } from '../../controllers/form.controller';
import { validate } from '../../middlewares/validate';
import { submissionLimiter } from '../../middlewares/rateLimiter';

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

router.post('/contact', submissionLimiter, validate(contactFormSchema), submitContactForm);
router.post('/course-register', submissionLimiter, validate(courseRegistrationSchema), submitCourseRegistration);

export default router;
