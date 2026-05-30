/**
 * LIFELINE — HTTP Request Logger Middleware
 * 
 * Logs every incoming HTTP request with method, URL, status, and response time.
 * Uses Morgan for HTTP logging, piped through Winston for consistent format.
 */

const morgan = require('morgan');
const logger = require('../config/logger');

// Create a write stream that pipes Morgan output into Winston
const stream = {
    write: (message) => {
        // Remove trailing newline that Morgan adds
        logger.info(message.trim(), { type: 'http' });
    },
};

// Use 'combined' format in production, 'dev' format in development
const requestLogger = morgan(
    process.env.NODE_ENV === 'production'
        ? ':remote-addr :method :url :status :res[content-length] - :response-time ms'
        : 'dev',
    { stream }
);

module.exports = requestLogger;
