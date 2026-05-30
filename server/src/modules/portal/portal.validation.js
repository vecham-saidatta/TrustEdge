/**
 * CUSTOMER PORTAL — Validation Schemas (Zod)
 */

const { z } = require('zod');

// ── Dashboard / Finance Queries ─────────────────
const paginationQuery = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
});

const transactionQuery = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    type: z.enum(['CREDIT', 'DEBIT']).optional(),
    category: z.string().optional(),
    from: z.string().optional(),
    to: z.string().optional(),
});

const notificationQuery = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    type: z.string().optional(),
    isRead: z.enum(['true', 'false']).optional(),
});

// ── Goals ───────────────────────────────────────
const createGoalSchema = z.object({
    goalType: z.enum(['HOME', 'EDUCATION', 'EMERGENCY_FUND', 'VACATION', 'WEDDING', 'VEHICLE', 'RETIREMENT', 'OTHER']),
    goalName: z.string().min(1, 'Goal name is required').max(100),
    targetAmount: z.number().positive('Target amount must be positive'),
    currentAmount: z.number().min(0).default(0),
    targetDate: z.string().min(1, 'Target date is required'),
    monthlyContribution: z.number().min(0),
    fundingMethod: z.enum(['AUTO_TRANSFER', 'MANUAL', 'LINKED_SIP', 'LINKED_RD']).default('MANUAL'),
    linkedProductId: z.string().optional(),
});

const updateGoalSchema = z.object({
    goalName: z.string().min(1).max(100).optional(),
    targetAmount: z.number().positive().optional(),
    currentAmount: z.number().min(0).optional(),
    targetDate: z.string().optional(),
    monthlyContribution: z.number().min(0).optional(),
    fundingMethod: z.enum(['AUTO_TRANSFER', 'MANUAL', 'LINKED_SIP', 'LINKED_RD']).optional(),
    status: z.enum(['ACTIVE', 'PAUSED', 'COMPLETED', 'ABANDONED']).optional(),
    linkedProductId: z.string().nullable().optional(),
});

// ── Offers ──────────────────────────────────────
const offerActionSchema = z.object({
    action: z.enum(['ACCEPTED', 'DECLINED', 'EXPLORING', 'IGNORED']),
    declineReason: z.string().max(500).optional(),
});

// ── Support Tickets ─────────────────────────────
const createTicketSchema = z.object({
    category: z.string().min(1, 'Category is required').max(50),
    subCategory: z.string().max(50).optional(),
    description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
    evidenceUrls: z.string().optional(),
});

const ticketMessageSchema = z.object({
    message: z.string().min(1, 'Message is required').max(2000),
});

const ticketQuery = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).optional(),
});

// ── Appointments ────────────────────────────────
const createAppointmentSchema = z.object({
    branchCode: z.string().min(1, 'Branch code is required'),
    branchName: z.string().default(''),
    appointmentDate: z.string().min(1, 'Appointment date is required'),
    timeSlot: z.string().min(1, 'Time slot is required'),
    reason: z.string().min(1, 'Reason is required').max(500),
});

// ── Preferences ─────────────────────────────────
const updatePreferencesSchema = z.object({
    languagePreference: z.enum(['EN', 'HI', 'TE', 'TA', 'KN']).optional(),
    uiMode: z.enum(['STANDARD', 'SIMPLIFIED', 'ACCESSIBLE']).optional(),
    transactionAlertChannels: z.array(z.string()).optional(),
    emiChannels: z.array(z.string()).optional(),
    offerChannels: z.array(z.string()).optional(),
    sageNudgeChannels: z.array(z.string()).optional(),
    transactionAlertThreshold: z.number().min(0).optional(),
    marketingOptIn: z.boolean().optional(),
    marketingPausedUntil: z.string().nullable().optional(),
    quietHoursStart: z.number().int().min(0).max(23).optional(),
    quietHoursEnd: z.number().int().min(0).max(23).optional(),
});

// ── Consents ────────────────────────────────────
const updateConsentSchema = z.object({
    consentType: z.enum(['PERSONALIZED_OFFERS', 'SAGE_ANALYSIS', 'CROSS_PRODUCT_PROFILE', 'ACCOUNT_AGGREGATOR']),
    granted: z.boolean(),
});

module.exports = {
    paginationQuery,
    transactionQuery,
    notificationQuery,
    createGoalSchema,
    updateGoalSchema,
    offerActionSchema,
    createTicketSchema,
    ticketMessageSchema,
    ticketQuery,
    createAppointmentSchema,
    updatePreferencesSchema,
    updateConsentSchema,
};
