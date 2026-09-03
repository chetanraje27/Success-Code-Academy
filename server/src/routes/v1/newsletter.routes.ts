import { Router } from 'express';
import { z } from 'zod';
import { subscribeNewsletter } from '../../controllers/newsletter.controller';
import { validate } from '../../middlewares/validate';
import { submissionLimiter } from '../../middlewares/rateLimiter';

const router = Router();

const subscribeSchema = z.object({
  email: z.string().email('A valid email address is required'),
});

router.post('/subscribe', submissionLimiter, validate(subscribeSchema), subscribeNewsletter);

export default router;
