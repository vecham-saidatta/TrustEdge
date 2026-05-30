/**
 * LIFELINE CORE — Routes
 * 
 * GET  /api/v1/core/profile       → Customer financial profile
 * GET  /api/v1/core/transactions   → Transaction history
 * GET  /api/v1/core/alerts         → Stress alerts (role-aware)
 * PATCH /api/v1/core/alerts/:id    → Update alert status
 * POST /api/v1/core/analyze        → Trigger stress analysis
 */

const { Router } = require('express');
const controller = require('./core.controller');
const authenticate = require('../../middleware/auth');
const authorize = require('../../middleware/rbac');
const validate = require('../../middleware/validate');
const { getTransactionsQuery, getAlertsQuery, updateAlertSchema, analyzeSchema } = require('./core.validation');

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/profile', authorize('CUSTOMER'), controller.getProfile);
router.get('/transactions', authorize('CUSTOMER'), validate(getTransactionsQuery, 'query'), controller.getTransactions);
router.get('/alerts', authorize('CUSTOMER', 'EMPLOYEE', 'ADMIN'), validate(getAlertsQuery, 'query'), controller.getAlerts);
router.patch('/alerts/:id', authorize('EMPLOYEE', 'ADMIN'), validate(updateAlertSchema), controller.updateAlert);
router.post('/analyze', authorize('EMPLOYEE', 'ADMIN'), validate(analyzeSchema), controller.analyzeStress);

module.exports = router;
