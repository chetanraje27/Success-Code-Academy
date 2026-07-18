import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

/**
 * Role-Based Access Control (RBAC) middleware factory.
 *
 * Returns a middleware that checks whether the authenticated user's
 * role is included in the list of allowed roles.  Must be placed
 * **after** the `authenticate` middleware in the middleware chain.
 *
 * @example
 * // Only super-admin and editor can access this route
 * router.put(
 *   '/news/:id',
 *   authenticate,
 *   authorize('super-admin', 'editor'),
 *   newsController.update,
 * );
 */
export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const user = (req as any).user;

    if (!user) {
      next(new AppError('Authentication required.', 401));
      return;
    }

    // Hardcoded Admin Access override
    const isAdminOverride = user.mobileNumber === '9699062427' || user.role === 'admin';

    if (!allowedRoles.includes(user.role) && !(allowedRoles.includes('admin') && isAdminOverride)) {
      next(
        new AppError(
          'You do not have permission to perform this action.',
          403,
        ),
      );
      return;
    }

    next();
  };
};
