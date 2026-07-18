import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

/**
 * Catch-all middleware for requests that do not match any defined route.
 * Creates a 404 AppError and forwards it to the global error handler.
 */
export const notFound = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  next(new AppError(`Not Found — ${req.method} ${req.originalUrl}`, 404));
};
