import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { Op } from 'sequelize';
import { User, Admin, AdminPasswordReset, sequelize } from '../models';
import { env } from '../config/environment';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import {
  hashResetToken,
  buildResetUrl,
  issueAdminPasswordReset,
  checkResetCooldown,
} from '../utils/adminPasswordReset';
import logger from '../utils/logger';
import { sendMail } from '../utils/mailer';
import {
  studentWelcome,
  adminLoginAlert,
  adminPasswordResetEmail,
} from '../utils/emailTemplates';

type AuthPurpose = 'student' | 'admin';

function createToken(
  user: { id: number; email?: string; role?: string; mobileNumber: string },
  purpose: AuthPurpose,
  expiresIn: NonNullable<SignOptions['expiresIn']>,
): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email || '',
      role: user.role || purpose,
      mobileNumber: user.mobileNumber,
      purpose,
    },
    env.JWT_SECRET,
    {
      algorithm: 'HS256',
      audience: 'sca-web',
      issuer: 'success-code-academy',
      expiresIn,
    },
  );
}

function publicUser(user: User) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    mobileNumber: user.mobileNumber,
    email: user.email,
    age: user.age,
    role: user.role,
  };
}

function publicAdmin(admin: Admin) {
  return {
    id: admin.id,
    firstName: admin.name,
    lastName: '',
    mobileNumber: admin.mobileNumber,
    email: admin.email,
    // The real privilege level, so the dashboard can hide what this account
    // cannot do. The API enforces the same role independently.
    role: admin.role,
  };
}

/**
 * POST /api/v1/auth/send-otp
 *
 * Temporarily acts as a direct mobile number check.
 * If user exists: logs them in immediately (generates JWT).
 * If user is new: returns exists = false to prompt profile creation on frontend.
 */
export const checkMobileOrLogin = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { mobileNumber } = req.body;

    if (!mobileNumber || !/^[0-9]{10}$/.test(mobileNumber)) {
      throw new AppError('A valid 10-digit mobile number is required.', 400);
    }

    // Check if user is already registered
    const user = await User.findOne({ where: { mobileNumber } });

    if (user) {
      if (user.role !== 'student') {
        throw new AppError('Please use the admin sign-in page.', 403);
      }

      const token = createToken(
        user,
        'student',
        env.JWT_EXPIRES_IN as NonNullable<SignOptions['expiresIn']>,
      );

      logger.info(`👤 [Auth] Existing user logged in directly: ${mobileNumber}`);

      res.status(200).json({
        status: 'success',
        message: 'Login successful',
        data: {
          exists: true,
          token,
          user: publicUser(user),
        },
      });
    } else {
      // New user
      logger.info(`👤 [Auth] New mobile number detected: ${mobileNumber}`);

      res.status(200).json({
        status: 'success',
        message: 'Mobile number checked. Registration required.',
        data: {
          exists: false,
        },
      });
    }
  },
);

/**
 * POST /api/v1/auth/verify-otp
 *
 * Temporarily acts as the direct registration endpoint.
 * Registers new profile details for a mobile number, then returns the JWT.
 */
export const registerUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { mobileNumber, firstName, lastName, email, age } = req.body;

    if (!mobileNumber || !/^[0-9]{10}$/.test(mobileNumber)) {
      throw new AppError('A valid 10-digit mobile number is required.', 400);
    }

    if (!firstName || !lastName || !email || !age) {
      throw new AppError('First name, last name, email, and age are required for registration.', 400);
    }

    // Check if user already exists (concurrency protection)
    let user = await User.findOne({ where: { mobileNumber } });

    if (user) {
      throw new AppError('Mobile number is already registered.', 400);
    }

    // Create new user
    user = await User.create({
      firstName,
      lastName,
      mobileNumber,
      email,
      age: parseInt(age, 10),
      role: 'student',
    });

    logger.info(`👤 [Auth] New user registered successfully: ${mobileNumber}`);

    // Welcome email, best-effort: a failed send never blocks registration.
    if (email) {
      const template = studentWelcome({ firstName, mobileNumber });
      void sendMail({
        to: email,
        subject: 'Welcome to Success Code Academy',
        text: template.text,
        html: template.html,
      }).then((mail) => {
        if (!mail.delivered) {
          logger.warn('[Auth] Welcome email failed', { to: email, error: mail.error });
        }
      });
    }

    // Generate JWT token
    const token = createToken(
      user,
      'student',
      env.JWT_EXPIRES_IN as NonNullable<SignOptions['expiresIn']>,
    );

    res.status(200).json({
      status: 'success',
      message: 'Registration and login successful',
      data: {
        token,
        user: publicUser(user),
      },
    });
  },
);

/**
 * PUT /api/v1/auth/profile
 *
 * Updates profile details (First Name, Last Name, Email, Age) for the authenticated user.
 */
export const updateProfile = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError('Authentication credentials are missing.', 401);
    }

    const { firstName, lastName, email, age } = req.body;

    if (!firstName || !lastName || !email || !age) {
      throw new AppError('First name, last name, email, and age are required.', 400);
    }

    const user = await User.findByPk(userId);

    if (!user) {
      throw new AppError('User profile not found.', 404);
    }

    // Update details
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.age = parseInt(age, 10);
    await user.save();

    logger.info(`👤 [Auth] User profile updated: ${user.mobileNumber}`);

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        user: publicUser(user),
      },
    });
  },
);

/**
 * POST /api/v1/auth/admin/login
 *
 * Admin authentication is deliberately separate from the public student
 * flow. Only a database-backed admin role with a bcrypt password can
 * receive an admin-purpose token.
 */
export const loginAdmin = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const email = String(req.body.email).trim().toLowerCase();
    const password = String(req.body.password);

    const user = await Admin.findOne({
      where: { email },
    });

    // Comparing a fixed hash for missing accounts reduces account-enumeration
    // timing differences while keeping the public error intentionally generic.
    const fallbackHash =
      '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';
    const passwordMatches = await bcrypt.compare(
      password,
      user?.passwordHash || fallbackHash,
    );

    if (!user || !user.passwordHash || !passwordMatches) {
      logger.warn('[Auth] Failed admin sign-in attempt', {
        email,
        ip: req.ip,
      });
      throw new AppError('Invalid email or password.', 401);
    }

    const token = createToken(
      user,
      'admin',
      env.ADMIN_JWT_EXPIRES_IN as NonNullable<SignOptions['expiresIn']>,
    );

    logger.info('[Auth] Admin signed in', { userId: user.id });

    // Login alert, best-effort: a failed send never blocks sign-in.
    const template = adminLoginAlert({
      name: user.name,
      email: user.email,
      ip: req.ip,
      when: new Date(),
    });
    void sendMail({
      to: user.email,
      subject: 'New sign-in to your SCA admin account',
      text: template.text,
      html: template.html,
    }).then((mail) => {
      if (!mail.delivered) {
        logger.warn('[Auth] Admin sign-in alert email failed', {
          to: user.email,
          error: mail.error,
        });
      }
    });

    res.status(200).json({
      status: 'success',
      message: 'Admin sign-in successful.',
      data: {
        token,
        user: publicAdmin(user),
      },
    });
  },
);

/** GET /api/v1/auth/me */
export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    let account = null;

    if (req.user?.purpose === 'admin') {
      const admin = await Admin.findByPk(req.user.id);
      if (admin) {
        account = publicAdmin(admin);
      }
    } else {
      const user = await User.findByPk(req.user?.id, {
        attributes: [
          'id',
          'firstName',
          'lastName',
          'mobileNumber',
          'email',
          'age',
          'role',
        ],
      });
      if (user) {
        account = publicUser(user);
      }
    }

    if (!account) {
      throw new AppError('This account is no longer available.', 401);
    }

    res.status(200).json({
      status: 'success',
      data: { user: account },
    });
  },
);

export const changeAdminPassword = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = await Admin.findByPk(req.user?.id);
    if (!user || !user.passwordHash) {
      throw new AppError('A verified admin account is required.', 403);
    }

    const currentMatches = await bcrypt.compare(
      req.body.currentPassword,
      user.passwordHash,
    );
    if (!currentMatches) {
      throw new AppError('Current password is incorrect.', 400);
    }

    user.passwordHash = await bcrypt.hash(req.body.newPassword, 12);
    await user.save();

    logger.info('[Auth] Admin password changed', { userId: user.id });
    res.status(200).json({
      status: 'success',
      message: 'Password changed successfully. Please sign in again.',
    });
  },
);

/**
 * Every rejection of a reset token says the same thing. Whether a token is
 * unknown, expired, or already spent is not information a caller needs, and
 * withholding it removes a way to probe for live tokens.
 */
const INVALID_RESET_MESSAGE =
  'This password reset link is invalid or has expired. Ask an administrator for a new one.';

/**
 * GET /api/v1/auth/admin/reset-password?token=...
 *
 * Lets the reset page tell a stale link apart from a good one before the
 * administrator types a new password. It deliberately returns nothing about
 * the account itself.
 */
export const verifyAdminPasswordReset = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const token = String(req.query.token || '');
    if (!token) {
      throw new AppError(INVALID_RESET_MESSAGE, 400);
    }

    const reset = await AdminPasswordReset.findOne({
      where: {
        tokenHash: hashResetToken(token),
        usedAt: { [Op.is]: null },
        expiresAt: { [Op.gt]: new Date() },
      },
    });

    if (!reset) {
      throw new AppError(INVALID_RESET_MESSAGE, 400);
    }

    res.status(200).json({
      status: 'success',
      data: { valid: true, expiresAt: reset.expiresAt },
    });
  },
);

/**
 * POST /api/v1/auth/admin/reset-password
 *
 * Consumes a single-use token and sets a new password. The lookup, the
 * password write, and marking the token spent share one transaction with a
 * row lock, so two submissions of the same link cannot both succeed.
 */
export const resetAdminPassword = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { token, newPassword } = req.body as {
      token: string;
      newPassword: string;
    };
    const tokenHash = hashResetToken(token);

    const adminId = await sequelize.transaction(async (transaction) => {
      const reset = await AdminPasswordReset.findOne({
        where: {
          tokenHash,
          usedAt: { [Op.is]: null },
          expiresAt: { [Op.gt]: new Date() },
        },
        lock: transaction.LOCK.UPDATE,
        transaction,
      });

      if (!reset) {
        throw new AppError(INVALID_RESET_MESSAGE, 400);
      }

      const admin = await Admin.findByPk(reset.adminId, { transaction });
      if (!admin) {
        throw new AppError(INVALID_RESET_MESSAGE, 400);
      }

      admin.passwordHash = await bcrypt.hash(newPassword, 12);
      await admin.save({ transaction });
      await reset.update({ usedAt: new Date() }, { transaction });

      return admin.id;
    });

    logger.info('[Auth] Admin password reset via link', { userId: adminId });

    res.status(200).json({
      status: 'success',
      message: 'Your password has been updated. You can now sign in.',
    });
  },
);

/**
 * POST /api/v1/auth/admin/forgot-password
 *
 * Public endpoint for administrators who forgot their password.
 * Checks if the email belongs to an administrator, enforces a 60s cooldown,
 * and sends an email with a single-use reset link.
 */
export const forgotAdminPassword = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const email = String(req.body.email || '').trim().toLowerCase();
    if (!email) {
      throw new AppError('Enter a valid email address.', 400);
    }

    const admin = await Admin.findOne({
      where: { email },
    });

    // If admin is not found, return generic success to avoid email enumeration
    if (!admin) {
      logger.info('[Auth] Password reset requested for unknown admin email', { email });
      res.status(200).json({
        status: 'success',
        message: 'If an administrator account with this email exists, a password reset link has been sent.',
        data: { emailed: true, ttlMinutes: env.ADMIN_RESET_TTL_MINUTES },
      });
      return;
    }

    // Enforce 60-second cooldown per account
    await checkResetCooldown(admin.id, 60);

    const { rawToken, expiresAt, ttlMinutes } = await issueAdminPasswordReset({
      adminId: admin.id,
      requestedByAdminId: null,
    });

    const resetUrl = buildResetUrl(rawToken);

    const template = adminPasswordResetEmail({
      name: admin.name || 'Administrator',
      resetUrl,
      ttlMinutes,
    });

    const mail = await sendMail({
      to: admin.email,
      subject: 'Reset your Success Code Academy admin password',
      text: template.text,
      html: template.html,
    });

    logger.info('[Auth] Password reset link issued via forgot-password', {
      adminId: admin.id,
      email: admin.email,
      delivered: mail.delivered,
    });

    res.status(200).json({
      status: 'success',
      message: mail.delivered
        ? `A password reset link was sent to ${admin.email}.`
        : 'A password reset link was generated.',
      data: {
        emailed: mail.delivered,
        ttlMinutes,
        expiresAt,
        ...(process.env.NODE_ENV !== 'production' && !mail.delivered ? { resetUrl } : {}),
      },
    });
  },
);

/**
 * POST /api/v1/auth/admin/request-password-reset
 *
 * Authenticated endpoint for the signed-in administrator on the settings page.
 * Issues a single-use reset link and dispatches it directly to the logged-in email.
 */
export const requestAdminPasswordReset = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const admin = await Admin.findByPk(req.user?.id);
    if (!admin) {
      throw new AppError('A verified admin account is required.', 403);
    }

    // Enforce 60-second cooldown per account
    await checkResetCooldown(admin.id, 60);

    const { rawToken, expiresAt, ttlMinutes } = await issueAdminPasswordReset({
      adminId: admin.id,
      requestedByAdminId: admin.id,
    });

    const resetUrl = buildResetUrl(rawToken);

    const template = adminPasswordResetEmail({
      name: admin.name || 'Administrator',
      resetUrl,
      ttlMinutes,
    });

    const mail = await sendMail({
      to: admin.email,
      subject: 'Reset your Success Code Academy admin password',
      text: template.text,
      html: template.html,
    });

    logger.info('[Auth] Signed-in admin requested password reset link', {
      adminId: admin.id,
      email: admin.email,
      delivered: mail.delivered,
    });

    res.status(200).json({
      status: 'success',
      message: mail.delivered
        ? `A password reset link was sent to ${admin.email}.`
        : 'A password reset link was generated.',
      data: {
        emailed: mail.delivered,
        email: admin.email,
        ttlMinutes,
        expiresAt,
        ...(process.env.NODE_ENV !== 'production' && !mail.delivered ? { resetUrl } : {}),
      },
    });
  },
);

