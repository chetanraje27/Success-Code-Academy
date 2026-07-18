import { Router } from 'express';
import { z } from 'zod';
import { createRegistration } from '../../controllers/scholarship.controller';
import { validate } from '../../middlewares/validate';
import { submissionLimiter } from '../../middlewares/rateLimiter';

const router = Router();

// Zod validation schema for student scholarship registration input
const registerScholarshipSchema = z.object({
  studentName: z.string().min(2, 'Student name must be at least 2 characters long'),
  studentPhone: z.string().regex(/^[0-9]{10}$/, 'Student mobile number must be exactly 10 digits'),
  parentPhone: z.string().regex(/^[0-9]{10}$/, 'Parent/Guardian mobile number must be exactly 10 digits'),
  studentClass: z.enum(['10th Pass', '11th', '12th'], {
    error: 'Class must be either 10th Pass, 11th, or 12th',
  }),
  schoolName: z.string().min(2, 'School name must be at least 2 characters long'),
  city: z.string().min(2, 'City must be at least 2 characters long'),
  preferredCourse: z.string().min(2, 'Preferred course or batch must be at least 2 characters long'),
});

router.post('/register', submissionLimiter, validate(registerScholarshipSchema), createRegistration);

export default router;
