/**
 * OUTREACH ENGINE — Routes
 * All routes are ADMIN-only
 */

const { Router } = require('express');
const controller = require('./outreach.controller');
const authenticate = require('../../middleware/auth');
const authorize = require('../../middleware/rbac');

const router = Router();

router.use(authenticate);
router.use(authorize('ADMIN'));

// ── Segments ────────────────────────────────────
router.get('/segments', controller.getSegments);
router.post('/segments', controller.createSegment);
router.get('/segments/:id/customers', controller.getSegmentCustomers);

// ── Campaigns ───────────────────────────────────
router.get('/campaigns', controller.getCampaigns);
router.get('/campaigns/:id', controller.getCampaign);
router.post('/campaigns', controller.createCampaign);
router.put('/campaigns/:id', controller.updateCampaign);

// ── Lifecycle ───────────────────────────────────
router.post('/campaigns/:id/activate', controller.activateCampaign);
router.post('/campaigns/:id/pause', controller.pauseCampaign);
router.post('/campaigns/:id/complete', controller.completeCampaign);

// ── Execution ───────────────────────────────────
router.post('/campaigns/:id/trigger', controller.triggerCampaign);
router.get('/campaigns/:id/logs', controller.getExecutionLogs);

// ── A/B Testing ─────────────────────────────────
router.get('/campaigns/:id/ab-results', controller.getABResults);

// ── Stats ───────────────────────────────────────
router.get('/stats', controller.getOutreachStats);

module.exports = router;
