/**
 * PULSE FEEDBACK LOOP — Routes (Admin-only)
 */
const { Router } = require('express');
const controller = require('./feedback.controller');
const authenticate = require('../../middleware/auth');
const authorize = require('../../middleware/rbac');

const router = Router();
router.use(authenticate);
router.use(authorize('ADMIN'));

router.post('/aggregate', controller.aggregate);
router.get('/insights', controller.getInsights);
router.get('/learning', controller.getLearningSummary);

module.exports = router;
