/**
 * LIFELINE — Express Application Setup
 * 
 * All modules wired:
 * - AUTH:   /api/v1/auth
 * - CORE:   /api/v1/core     (Lifeline Core — stress detection)
 * - SAGE:   /api/v1/sage     (Financial education)
 * - TRUTH:  /api/v1/truth    (Product comparison)
 * - ADMIN:  /api/v1/admin    (Admin dashboard)
 * - PORTAL: /api/v1/portal   (Customer Portal)
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config/env');
const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');
const ApiResponse = require('./utils/apiResponse');

// Import route modules
const authRoutes = require('./modules/auth/auth.routes');
const coreRoutes = require('./modules/core/core.routes');
const sageRoutes = require('./modules/sage/sage.routes');
const truthRoutes = require('./modules/truth/truth.routes');
const adminRoutes = require('./modules/admin/admin.routes');
const complaintsRoutes = require('./modules/complaints/complaints.routes');
const outreachRoutes = require('./modules/outreach/outreach.routes');
const signalRoutes = require('./modules/signal/signal.routes');
const retentionRoutes = require('./modules/retention/retention.routes');
const feedbackRoutes = require('./modules/feedback/feedback.routes');
const portalRoutes = require('./modules/portal/portal.routes');
const mlRoutes = require('../routes/mlRoutes');

// ── Bootstrap Event Listeners (Unified Ecosystem) ───────────
require('./bootstrap/eventListeners');

// ── Create Express App ──────────────────────────────────────
const app = express();

// ── Security Middleware ─────────────────────────────────────
app.use(helmet());
app.use(cors({
    origin: config.corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Request Parsing ─────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Request Logging ─────────────────────────────────────────
app.use(requestLogger);

// ── Health Check ────────────────────────────────────────────
app.get('/api/v1/health', (req, res) => {
    return ApiResponse.success(res, 200, 'LIFELINE API is running.', {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: config.nodeEnv,
        uptime: `${Math.floor(process.uptime())}s`,
        modules: ['AUTH', 'CORE', 'SAGE', 'TRUTH', 'ADMIN', 'OUTREACH', 'SIGNAL', 'RETENTION', 'FEEDBACK', 'PORTAL'],
    });
});

// ── API Routes ──────────────────────────────────────────────
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/core', coreRoutes);
app.use('/api/v1/sage', sageRoutes);
app.use('/api/v1/truth', truthRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/complaints', complaintsRoutes);
app.use('/api/v1/outreach', outreachRoutes);
app.use('/api/v1/signal', signalRoutes);
app.use('/api/v1/retention', retentionRoutes);
app.use('/api/v1/feedback', feedbackRoutes);
app.use('/api/v1/portal', portalRoutes);
app.use('/api', mlRoutes);

// ── 404 Handler ─────────────────────────────────────────────
app.use((req, res) => {
    return ApiResponse.error(res, 404, `Route not found: ${req.method} ${req.path}`);
});

// ── Global Error Handler ────────────────────────────────────
app.use(errorHandler);

module.exports = app;
