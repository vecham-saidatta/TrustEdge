/**
 * LIFELINE — Auth Routes
 * 
 * POST /api/v1/auth/register  → Create a new account
 * POST /api/v1/auth/login     → Login and receive tokens
 * POST /api/v1/auth/refresh   → Refresh access token
 * GET  /api/v1/auth/me        → Get current user profile (protected)
 */

const { Router } = require('express');
const authController = require('./auth.controller');
const validate = require('../../middleware/validate');
const authenticate = require('../../middleware/auth');
const { registerSchema, loginSchema, refreshSchema } = require('./auth.validation');

const router = Router();

// Public routes (no token needed)
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', validate(refreshSchema), authController.refresh);

// Protected routes (token required)
router.get('/me', authenticate, authController.getProfile);

module.exports = router;
