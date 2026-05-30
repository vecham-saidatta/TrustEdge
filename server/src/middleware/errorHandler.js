/**
 * LIFELINE — Global Error Handler Middleware
 * 
 * Catches ALL errors thrown in the app (including async errors).
 * Distinguishes between:
 * - Operational errors (ApiError) → returns proper status + message
 * - Programming errors (unexpected) → logs full stack, returns 500
 * 
 * Must be registered LAST in the Express middleware chain.
 */

const logger = require('../config/logger');
const ApiResponse = require('../utils/apiResponse');
const config = require('../config/env');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    // Default values
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal server error';

    // Log the error
    if (statusCode >= 500) {
        // Server errors — log full details
        logger.error('Server Error', {
            statusCode,
            message,
            stack: err.stack,
            path: req.path,
            method: req.method,
            ip: req.ip,
        });
    } else {
        // Client errors — log briefly
        logger.warn('Client Error', {
            statusCode,
            message,
            path: req.path,
            method: req.method,
        });
    }

    // In production, don't leak error details for 500s
    if (config.isProd && statusCode === 500) {
        message = 'Something went wrong. Please try again later.';
    }

    return ApiResponse.error(res, statusCode, message, err.details || null);
};

module.exports = errorHandler;
