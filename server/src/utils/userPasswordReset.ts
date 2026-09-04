import crypto from 'crypto';
import { Op } from 'sequelize';
import { UserPasswordReset } from '../models';
import { appBaseUrl, env } from '../config/environment';
import { AppError } from './AppError';

/**
 * Shared rules for user password reset tokens.
 */

/** Raw tokens are 32 random bytes; only their SHA-256 is ever stored. */
export function hashResetToken(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

/** The link a user follows to choose a new password. */
export function buildUserResetUrl(rawToken: string): string {
  const base = appBaseUrl();
  const tokenParam = encodeURIComponent(rawToken);

  // In production, direct to main domain with clean path
  if (base.includes('successcodeacademy.in') || env.NODE_ENV === 'production') {
    return `https://www.successcodeacademy.in/reset-password?token=${tokenParam}`;
  }

  const path = `/reset-password?token=${tokenParam}`;
  return base ? `${base}${path}` : path;
}

/**
 * Checks if a reset token was already issued recently for this user.
 * Throws a 429 AppError if the cooldown window has not elapsed yet.
 */
export async function checkUserResetCooldown(userId: number, cooldownSeconds = 60): Promise<void> {
  const lastReset = await UserPasswordReset.findOne({
    where: { userId },
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
 * Creates a single-use reset token for a user and returns the raw
 * token, which is the only moment it exists in readable form.
 */
export async function issueUserPasswordReset(options: {
  userId: number;
}): Promise<{ rawToken: string; expiresAt: Date; ttlMinutes: number }> {
  // Use the same TTL as admin for now, or 15 mins default
  const ttlMinutes = env.ADMIN_RESET_TTL_MINUTES || 15;
  const now = new Date();

  await UserPasswordReset.update(
    { usedAt: now },
    {
      where: {
        userId: options.userId,
        usedAt: { [Op.is]: null },
        expiresAt: { [Op.gt]: now },
      },
    },
  );

  const rawToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(now.getTime() + ttlMinutes * 60 * 1000);

  await UserPasswordReset.create({
    userId: options.userId,
    tokenHash: hashResetToken(rawToken),
    expiresAt,
  });

  return { rawToken, expiresAt, ttlMinutes };
}
