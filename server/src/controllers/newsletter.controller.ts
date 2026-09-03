import type { Request, Response } from 'express';
import { NewsletterSubscriber } from '../models';
import { asyncHandler } from '../utils/asyncHandler';
import { sendMail, isMailerConfigured } from '../utils/mailer';
import { newsletterWelcome } from '../utils/emailTemplates';
import logger from '../utils/logger';

/**
 * POST /api/v1/newsletter/subscribe
 *
 * Idempotent: subscribing an already-subscribed address returns success
 * without sending a second welcome email.
 */
export const subscribeNewsletter = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const email = String(req.body.email || '').trim().toLowerCase();

    const existing = await NewsletterSubscriber.findOne({ where: { email } });

    if (existing) {
      res.status(200).json({
        status: 'success',
        message: 'You are already on our update list. Thank you!',
      });
      return;
    }

    await NewsletterSubscriber.create({ email });
    logger.info(`📬 [Newsletter] New subscriber: ${email}`);

    let emailSent = false;
    if (isMailerConfigured()) {
      const template = newsletterWelcome();
      const mail = await sendMail({
        to: email,
        subject: 'Welcome to Success Code Academy updates',
        text: template.text,
        html: template.html,
      });
      emailSent = mail.delivered;
      if (!mail.delivered) {
        logger.warn('[Newsletter] Welcome email failed', { email, error: mail.error });
      }
    }

    res.status(201).json({
      status: 'success',
      message: emailSent
        ? 'Subscribed! A welcome email is on its way to your inbox.'
        : 'Subscribed! You will now receive our updates.',
    });
  },
);
