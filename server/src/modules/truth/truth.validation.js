/**
 * TRUTH — Validation Schemas
 */

const { z } = require('zod');

const productsQuery = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    type: z.enum(['LOAN', 'CREDIT_CARD', 'SAVINGS', 'INVESTMENT']).optional(),
    provider: z.string().optional(),
});

const compareSchema = z.object({
    productId: z.string().min(1, 'Product ID is required'),
    loanAmount: z.number().positive('Amount must be positive').optional(),
    tenureMonths: z.number().int().min(1).max(360).optional(),
});

const comparisonsQuery = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
});

module.exports = { productsQuery, compareSchema, comparisonsQuery };
