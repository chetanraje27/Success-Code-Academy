import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { ADMIN_ROLES } from '../config/roles';

const ADMIN_ROLE_SET = new Set<string>(ADMIN_ROLES);

/**
 * Role-Based Access Control (RBAC) middleware factory.
 *
 * Returns a middleware that checks whether the authenticated user's
 * role is included in the list of allowed roles.  Must be placed
 * **after** the `authenticate` middleware in the middleware chain.
 *
 * The role compared here is the one `authenticate` loaded from the database,
 * so nothing a caller sends — a JWT claim, a header, a request body field —
 * can influence the decision.
 *
 * @example
 * // Only a super administrator may delete a banner
 * router.delete(
 *   '/banners/:id',
 *   authenticate,
 *   authorize('super-admin'),
 *   adminController.deleteBanner,
 * );
 */
export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      next(new AppError('Authentication required.', 401));
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      next(
        new AppError(
          'You do not have permission to perform this action.',
          403,
        ),
      );
      return;
    }

    // An ordinary student token can never become an admin session, even if
    // the account role is changed while that token is still valid.
    if (ADMIN_ROLE_SET.has(user.role) && user.purpose !== 'admin') {
      next(new AppError('A verified admin session is required.', 403));
      return;
    }

    next();
  };
};
