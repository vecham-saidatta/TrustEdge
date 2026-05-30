/**
 * TRUSTEDGE — Winston Logger
 * 
 * Structured logging with:
 * - Console output (colorized in dev, JSON in prod)
 * - File output (errors go to error.log, everything goes to combined.log)
 * - Timestamp on every log line
 * 
 * Usage:
 *   const logger = require('./config/logger');
 *   logger.info('Server started', { port: 5000 });
 *   logger.error('Database failed', { error: err.message });
 */

const winston = require('winston');
const path = require('path');
const config = require('./env');

// Define log format
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
);

// Console format (colorized for dev readability)
const consoleFormat = winston.format.combine(
    winston.format.timestamp({ format: 'HH:mm:ss' }),
    winston.format.colorize(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
        const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
        return `${timestamp} ${level}: ${message}${metaStr}`;
    })
);

// Create logger instance
const logger = winston.createLogger({
    level: config.logLevel,
    format: logFormat,
    defaultMeta: { service: 'trustedge-api' },
    transports: [
        // Write errors to error.log
        new winston.transports.File({
            filename: path.resolve(__dirname, '../../logs/error.log'),
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        // Write all logs to combined.log
        new winston.transports.File({
            filename: path.resolve(__dirname, '../../logs/combined.log'),
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
    ],
});

// In development, also log to console with colors
if (config.isDev) {
    logger.add(
        new winston.transports.Console({
            format: consoleFormat,
        })
    );
}

module.exports = logger;
