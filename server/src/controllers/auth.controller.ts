import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { User } from '../models';
import { env } from '../config/environment';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';

type AuthPurpose = 'student' | 'admin';

function createToken(
  user: User,
  purpose: AuthPurpose,
  expiresIn: NonNullable<SignOptions['expiresIn']>,
): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email || '',
      role: user.role,
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

    const user = await User.findOne({
      where: { email, role: 'admin' },
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

    res.status(200).json({
      status: 'success',
      message: 'Admin sign-in successful.',
      data: {
        token,
        user: publicUser(user),
      },
    });
  },
);

/** GET /api/v1/auth/me */
export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
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

    if (!user) {
      throw new AppError('This account is no longer available.', 401);
    }

    res.status(200).json({
      status: 'success',
      data: { user: publicUser(user) },
    });
  },
);

/** PUT /api/v1/auth/admin/password */
export const changeAdminPassword = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = await User.findByPk(req.user?.id);
    if (!user || user.role !== 'admin' || !user.passwordHash) {
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
