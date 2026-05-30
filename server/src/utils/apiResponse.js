/**
 * TRUSTEDGE — Standardized API Response Helper
 * 
 * Ensures EVERY API response follows the same shape.
 * Frontend developers never have to guess the response structure.
 * 
 * Success: { success: true, message: '...', data: {...} }
 * Error:   { success: false, message: '...', error: {...} }
 */

class ApiResponse {
    /**
     * Send a success response.
     * @param {object} res - Express response object
     * @param {number} statusCode - HTTP status (200, 201, etc.)
     * @param {string} message - Human-readable message
     * @param {*} data - Response payload
     */
    static success(res, statusCode = 200, message = 'Success', data = null) {
        const response = {
            success: true,
            message,
        };
        if (data !== null) {
            response.data = data;
        }
        return res.status(statusCode).json(response);
    }

    /**
     * Send a paginated success response.
     * @param {object} res - Express response object
     * @param {string} message - Human-readable message
     * @param {Array} data - Array of items
     * @param {object} pagination - { page, limit, total, totalPages }
     */
    static paginated(res, message, data, pagination) {
        return res.status(200).json({
            success: true,
            message,
            data,
            pagination,
        });
    }

    /**
     * Send an error response.
     * @param {object} res - Express response object
     * @param {number} statusCode - HTTP error status
     * @param {string} message - Error message
     * @param {*} details - Additional error details
     */
    static error(res, statusCode = 500, message = 'Something went wrong', details = null) {
        const response = {
            success: false,
            message,
        };
        if (details !== null) {
            response.error = details;
        }
        return res.status(statusCode).json(response);
    }
}

module.exports = ApiResponse;
