/**
 * RETENTION HUB — Controller
 */
const service = require('./retention.service');
const ApiResponse = require('../../utils/apiResponse');

// ── Health Scores ───────────────────────────────
const calculateHealth = async (req, res, next) => {
    try {
        const data = await service.calculateHealthScore(req.body.userId);
        return ApiResponse.success(res, 200, 'Health score calculated.', data);
    } catch (e) { next(e); }
};

const recalculateAll = async (req, res, next) => {
    try {
        const data = await service.recalculateAllHealthScores();
        return ApiResponse.success(res, 200, 'All health scores recalculated.', data);
    } catch (e) { next(e); }
};

const getHealthScores = async (req, res, next) => {
    try {
        const data = await service.getHealthScores(req.query);
        return ApiResponse.success(res, 200, 'Health scores retrieved.', data);
    } catch (e) { next(e); }
};

const getHealthScore = async (req, res, next) => {
    try {
        const data = await service.getHealthScore(req.params.userId);
        return ApiResponse.success(res, 200, 'Health score retrieved.', data);
    } catch (e) { next(e); }
};

// ── Offer Library ───────────────────────────────
const getOfferLibrary = async (req, res, next) => {
    try {
        const data = await service.getOfferLibrary(req.query);
        return ApiResponse.success(res, 200, 'Offer library retrieved.', data);
    } catch (e) { next(e); }
};

const createOffer = async (req, res, next) => {
    try {
        const data = await service.createOffer(req.body);
        return ApiResponse.success(res, 201, 'Offer created.', data);
    } catch (e) { next(e); }
};

const updateOffer = async (req, res, next) => {
    try {
        const data = await service.updateOffer(req.params.id, req.body);
        return ApiResponse.success(res, 200, 'Offer updated.', data);
    } catch (e) { next(e); }
};

// ── Retention Offers ────────────────────────────
const issueOffer = async (req, res, next) => {
    try {
        const data = await service.issueRetentionOffer(req.body);
        return ApiResponse.success(res, 201, 'Retention offer issued.', data);
    } catch (e) { next(e); }
};

const getRetentionOffers = async (req, res, next) => {
    try {
        const data = await service.getRetentionOffers(req.query);
        return ApiResponse.success(res, 200, 'Retention offers retrieved.', data);
    } catch (e) { next(e); }
};

const respondToOffer = async (req, res, next) => {
    try {
        const data = await service.respondToOffer(req.params.id, req.body.response, req.body.feedbackNote);
        return ApiResponse.success(res, 200, 'Response recorded.', data);
    } catch (e) { next(e); }
};

// ── Journeys ────────────────────────────────────
const getJourneys = async (req, res, next) => {
    try {
        const data = await service.getJourneys(req.query);
        return ApiResponse.success(res, 200, 'Journeys retrieved.', data);
    } catch (e) { next(e); }
};

const createJourney = async (req, res, next) => {
    try {
        const data = await service.createJourney(req.body);
        return ApiResponse.success(res, 201, 'Journey created.', data);
    } catch (e) { next(e); }
};

const updateJourney = async (req, res, next) => {
    try {
        const data = await service.updateJourney(req.params.id, req.body);
        return ApiResponse.success(res, 200, 'Journey updated.', data);
    } catch (e) { next(e); }
};

// ── Metrics ─────────────────────────────────────
const getMetrics = async (req, res, next) => {
    try {
        const data = await service.getMetrics();
        return ApiResponse.success(res, 200, 'Metrics retrieved.', data);
    } catch (e) { next(e); }
};

const generateSnapshot = async (req, res, next) => {
    try {
        const data = await service.generateMetricsSnapshot();
        return ApiResponse.success(res, 201, 'Metrics snapshot generated.', data);
    } catch (e) { next(e); }
};

// ── Hub Stats ───────────────────────────────────
const getHubStats = async (req, res, next) => {
    try {
        const data = await service.getHubStats();
        return ApiResponse.success(res, 200, 'Hub stats retrieved.', data);
    } catch (e) { next(e); }
};

const getDashboardStats = async (req, res, next) => {
    try {
        const data = await service.getRetentionDashboardStats();
        return ApiResponse.success(res, 200, 'Retention dashboard stats retrieved.', data);
    } catch (e) { next(e); }
};

const getSimulations = async (req, res, next) => {
    try {
        const data = await service.getSimulations(req.query);
        return ApiResponse.success(res, 200, 'Simulations retrieved.', data);
    } catch (e) { next(e); }
};

module.exports = {
    calculateHealth, recalculateAll, getHealthScores, getHealthScore,
    getOfferLibrary, createOffer, updateOffer,
    issueOffer, getRetentionOffers, respondToOffer,
    getJourneys, createJourney, updateJourney, getDashboardStats,
    getMetrics, generateSnapshot, getHubStats, getSimulations,
};
