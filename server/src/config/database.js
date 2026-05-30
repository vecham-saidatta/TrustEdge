/**
 * TRUSTEDGE — Prisma Database Client (Singleton)
 * 
 * Creates a single PrismaClient instance and reuses it across the app.
 * In development, we attach it to `global` to prevent hot-reload from
 * creating multiple connections.
 * 
 * Usage:
 *   const prisma = require('./config/database');
 *   const users = await prisma.user.findMany();
 */

const { PrismaClient } = require('@prisma/client');
const logger = require('./logger');

let prisma;

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient({
        log: ['error', 'warn'],
    });
} else {
    // In development, reuse client across hot reloads
    if (!global.__prisma) {
        global.__prisma = new PrismaClient({
            log: ['query', 'info', 'warn', 'error'],
        });
    }
    prisma = global.__prisma;
}

// Log connection events
prisma.$connect()
    .then(() => logger.info('📦 Database connected successfully'))
    .catch((err) => {
        logger.error('❌ Database connection failed', { error: err.message });
        process.exit(1);
    });

module.exports = prisma;
