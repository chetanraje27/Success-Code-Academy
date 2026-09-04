import { env } from './environment';
import type { CorsOptions } from 'cors';

const configuredOrigins = (env.CORS_ORIGIN || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const defaultAllowedOrigins = new Set([
  ...configuredOrigins,
  'https://console.successcodeacademy.in',
  'https://successcodeacademy.in',
  'https://www.successcodeacademy.in',
  'http://localhost:3000',
  'http://console.localhost:3000',
  'http://127.0.0.1:3000',
]);

/**
 * CORS configuration.
 *
 * Allows the Next.js frontend and admin console subdomain to make
 * cross-origin requests to this API. Credentials are enabled so
 * the browser can send cookies / Authorization headers.
 */
const corsOptions: CorsOptions = {
  origin: (requestOrigin, callback) => {
    // Allow requests with no origin (e.g. server-side Next.js fetch, mobile, curl)
    if (!requestOrigin) {
      return callback(null, true);
    }
    if (defaultAllowedOrigins.has(requestOrigin)) {
      return callback(null, true);
    }
    try {
      const url = new URL(requestOrigin);
      // Allow all successcodeacademy.in domains and subdomains
      if (
        url.hostname === 'successcodeacademy.in' ||
        url.hostname.endsWith('.successcodeacademy.in')
      ) {
        return callback(null, true);
      }
      // Allow localhost subdomains during development
      if (
        env.NODE_ENV !== 'production' &&
        (url.hostname === 'localhost' || url.hostname.endsWith('.localhost') || url.hostname === '127.0.0.1')
      ) {
        return callback(null, true);
      }
    } catch {
      // Invalid URL format
    }
    return callback(new Error(`CORS origin not allowed: ${requestOrigin}`), false);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400, // 24 hours — browsers cache preflight results
};

export default corsOptions;
