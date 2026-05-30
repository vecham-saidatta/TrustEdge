/**
 * ADMIN — Validation Schemas
 */

const { z } = require('zod');

const usersQuery = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    role: z.enum(['CUSTOMER', 'EMPLOYEE', 'ADMIN']).optional(),
    isActive: z.coerce.boolean().optional(),
});

const updateUserSchema = z.object({
    role: z.enum(['CUSTOMER', 'EMPLOYEE', 'ADMIN']).optional(),
    isActive: z.boolean().optional(),
}).refine((data) => data.role !== undefined || data.isActive !== undefined, {
    message: 'At least one field (role or isActive) must be provided',
});

const auditQuery = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(50),
    action: z.string().optional(),
    userId: z.string().optional(),
});

module.exports = { usersQuery, updateUserSchema, auditQuery };
