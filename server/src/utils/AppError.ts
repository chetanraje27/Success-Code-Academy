/**
 * Custom application error class.
 *
 * Extends the native Error with HTTP-specific metadata so the global
 * error handler can produce consistent, structured JSON responses.
 *
 * - `statusCode` — HTTP status code (e.g. 400, 404, 500)
 * - `status`     — "fail" for 4xx, "error" for 5xx
 * - `isOperational` — true for expected (operational) errors;
 *                     false would indicate a programmer bug
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly status: string;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // Preserve proper stack trace (V8 engines only)
    Error.captureStackTrace(this, this.constructor);
  }
}
