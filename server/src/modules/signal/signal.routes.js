/**
 * SIGNAL ENGINE — Routes (Admin-only)
 */
const { Router } = require('express');
const controller = require('./signal.controller');
const authenticate = require('../../middleware/auth');
const authorize = require('../../middleware/rbac');

const router = Router();
router.use(authenticate);
router.use(authorize('ADMIN'));

router.get('/customers', controller.getCustomers);
router.get('/customers/:userId/signals', controller.getSignalSummary);
router.get('/customers/:userId/reports', controller.getReports);
router.post('/reports', controller.generateReport);        // body: { userId }
router.get('/reports/:id', controller.getReport);
router.get('/stats', controller.getStats);
router.post('/customers/:userId/simulate', controller.simulateForUser);

module.exports = router;
