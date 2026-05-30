/**
 * LIFELINE — Auth Controller
 * 
 * Thin layer between routes and service.
 * Responsibilities:
 * 1. Extract data from request
 * 2. Call the service
 * 3. Send the response
 * 
 * Controllers do NOT contain business logic.
 */

const authService = require('./auth.service');
const ApiResponse = require('../../utils/apiResponse');

/**
 * POST /api/v1/auth/register
 * Register a new user account.
 */
const register = async (req, res, next) => {
    try {
        const result = await authService.register(req.body);
        return ApiResponse.success(res, 201, 'Account created successfully.', result);
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/v1/auth/login
 * Login with email and password.
 */
const login = async (req, res, next) => {
    try {
        const result = await authService.login(req.body);
        return ApiResponse.success(res, 200, 'Login successful.', result);
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/v1/auth/refresh
 * Get a new access token using a refresh token.
 */
const refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        const result = await authService.refresh(refreshToken);
        return ApiResponse.success(res, 200, 'Token refreshed successfully.', result);
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/v1/auth/me
 * Get current logged-in user profile.
 */
const getProfile = async (req, res, next) => {
    try {
        const user = await authService.getProfile(req.user.id);
        return ApiResponse.success(res, 200, 'Profile retrieved.', { user });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    refresh,
    getProfile,
};
