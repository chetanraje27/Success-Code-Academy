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

// Root route to handle Render health checks (which default to /)
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Success Code Academy API is running.' });
});

// Unversioned health check for Render / load balancers
router.get('/health', getHealth);

// Versioned API
router.use('/api/v1', v1Router);

export default router;
