/**
 * LIFELINE — Environment Configuration
 * 
 * Loads environment variables from .env file and exports
 * them as a validated, centralized config object.
 * Every part of the app reads config from HERE, never from process.env directly.
 */

const dotenv = require('dotenv');
const path = require('path');

// Load .env file from server root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  // Server
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',

  // Database
  databaseUrl: process.env.DATABASE_URL,

  // JWT
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
  },

  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
};

// ── Validation ──────────────────────────────────────────────
// Fail fast if critical environment variables are missing.
const requiredVars = ['databaseUrl', 'jwt.accessSecret', 'jwt.refreshSecret'];

for (const varPath of requiredVars) {
  const parts = varPath.split('.');
  let value = config;
  for (const part of parts) {
    value = value?.[part];
  }
  if (!value) {
    console.error(`❌ FATAL: Missing required env variable mapping for: ${varPath}`);
    console.error('   Check your .env file against .env.example');
    process.exit(1);
  }
}

module.exports = config;
