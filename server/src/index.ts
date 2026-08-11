import { env } from './config/environment';
import app from './app';
import { testConnection } from './models';
import logger from './utils/logger';
import { sequelize } from './models';
import { seedDatabase } from './seedDatabase';

function scheduleDatabaseReconnect(): void {
  let delay = 3_000;

  const reconnect = async (): Promise<void> => {
    const connected = await testConnection();
    if (connected) {
      try {
        await seedDatabase();
        logger.info('Database connection restored.');
        return;
      } catch (error) {
        logger.error('Database reconnected but content seeding failed.', { error });
      }
    }

    const retryIn = delay;
    delay = Math.min(delay * 2, 60_000);
    logger.warn(`Database unavailable. Retrying connection in ${retryIn / 1_000}s.`);
    setTimeout(() => void reconnect(), retryIn);
  };

  void reconnect();
}

/**
 * Server entry point.
 *
 * 1. Environment variables are validated on import (config/environment.ts).
 * 2. Tests the database connection (logs result but does not block startup).
 * 3. Starts the HTTP server.
 * 4. Registers graceful-shutdown handlers for SIGTERM / SIGINT.
 */
async function startServer(): Promise<void> {
  // Test the database connection. In development, testConnection also
  // synchronizes models; production schema changes use migrations.
  const dbConnected = await testConnection();

  if (dbConnected) {
    // Seed default content data if empty (must run after sync)
    await seedDatabase();
  }

  if (!dbConnected) {
    logger.warn(
      'Server starting without database connection. Retrying in the background.',
    );
    scheduleDatabaseReconnect();
  }

  const server = app.listen(env.PORT, () => {
    logger.info(` Server running on port ${env.PORT} [${env.NODE_ENV}]`);
  });

  // ── Graceful shutdown ──
  const shutdown = (signal: string): void => {
    logger.info(`\n${signal} received. Shutting down gracefully…`);

    server.close(() => {
      logger.info('HTTP server closed.');
      process.exit(0);
    });

    // Force exit if graceful shutdown takes too long
    setTimeout(() => {
      logger.error('Forced shutdown — timeout exceeded.');
      process.exit(1);
    }, 10_000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

startServer();

setInterval(() => {
  // Keep the event loop alive
}, 1000 * 60 * 60);
