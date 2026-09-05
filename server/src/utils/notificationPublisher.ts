import { Admin } from '../models/Admin';
import { AdminNotificationPreference } from '../models';
import { createAdminNotification, isEnabled } from './notificationDelivery';
import logger from './logger';

export interface AdminNotificationInput {
  eventType: string;
  title: string;
  body: string;
  targetUrl?: string;
  metadata?: Record<string, unknown>;
}

/** Fan out an event to every enabled administrator without exposing metadata in push payloads. */
export async function publishAdminNotification(input: AdminNotificationInput): Promise<void> {
  try {
    // Check before reading recipients or creating rows. createAdminNotification
    // checks again to cover a concurrent global setting change.
    if (!await isEnabled()) return;

    const [admins, preferences] = await Promise.all([
      Admin.findAll({ attributes: ['id'] }),
      AdminNotificationPreference.findAll({ attributes: ['adminId', 'enabled'] }),
    ]);
    const enabledByAdmin = new Map(preferences.map((preference) => [preference.adminId, preference.enabled]));

    await Promise.allSettled(admins
      .filter((admin) => enabledByAdmin.get(admin.id) !== false)
      .map((admin) => createAdminNotification({
        adminId: admin.id,
        eventType: input.eventType,
        title: input.title,
        body: input.body,
        ...(input.targetUrl ? { targetUrl: input.targetUrl } : {}),
      })));
  } catch (error: unknown) {
    // Fan-out is best effort and must not affect the originating request.
    // Do not log the event input or its potentially sensitive metadata.
    logger.warn('[Notifications] Admin notification fan-out failed', { error });
  }
}
