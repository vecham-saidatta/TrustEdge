/**
 * TRUSTEDGE — Custom API Error Class
 * 
 * Extends the native Error class with HTTP status codes.
 * Throw this in any service/controller to trigger the global error handler.
 * 
 * Usage:
 *   throw new ApiError(404, 'User not found');
 *   throw new ApiError(403, 'Access denied', { role: 'CUSTOMER' });
 */

class ApiError extends Error {
    constructor(statusCode, message, details = null) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.isOperational = true; // Distinguishes expected errors from crashes

        // Capture stack trace (excludes constructor from trace)
        Error.captureStackTrace(this, this.constructor);
    }

    // Factory methods for common errors
    static badRequest(message, details) {
        return new ApiError(400, message, details);
    }

    static unauthorized(message = 'Authentication required') {
        return new ApiError(401, message);
    }

    static forbidden(message = 'Access denied') {
        return new ApiError(403, message);
    }

    static notFound(message = 'Resource not found') {
        return new ApiError(404, message);
    }

    static conflict(message = 'Resource already exists') {
        return new ApiError(409, message);
    }

    static internal(message = 'Internal server error') {
        return new ApiError(500, message);
    }
}

module.exports = ApiError;
