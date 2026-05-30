/**
 * ADMIN — Controller
 */

const adminService = require('./admin.service');
const ApiResponse = require('../../utils/apiResponse');

const getUsers = async (req, res, next) => {
    try {
        const { users, pagination } = await adminService.getUsers(req.query);
        return ApiResponse.paginated(res, 'Users retrieved.', users, pagination);
    } catch (error) {
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const user = await adminService.updateUser(req.params.id, req.body, req.user.id);
        return ApiResponse.success(res, 200, 'User updated successfully.', { user });
    } catch (error) {
        next(error);
    }
};

const getStats = async (req, res, next) => {
    try {
        const stats = await adminService.getStats();
        return ApiResponse.success(res, 200, 'System stats retrieved.', stats);
    } catch (error) {
        next(error);
    }
};

const getAuditLogs = async (req, res, next) => {
    try {
        const { logs, pagination } = await adminService.getAuditLogs(req.query);
        return ApiResponse.paginated(res, 'Audit logs retrieved.', logs, pagination);
    } catch (error) {
        next(error);
    }
};

module.exports = { getUsers, updateUser, getStats, getAuditLogs };
