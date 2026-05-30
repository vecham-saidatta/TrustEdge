/**
 * LIFELINE — Auth Service
 * 
 * Contains all business logic for authentication:
 * - Register (hash password, create user)
 * - Login (verify credentials, generate tokens)
 * - Refresh (issue new access token from refresh token)
 * - Get profile (return current user data)
 * 
 * This layer talks to the database via Prisma.
 * Controllers call this layer — they never touch the DB directly.
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../../config/database');
const config = require('../../config/env');
const ApiError = require('../../utils/apiError');
const logger = require('../../config/logger');

/**
 * Generate JWT access and refresh tokens for a user.
 * @param {object} user - User record from database
 * @returns {{ accessToken: string, refreshToken: string }}
 */
const generateTokens = (user) => {
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
    };

    const accessToken = jwt.sign(payload, config.jwt.accessSecret, {
        expiresIn: config.jwt.accessExpiry,
    });

    const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
        expiresIn: config.jwt.refreshExpiry,
    });

    return { accessToken, refreshToken };
};

/**
 * Strip sensitive fields from user object before returning to client.
 * @param {object} user - Raw user from database
 * @returns {object} Safe user object
 */
const sanitizeUser = (user) => {
    const { passwordHash, ...safeUser } = user;
    return safeUser;
};

/**
 * Register a new user.
 */
const register = async ({ name, email, password, role }) => {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw ApiError.conflict('An account with this email already exists.');
    }

    // Hash password with bcrypt (12 rounds — good balance of security and speed)
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user in database
    const user = await prisma.user.create({
        data: {
            name,
            email,
            passwordHash,
            role: role || 'CUSTOMER',
        },
    });

    logger.info('New user registered', { userId: user.id, role: user.role });

    // Generate tokens
    const tokens = generateTokens(user);

    return {
        user: sanitizeUser(user),
        ...tokens,
    };
};

/**
 * Login with email and password.
 */
const login = async ({ email, password }) => {
    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        // Intentionally vague message to prevent email enumeration
        throw ApiError.unauthorized('Invalid email or password.');
    }

    // Check if account is active
    if (!user.isActive) {
        throw ApiError.forbidden('Your account has been deactivated. Please contact support.');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
        throw ApiError.unauthorized('Invalid email or password.');
    }

    logger.info('User logged in', { userId: user.id, role: user.role });

    // Generate tokens
    const tokens = generateTokens(user);

    return {
        user: sanitizeUser(user),
        ...tokens,
    };
};

/**
 * Refresh access token using a valid refresh token.
 */
const refresh = async (refreshToken) => {
    try {
        const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);

        // Verify user still exists and is active
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user || !user.isActive) {
            throw ApiError.unauthorized('User not found or account deactivated.');
        }

        // Generate new tokens
        const tokens = generateTokens(user);

        return {
            user: sanitizeUser(user),
            ...tokens,
        };
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw ApiError.unauthorized('Refresh token expired. Please log in again.');
        }
        if (error instanceof jwt.JsonWebTokenError) {
            throw ApiError.unauthorized('Invalid refresh token.');
        }
        throw error;
    }
};

/**
 * Get current user profile by ID.
 */
const getProfile = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            financialProfile: {
                select: { monthlyIncome: true, currentBalance: true, stressLevel: true, riskScore: true },
            },
        },
    });
    if (!user) throw ApiError.notFound('User not found.');
    const { passwordHash, ...safeUser } = user;
    return safeUser;
};

module.exports = {
    register,
    login,
    refresh,
    getProfile,
};
