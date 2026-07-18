import { env } from './config/environment';
import app from './app';
import { testConnection } from './models';
import logger from './utils/logger';
import { sequelize } from './models';
import { seedDatabase } from './seedDatabase';

/**
 * Server entry point.
 *
 * 1. Environment variables are validated on import (config/environment.ts).
 * 2. Tests the database connection (logs result but does not block startup).
 * 3. Starts the HTTP server.
 * 4. Registers graceful-shutdown handlers for SIGTERM / SIGINT.
 */
async function startServer(): Promise<void> {
  // We don't need to manually sync here because testConnection() inside models/index.ts already calls sequelize.sync({ alter: true }).
  // Test database connection and sync tables
  const dbConnected = await testConnection();

  if (dbConnected) {
    // Seed default content data if empty (must run after sync)
    await seedDatabase();
  }

  if (!dbConnected) {
    logger.warn(
      'Server starting without database connection. Check your DB credentials.',
    );
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
