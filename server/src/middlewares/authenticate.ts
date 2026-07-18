import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';
import { env } from '../config/environment';

/**
 * JWT authentication middleware.
 *
 * Expects an `Authorization: Bearer <token>` header.  Verifies the
 * token against JWT_SECRET and attaches the decoded payload to
 * `req.user` so downstream handlers can identify the caller.
 *
 * Must be placed before any route that requires authentication.
 */
export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next(
      new AppError(
        'Authentication required. Please provide a valid token.',
        401,
      ),
    );
    return;
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    next(
      new AppError(
        'Authentication required. Please provide a valid token.',
        401,
      ),
    );
    return;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      id: number;
      role: string;
      email: string;
    };

    (req as any).user = decoded;
    next();
  } catch {
    next(new AppError('Invalid or expired token.', 401));
  }
};
