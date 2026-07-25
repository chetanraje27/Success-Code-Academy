import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';
import { env } from '../config/environment';
import { User } from '../models';
import { asyncHandler } from '../utils/asyncHandler';

/**
 * JWT authentication middleware.
 *
 * Expects an `Authorization: Bearer <token>` header.  Verifies the
 * token against JWT_SECRET and attaches the decoded payload to
 * `req.user` so downstream handlers can identify the caller.
 *
 * Must be placed before any route that requires authentication.
 */
export const authenticate = asyncHandler(async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError(
      'Authentication required. Please provide a valid token.',
      401,
    );
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    throw new AppError(
      'Authentication required. Please provide a valid token.',
      401,
    );
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET, {
      algorithms: ['HS256'],
      issuer: 'success-code-academy',
      audience: 'sca-web',
    }) as {
      id: number;
      role: string;
      email: string;
      purpose: 'student' | 'admin';
    };

    if (!decoded.id || !['student', 'admin'].includes(decoded.purpose)) {
      throw new AppError('Invalid or expired token.', 401);
    }

    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'email', 'mobileNumber', 'role'],
    });

    if (!user) {
      throw new AppError('This account is no longer available.', 401);
    }

    if (decoded.purpose === 'admin' && user.role !== 'admin') {
      throw new AppError('Admin access has been revoked.', 403);
    }

    if (decoded.purpose === 'student' && user.role !== 'student') {
      throw new AppError('Please use the admin sign-in page.', 403);
    }

    req.user = {
      id: user.id,
      email: user.email || '',
      mobileNumber: user.mobileNumber,
      role: user.role,
      purpose: decoded.purpose,
    };
    next();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Invalid or expired token.', 401);
  }
});
