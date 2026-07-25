import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load .env from the server root directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Zod schema defining all required and optional environment variables.
 * Validates types, applies defaults, and exits the process with a
 * clear error message if any required variable is missing or invalid.
 */
const envSchema = z.object({
  // Server
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z
    .string()
    .default('5000')
    .transform((val) => parseInt(val, 10)),

  // Database (Supabase PostgreSQL)
  DB_HOST: z.string().min(1, 'DB_HOST is required'),
  DB_PORT: z
    .string()
    .default('5432')
    .transform((val) => parseInt(val, 10)),
  DB_NAME: z.string().min(1, 'DB_NAME is required'),
  DB_USER: z.string().min(1, 'DB_USER is required'),
  DB_PASSWORD: z.string().min(1, 'DB_PASSWORD is required'),

  // Authentication
  JWT_SECRET: z
    .string()
    .min(32, 'JWT_SECRET must be at least 32 characters long'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  ADMIN_JWT_EXPIRES_IN: z.string().default('8h'),

  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:3000'),

  // Logging
  LOG_LEVEL: z
    .enum(['error', 'warn', 'info', 'http', 'debug'])
    .default('debug'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:\n');
  const formatted = parsed.error.flatten();

  for (const [field, errors] of Object.entries(formatted.fieldErrors)) {
    if (errors) {
      console.error(`  ${field}: ${errors.join(', ')}`);
    }
  }

  console.error('\nSee .env.example for the required variables.');
  process.exit(1);
}

/** Validated and typed environment configuration. */
export const env = parsed.data;

/** TypeScript type inferred from the environment schema. */
export type Env = z.infer<typeof envSchema>;
