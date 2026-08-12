import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';
import { env } from '../config/environment';
import { isAdminRole } from '../config/roles';
import { User, Admin } from '../models';
import { asyncHandler } from '../utils/asyncHandler';

/**
 * JWT authentication middleware.
 *
 * Expects an `Authorization: Bearer <token>` header.  Verifies the
 * token against JWT_SECRET and attaches the decoded payload to
 * `req.user` so downstream handlers can identify the caller.
 *
 * The privilege level on `req.user.role` is always the one stored on the
 * account row, never the `role` claim carried by the token. A token minted
 * before a demotion therefore loses its access on the very next request, and
 * a tampered claim is ignored outright.
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
        attributes: ['id', 'email', 'mobileNumber', 'role'],
      });
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

    // An administrator row with an unrecognised role is treated as broken
    // rather than as a default-privileged account.
    if (decoded.purpose === 'admin' && !isAdminRole(account.role)) {
      throw new AppError('This account has no valid admin role assigned.', 403);
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
