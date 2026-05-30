/**
 * LIFELINE — Auth Validation Schemas
 * 
 * Zod schemas for all auth-related request bodies.
 * Used by the validate middleware to reject bad input before it hits the service.
 */

const { z } = require('zod');

const registerSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be under 100 characters')
        .trim(),
    email: z
        .string()
        .email('Please provide a valid email address')
        .toLowerCase()
        .trim(),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(128, 'Password must be under 128 characters'),
    role: z
        .enum(['CUSTOMER', 'EMPLOYEE', 'ADMIN'], {
            errorMap: () => ({ message: 'Role must be CUSTOMER, EMPLOYEE, or ADMIN' }),
        })
        .default('CUSTOMER'),
});

const loginSchema = z.object({
    email: z
        .string()
        .email('Please provide a valid email address')
        .toLowerCase()
        .trim(),
    password: z
        .string()
        .min(1, 'Password is required'),
});

const refreshSchema = z.object({
    refreshToken: z
        .string()
        .min(1, 'Refresh token is required'),
});

module.exports = {
    registerSchema,
    loginSchema,
    refreshSchema,
};
