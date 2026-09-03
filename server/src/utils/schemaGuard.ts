import { sequelize } from '../models';
import logger from './logger';

/**
 * Add-only schema guard.
 *
 * History: banners.targetUrl and notifications.icon were repeatedly reported
 * missing in both local and production while SequelizeMeta insisted the
 * migrations were applied. Sequelize's `sync({ alter: true })` (dev-only) can
 * drop columns when the model snapshot it compares against lags the database,
 * and migration bookkeeping drifts independently of the physical schema. A
 * one-off migration cannot fix that because it is recorded once and never runs
 * again.
 *
 * This guard closes the loop permanently. After the connection is up (and
 * after `runMigrations`), it walks every registered model, inspects the live
 * table, and ADD-only restores any column the model declares that the table
 * lacks. It never drops, never alters types, and is idempotent — on a healthy
 * database it performs zero writes and costs a handful of metadata queries.
 *
 * It runs in every environment (dev and production), so a fresh deployment
 * self-heals even when migration history is out of sync.
 */

export async function ensureModelColumns(): Promise<void> {
  try {
    let restored = 0;

    for (const [name, model] of Object.entries(sequelize.models)) {
      const tableName = model.getTableName();

      let columns: Record<string, { type: string }>;
      try {
        columns = await sequelize
          .getQueryInterface()
          .describeTable(String(tableName));
      } catch {
        // Table does not exist yet (sync/migrations will create it). Skip.
        continue;
      }

      for (const [attributeName, attribute] of Object.entries(
        model.rawAttributes,
      )) {
        if (attributeName === 'id' || columns[attributeName]) continue;

        const definition = {
          type: attribute.type,
          allowNull: attribute.allowNull ?? true,
        };
        if (attribute.defaultValue !== undefined) {
          (definition as { defaultValue?: unknown }).defaultValue =
            attribute.defaultValue;
        }

        try {
          await sequelize
            .getQueryInterface()
            .addColumn(String(tableName), attributeName, definition);
          logger.info('[SchemaGuard] Restored missing column', {
            table: String(tableName),
            column: attributeName,
            model: name,
          });
          restored += 1;
        } catch (error: unknown) {
          const reason = error instanceof Error ? error.message : 'Unknown error';
          logger.warn('[SchemaGuard] Could not restore column', {
            table: String(tableName),
            column: attributeName,
            error: reason,
          });
        }
      }
    }

    if (restored > 0) {
      logger.info(`[SchemaGuard] Restored ${restored} missing column(s).`);
    }
  } catch (error: unknown) {
    const reason = error instanceof Error ? error.message : 'Unknown error';
    logger.error('[SchemaGuard] Failed to run.', { error: reason });
  }
}
