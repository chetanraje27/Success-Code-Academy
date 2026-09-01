import { execSync } from 'node:child_process';
import path from 'node:path';
import logger from './logger';

/**
 * Applies pending database migrations before the server starts listening.
 *
 * The `prestart` script (`npx sequelize-cli db:migrate`) only runs when the
 * process is launched through `npm start`. Hosting providers (e.g. Render)
 * frequently invoke the compiled entry point directly, which silently skips
 * the prestart step and leaves the schema diverged from the models (recorded
 * migrations whose columns were never created). Running migrations here keeps
 * every environment on the reviewed migration path regardless of how the
 * process is started.
 *
 * Failures are logged but do not block startup; the connection retry loop
 * re-runs this step when the database becomes available.
 */
export function runMigrations(): void {
  try {
    // Compiled: dist -> server root. ts-node dev: src -> server root.
    const serverRoot = path.resolve(__dirname, '..');
    execSync('npx sequelize-cli db:migrate', {
      cwd: serverRoot,
      stdio: 'inherit',
      env: process.env,
    });
  } catch (error) {
    logger.error(
      'Startup database migration step failed. Continuing anyway.',
      { error },
    );
  }
}
