import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import corsOptions from './config/cors';
import routes from './routes';
import { requestLogger } from './middlewares/requestLogger';
import { defaultLimiter } from './middlewares/rateLimiter';
import { notFound } from './middlewares/notFound';
import { errorHandler } from './middlewares/errorHandler';

/**
 * Express application factory.
 *
 * Assembles the full middleware stack in the correct order and returns
 * the configured app.  Does NOT call `app.listen()` — that is the
 * responsibility of `index.ts` so the server can be started after
 * environment validation and database checks.
 */
const app = express();

// ── Security headers ──
app.use(helmet());

// ── CORS ──
app.use(cors(corsOptions));

// ── Body parsers ──
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Request logging ──
app.use(requestLogger);

// ── Rate limiting (general) ──
app.use(defaultLimiter);

// ── Routes ──
app.use(routes);

// ── 404 catch-all (must be after routes) ──
app.use(notFound);

// ── Global error handler (must be last) ──
app.use(errorHandler);

export default app;
