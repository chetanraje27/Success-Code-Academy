import type { Request, Response } from 'express';
import { sequelize } from '../models';
import { asyncHandler } from '../utils/asyncHandler';
import { env } from '../config/environment';

/**
 * GET /health  and  GET /api/v1/health
 *
 * Returns the server's operational status, uptime, current timestamp,
 * and database connectivity.  Used by load balancers (Render) and
 * for manual verification during development.
 */
export const getHealth = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    let dbStatus = 'disconnected';

    try {
      await sequelize.authenticate();
      dbStatus = 'connected';
    } catch {
      dbStatus = 'disconnected';
    }

    res.status(200).json({
      status: 'success',
      data: {
        server: 'running',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        database: dbStatus,
        environmentVariables: {
          nodeEnv: env.NODE_ENV,
          corsOrigin: env.CORS_ORIGIN,
          dbHost: env.DB_HOST,
          dbUser: env.DB_USER,
          dbName: env.DB_NAME,
          jwtConfigured: !!env.JWT_SECRET,
          passwordConfigured: !!env.DB_PASSWORD,
        }
      },
    });
  },
);
