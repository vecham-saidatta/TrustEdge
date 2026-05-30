/**
 * CUSTOMER PORTAL — Controllers
 *
 * Thin controller layer — delegates all business logic to portal.service.js.
 * Follows existing pattern: compact one-liner async handlers with try/catch → next(e).
 */

const ApiResponse = require('../../utils/apiResponse');
const svc = require('./portal.service');

// ── Profile ────────────────────────────────────
const getProfile             = async (req, res, next) => { try { const d = await svc.getProfile(req.user.id); return ApiResponse.success(res, 200, 'OK', { profile: d }); } catch(e){next(e);} };
const updateProfile          = async (req, res, next) => { try { const d = await svc.updateProfile(req.user.id, req.body); return ApiResponse.success(res, 200, 'Profile updated', { profile: d }); } catch(e){next(e);} };

// ── Dashboard ──────────────────────────────────
const getDashboard           = async (req, res, next) => { try { const d = await svc.getDashboard(req.user.id); return ApiResponse.success(res, 200, 'Dashboard loaded.', d); } catch(e){next(e);} };

// ── Finances ───────────────────────────────────
const getAccounts            = async (req, res, next) => { try { const d = await svc.getAccounts(req.user.id); return ApiResponse.success(res, 200, 'OK', { accounts: d }); } catch(e){next(e);} };
const getTransactions        = async (req, res, next) => { try { const r = await svc.getTransactions(req.user.id, req.query); return ApiResponse.paginated(res, 'OK', r.transactions, r.pagination); } catch(e){next(e);} };
const getSpendingInsights    = async (req, res, next) => { try { const d = await svc.getSpendingInsights(req.user.id); return ApiResponse.success(res, 200, 'OK', { spending: d }); } catch(e){next(e);} };
const getNetWorth            = async (req, res, next) => { try { const d = await svc.getNetWorth(req.user.id); return ApiResponse.success(res, 200, 'OK', { netWorth: d }); } catch(e){next(e);} };

// ── Goals ──────────────────────────────────────
const getGoals               = async (req, res, next) => { try { const g = await svc.getGoals(req.user.id); return ApiResponse.success(res, 200, 'OK', { goals: g }); } catch(e){next(e);} };
const getGoalById            = async (req, res, next) => { try { const g = await svc.getGoalById(req.params.id, req.user.id); return ApiResponse.success(res, 200, 'OK', { goal: g }); } catch(e){next(e);} };
const createGoal             = async (req, res, next) => { try { const g = await svc.createGoal(req.user.id, req.body); return ApiResponse.success(res, 201, 'Goal created.', { goal: g }); } catch(e){next(e);} };
const updateGoal             = async (req, res, next) => { try { const g = await svc.updateGoal(req.params.id, req.user.id, req.body); return ApiResponse.success(res, 200, 'Goal updated.', { goal: g }); } catch(e){next(e);} };
const deleteGoal             = async (req, res, next) => { try { const r = await svc.deleteGoal(req.params.id, req.user.id); return ApiResponse.success(res, 200, 'Goal deleted.', r); } catch(e){next(e);} };

// ── Products ───────────────────────────────────
const getProducts            = async (req, res, next) => { try { const d = await svc.getProducts(req.user.id); return ApiResponse.success(res, 200, 'OK', { products: d }); } catch(e){next(e);} };
const getProductDetail       = async (req, res, next) => { try { const d = await svc.getProductDetail(req.params.type, req.params.id, req.user.id); return ApiResponse.success(res, 200, 'OK', { product: d }); } catch(e){next(e);} };

// ── Offers ─────────────────────────────────────
const getOffers              = async (req, res, next) => { try { const d = await svc.getOffers(req.user.id); return ApiResponse.success(res, 200, 'OK', { offers: d }); } catch(e){next(e);} };
const respondToOffer         = async (req, res, next) => { try { const d = await svc.respondToOffer(req.params.id, req.user.id, req.body); return ApiResponse.success(res, 200, 'Response recorded.', { offer: d }); } catch(e){next(e);} };
const getOffer               = async (req, res, next) => { try { const d = await svc.getOffer(req.params.id, req.user.id); return ApiResponse.success(res, 200, 'OK', { offer: d }); } catch(e){next(e);} };
const getOfferStats          = async (req, res, next) => { try { const d = await svc.getOfferStats(req.user.id); return ApiResponse.success(res, 200, 'OK', { stats: d }); } catch(e){next(e);} };

// ── Stress ─────────────────────────────────────
const getStressStatus        = async (req, res, next) => { try { const d = await svc.getStressStatus(req.user.id); return ApiResponse.success(res, 200, 'OK', { status: d }); } catch(e){next(e);} };
const requestRestructuring   = async (req, res, next) => { try { const d = await svc.requestRestructuring(req.user.id, req.body); return ApiResponse.success(res, 200, 'Restructuring requested.', d); } catch(e){next(e);} };
const calculatePrepayment    = async (req, res, next) => { try { const d = await svc.calculatePrepayment(req.user.id, req.body); return ApiResponse.success(res, 200, 'Calculated.', d); } catch(e){next(e);} };
const dismissStressCard      = async (req, res, next) => { try { const d = await svc.dismissStressCard(req.user.id); return ApiResponse.success(res, 200, 'Dismissed.', d); } catch(e){next(e);} };

// ── Notifications ──────────────────────────────
const getNotifications       = async (req, res, next) => { try { const r = await svc.getNotifications(req.user.id, req.query); return ApiResponse.paginated(res, 'OK', r.notifications, r.pagination); } catch(e){next(e);} };
const markNotificationRead   = async (req, res, next) => { try { const n = await svc.markNotificationRead(req.params.id, req.user.id); return ApiResponse.success(res, 200, 'Marked as read.', { notification: n }); } catch(e){next(e);} };
const markAllRead            = async (req, res, next) => { try { const r = await svc.markAllNotificationsRead(req.user.id); return ApiResponse.success(res, 200, 'All notifications marked as read.', r); } catch(e){next(e);} };
const getNotifCount          = async (req, res, next) => { try { const d = await svc.getNotifCount(req.user.id); return ApiResponse.success(res, 200, 'OK', { count: d }); } catch(e){next(e);} };

// ── Support Tickets ────────────────────────────
const createTicket           = async (req, res, next) => { try { const t = await svc.createTicket(req.user.id, req.body); return ApiResponse.success(res, 201, 'Ticket created.', { ticket: t }); } catch(e){next(e);} };
const getTickets             = async (req, res, next) => { try { const r = await svc.getTickets(req.user.id, req.query); return ApiResponse.paginated(res, 'OK', r.tickets, r.pagination); } catch(e){next(e);} };
const getTicketById          = async (req, res, next) => { try { const t = await svc.getTicketById(req.params.id, req.user.id); return ApiResponse.success(res, 200, 'OK', { ticket: t }); } catch(e){next(e);} };
const addTicketMessage       = async (req, res, next) => { try { const m = await svc.addTicketMessage(req.params.id, req.user.id, req.body); return ApiResponse.success(res, 201, 'Message added.', { communication: m }); } catch(e){next(e);} };
const cancelTicket           = async (req, res, next) => { try { const d = await svc.cancelTicket(req.params.id, req.user.id); return ApiResponse.success(res, 200, 'Ticket cancelled.', d); } catch(e){next(e);} };

// ── Appointments ───────────────────────────────
const createAppointment      = async (req, res, next) => { try { const a = await svc.createAppointment(req.user.id, req.body); return ApiResponse.success(res, 201, 'Appointment booked.', { appointment: a }); } catch(e){next(e);} };
const getAppointments        = async (req, res, next) => { try { const d = await svc.getAppointments(req.user.id); return ApiResponse.success(res, 200, 'OK', { appointments: d }); } catch(e){next(e);} };
const cancelAppointment      = async (req, res, next) => { try { const d = await svc.cancelAppointment(req.params.id, req.user.id); return ApiResponse.success(res, 200, 'Appointment cancelled.', d); } catch(e){next(e);} };
const requestCallback        = async (req, res, next) => { try { const d = await svc.requestCallback(req.user.id, req.body); return ApiResponse.success(res, 200, 'Callback requested.', d); } catch(e){next(e);} };

// ── Settings ───────────────────────────────────
const getPreferences         = async (req, res, next) => { try { const p = await svc.getPreferences(req.user.id); return ApiResponse.success(res, 200, 'OK', { preferences: p }); } catch(e){next(e);} };
const updatePreferences      = async (req, res, next) => { try { const p = await svc.updatePreferences(req.user.id, req.body); return ApiResponse.success(res, 200, 'Preferences updated.', { preferences: p }); } catch(e){next(e);} };
const getConsents            = async (req, res, next) => { try { const c = await svc.getConsents(req.user.id); return ApiResponse.success(res, 200, 'OK', { consents: c }); } catch(e){next(e);} };
const updateConsent          = async (req, res, next) => { try { const c = await svc.updateConsent(req.user.id, req.body, req.ip); return ApiResponse.success(res, 200, 'Consent updated.', { consent: c }); } catch(e){next(e);} };
const getSecurityInfo        = async (req, res, next) => { try { const s = await svc.getSecurityInfo(req.user.id); return ApiResponse.success(res, 200, 'OK', { security: s }); } catch(e){next(e);} };
const getLoginHistory        = async (req, res, next) => { try { const d = await svc.getLoginHistory(req.user.id); return ApiResponse.success(res, 200, 'OK', { history: d }); } catch(e){next(e);} };
const endSession             = async (req, res, next) => { try { const d = await svc.endSession(req.params.id, req.user.id); return ApiResponse.success(res, 200, 'Session ended.', d); } catch(e){next(e);} };
const freezeAccount          = async (req, res, next) => { try { const d = await svc.freezeAccount(req.user.id); return ApiResponse.success(res, 200, 'Account frozen.', d); } catch(e){next(e);} };
const unfreezeAccount        = async (req, res, next) => { try { const d = await svc.unfreezeAccount(req.user.id); return ApiResponse.success(res, 200, 'Account unfrozen.', d); } catch(e){next(e);} };
const updateAlertThreshold   = async (req, res, next) => { try { const d = await svc.updateAlertThreshold(req.user.id, req.body); return ApiResponse.success(res, 200, 'Threshold updated.', d); } catch(e){next(e);} };
const getPrivacyDashboard    = async (req, res, next) => { try { const d = await svc.getPrivacyDashboard(req.user.id); return ApiResponse.success(res, 200, 'OK', { privacy: d }); } catch(e){next(e);} };
const requestDataExport      = async (req, res, next) => { try { const d = await svc.requestDataExport(req.user.id); return ApiResponse.success(res, 200, 'Export requested.', d); } catch(e){next(e);} };
const deleteSageHistory      = async (req, res, next) => { try { const d = await svc.deleteSageHistory(req.user.id); return ApiResponse.success(res, 200, 'History deleted.', d); } catch(e){next(e);} };

// ── Trust ──────────────────────────────────────
const getEducationArticles   = async (req, res, next) => { try { const d = await svc.getEducationArticles(req.user.id); return ApiResponse.success(res, 200, 'OK', { articles: d }); } catch(e){next(e);} };
const getGlossary            = async (req, res, next) => { try { const d = await svc.getGlossary(); return ApiResponse.success(res, 200, 'OK', { glossary: d }); } catch(e){next(e);} };
const getFeeSchedule         = async (req, res, next) => { try { const d = await svc.getFeeSchedule(); return ApiResponse.success(res, 200, 'OK', { fees: d }); } catch(e){next(e);} };


module.exports = {
    // Profile
    getProfile, updateProfile,
    // Dashboard
    getDashboard,
    // Finances
    getAccounts, getTransactions, getSpendingInsights, getNetWorth,
    // Goals
    getGoals, getGoalById, createGoal, updateGoal, deleteGoal,
    // Products
    getProducts, getProductDetail,
    // Offers
    getOffers, respondToOffer, getOffer, getOfferStats,
    // Stress
    getStressStatus, requestRestructuring, calculatePrepayment, dismissStressCard,
    // Notifications
    getNotifications, markNotificationRead, markAllRead, getNotifCount,
    // Support
    createTicket, getTickets, getTicketById, addTicketMessage, cancelTicket,
    // Appointments
    createAppointment, getAppointments, cancelAppointment, requestCallback,
    // Settings
    getPreferences, updatePreferences, getConsents, updateConsent, getSecurityInfo,
    getLoginHistory, endSession, freezeAccount, unfreezeAccount, updateAlertThreshold,
    getPrivacyDashboard, requestDataExport, deleteSageHistory,
    // Trust
    getEducationArticles, getGlossary, getFeeSchedule
};

