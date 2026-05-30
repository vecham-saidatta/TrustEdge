/**
 * TRUSTEDGE — Server Entry Point
 * 
 * This file starts the HTTP server.
 * It imports the configured Express app and listens on the configured port.
 * 
 * Run: npm run dev   (development with hot reload)
 * Run: npm start     (production)
 */

const app = require('./src/app');
const config = require('./src/config/env');
const logger = require('./src/config/logger');

const PORT = config.port;

const server = app.listen(PORT, () => {
    logger.info(`🚀 TRUSTEDGE API Server running on port ${PORT}`);
    logger.info(`📍 Environment: ${config.nodeEnv}`);
    logger.info(`🔗 Health check: http://localhost:${PORT}/api/v1/health`);
    logger.info(`🔗 Auth API:     http://localhost:${PORT}/api/v1/auth`);
});

// ── Graceful Shutdown ───────────────────────────────────────
// Handle process termination signals cleanly.
// Close the server and database connections before exiting.

const gracefulShutdown = (signal) => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(() => {
        logger.info('HTTP server closed.');
        process.exit(0);
    });

    // Force shutdown after 10 seconds if graceful shutdown fails
    setTimeout(() => {
        logger.error('Forced shutdown — graceful shutdown timed out.');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Catch unhandled promise rejections (prevents silent failures)
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection', { reason: reason?.message || reason });
});

// Catch uncaught exceptions
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
    process.exit(1);
});
