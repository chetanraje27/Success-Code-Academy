/**
 * Augments the Express Request interface to include a `user` property
 * populated by the authenticate middleware after JWT verification.
 *
 * The shape matches the JWT payload created during login (which will
 * be implemented in a future phase).
 */
declare namespace Express {
  interface Request {
    user?: {
      id: number;
      role: string;
      email: string;
    };
  }
}
