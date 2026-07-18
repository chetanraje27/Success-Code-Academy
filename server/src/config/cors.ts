import { env } from './environment';
import type { CorsOptions } from 'cors';

/**
 * CORS configuration.
 *
 * Allows the Next.js frontend (specified by CORS_ORIGIN) to make
 * cross-origin requests to this API.  Credentials are enabled so
 * the browser can send cookies / Authorization headers.
 */
const corsOptions: CorsOptions = {
  origin: env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400, // 24 hours — browsers cache preflight results
};

export default corsOptions;
