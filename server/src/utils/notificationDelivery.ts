import webpush from 'web-push';
import { env } from '../config/environment';
import { AdminNotification, AdminNotificationPreference, AdminPushSubscription, SiteSetting } from '../models';
import logger from './logger';

let configured = false;
function configure(): boolean {
  if (configured) return true;
  if (!env.VAPID_PUBLIC_KEY || !env.VAPID_PRIVATE_KEY || !env.VAPID_SUBJECT) return false;
  webpush.setVapidDetails(env.VAPID_SUBJECT, env.VAPID_PUBLIC_KEY, env.VAPID_PRIVATE_KEY);
  configured = true;
  return true;
}

export async function deliverAdminNotification(notification: AdminNotification): Promise<void> {
  try {
    if (!await isEnabled() || !configure()) return;
    const preference = await AdminNotificationPreference.findOne({ where: { adminId: notification.adminId } });
    if (preference && !preference.enabled) return;
    const subscriptions = await AdminPushSubscription.findAll({ where: { adminId: notification.adminId } });
    // Deliberately omit notification metadata from the browser payload.
    // The service worker consumes `url` for both the notification click target
    // and the postMessage shape. Keep the persisted model's targetUrl internal
    // while exposing the same destination under the worker contract.
    const payload = JSON.stringify({ id: String(notification.id), eventType: notification.eventType, title: notification.title, body: notification.body, url: notification.targetUrl || '/admin' });
    await Promise.all(subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification({ endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } }, payload);
      } catch (error: any) {
        if (error?.statusCode === 404 || error?.statusCode === 410) {
          await sub.destroy();
          return;
        }
        logger.warn('[Notifications] Admin push delivery failed', { statusCode: error?.statusCode });
      }
    }));
  } catch (error: unknown) {
    // Delivery is best effort; callers commonly invoke this without awaiting it.
    logger.warn('[Notifications] Admin push delivery failed', { error });
  }
}

/** Persist and, when configured, deliver a minimal browser notification. */
export async function createAdminNotification(input: {
  adminId: number; eventType: string; title: string; body: string; targetUrl?: string | null;
}): Promise<AdminNotification | null> {
  if (!await isEnabled()) return null;
  const preference = await AdminNotificationPreference.findOne({ where: { adminId: input.adminId } });
  if (preference && !preference.enabled) return null;
  const notification = await AdminNotification.create(input);
  await deliverAdminNotification(notification);
  return notification;
}

export async function isEnabled(): Promise<boolean> {
  const setting = await SiteSetting.findOne({ where: { key: 'admin_notifications_enabled' } });
  return setting?.value !== 'false';
}
