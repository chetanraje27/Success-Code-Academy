import crypto from 'crypto';
import { Op } from 'sequelize';
import { AdminPasswordReset } from '../models';
import { appBaseUrl, env } from '../config/environment';
import { AppError } from './AppError';

/**
 * Shared rules for administrator password reset tokens, used by both the
 * dashboard (which issues links) and the public reset endpoint (which consumes
 * them) so the two can never disagree about hashing or expiry.
 */

/** Raw tokens are 32 random bytes; only their SHA-256 is ever stored. */
export function hashResetToken(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

/** The link an administrator follows to choose a new password. */
export function buildResetUrl(rawToken: string): string {
  const base = appBaseUrl();
  const path = `/admin/reset-password?token=${encodeURIComponent(rawToken)}`;
  return base ? `${base}${path}` : path;
}

/**
 * Checks if a reset token was already issued recently for this administrator.
 * Throws a 429 AppError if the cooldown window has not elapsed yet.
 */
export async function checkResetCooldown(adminId: number, cooldownSeconds = 60): Promise<void> {
  const lastReset = await AdminPasswordReset.findOne({
    where: { adminId },
    order: [['createdAt', 'DESC']],
  });

  if (lastReset && lastReset.createdAt) {
    const elapsedSeconds = (Date.now() - new Date(lastReset.createdAt).getTime()) / 1000;
    if (elapsedSeconds < cooldownSeconds) {
      const remainingSeconds = Math.max(1, Math.ceil(cooldownSeconds - elapsedSeconds));
      throw new AppError(
        `Please wait ${remainingSeconds} second${remainingSeconds === 1 ? '' : 's'} before requesting another reset link.`,
        429,
      );
    }
  }
}

/**
 * Creates a single-use reset token for an administrator and returns the raw
 * token, which is the only moment it exists in readable form.
 *
 * Any earlier unused token for the same administrator is expired first, so
 * issuing a fresh link silently revokes a link that was sent to the wrong
 * person or is sitting in an old message.
 */
export async function issueAdminPasswordReset(options: {
  adminId: number;
  requestedByAdminId?: number | null;
}): Promise<{ rawToken: string; expiresAt: Date; ttlMinutes: number }> {
  const ttlMinutes = env.ADMIN_RESET_TTL_MINUTES;
  const now = new Date();

  await AdminPasswordReset.update(
    { usedAt: now },
    {
      where: {
        adminId: options.adminId,
        usedAt: { [Op.is]: null },
        expiresAt: { [Op.gt]: now },
      },
    },
  );

  const rawToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(now.getTime() + ttlMinutes * 60 * 1000);

  await AdminPasswordReset.create({
    adminId: options.adminId,
    tokenHash: hashResetToken(rawToken),
    expiresAt,
    requestedByAdminId: options.requestedByAdminId ?? null,
  });

  return { rawToken, expiresAt, ttlMinutes };
}

