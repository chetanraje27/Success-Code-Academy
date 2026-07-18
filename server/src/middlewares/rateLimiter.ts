import rateLimit from 'express-rate-limit';

/**
 * Default rate limiter for general API routes.
 * 100 requests per 15-minute window per IP address.
 */
export const defaultLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true, // Return rate-limit info in RateLimit-* headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
  message: {
    status: 'fail',
    statusCode: 429,
    message: 'Too many requests, please try again later.',
    errors: [],
  },
});

/**
 * Strict rate limiter for public submission endpoints
 * (enquiry forms, contact forms, application forms).
 * 10 requests per 15-minute window per IP address.
 */
export const submissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'fail',
    statusCode: 429,
    message: 'Too many submissions, please try again later.',
    errors: [],
  },
});
