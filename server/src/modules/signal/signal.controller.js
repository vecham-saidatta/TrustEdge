/**
 * SIGNAL ENGINE — Controller
 */
const service = require('./signal.service');
const ApiResponse = require('../../utils/apiResponse');

const getCustomers = async (req, res, next) => {
    try {
        const data = await service.getCustomersWithSignals();
        return ApiResponse.success(res, 200, 'Customers with signal data.', data);
    } catch (e) { next(e); }
};

const getSignalSummary = async (req, res, next) => {
    try {
        const data = await service.getSignalSummary(req.params.userId, parseInt(req.query.days) || 90);
        return ApiResponse.success(res, 200, 'Signal summary.', data);
    } catch (e) { next(e); }
};

const generateReport = async (req, res, next) => {
    try {
        const report = await service.generateChurnReport(req.body.userId);
        return ApiResponse.success(res, 201, 'Churn report generated.', report);
    } catch (e) { next(e); }
};

const getReports = async (req, res, next) => {
    try {
        const reports = await service.getReportsForUser(req.params.userId);
        return ApiResponse.success(res, 200, 'Reports retrieved.', reports);
    } catch (e) { next(e); }
};

const getReport = async (req, res, next) => {
    try {
        const report = await service.getReport(req.params.id);
        return ApiResponse.success(res, 200, 'Report detail.', report);
    } catch (e) { next(e); }
};

const getStats = async (req, res, next) => {
    try {
        const stats = await service.getSignalStats();
        return ApiResponse.success(res, 200, 'Signal stats.', stats);
    } catch (e) { next(e); }
};

const simulateForUser = async (req, res, next) => {
    try {
        const data = await service.simulateMonteCarloForUser(req.params.userId);
        return ApiResponse.success(res, 200, 'Monte Carlo simulation.', data);
    } catch (e) { next(e); }
};

module.exports = { getCustomers, getSignalSummary, generateReport, getReports, getReport, getStats, simulateForUser };
