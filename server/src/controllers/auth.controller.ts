import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { env } from '../config/environment';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';

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
      // Existing user: Generate JWT token immediately (proceeding without OTP)
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email || '',
          role: user.role,
          mobileNumber: user.mobileNumber,
        },
        env.JWT_SECRET,
        {
          expiresIn: env.JWT_EXPIRES_IN as any,
        },
      );

      logger.info(`👤 [Auth] Existing user logged in directly: ${mobileNumber}`);

      res.status(200).json({
        status: 'success',
        message: 'Login successful',
        data: {
          exists: true,
          token,
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            mobileNumber: user.mobileNumber,
            email: user.email,
            age: user.age,
            role: user.role,
          },
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
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email || '',
        role: user.role,
        mobileNumber: user.mobileNumber,
      },
      env.JWT_SECRET,
      {
        expiresIn: env.JWT_EXPIRES_IN as any,
      },
    );

    res.status(200).json({
      status: 'success',
      message: 'Registration and login successful',
      data: {
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          mobileNumber: user.mobileNumber,
          email: user.email,
          age: user.age,
          role: user.role,
        },
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
    const userId = (req as any).user?.id;

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
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          mobileNumber: user.mobileNumber,
          email: user.email,
          age: user.age,
          role: user.role,
        },
      },
    });
  },
);
