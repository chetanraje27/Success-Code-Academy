/**
 * Augments the Express Request interface to include a `user` property
 * populated by the authenticate middleware after JWT verification.
 *
 * The shape matches the verified session that authenticate attaches
 * after loading the current user from the database.
 */
declare namespace Express {
  interface Request {
    user?: {
      id: number;
      role: string;
      email: string;
      mobileNumber: string;
      purpose: 'student' | 'admin';
    };
  }
}
