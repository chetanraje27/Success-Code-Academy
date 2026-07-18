import { Router } from 'express';
import { z } from 'zod';
import { checkMobileOrLogin, registerUser, updateProfile } from '../../controllers/auth.controller';
import { validate } from '../../middlewares/validate';
import { authenticate } from '../../middlewares/authenticate';
import { submissionLimiter } from '../../middlewares/rateLimiter';

const router = Router();

const sendOtpSchema = z.object({
  mobileNumber: z.string().regex(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits'),
});

const verifyOtpSchema = z.object({
  mobileNumber: z.string().regex(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('A valid email address is required'),
  age: z.union([z.number(), z.string()]).transform((val) => {
    if (typeof val === 'number') return val;
    const parsed = parseInt(val, 10);
    return isNaN(parsed) ? undefined : parsed;
  }),
});

const updateProfileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('A valid email address is required'),
  age: z.union([z.number(), z.string()]).transform((val) => {
    if (typeof val === 'number') return val;
    const parsed = parseInt(val, 10);
    return isNaN(parsed) ? undefined : parsed;
  }),
});

router.post('/send-otp', submissionLimiter, validate(sendOtpSchema), checkMobileOrLogin);
router.post('/verify-otp', submissionLimiter, validate(verifyOtpSchema), registerUser);
router.put('/profile', authenticate, validate(updateProfileSchema), updateProfile);

export default router;
