import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { env } from '../config/environment';
import logger from '../utils/logger';

/**
 * Checks whether an unknown error value is a Zod validation error
 * by looking for the characteristic `issues` array.
 * This structural check avoids tight coupling to a specific Zod version.
 */
function isZodError(
  err: unknown,
): err is { issues: Array<{ path: (string | number)[]; message: string }> } {
  return (
    err !== null &&
    typeof err === 'object' &&
    'issues' in err &&
    Array.isArray((err as Record<string, unknown>).issues)
  );
}

/**
 * Global error-handling middleware.
 *
 * Catches every error forwarded via `next(err)` and returns a
 * consistent JSON response.  In development the full stack trace is
 * included; in production only the message is exposed.
 *
 * Express identifies this as an error handler because it declares
 * exactly four parameters (err, req, res, next).
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  let statusCode = 500;
  let status = 'error';
  let message: string = 'Internal Server Error';
  let errors: Array<{ field: string; message: string }> = [];

  // ── Operational errors thrown intentionally via AppError ──
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    status = err.status;
    message = err.message;
  }
  
  // ── Sequelize database connection errors ──
  else if (err.name && err.name.startsWith('Sequelize')) {
    statusCode = 503; // Service Unavailable
    status = 'error';
    message = 'Database service is temporarily unavailable. Please try again shortly.';
  }

  // ── Zod validation errors ──
  else if (isZodError(err)) {
    statusCode = 422;
    status = 'fail';
    message = 'Validation failed';
    errors = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
  }

  // Log the error
  logger.error(err.message, {
    statusCode,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  });

  // Build the response payload
  const payload: Record<string, unknown> = {
    status,
    statusCode,
    message,
    errors,
  };

  if (env.NODE_ENV === 'development') {
    payload.stack = err.stack;
  }

  res.status(statusCode).json(payload);
};
