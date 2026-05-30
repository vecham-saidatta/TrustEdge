/**
 * SAGE — Validation Schemas
 */

const { z } = require('zod');

const chatSchema = z.object({
    message: z.string().min(1, 'Message is required').max(1000, 'Message must be under 1000 characters'),
    topic: z.enum(['BUDGETING', 'SAVING', 'DEBT', 'INVESTING', 'GENERAL']).default('GENERAL'),
    language: z.enum(['ENGLISH', 'HINDI', 'TELUGU']).default('ENGLISH'),
});

const historyQuery = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    topic: z.enum(['BUDGETING', 'SAVING', 'DEBT', 'INVESTING', 'GENERAL']).optional(),
});

const feedbackSchema = z.object({
    helpful: z.boolean(),
});

const translateSchema = z.object({
    text: z.string().min(1, 'Text is required'),
    targetLanguage: z.enum(['ENGLISH', 'HINDI', 'TELUGU']),
});

module.exports = { chatSchema, historyQuery, feedbackSchema, translateSchema };

