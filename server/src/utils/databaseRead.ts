const TRANSIENT_DATABASE_ERRORS = new Set([
  'SequelizeConnectionAcquireTimeoutError',
  'SequelizeConnectionError',
  'SequelizeConnectionRefusedError',
  'SequelizeConnectionTimedOutError',
  'SequelizeHostNotFoundError',
  'SequelizeHostNotReachableError',
  'SequelizeTimeoutError',
]);

function isTransientDatabaseError(error: unknown): boolean {
  return (
    error instanceof Error && TRANSIENT_DATABASE_ERRORS.has(error.name)
  );
}

/**
 * Retries a read once when a pooled database connection was interrupted.
 * Writes intentionally do not use this helper, so they cannot be submitted twice.
 */
export async function readFromDatabase<T>(
  query: () => Promise<T>,
): Promise<T> {
  try {
    return await query();
  } catch (error) {
    if (!isTransientDatabaseError(error)) {
      throw error;
    }

    await new Promise<void>((resolve) => setTimeout(resolve, 300));
    return query();
  }
}
