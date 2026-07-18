import { Router } from 'express';
import v1Router from './v1';
import { getHealth } from '../controllers/health.controller';

/**
 * Top-level route aggregator.
 *
 * - `/health`     — unversioned health check (for load balancers / Render)
 * - `/api/v1/...` — versioned API routes
 */
const router = Router();

// Unversioned health check for Render / load balancers
router.get('/health', getHealth);

// Versioned API
router.use('/api/v1', v1Router);

export default router;
