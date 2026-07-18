import { env } from './environment';

/**
 * Sequelize connection configuration.
 *
 * Used by the application (via src/models/index.ts) to connect to
 * Supabase PostgreSQL.  SSL is enabled because Supabase requires it
 * for all external connections.
 */
const dbConfig = {
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  dialect: 'postgres' as const,

  // Log SQL in development only
  logging:
    env.NODE_ENV === 'development'
      ? (sql: string) => {
          console.log(sql);
        }
      : false,

  // Supabase requires SSL for external connections
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },

  // Connection pool settings
  pool: {
    max: 5,
    min: 0,
    acquire: 30000, // ms — max time to acquire a connection
    idle: 10000, // ms — max idle time before release
  },
};

export default dbConfig;
