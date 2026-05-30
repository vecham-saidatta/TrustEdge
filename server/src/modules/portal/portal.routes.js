/**
 * CUSTOMER PORTAL — Routes
 *
 * Comprehensive route file for the TrustEdge Customer Portal.
 * All routes are customer-facing (CUSTOMER role) and require authentication.
 *
 * Mounts at: /api/v1/portal
 */

const { Router } = require('express');
const ctrl = require('./portal.controller');
const authenticate = require('../../middleware/auth');
const authorize = require('../../middleware/rbac');
const validate = require('../../middleware/validate');
const {
    transactionQuery,
    notificationQuery,
    createGoalSchema,
    updateGoalSchema,
    offerActionSchema,
    createTicketSchema,
    ticketMessageSchema,
    ticketQuery,
    createAppointmentSchema,
    updatePreferencesSchema,
    updateConsentSchema,
} = require('./portal.validation');

const router = Router();
router.use(authenticate);
router.use(authorize('CUSTOMER', 'ADMIN', 'EMPLOYEE'));

// ── Profile ────────────────────────────────────
router.get('/profile',                ctrl.getProfile);
router.put('/profile',                ctrl.updateProfile);

// ── Dashboard ──────────────────────────────────
router.get('/dashboard', ctrl.getDashboard);

// ── Finances ───────────────────────────────────
router.get('/finances/accounts',      ctrl.getAccounts);
router.get('/finances/transactions',  validate(transactionQuery, 'query'), ctrl.getTransactions);
router.get('/finances/spending',      ctrl.getSpendingInsights);
router.get('/finances/networth',      ctrl.getNetWorth);

// ── Goals ──────────────────────────────────────
router.get('/goals',                  ctrl.getGoals);
router.get('/goals/:id',             ctrl.getGoalById);
router.post('/goals',                 validate(createGoalSchema), ctrl.createGoal);
router.patch('/goals/:id',           validate(updateGoalSchema), ctrl.updateGoal);
router.delete('/goals/:id',          ctrl.deleteGoal);

// ── Products ───────────────────────────────────
router.get('/products/summary',       ctrl.getProducts);
router.get('/products/:type/:id',     ctrl.getProductDetail);

// ── Offers ─────────────────────────────────────
router.get('/offers',                 ctrl.getOffers);
router.get('/offers/stats',           ctrl.getOfferStats);
router.get('/offers/:id',             ctrl.getOffer);
router.patch('/offers/:id/respond',   validate(offerActionSchema), ctrl.respondToOffer);

// ── Stress ─────────────────────────────────────
router.get('/stress/status',          ctrl.getStressStatus);
router.post('/stress/restructure',    ctrl.requestRestructuring);
router.post('/stress/prepayment-calc',ctrl.calculatePrepayment);
router.post('/stress/dismiss',        ctrl.dismissStressCard);

// ── Notifications ──────────────────────────────
router.get('/notifications',          validate(notificationQuery, 'query'), ctrl.getNotifications);
router.get('/notifications/count',    ctrl.getNotifCount);
router.patch('/notifications/:id/read', ctrl.markNotificationRead);
router.post('/notifications/read-all',  ctrl.markAllRead);

// ── Support Tickets ────────────────────────────
router.post('/support/tickets',       validate(createTicketSchema), ctrl.createTicket);
router.get('/support/tickets',        validate(ticketQuery, 'query'), ctrl.getTickets);
router.get('/support/tickets/:id',   ctrl.getTicketById);
router.post('/support/tickets/:id/message', validate(ticketMessageSchema), ctrl.addTicketMessage);
router.patch('/support/tickets/:id/cancel', ctrl.cancelTicket);

// ── Appointments ───────────────────────────────
router.post('/support/appointments',  validate(createAppointmentSchema), ctrl.createAppointment);
router.get('/support/appointments',   ctrl.getAppointments);
router.patch('/support/appointments/:id/cancel', ctrl.cancelAppointment);
router.post('/support/callback',      ctrl.requestCallback);

// ── Settings ───────────────────────────────────
router.get('/settings/preferences',   ctrl.getPreferences);
router.put('/settings/preferences',   validate(updatePreferencesSchema), ctrl.updatePreferences);
router.get('/settings/consents',      ctrl.getConsents);
router.put('/settings/consents',      validate(updateConsentSchema), ctrl.updateConsent);

router.get('/settings/security',      ctrl.getSecurityInfo);
router.get('/settings/security/logins', ctrl.getLoginHistory);
router.delete('/settings/security/sessions/:id', ctrl.endSession);
router.post('/settings/security/freeze', ctrl.freezeAccount);
router.post('/settings/security/unfreeze', ctrl.unfreezeAccount);
router.put('/settings/security/alert-threshold', ctrl.updateAlertThreshold);

router.get('/settings/privacy',       ctrl.getPrivacyDashboard);
router.post('/settings/data-export',  ctrl.requestDataExport);
router.delete('/settings/sage-history', ctrl.deleteSageHistory);

// ── Trust ──────────────────────────────────────
router.get('/trust/articles',         ctrl.getEducationArticles);
router.get('/trust/glossary',         ctrl.getGlossary);
router.get('/trust/fees',             ctrl.getFeeSchedule);

module.exports = router;
