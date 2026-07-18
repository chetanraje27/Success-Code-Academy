/**
 * Augments the NodeJS.ProcessEnv interface so that process.env
 * provides autocomplete and type safety across the codebase.
 *
 * The actual runtime validation is handled by src/config/environment.ts.
 * This declaration exists solely for editor/IDE support.
 */
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    PORT: string;

    DB_HOST: string;
    DB_PORT: string;
    DB_NAME: string;
    DB_USER: string;
    DB_PASSWORD: string;

    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;

    CORS_ORIGIN: string;

    LOG_LEVEL: 'error' | 'warn' | 'info' | 'http' | 'debug';
  }
}
