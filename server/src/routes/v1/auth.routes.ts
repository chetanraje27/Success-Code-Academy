import { Router } from 'express';
import { z } from 'zod';
import {
  changeAdminPassword,
  checkMobileOrLogin,
  getCurrentUser,
  loginAdmin,
  registerUser,
  updateProfile,
} from '../../controllers/auth.controller';
import { validate } from '../../middlewares/validate';
import { authenticate } from '../../middlewares/authenticate';
import {
  adminLoginLimiter,
  submissionLimiter,
} from '../../middlewares/rateLimiter';
import { authorize } from '../../middlewares/authorize';

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

const adminLoginSchema = z
  .object({
    email: z.string().trim().toLowerCase().email('Enter a valid email address'),
    password: z.string().min(1, 'Password is required').max(128),
  })
  .strict();

const adminPasswordSchema = z
  .object({
    currentPassword: z.string().min(1).max(128),
    newPassword: z
      .string()
      .min(12, 'New password must be at least 12 characters')
      .max(128)
      .regex(/[a-z]/, 'New password must include a lowercase letter')
      .regex(/[A-Z]/, 'New password must include an uppercase letter')
      .regex(/[0-9]/, 'New password must include a number')
      .regex(/[^A-Za-z0-9]/, 'New password must include a symbol'),
  })
  .strict()
  .refine((data) => data.currentPassword !== data.newPassword, {
    path: ['newPassword'],
    message: 'New password must be different from the current password',
  });

router.post('/send-otp', submissionLimiter, validate(sendOtpSchema), checkMobileOrLogin);
router.post('/verify-otp', submissionLimiter, validate(verifyOtpSchema), registerUser);
router.put('/profile', authenticate, validate(updateProfileSchema), updateProfile);
router.post('/admin/login', adminLoginLimiter, validate(adminLoginSchema), loginAdmin);
router.get('/me', authenticate, getCurrentUser);
router.put(
  '/admin/password',
  authenticate,
  authorize('admin'),
  validate(adminPasswordSchema),
  changeAdminPassword,
);

export default router;
