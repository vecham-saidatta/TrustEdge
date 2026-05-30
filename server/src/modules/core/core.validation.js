/**
 * TRUSTEDGE CORE — Validation Schemas
 */

const { z } = require('zod');

const getTransactionsQuery = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    category: z.string().optional(),
    type: z.enum(['CREDIT', 'DEBIT']).optional(),
});

const getAlertsQuery = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    status: z.enum(['OPEN', 'ACKNOWLEDGED', 'RESOLVED', 'DISMISSED']).optional(),
    severity: z.enum(['LOW', 'MODERATE', 'HIGH', 'CRITICAL']).optional(),
});

const updateAlertSchema = z.object({
    status: z.enum(['ACKNOWLEDGED', 'RESOLVED', 'DISMISSED']),
});

const analyzeSchema = z.object({
    customerId: z.string().uuid('Valid customer ID is required'),
});

module.exports = {
    getTransactionsQuery,
    getAlertsQuery,
    updateAlertSchema,
    analyzeSchema,
};
