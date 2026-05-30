/**
 * SHARED OFFER MATCHER — Maps Risk Profiles to Offer Library Templates
 * Used by the unified pipeline: Signal assesses → OfferMatcher selects → Outreach delivers
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Risk-to-offer category priority matrix
const RISK_OFFER_MAP = {
    CRITICAL: ['SERVICE_RECOVERY', 'FEE_WAIVER', 'RATE_ADJUSTMENT', 'REACTIVATION_PROMPT'],
    AT_RISK:  ['FEE_WAIVER', 'REACTIVATION_PROMPT', 'REWARD_BOOST', 'SERVICE_RECOVERY'],
    NEEDS_ATTENTION: ['REWARD_BOOST', 'BUNDLE_UPGRADE', 'FEE_WAIVER'],
    HEALTHY:  ['BUNDLE_UPGRADE', 'REWARD_BOOST'],
    THRIVING: ['RATE_ADJUSTMENT', 'BUNDLE_UPGRADE'],
};

// Disengagement reason → preferred offer category
const REASON_OFFER_MAP = {
    FEE_SENSITIVITY:      'FEE_WAIVER',
    POOR_SERVICE:         'SERVICE_RECOVERY',
    LOW_DIGITAL_ADOPTION: 'BUNDLE_UPGRADE',
    COMPETITOR_EXPOSURE:  'RATE_ADJUSTMENT',
    LIFE_EVENT:           'REWARD_BOOST',
    INACTIVITY:           'REACTIVATION_PROMPT',
};

/**
 * Finds the best matching Offer Library template for a customer's risk profile.
 * @param {string} healthLevel - CRITICAL, AT_RISK, NEEDS_ATTENTION, HEALTHY, THRIVING
 * @param {string|null} disengagementReason - FEE_SENSITIVITY, POOR_SERVICE, etc.
 * @param {string} userId - For checking frequency caps
 * @returns {Object|null} Best matching offer template, or null if none available
 */
async function matchOffer(healthLevel, disengagementReason, userId) {
    // 1. Preferred category from disengagement reason
    const preferredCategory = REASON_OFFER_MAP[disengagementReason] || null;

    // 2. Fallback priority from risk level
    const categoryPriority = RISK_OFFER_MAP[healthLevel] || RISK_OFFER_MAP.NEEDS_ATTENTION;

    // 3. Build ordered category list (preferred first, then fallbacks)
    const orderedCategories = preferredCategory
        ? [preferredCategory, ...categoryPriority.filter(c => c !== preferredCategory)]
        : categoryPriority;

    // 4. Try each category in order
    for (const category of orderedCategories) {
        const offers = await prisma.offerLibrary.findMany({
            where: { isActive: true, category },
            orderBy: { createdAt: 'desc' },
        });

        for (const offer of offers) {
            // Check frequency cap
            const recentCount = await prisma.retentionOffer.count({
                where: {
                    userId,
                    offerLibraryId: offer.id,
                    createdAt: { gte: new Date(Date.now() - offer.cooldownDays * 86400000) },
                },
            });
            if (recentCount < offer.maxPerCustomer) {
                return offer; // Found a valid offer within frequency cap
            }
        }
    }

    return null; // All offers exhausted or capped
}

/**
 * Checks global frequency cap — max N messages to a customer per week across all channels.
 * @param {string} userId
 * @param {number} [maxPerWeek=5]
 * @returns {boolean} true if customer can receive more messages
 */
async function checkGlobalFrequencyCap(userId, maxPerWeek = 5) {
    const weekAgo = new Date(Date.now() - 7 * 86400000);
    const recentMessages = await prisma.executionLog.count({
        where: {
            recipientId: userId,
            createdAt: { gte: weekAgo },
            status: { not: 'FAILED' },
        },
    });
    return recentMessages < maxPerWeek;
}

module.exports = { matchOffer, checkGlobalFrequencyCap, RISK_OFFER_MAP, REASON_OFFER_MAP };
