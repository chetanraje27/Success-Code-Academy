import { Router } from 'express';
import { z } from 'zod';
import {
  changeAdminPassword,
  checkMobileOrLogin,
  forgotAdminPassword,
  getCurrentUser,
  loginAdmin,
  registerUser,
  requestAdminPasswordReset,
  resetAdminPassword,
  updateProfile,
  verifyAdminPasswordReset,
} from '../../controllers/auth.controller';
import { validate } from '../../middlewares/validate';
import { authenticate } from '../../middlewares/authenticate';
import {
  adminLoginLimiter,
  passwordResetLimiter,
  submissionLimiter,
} from '../../middlewares/rateLimiter';
import { authorize } from '../../middlewares/authorize';
import { ADMIN_ROLES } from '../../config/roles';

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
      .min(6, 'New password must be at least 6 characters')
      .max(128),
  })
  .strict()
  .refine((data) => data.currentPassword !== data.newPassword, {
    path: ['newPassword'],
    message: 'New password must be different from the current password',
  });

const adminResetTokenQuerySchema = z
  .object({
    token: z.string().trim().min(1, 'A reset token is required').max(256),
  })
  .strict();

const adminResetPasswordSchema = z
  .object({
    token: z.string().trim().min(1, 'A reset token is required').max(256),
    newPassword: z
      .string()
      .min(6, 'New password must be at least 6 characters')
      .max(128),
  })
  .strict();

const adminForgotPasswordSchema = z
  .object({
    email: z.string().trim().toLowerCase().email('Enter a valid email address'),
  })
  .strict();

router.post('/send-otp', submissionLimiter, validate(sendOtpSchema), checkMobileOrLogin);
router.post('/verify-otp', submissionLimiter, validate(verifyOtpSchema), registerUser);
router.put('/profile', authenticate, validate(updateProfileSchema), updateProfile);
router.post('/admin/login', adminLoginLimiter, validate(adminLoginSchema), loginAdmin);
// Public forgot-password endpoint for admins
router.post(
  '/admin/forgot-password',
  passwordResetLimiter,
  validate(adminForgotPasswordSchema),
  forgotAdminPassword,
);
// Public, token-gated password reset. Rate limited like sign-in because a
// reset token is a credential and these are the endpoints that test one.
router.get(
  '/admin/reset-password',
  adminLoginLimiter,
  validate(adminResetTokenQuerySchema, 'query'),
  verifyAdminPasswordReset,
);
router.post(
  '/admin/reset-password',
  adminLoginLimiter,
  validate(adminResetPasswordSchema),
  resetAdminPassword,
);
router.get('/me', authenticate, getCurrentUser);
router.put(
  '/admin/password',
  authenticate,
  authorize(...ADMIN_ROLES),
  validate(adminPasswordSchema),
  changeAdminPassword,
);
// Authenticated request for logged-in admin to receive a password reset email
router.post(
  '/admin/request-password-reset',
  authenticate,
  authorize(...ADMIN_ROLES),
  passwordResetLimiter,
  requestAdminPasswordReset,
);

export default router;
