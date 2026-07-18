import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

type ValidationTarget = 'body' | 'query' | 'params';

/**
 * Creates a middleware that validates a specific part of the incoming
 * request (`body`, `query`, or `params`) against a Zod schema.
 *
 * On success the raw value is replaced with the parsed (and
 * potentially transformed/defaulted) output from Zod.
 *
 * On failure the ZodError is forwarded to the global error handler
 * which formats it as a 422 response.
 *
 * @example
 * const createLeadSchema = z.object({
 *   name: z.string().min(1),
 *   email: z.string().email(),
 * });
 *
 * router.post('/leads', validate(createLeadSchema), leadsController.create);
 */
export const validate = (
  schema: z.ZodType<unknown>,
  target: ValidationTarget = 'body',
) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      next(result.error);
      return;
    }

    // Replace raw input with validated and transformed data
    (req as unknown as Record<string, unknown>)[target] = result.data;
    next();
  };
};
