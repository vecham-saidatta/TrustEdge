/**
 * TRUSTEDGE — JWT Authentication Middleware
 * 
 * Verifies Bearer tokens on protected routes.
 * On success, attaches the decoded user payload to req.user.
 * On failure, returns 401 Unauthorized.
 * 
 * Usage in routes:
 *   router.get('/profile', authenticate, controller.getProfile);
 */

const jwt = require('jsonwebtoken');
const config = require('../config/env');
const ApiError = require('../utils/apiError');

const authenticate = (req, res, next) => {
    try {
        // Extract token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw ApiError.unauthorized('No token provided. Please log in.');
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, config.jwt.accessSecret);

        // Attach user info to request object
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
        };

        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return next(ApiError.unauthorized('Token expired. Please refresh or log in again.'));
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return next(ApiError.unauthorized('Invalid token. Please log in again.'));
        }
        next(error);
    }
};

module.exports = authenticate;
