/**
 * EVENT LISTENER BOOTSTRAP — Unified Ecosystem Wiring
 * 
 * Connects Signal → Outreach → Retention → Feedback in an event-driven loop.
 * This file is loaded once on app startup.
 */

const { eventBus, EVENTS } = require('../shared/eventBus');
const logger = require('../config/logger');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { matchOffer, checkGlobalFrequencyCap } = require('../shared/offerMatcher');
const { simulateDelivery } = require('../shared/deliverySimulator');

// ═══════════════════════════════════════════════════════════
// LISTENER 1: RISK_ASSESSED → Auto-create Retention Journey + Outreach Campaign
// Signal Engine emits this after generating a churn report.
// ═══════════════════════════════════════════════════════════

eventBus.on(EVENTS.RISK_ASSESSED, async (data) => {
    const { userId, riskLevel, churnProbability, reportId, pulse, userName } = data;

    try {
        // Skip low-risk customers
        if (riskLevel === 'LOW') return;

        // 1. Auto-create Retention Journey
        let journey = null;
        const existingJourney = await prisma.retentionJourney.findFirst({
            where: { userId, stage: { notIn: ['RESOLVED', 'CLOSED'] } },
        });

        if (!existingJourney) {
            journey = await prisma.retentionJourney.create({
                data: {
                    userId,
                    triggerType: 'SIGNAL_ENGINE',
                    stage: 'RISK_DETECTED',
                    outcome: 'PENDING',
                    detectedAt: new Date(),
                    triggerDetail: JSON.stringify({ reportId, riskLevel, churnProbability }),
                },
            });
            logger.info(`🗺️ Auto-created Retention Journey for ${userName}`, { journeyId: journey.id });
        } else {
            journey = existingJourney;
        }

        // 2. Auto-recalculate Health Score
        try {
            const retentionService = require('../modules/retention/retention.service');
            await retentionService.calculateHealthScore(userId);
            logger.info(`🩺 Health Score recalculated for ${userName}`);
        } catch (e) {
            logger.error('Health score recalculation failed', { userId, error: e.message });
        }

        // 3. Match best offer from Offer Library
        const healthScore = await prisma.customerHealthScore.findUnique({ where: { userId } });
        const healthLevel = healthScore?.healthLevel || (riskLevel === 'CRITICAL' ? 'CRITICAL' : riskLevel === 'HIGH' ? 'AT_RISK' : 'NEEDS_ATTENTION');
        const disengagementReason = healthScore?.disengagementReason || null;

        const bestOffer = await matchOffer(healthLevel, disengagementReason, userId);
        if (!bestOffer) {
            logger.info(`⏭️ No eligible offer for ${userName} (all capped or none match)`);
            return;
        }

        // 4. Check global frequency cap
        const canSend = await checkGlobalFrequencyCap(userId);
        if (!canSend) {
            logger.info(`🛑 Frequency cap hit for ${userName} — skipping outreach`);
            return;
        }

        // 5. Update Journey stage
        await prisma.retentionJourney.update({
            where: { id: journey.id },
            data: { stage: 'OFFER_SELECTED', lastUpdatedAt: new Date() },
        });

        // 6. Create Retention Offer record
        await prisma.retentionOffer.create({
            data: {
                userId,
                offerLibraryId: bestOffer.id,
                explanationWhy: bestOffer.whyShown,
                explanationWhat: bestOffer.problemSolved,
                explanationGain: bestOffer.customerGain,
                validUntil: new Date(Date.now() + bestOffer.validityDays * 86400000),
                channel: pulse?.channels?.[0]?.channel || 'INAPP',
                status: 'PENDING',
                approvalStatus: bestOffer.requiresApproval ? 'PENDING_APPROVAL' : 'AUTO_APPROVED',
                churnReportId: reportId,
            },
        });

        // 7. Create Outreach Campaign through the Outreach Engine
        const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
        if (!admin) return;

        const now = new Date();
        const endDate = new Date(now.getTime() + 7 * 86400000);
        const recommendedChannels = pulse?.channels?.filter(ch => ch.recommended) || [{ channel: 'INAPP' }];

        const campaign = await prisma.campaign.create({
            data: {
                name: `🤖 PULSE — ${userName} [${bestOffer.category}]`,
                description: `Auto: ${riskLevel} risk, ${churnProbability}% churn. Offer: ${bestOffer.name}. Report: ${reportId}`,
                status: 'ACTIVE',
                source: 'PULSE_AUTO',
                journeyId: journey.id,
                startDate: now,
                endDate,
                createdById: admin.id,
            },
        });

        // Create variant from Offer Library template
        const variant = await prisma.variant.create({
            data: {
                campaignId: campaign.id,
                label: bestOffer.name,
                offerJson: JSON.stringify({
                    type: bestOffer.category,
                    name: bestOffer.name,
                    whyShown: bestOffer.whyShown,
                    problemSolved: bestOffer.problemSolved,
                    customerGain: bestOffer.customerGain,
                    validityDays: bestOffer.validityDays,
                }),
                weight: 100,
            },
        });

        // Configure channels
        for (const ch of recommendedChannels) {
            await prisma.channelConfig.create({
                data: {
                    campaignId: campaign.id,
                    channel: ch.channel,
                    enabled: true,
                    templateBody: ch.action || bestOffer.customerGain,
                },
            });
        }

        // Execute delivery simulation
        const logs = [];
        for (const ch of recommendedChannels) {
            const status = simulateDelivery(ch.channel, riskLevel);
            logs.push({
                campaignId: campaign.id,
                variantId: variant.id,
                channel: ch.channel,
                recipientId: userId,
                source: 'PULSE_AUTO',
                status,
                sentAt: status !== 'FAILED' ? now : null,
                deliveredAt: ['DELIVERED', 'OPENED', 'CONVERTED'].includes(status) ? now : null,
                openedAt: ['OPENED', 'CONVERTED'].includes(status) ? now : null,
                convertedAt: status === 'CONVERTED' ? now : null,
                failReason: status === 'FAILED' ? `Simulated failure on ${ch.channel}` : null,
            });
        }

        if (logs.length > 0) {
            await prisma.executionLog.createMany({ data: logs });
        }

        // Update Journey stage
        await prisma.retentionJourney.update({
            where: { id: journey.id },
            data: { stage: 'OFFER_SENT', lastUpdatedAt: new Date() },
        });

        // Emit campaign executed event
        eventBus.emitEvent(EVENTS.CAMPAIGN_EXECUTED, {
            campaignId: campaign.id, userId, riskLevel,
            channels: recommendedChannels.map(c => c.channel),
            offerName: bestOffer.name,
        });

        logger.info(`🚀 Unified Pipeline: ${userName} → ${bestOffer.name} via ${recommendedChannels.length} channels`, {
            campaignId: campaign.id, journeyId: journey.id,
        });

    } catch (err) {
        logger.error('Event listener RISK_ASSESSED failed', { userId, error: err.message });
    }
});

// ═══════════════════════════════════════════════════════════
// LISTENER 2: FEEDBACK_AGGREGATED → Log learning events
// ═══════════════════════════════════════════════════════════

eventBus.on(EVENTS.FEEDBACK_AGGREGATED, (data) => {
    logger.info(`🧠 Feedback Loop: ${data.insights?.length || 0} insights for ${data.periodLabel}`);
});

logger.info('✅ Event Listeners bootstrapped — Unified Ecosystem active');
