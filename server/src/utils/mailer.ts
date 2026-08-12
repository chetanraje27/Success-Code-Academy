import logger from './logger';

/**
 * Outbound email, deliberately transport-free for now.
 *
 * The academy has no SMTP or API credentials wired up yet, so this module is
 * the single seam where a transport will be added later. Callers treat delivery
 * as best-effort: `sendMail` never throws and reports whether the message
 * actually left the building, so a feature like an admin password reset link
 * can fall back to "copy this link and hand it over" instead of failing.
 *
 * To switch email on, install a transport (e.g. `nodemailer`), fill in
 * `deliver()` below, and set the SMTP_* variables. Nothing else changes.
 */

export type MailMessage = {
  to: string;
  subject: string;
  text: string;
};

export type MailResult = {
  /** True only when a transport accepted the message. */
  delivered: boolean;
  /** Present when delivery was attempted and failed. */
  error?: string;
};

/**
 * Whether a transport is configured. Read from process.env rather than the
 * validated env schema so that adding a transport later needs no schema churn.
 */
export function isMailerConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASSWORD &&
      process.env.MAIL_FROM,
  );
}

async function deliver(message: MailMessage): Promise<MailResult> {
  // TODO: create a nodemailer transport from SMTP_HOST / SMTP_PORT /
  // SMTP_USER / SMTP_PASSWORD and send `message` from MAIL_FROM.
  logger.warn('[Mail] A transport is configured but not implemented yet.', {
    to: message.to,
    subject: message.subject,
  });
  return {
    delivered: false,
    error: 'Email delivery is not implemented on this server yet.',
  };
}

/**
 * Best-effort send. Resolves with `delivered: false` instead of throwing so
 * callers can offer a manual fallback.
 */
export async function sendMail(message: MailMessage): Promise<MailResult> {
  if (!isMailerConfigured()) {
    logger.info('[Mail] Skipped: no email transport is configured.', {
      to: message.to,
      subject: message.subject,
    });
    return {
      delivered: false,
      error: 'No email transport is configured on this server.',
    };
  }

  try {
    return await deliver(message);
  } catch (error: unknown) {
    const reason = error instanceof Error ? error.message : 'Unknown error';
    logger.error('[Mail] Delivery failed.', {
      to: message.to,
      subject: message.subject,
      error: reason,
    });
    return { delivered: false, error: reason };
  }
}
