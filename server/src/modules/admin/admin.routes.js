/**
 * ADMIN — Routes
 */

const { Router } = require('express');
const controller = require('./admin.controller');
const c360 = require('./customer360.controller');
const authenticate = require('../../middleware/auth');
const authorize = require('../../middleware/rbac');
const validate = require('../../middleware/validate');
const { usersQuery, updateUserSchema, auditQuery } = require('./admin.validation');

const router = Router();

router.use(authenticate);
router.use(authorize('ADMIN')); // ALL Admin routes are Admin-only

router.get('/users', validate(usersQuery, 'query'), controller.getUsers);
router.patch('/users/:id', validate(updateUserSchema), controller.updateUser);
router.get('/stats', controller.getStats);
router.get('/audit-logs', validate(auditQuery, 'query'), controller.getAuditLogs);

// ── Customer 360 — Aggregated per-customer endpoints ────────
router.get('/customer-360/:userId/profile', c360.getProfile);
router.get('/customer-360/:userId/transactions', c360.getTransactions);
router.get('/customer-360/:userId/complaints', c360.getComplaints);
router.get('/customer-360/:userId/sage-history', c360.getSageHistory);
router.get('/customer-360/:userId/retention', c360.getRetention);
router.get('/customer-360/:userId/outreach', c360.getOutreach);
router.get('/customer-360/:userId/signals', c360.getSignals);
router.get('/customer-360/:userId/products', c360.getProducts);

module.exports = router;
