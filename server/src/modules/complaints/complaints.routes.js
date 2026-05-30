const { Router } = require('express');
const ctrl = require('./complaints.controller');
const authenticate = require('../../middleware/auth');
const authorize = require('../../middleware/rbac');

const router = Router();
router.use(authenticate);

// ── Customer routes ────────────────────────────
router.post('/',                    authorize('CUSTOMER'),             ctrl.submit);
router.get('/my',                   authorize('CUSTOMER'),             ctrl.getMyComplaints);
router.get('/my/stats',             authorize('CUSTOMER'),             ctrl.getMyStats);
router.get('/my/:id',               authorize('CUSTOMER'),             ctrl.getOne);
router.patch('/my/:id/withdraw',    authorize('CUSTOMER'),             ctrl.withdraw);

// ── Admin routes (Tier 2 + 3 oversight) ───────
router.get('/',                     authorize('ADMIN'),                ctrl.getAll);
router.get('/stats',                authorize('ADMIN'),                ctrl.getAdminStats);

router.patch('/:id/admin-resolve',  authorize('ADMIN'),                ctrl.adminResolve);
router.patch('/:id/escalate-t3',    authorize('ADMIN'),                ctrl.escalateT3);

module.exports = router;
