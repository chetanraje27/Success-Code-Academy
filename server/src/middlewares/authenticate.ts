import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';
import { env } from '../config/environment';
import { User, Admin } from '../models';
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

    let account: any = null;

    if (decoded.purpose === 'admin') {
      account = await Admin.findByPk(decoded.id, {
        attributes: ['id', 'email', 'mobileNumber'],
      });
      if (account) {
        account.role = 'admin'; // For compatibility with the req.user type
      }
    } else {
      account = await User.findByPk(decoded.id, {
        attributes: ['id', 'email', 'mobileNumber', 'role'],
      });
    }

    if (!account) {
      throw new AppError('This account is no longer available.', 401);
    }

    if (decoded.purpose === 'student' && account.role !== 'student') {
      throw new AppError('Please use the admin sign-in page.', 403);
    }

    req.user = {
      id: account.id,
      email: account.email || '',
      mobileNumber: account.mobileNumber,
      role: account.role,
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
