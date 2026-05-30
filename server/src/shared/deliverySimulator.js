/**
 * SHARED DELIVERY SIMULATOR — Single Source of Truth
 * Extracted from both Signal Engine and Outreach Engine.
 * All channel delivery simulation flows through here.
 */

const BASE_RATES = {
    EMAIL:    { delivered: 0.85, opened: 0.30, converted: 0.05 },
    SMS:      { delivered: 0.95, opened: 0.60, converted: 0.08 },
    WHATSAPP: { delivered: 0.92, opened: 0.70, converted: 0.12 },
    PUSH:     { delivered: 0.80, opened: 0.25, converted: 0.04 },
    INAPP:    { delivered: 0.99, opened: 0.50, converted: 0.15 },
    RM_CALL:  { delivered: 0.70, opened: 0.60, converted: 0.20 },
    BRANCH:   { delivered: 0.60, opened: 0.90, converted: 0.30 },
};

// Priority boost for at-risk customers (banks prioritize retention outreach)
const RISK_BOOST = { CRITICAL: 0.10, HIGH: 0.05, MODERATE: 0.02, LOW: 0 };

/**
 * Simulates delivery for a single message on a given channel.
 * @param {string} channel - RM_CALL, SMS, etc.
 * @param {string} [riskLevel] - Customer risk level for priority boost
 * @returns {string} Status: FAILED | DELIVERED | OPENED | CONVERTED
 */
function simulateDelivery(channel, riskLevel = 'MODERATE') {
    const boost = RISK_BOOST[riskLevel] || 0;
    const r = BASE_RATES[channel] || BASE_RATES.EMAIL;
    const deliveredRate = Math.min(1, r.delivered + boost);
    const rand = Math.random();

    if (rand > deliveredRate) return 'FAILED';
    if (rand < r.converted * deliveredRate) return 'CONVERTED';
    if (rand < r.opened * deliveredRate) return 'OPENED';
    return 'DELIVERED';
}

/**
 * Returns the base conversion rates for analytics/display.
 */
function getChannelRates() {
    return { ...BASE_RATES };
}

module.exports = { simulateDelivery, getChannelRates, BASE_RATES };
