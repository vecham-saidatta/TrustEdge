import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/v1';

const api = axios.create({
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 — clear token and redirect
api.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// ── Auth API ──────────────────────────────────────
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    me: () => api.get('/auth/me'),
};

// ── Core API ──────────────────────────────────────
export const coreAPI = {
    getProfile: () => api.get('/core/profile'),
    getTransactions: (params) => api.get('/core/transactions', { params }),
    getAlerts: (params) => api.get('/core/alerts', { params }),
    updateAlert: (id, data) => api.patch(`/core/alerts/${id}`, data),
    analyze: (customerId) => api.post('/core/analyze', { customerId }),
};

// ── Shield API ────────────────────────────────────
export const shieldAPI = {
    checkin: (data) => api.post('/shield/checkin', data),
    getHistory: (params) => api.get('/shield/history', { params }),
    getStats: () => api.get('/shield/stats'),
};

// ── Sage API ──────────────────────────────────────
export const sageAPI = {
    chat: (data) => api.post('/sage/chat', data),
    getHistory: (params) => api.get('/sage/history', { params }),
    feedback: (id, data) => api.patch(`/sage/feedback/${id}`, data),
    getSuggestions: () => api.get('/sage/suggestions'),
    clearHistory: () => api.delete('/sage/history'),
    translate: (data) => api.post('/sage/translate', data),
};

// ── Truth API ─────────────────────────────────────
export const truthAPI = {
    getProducts: (params) => api.get('/truth/products', { params }),
    getProduct: (id) => api.get(`/truth/products/${id}`),
    compare: (data) => api.post('/truth/compare', data),
    getComparisons: (params) => api.get('/truth/comparisons', { params }),
};

// ── Admin API ─────────────────────────────────────
export const adminAPI = {
    getUsers: (params) => api.get('/admin/users', { params }),
    updateUser: (id, data) => api.patch(`/admin/users/${id}`, data),
    getStats: () => api.get('/admin/stats'),
    getAuditLogs: (params) => api.get('/admin/audit-logs', { params }),
};

// ── Complaints API ─────────────────────────────────
export const complaintsAPI = {
    // Customer
    submit:      (data)    => api.post('/complaints', data),
    getAll:      (params)  => api.get('/complaints/my', { params }),
    getOne:      (id)      => api.get(`/complaints/my/${id}`),
    getStats:    ()        => api.get('/complaints/my/stats'),
    withdraw:    (id)      => api.patch(`/complaints/my/${id}/withdraw`),
    // Employee (Tier 1)
    getAssigned: (params)  => api.get('/complaints/assigned', { params }),
    respond:     (id,data) => api.patch(`/complaints/${id}/respond`, data),
    resolve:     (id,data) => api.patch(`/complaints/${id}/resolve`, data),
    escalateT2:  (id,data) => api.patch(`/complaints/${id}/escalate-t2`, data),
    // Admin (Tier 2+3)
    adminGetAll:     (params)  => api.get('/complaints', { params }),
    adminGetStats:   ()        => api.get('/complaints/stats'),
    adminAssign:     (id,data) => api.patch(`/complaints/${id}/assign`, data),
    adminResolve:    (id,data) => api.patch(`/complaints/${id}/admin-resolve`, data),
    escalateT3:      (id)      => api.patch(`/complaints/${id}/escalate-t3`),
};

// ── Outreach Engine API ────────────────────────────────
export const outreachAPI = {
    // Campaigns
    getCampaigns:   (params) => api.get('/outreach/campaigns', { params }),
    getCampaign:    (id)     => api.get(`/outreach/campaigns/${id}`),
    createCampaign: (data)   => api.post('/outreach/campaigns', data),
    updateCampaign: (id, data) => api.put(`/outreach/campaigns/${id}`, data),
    activateCampaign: (id)   => api.post(`/outreach/campaigns/${id}/activate`),
    pauseCampaign:    (id)   => api.post(`/outreach/campaigns/${id}/pause`),
    completeCampaign: (id)   => api.post(`/outreach/campaigns/${id}/complete`),
    triggerCampaign:  (id)   => api.post(`/outreach/campaigns/${id}/trigger`),
    getLogs:          (id, params) => api.get(`/outreach/campaigns/${id}/logs`, { params }),
    getABResults:     (id)   => api.get(`/outreach/campaigns/${id}/ab-results`),
    // Segments
    getSegments:     ()      => api.get('/outreach/segments'),
    createSegment:   (data)  => api.post('/outreach/segments', data),
    getSegmentCustomers: (id) => api.get(`/outreach/segments/${id}/customers`),
    // Stats
    getStats:        ()      => api.get('/outreach/stats'),
};

// ── Signal Engine API ──────────────────────────────────
export const signalAPI = {
    getCustomers:   ()       => api.get('/signal/customers'),
    getSignals:     (userId, params) => api.get(`/signal/customers/${userId}/signals`, { params }),
    generateReport: (userId) => api.post('/signal/reports', { userId }),
    getReports:     (userId) => api.get(`/signal/customers/${userId}/reports`),
    getReport:      (id)     => api.get(`/signal/reports/${id}`),
    getStats:       ()       => api.get('/signal/stats'),
};

// ── Retention Hub API ─────────────────────────────────
export const retentionAPI = {
    // Health Scores
    getHealthScores:    (params) => api.get('/retention/health', { params }),
    getHealthScore:     (userId) => api.get(`/retention/health/${userId}`),
    calculateHealth:    (userId) => api.post('/retention/health/calculate', { userId }),
    recalculateAll:     ()       => api.post('/retention/health/recalculate-all'),
    // Offer Library
    getOfferLibrary:    (params) => api.get('/retention/offers/library', { params }),
    createOfferTemplate:(data)   => api.post('/retention/offers/library', data),
    updateOfferTemplate:(id, data) => api.patch(`/retention/offers/library/${id}`, data),
    // Retention Offers
    getRetentionOffers: (params) => api.get('/retention/offers', { params }),
    issueOffer:         (data)   => api.post('/retention/offers/issue', data),
    respondToOffer:     (id, data) => api.patch(`/retention/offers/${id}/respond`, data),
    // Journeys
    getJourneys:        (params) => api.get('/retention/journeys', { params }),
    createJourney:      (data)   => api.post('/retention/journeys', data),
    updateJourney:      (id, data) => api.patch(`/retention/journeys/${id}`, data),
    // Metrics
    getMetrics:         ()       => api.get('/retention/metrics'),
    generateSnapshot:   ()       => api.post('/retention/metrics/snapshot'),
    // Hub Stats
    getHubStats:        ()       => api.get('/retention/stats'),
    getDashboardStats:  ()       => api.get('/retention/dashboard-stats'),
};

// ── PULSE Feedback Loop API ──────────────────────────
export const feedbackAPI = {
    aggregate:        ()       => api.post('/feedback/aggregate'),
    getInsights:      (params) => api.get('/feedback/insights', { params }),
    getLearningSummary: ()     => api.get('/feedback/learning'),
};

// ── Unified Command Center API ──────────────────────
export const commandCenterAPI = {
    getStats: async () => {
        const [signalRes, outreachRes, retentionRes, feedbackRes] = await Promise.all([
            api.get('/signal/stats'),
            api.get('/outreach/stats'),
            api.get('/retention/stats'),
            api.get('/feedback/learning').catch(() => ({ data: { data: {} } })),
        ]);
        return {
            data: {
                data: {
                    signal: signalRes.data.data,
                    outreach: outreachRes.data.data,
                    retention: retentionRes.data.data,
                    feedback: feedbackRes.data.data,
                },
            },
        };
    },
};

// ═══════════════════════════════════════════════════════════════
//  CUSTOMER PORTAL API — Per TRUSTEDGE_CUSTOMER_PORTAL_PLAN
//  All endpoints under /api/v1/portal/
// ═══════════════════════════════════════════════════════════════

export const portalAPI = {
    // ── Dashboard (Section 4) ────────────────────────────────
    getDashboard:       ()        => api.get('/portal/dashboard'),

    // ── Finances (Section 6) ─────────────────────────────────
    getAccounts:        ()        => api.get('/portal/finances/accounts'),
    getTransactions:    (params)  => api.get('/portal/finances/transactions', { params }),
    getSpendingInsights:()        => api.get('/portal/finances/spending'),
    getNetWorth:        ()        => api.get('/portal/finances/networth'),

    // ── Products (Section 7) ─────────────────────────────────
    getProducts:        ()        => api.get('/portal/products/summary'),
    getProductDetail:   (type, id)=> api.get(`/portal/products/${type}/${id}`),

    // ── Goals (Section 8) ────────────────────────────────────
    getGoals:           ()        => api.get('/portal/goals'),
    getGoal:            (id)      => api.get(`/portal/goals/${id}`),
    createGoal:         (data)    => api.post('/portal/goals', data),
    updateGoal:         (id,data) => api.patch(`/portal/goals/${id}`, data),
    deleteGoal:         (id)      => api.delete(`/portal/goals/${id}`),

    // ── Stress Support (Section 9) ───────────────────────────
    getStressStatus:    ()        => api.get('/portal/stress/status'),
    requestRestructuring:(data)   => api.post('/portal/stress/restructure', data),
    calculatePrepayment:(data)    => api.post('/portal/stress/prepayment-calc', data),
    dismissStressCard:  ()        => api.post('/portal/stress/dismiss'),

    // ── Offers (Section 10) ──────────────────────────────────
    getOffers:          (params)  => api.get('/portal/offers', { params }),
    getOffer:           (id)      => api.get(`/portal/offers/${id}`),
    respondToOffer:     (id,data) => api.patch(`/portal/offers/${id}/respond`, data),
    getOfferStats:      ()        => api.get('/portal/offers/stats'),

    // ── Notifications (Section 11) ───────────────────────────
    getNotifications:   (params)  => api.get('/portal/notifications', { params }),
    markNotifRead:      (id)      => api.patch(`/portal/notifications/${id}/read`),
    markAllNotifsRead:  ()        => api.post('/portal/notifications/read-all'),
    getNotifCount:      ()        => api.get('/portal/notifications/count'),

    // ── Support (Section 13) ─────────────────────────────────
    createTicket:       (data)    => api.post('/portal/support/tickets', data),
    getTickets:         (params)  => api.get('/portal/support/tickets', { params }),
    getTicket:          (id)      => api.get(`/portal/support/tickets/${id}`),
    addTicketMessage:   (id,data) => api.post(`/portal/support/tickets/${id}/message`, data),
    cancelTicket:       (id)      => api.patch(`/portal/support/tickets/${id}/cancel`),
    bookAppointment:    (data)    => api.post('/portal/support/appointments', data),
    getAppointments:    ()        => api.get('/portal/support/appointments'),
    cancelAppointment:  (id)      => api.patch(`/portal/support/appointments/${id}/cancel`),
    requestCallback:    (data)    => api.post('/portal/support/callback', data),

    // ── Settings — Preferences (Section 11.2) ────────────────
    getPreferences:     ()        => api.get('/portal/settings/preferences'),
    updatePreferences:  (data)    => api.put('/portal/settings/preferences', data),

    // ── Settings — Privacy & Consent (Section 14) ────────────
    getConsents:        ()        => api.get('/portal/settings/consents'),
    updateConsent:      (data)    => api.put('/portal/settings/consents', data),
    getPrivacyDashboard:()        => api.get('/portal/settings/privacy'),
    requestDataExport:  ()        => api.post('/portal/settings/data-export'),
    deleteSageHistory:  ()        => api.delete('/portal/settings/sage-history'),

    // ── Settings — Security (Section 15) ─────────────────────
    getSecurityInfo:    ()        => api.get('/portal/settings/security'),
    getLoginHistory:    ()        => api.get('/portal/settings/security/logins'),
    endSession:         (id)      => api.delete(`/portal/settings/security/sessions/${id}`),
    freezeAccount:      ()        => api.post('/portal/settings/security/freeze'),
    unfreezeAccount:    ()        => api.post('/portal/settings/security/unfreeze'),
    updateAlertThreshold:(data)   => api.put('/portal/settings/security/alert-threshold', data),

    // ── Trust & Transparency (Section 14.3) ──────────────────
    getEducationArticles:()       => api.get('/portal/trust/articles'),
    getGlossary:        ()        => api.get('/portal/trust/glossary'),
    getFeeSchedule:     ()        => api.get('/portal/trust/fees'),

    // ── Profile ──────────────────────────────────────────────
    getProfile:         ()        => api.get('/portal/profile'),
    updateProfile:      (data)    => api.put('/portal/profile', data),
};

export default api;
