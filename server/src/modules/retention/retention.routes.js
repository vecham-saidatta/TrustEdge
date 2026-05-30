/**
 * RETENTION HUB — Routes (Admin-only)
 */
const { Router } = require('express');
const controller = require('./retention.controller');
const authenticate = require('../../middleware/auth');
const authorize = require('../../middleware/rbac');

const router = Router();
router.use(authenticate);
router.use(authorize('ADMIN'));

// ── Health Scores ───────────────────────────────
router.get('/health', controller.getHealthScores);
router.get('/health/:userId', controller.getHealthScore);
router.post('/health/calculate', controller.calculateHealth);
router.post('/health/recalculate-all', controller.recalculateAll);

// ── Offer Library ───────────────────────────────
router.get('/offers/library', controller.getOfferLibrary);
router.post('/offers/library', controller.createOffer);
router.patch('/offers/library/:id', controller.updateOffer);

// ── Retention Offers ────────────────────────────
router.get('/offers', controller.getRetentionOffers);
router.post('/offers/issue', controller.issueOffer);
router.patch('/offers/:id/respond', controller.respondToOffer);

// ── Journeys ────────────────────────────────────
router.get('/journeys', controller.getJourneys);
router.post('/journeys', controller.createJourney);
router.patch('/journeys/:id', controller.updateJourney);

// ── Metrics ─────────────────────────────────────
router.get('/metrics', controller.getMetrics);
router.post('/metrics/snapshot', controller.generateSnapshot);

// ── Hub Dashboard ───────────────────────────────
router.get('/stats', controller.getHubStats);
router.get('/dashboard-stats', controller.getDashboardStats);
router.get('/simulate', controller.getSimulations);

module.exports = router;
