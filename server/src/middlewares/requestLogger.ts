import type { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

/**
 * HTTP request-logging middleware.
 *
 * Hooks into the response `finish` event to capture the final status
 * code and calculates the total response time.  Logs at the `http`
 * level so it can be silenced independently of application logs.
 */
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;

    logger.http(`${req.method} ${req.originalUrl}`, {
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
    });
  });

  next();
};
