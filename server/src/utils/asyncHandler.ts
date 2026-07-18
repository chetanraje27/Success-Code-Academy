import type { Request, Response, NextFunction } from 'express';

/**
 * Wraps an async Express route handler so that any rejected promise
 * is automatically forwarded to the next error-handling middleware.
 *
 * Note: Express 5 handles async rejections natively, but this wrapper
 * keeps the intent explicit and provides a consistent pattern across
 * the codebase.
 *
 * @example
 * router.get('/items', asyncHandler(async (req, res) => {
 *   const items = await Item.findAll();
 *   res.json(items);
 * }));
 */
type AsyncRouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

export const asyncHandler = (fn: AsyncRouteHandler) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
