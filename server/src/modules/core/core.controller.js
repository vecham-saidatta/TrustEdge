/**
 * TRUSTEDGE CORE — Controller
 */

const coreService = require('./core.service');
const ApiResponse = require('../../utils/apiResponse');

const getProfile = async (req, res, next) => {
    try {
        const profile = await coreService.getProfile(req.user.id);
        return ApiResponse.success(res, 200, 'Financial profile retrieved.', { profile });
    } catch (error) {
        next(error);
    }
};

const getTransactions = async (req, res, next) => {
    try {
        const { transactions, pagination } = await coreService.getTransactions(req.user.id, req.query);
        return ApiResponse.paginated(res, 'Transactions retrieved.', transactions, pagination);
    } catch (error) {
        next(error);
    }
};

const getAlerts = async (req, res, next) => {
    try {
        const { alerts, pagination } = await coreService.getAlerts(req.user, req.query);
        return ApiResponse.paginated(res, 'Alerts retrieved.', alerts, pagination);
    } catch (error) {
        next(error);
    }
};

const updateAlert = async (req, res, next) => {
    try {
        const alert = await coreService.updateAlert(req.params.id, req.user.id, req.user.role, req.body);
        return ApiResponse.success(res, 200, 'Alert updated successfully.', { alert });
    } catch (error) {
        next(error);
    }
};

const analyzeStress = async (req, res, next) => {
    try {
        const result = await coreService.analyzeStress(req.body.customerId, req.user.id);
        return ApiResponse.success(res, 200, 'Stress analysis complete.', result);
    } catch (error) {
        next(error);
    }
};

module.exports = { getProfile, getTransactions, getAlerts, updateAlert, analyzeStress };
