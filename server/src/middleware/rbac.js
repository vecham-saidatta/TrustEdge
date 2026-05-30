/**
 * LIFELINE — Role-Based Access Control (RBAC) Middleware
 * 
 * Checks if the authenticated user has one of the allowed roles.
 * Must be used AFTER the authenticate middleware.
 * 
 * Usage in routes:
 *   router.get('/admin/stats', authenticate, authorize('ADMIN'), controller.getStats);
 *   router.get('/shared', authenticate, authorize('ADMIN', 'EMPLOYEE'), controller.getData);
 */

const ApiError = require('../utils/apiError');

/**
 * @param {...string} allowedRoles - Roles permitted to access this route
 * @returns {Function} Express middleware
 */
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        // authenticate middleware must run first
        if (!req.user) {
            return next(ApiError.unauthorized('Authentication required before authorization.'));
        }

        // Check if user's role is in the allowed list
        if (!allowedRoles.includes(req.user.role)) {
            return next(
                ApiError.forbidden(
                    `Access denied. Required role(s): ${allowedRoles.join(', ')}. Your role: ${req.user.role}.`
                )
            );
        }

        next();
    };
};

module.exports = authorize;
