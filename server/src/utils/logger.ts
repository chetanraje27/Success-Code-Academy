import winston from 'winston';
import fs from 'fs';
import path from 'path';
import { env } from '../config/environment';

const { combine, timestamp, printf, colorize, json, errors: errorsFormat } =
  winston.format;

// ---------------------------------------------------------------------------
// Custom development format: colorized, human-readable one-liner per log
// ---------------------------------------------------------------------------
const devFormat = printf(({ level, message, timestamp: ts, stack, ...meta }) => {
  const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  const stackStr = stack ? `\n${stack}` : '';
  return `${ts} [${level}]: ${message}${metaStr}${stackStr}`;
});

// ---------------------------------------------------------------------------
// Create the logger instance
// ---------------------------------------------------------------------------
const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  levels: winston.config.npm.levels,
  format: combine(
    errorsFormat({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  ),
  transports: [
    // Console transport — always active
    new winston.transports.Console({
      format:
        env.NODE_ENV === 'development'
          ? combine(colorize(), devFormat)
          : json(),
    }),
  ],
  // Do not exit on unhandled errors
  exitOnError: false,
});

// ---------------------------------------------------------------------------
// File transports — production only
// ---------------------------------------------------------------------------
if (env.NODE_ENV === 'production') {
  const logDir = path.resolve(__dirname, '../../logs');

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  logger.add(
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5 * 1024 * 1024, // 5 MB
      maxFiles: 5,
    }),
  );

  logger.add(
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 10 * 1024 * 1024, // 10 MB
      maxFiles: 5,
    }),
  );
}

export default logger;
