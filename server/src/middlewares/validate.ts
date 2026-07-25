import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

type ValidationTarget = 'body' | 'query' | 'params';

/**
 * Creates a middleware that validates a specific part of the incoming
 * request (`body`, `query`, or `params`) against a Zod schema.
 *
 * On success body and route params are replaced with the parsed (and
 * potentially transformed/defaulted) output from Zod.
 *
 * Express 5 exposes `req.query` through a getter-only property, so query
 * input is validated here but remains on the request in its original
 * string form. Query-consuming controllers already normalize those values
 * after this middleware has established that they are safe.
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

    // Express 5 defines req.query as a getter on the request prototype.
    // Assigning to it throws before the controller can run.
    if (target !== 'query') {
      (req as unknown as Record<string, unknown>)[target] = result.data;
    }
    next();
  };
};
