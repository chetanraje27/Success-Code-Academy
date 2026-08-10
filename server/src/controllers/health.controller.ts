import type { Request, Response } from 'express';
import { sequelize } from '../models';
import { asyncHandler } from '../utils/asyncHandler';

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

    res.status(dbStatus === 'connected' ? 200 : 503).json({
      status: 'success',
      data: {
        server: 'running',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        database: dbStatus,
      },
    });
  },
);
