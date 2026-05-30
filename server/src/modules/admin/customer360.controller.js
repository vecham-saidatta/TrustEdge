/**
 * ADMIN — Customer 360 Controller
 * Aggregated per-customer endpoints for the admin Customer360 dashboard.
 */

const service = require('./customer360.service');
const ApiResponse = require('../../utils/apiResponse');

const getProfile = async (req, res, next) => {
    try {
        const data = await service.getCustomer360Profile(req.params.userId);
        return ApiResponse.success(res, 200, 'Customer 360 profile.', data);
    } catch (e) { next(e); }
};

const getTransactions = async (req, res, next) => {
    try {
        const data = await service.getCustomer360Transactions(req.params.userId, req.query);
        return ApiResponse.success(res, 200, 'Customer transactions.', data);
    } catch (e) { next(e); }
};

const getComplaints = async (req, res, next) => {
    try {
        const data = await service.getCustomer360Complaints(req.params.userId);
        return ApiResponse.success(res, 200, 'Customer complaints.', data);
    } catch (e) { next(e); }
};

const getSageHistory = async (req, res, next) => {
    try {
        const data = await service.getCustomer360SageHistory(req.params.userId);
        return ApiResponse.success(res, 200, 'Customer SAGE history.', data);
    } catch (e) { next(e); }
};

const getRetention = async (req, res, next) => {
    try {
        const data = await service.getCustomer360Retention(req.params.userId);
        return ApiResponse.success(res, 200, 'Customer retention data.', data);
    } catch (e) { next(e); }
};

const getOutreach = async (req, res, next) => {
    try {
        const data = await service.getCustomer360Outreach(req.params.userId);
        return ApiResponse.success(res, 200, 'Customer outreach history.', data);
    } catch (e) { next(e); }
};

const getSignals = async (req, res, next) => {
    try {
        const days = parseInt(req.query.days) || 90;
        const data = await service.getCustomer360Signals(req.params.userId, days);
        return ApiResponse.success(res, 200, 'Customer signals.', data);
    } catch (e) { next(e); }
};

const getProducts = async (req, res, next) => {
    try {
        const data = await service.getCustomer360Products(req.params.userId);
        return ApiResponse.success(res, 200, 'Customer products.', data);
    } catch (e) { next(e); }
};

module.exports = { getProfile, getTransactions, getComplaints, getSageHistory, getRetention, getOutreach, getSignals, getProducts };
