/**
 * OUTREACH ENGINE — Controller
 */

const service = require('./outreach.service');
const ApiResponse = require('../../utils/apiResponse');

// ── Segments ────────────────────────────────────
const getSegments = async (req, res, next) => {
    try {
        const segments = await service.getSegments();
        return ApiResponse.success(res, 200, 'Segments retrieved.', segments);
    } catch (e) { next(e); }
};

const createSegment = async (req, res, next) => {
    try {
        const segment = await service.createSegment(req.body);
        return ApiResponse.success(res, 201, 'Segment created.', segment);
    } catch (e) { next(e); }
};

const getSegmentCustomers = async (req, res, next) => {
    try {
        const customers = await service.getSegmentCustomers(req.params.id);
        return ApiResponse.success(res, 200, 'Segment customers retrieved.', customers);
    } catch (e) { next(e); }
};

// ── Campaigns ───────────────────────────────────
const getCampaigns = async (req, res, next) => {
    try {
        const campaigns = await service.getCampaigns(req.query);
        return ApiResponse.success(res, 200, 'Campaigns retrieved.', campaigns);
    } catch (e) { next(e); }
};

const getCampaign = async (req, res, next) => {
    try {
        const campaign = await service.getCampaign(req.params.id);
        return ApiResponse.success(res, 200, 'Campaign retrieved.', campaign);
    } catch (e) { next(e); }
};

const createCampaign = async (req, res, next) => {
    try {
        const campaign = await service.createCampaign(req.body, req.user.id);
        return ApiResponse.success(res, 201, 'Campaign created.', campaign);
    } catch (e) { next(e); }
};

const updateCampaign = async (req, res, next) => {
    try {
        const campaign = await service.updateCampaign(req.params.id, req.body);
        return ApiResponse.success(res, 200, 'Campaign updated.', campaign);
    } catch (e) { next(e); }
};

const activateCampaign = async (req, res, next) => {
    try {
        const campaign = await service.activateCampaign(req.params.id);
        return ApiResponse.success(res, 200, 'Campaign activated.', campaign);
    } catch (e) { next(e); }
};

const pauseCampaign = async (req, res, next) => {
    try {
        const campaign = await service.pauseCampaign(req.params.id);
        return ApiResponse.success(res, 200, 'Campaign paused.', campaign);
    } catch (e) { next(e); }
};

const completeCampaign = async (req, res, next) => {
    try {
        const campaign = await service.completeCampaign(req.params.id);
        return ApiResponse.success(res, 200, 'Campaign completed.', campaign);
    } catch (e) { next(e); }
};

// ── Execution ───────────────────────────────────
const triggerCampaign = async (req, res, next) => {
    try {
        const result = await service.triggerCampaign(req.params.id);
        return ApiResponse.success(res, 200, 'Campaign triggered.', result);
    } catch (e) { next(e); }
};

const getExecutionLogs = async (req, res, next) => {
    try {
        const result = await service.getExecutionLogs(req.params.id, req.query);
        return ApiResponse.success(res, 200, 'Execution logs retrieved.', result);
    } catch (e) { next(e); }
};

// ── A/B Results ─────────────────────────────────
const getABResults = async (req, res, next) => {
    try {
        const results = await service.getABResults(req.params.id);
        return ApiResponse.success(res, 200, 'A/B test results retrieved.', results);
    } catch (e) { next(e); }
};

// ── Stats ───────────────────────────────────────
const getOutreachStats = async (req, res, next) => {
    try {
        const stats = await service.getOutreachStats();
        return ApiResponse.success(res, 200, 'Outreach stats retrieved.', stats);
    } catch (e) { next(e); }
};

module.exports = {
    getSegments, createSegment, getSegmentCustomers,
    getCampaigns, getCampaign, createCampaign, updateCampaign,
    activateCampaign, pauseCampaign, completeCampaign,
    triggerCampaign, getExecutionLogs, getABResults, getOutreachStats,
};
