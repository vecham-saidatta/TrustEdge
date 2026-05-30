/**
 * UNIFIED EVENT BUS — Shared In-Process Event Emitter
 * Connects Signal Engine, Outreach Engine, Retention Hub, and Feedback Loop
 * without tight coupling between modules.
 */

const EventEmitter = require('events');
const logger = require('../config/logger');

class LifelineEventBus extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(50);
    }

    emitEvent(event, data) {
        logger.info(`📡 EventBus: ${event}`, { customerId: data?.userId || data?.customerId });
        this.emit(event, data);
    }
}

// Singleton
const eventBus = new LifelineEventBus();

// ── Event Constants ─────────────────────────────────
const EVENTS = {
    // Signal → Outreach + Retention
    RISK_ASSESSED:         'signal.risk.assessed',
    HEALTH_RECALCULATED:   'signal.health.recalculated',

    // Outreach → Retention + Feedback
    CAMPAIGN_CREATED:      'outreach.campaign.created',
    MESSAGE_DELIVERED:     'outreach.message.delivered',
    MESSAGE_OPENED:        'outreach.message.opened',
    MESSAGE_CONVERTED:     'outreach.message.converted',
    MESSAGE_FAILED:        'outreach.message.failed',
    CAMPAIGN_EXECUTED:     'outreach.campaign.executed',

    // Retention → Signal
    JOURNEY_STAGE_CHANGED: 'retention.journey.stage_changed',
    OFFER_RESPONDED:       'retention.offer.responded',
    CUSTOMER_REACTIVATED:  'retention.customer.reactivated',

    // Feedback → Signal
    FEEDBACK_AGGREGATED:   'feedback.aggregated',
    MODEL_RETRAINED:       'feedback.model.retrained',
};

module.exports = { eventBus, EVENTS };
