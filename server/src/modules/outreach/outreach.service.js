/**
 * OUTREACH ENGINE — Service Layer (Unified Ecosystem)
 * Manages campaigns, variants, channels, audience segments, execution, A/B results.
 * Uses shared/deliverySimulator.js for all delivery simulation.
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const ApiError = require('../../utils/apiError');
const { simulateDelivery } = require('../../shared/deliverySimulator');

// ═══════════════════════════════════════════════
// AUDIENCE SEGMENTS
// ═══════════════════════════════════════════════

const getSegments = async () => {
    return prisma.audienceSegment.findMany({ orderBy: { createdAt: 'desc' } });
};

const createSegment = async (data) => {
    // Count matching customers
    let customerCount = 0;
    try {
        const filter = JSON.parse(data.filterJson);
        customerCount = await prisma.user.count({ where: { role: 'CUSTOMER', ...filter } });
    } catch { /* ignore parse errors, count will be 0 */ }

    return prisma.audienceSegment.create({
        data: { ...data, customerCount },
    });
};

const getSegmentCustomers = async (segmentId) => {
    const segment = await prisma.audienceSegment.findUnique({ where: { id: segmentId } });
    if (!segment) throw ApiError.notFound('Segment not found');
    let filter = {};
    try { filter = JSON.parse(segment.filterJson); } catch { /* empty */ }
    return prisma.user.findMany({
        where: { role: 'CUSTOMER', ...filter },
        select: { id: true, name: true, email: true, phone: true, accountNumber: true },
    });
};

// ═══════════════════════════════════════════════
// CAMPAIGNS — CRUD
// ═══════════════════════════════════════════════

const getCampaigns = async (query = {}) => {
    const where = {};
    if (query.status) where.status = query.status;

    return prisma.campaign.findMany({
        where,
        include: {
            segment: { select: { id: true, name: true, customerCount: true } },
            variants: true,
            channelConfigs: true,
            _count: { select: { executionLogs: true } },
            abTestResults: true,
        },
        orderBy: { createdAt: 'desc' },
    });
};

const getCampaign = async (id) => {
    const campaign = await prisma.campaign.findUnique({
        where: { id },
        include: {
            segment: true,
            variants: true,
            channelConfigs: true,
            executionLogs: { take: 50, orderBy: { createdAt: 'desc' } },
            abTestResults: { include: { variant: { select: { label: true } } } },
        },
    });
    if (!campaign) throw ApiError.notFound('Campaign not found');
    return campaign;
};

const createCampaign = async (data, adminId) => {
    const { variants, channels, ...campaignData } = data;

    const campaign = await prisma.campaign.create({
        data: {
            ...campaignData,
            startDate: new Date(campaignData.startDate),
            endDate: new Date(campaignData.endDate),
            createdById: adminId,
            variants: variants?.length ? {
                create: variants.map(v => ({
                    label: v.label,
                    offerJson: typeof v.offerJson === 'string' ? v.offerJson : JSON.stringify(v.offerJson),
                    weight: v.weight || 50,
                })),
            } : undefined,
            channelConfigs: channels?.length ? {
                create: channels.map(ch => ({
                    channel: ch.channel,
                    enabled: ch.enabled !== false,
                    templateBody: ch.templateBody || null,
                    providerConfig: ch.providerConfig || null,
                })),
            } : undefined,
        },
        include: { variants: true, channelConfigs: true },
    });

    return campaign;
};

const updateCampaign = async (id, data) => {
    const existing = await prisma.campaign.findUnique({ where: { id } });
    if (!existing) throw ApiError.notFound('Campaign not found');
    if (existing.status === 'ACTIVE') throw ApiError.badRequest('Cannot edit an active campaign. Pause it first.');

    const { variants, channels, ...campaignData } = data;

    // Update campaign fields
    if (campaignData.startDate) campaignData.startDate = new Date(campaignData.startDate);
    if (campaignData.endDate) campaignData.endDate = new Date(campaignData.endDate);

    const campaign = await prisma.campaign.update({
        where: { id },
        data: campaignData,
        include: { variants: true, channelConfigs: true },
    });

    // Replace variants if provided
    if (variants) {
        await prisma.variant.deleteMany({ where: { campaignId: id } });
        for (const v of variants) {
            await prisma.variant.create({
                data: {
                    campaignId: id,
                    label: v.label,
                    offerJson: typeof v.offerJson === 'string' ? v.offerJson : JSON.stringify(v.offerJson),
                    weight: v.weight || 50,
                },
            });
        }
    }

    // Replace channels if provided
    if (channels) {
        await prisma.channelConfig.deleteMany({ where: { campaignId: id } });
        for (const ch of channels) {
            await prisma.channelConfig.create({
                data: {
                    campaignId: id,
                    channel: ch.channel,
                    enabled: ch.enabled !== false,
                    templateBody: ch.templateBody || null,
                    providerConfig: ch.providerConfig || null,
                },
            });
        }
    }

    return getCampaign(id);
};

// ═══════════════════════════════════════════════
// CAMPAIGN LIFECYCLE
// ═══════════════════════════════════════════════

const activateCampaign = async (id) => {
    const campaign = await prisma.campaign.findUnique({
        where: { id },
        include: { variants: true, channelConfigs: true },
    });
    if (!campaign) throw ApiError.notFound('Campaign not found');
    if (campaign.status === 'ACTIVE') throw ApiError.badRequest('Campaign is already active.');
    if (campaign.variants.length === 0) throw ApiError.badRequest('Campaign needs at least one variant.');
    const enabledChannels = campaign.channelConfigs.filter(c => c.enabled);
    if (enabledChannels.length === 0) throw ApiError.badRequest('Enable at least one outreach channel.');

    // Validate variant weights sum to ~100
    const totalWeight = campaign.variants.reduce((s, v) => s + v.weight, 0);
    if (totalWeight < 95 || totalWeight > 105) {
        throw ApiError.badRequest(`Variant weights must sum to ~100%. Current total: ${totalWeight}%`);
    }

    return prisma.campaign.update({ where: { id }, data: { status: 'ACTIVE' } });
};

const pauseCampaign = async (id) => {
    const campaign = await prisma.campaign.findUnique({ where: { id } });
    if (!campaign) throw ApiError.notFound('Campaign not found');
    if (campaign.status !== 'ACTIVE') throw ApiError.badRequest('Only active campaigns can be paused.');
    return prisma.campaign.update({ where: { id }, data: { status: 'PAUSED' } });
};

const completeCampaign = async (id) => {
    return prisma.campaign.update({ where: { id }, data: { status: 'COMPLETED' } });
};

// ═══════════════════════════════════════════════
// EXECUTION — Trigger & Simulate
// ═══════════════════════════════════════════════

const triggerCampaign = async (id) => {
    const campaign = await prisma.campaign.findUnique({
        where: { id },
        include: { variants: true, channelConfigs: true, segment: true },
    });
    if (!campaign) throw ApiError.notFound('Campaign not found');

    // Get target customers
    let customers;
    if (campaign.segment) {
        let filter = {};
        try { filter = JSON.parse(campaign.segment.filterJson); } catch { /* empty */ }
        customers = await prisma.user.findMany({
            where: { role: 'CUSTOMER', ...filter },
            select: { id: true, name: true, email: true, phone: true },
        });
    } else {
        customers = await prisma.user.findMany({
            where: { role: 'CUSTOMER' },
            select: { id: true, name: true, email: true, phone: true },
        });
    }

    if (customers.length === 0) {
        return { sent: 0, message: 'No matching customers found for this segment.' };
    }

    const enabledChannels = campaign.channelConfigs.filter(c => c.enabled);
    const logs = [];

    for (const customer of customers) {
        // Assign variant based on weight (weighted random)
        const variant = pickVariant(campaign.variants);

        for (const ch of enabledChannels) {
            // Use shared delivery simulator
            const status = simulateDelivery(ch.channel);

            logs.push({
                campaignId: id,
                variantId: variant.id,
                channel: ch.channel,
                recipientId: customer.id,
                source: campaign.source || 'MANUAL',
                status: status,
                sentAt: status !== 'FAILED' ? new Date() : null,
                deliveredAt: status === 'DELIVERED' || status === 'OPENED' || status === 'CONVERTED' ? new Date() : null,
                openedAt: status === 'OPENED' || status === 'CONVERTED' ? new Date() : null,
                convertedAt: status === 'CONVERTED' ? new Date() : null,
                failReason: status === 'FAILED' ? 'Simulated failure for demo' : null,
            });
        }
    }

    // Bulk insert execution logs
    await prisma.executionLog.createMany({ data: logs });

    // Recalculate A/B results
    await recalculateABResults(id);

    return { sent: logs.length, delivered: logs.filter(l => l.status !== 'FAILED').length, failed: logs.filter(l => l.status === 'FAILED').length };
}

// ═══════════════════════════════════════════════
// NOTE: simulateDelivery now uses shared/deliverySimulator.js
// The old inline function has been removed.
// ═══════════════════════════════════════════════

function pickVariant(variants) {
    const totalWeight = variants.reduce((s, v) => s + v.weight, 0);
    let random = Math.random() * totalWeight;
    for (const v of variants) {
        random -= v.weight;
        if (random <= 0) return v;
    }
    return variants[variants.length - 1];
}

// ═══════════════════════════════════════════════
// A/B TEST RESULTS
// ═══════════════════════════════════════════════

const recalculateABResults = async (campaignId) => {
    const variants = await prisma.variant.findMany({ where: { campaignId } });

    for (const variant of variants) {
        const logs = await prisma.executionLog.findMany({
            where: { campaignId, variantId: variant.id },
        });

        const impressions = logs.length;
        const delivered = logs.filter(l => l.deliveredAt).length;
        const opened = logs.filter(l => l.openedAt).length;
        const conversions = logs.filter(l => l.convertedAt).length;
        const conversionRate = impressions > 0 ? conversions / impressions : 0;

        await prisma.aBTestResult.upsert({
            where: { campaignId_variantId: { campaignId, variantId: variant.id } },
            update: { impressions, delivered, opened, conversions, conversionRate, lastUpdatedAt: new Date() },
            create: { campaignId, variantId: variant.id, impressions, delivered, opened, conversions, conversionRate },
        });
    }
};

const getABResults = async (campaignId) => {
    return prisma.aBTestResult.findMany({
        where: { campaignId },
        include: { variant: { select: { label: true, weight: true } } },
    });
};

// ═══════════════════════════════════════════════
// EXECUTION LOGS
// ═══════════════════════════════════════════════

const getExecutionLogs = async (campaignId, query = {}) => {
    const where = { campaignId };
    if (query.channel) where.channel = query.channel;
    if (query.status) where.status = query.status;

    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 25;

    const [total, logs] = await Promise.all([
        prisma.executionLog.count({ where }),
        prisma.executionLog.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        }),
    ]);

    return { logs, total, page, pages: Math.ceil(total / limit) };
};

// ═══════════════════════════════════════════════
// DASHBOARD STATS
// ═══════════════════════════════════════════════

const getOutreachStats = async () => {
    const [totalCampaigns, activeCampaigns, totalSent, totalDelivered, totalOpened, totalConverted] = await Promise.all([
        prisma.campaign.count(),
        prisma.campaign.count({ where: { status: 'ACTIVE' } }),
        prisma.executionLog.count(),
        prisma.executionLog.count({ where: { status: { in: ['DELIVERED', 'OPENED', 'CONVERTED'] } } }),
        prisma.executionLog.count({ where: { status: { in: ['OPENED', 'CONVERTED'] } } }),
        prisma.executionLog.count({ where: { status: 'CONVERTED' } }),
    ]);

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentLogs = await prisma.executionLog.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        select: { createdAt: true, channel: true },
    });

    const trendsMap = {};
    recentLogs.forEach(log => {
        const dateStr = log.createdAt.toISOString().split('T')[0];
        if (!trendsMap[dateStr]) trendsMap[dateStr] = { WhatsApp: 0, SMS: 0, Email: 0, 'RM Call': 0, 'In-App': 0, Push: 0 };
        if (trendsMap[dateStr][log.channel] !== undefined) {
            trendsMap[dateStr][log.channel]++;
        }
    });

    let trendsData = Object.keys(trendsMap).sort().map((date, idx) => ({
        week: 'D'+(idx+1), 
        date, 
        ...trendsMap[date]
    }));

    if (trendsData.length === 0) {
        trendsData = [
            { week: 'D1', date: '2026-05-24', WhatsApp: 1200, SMS: 800, Email: 400, 'RM Call': 150, 'In-App': 500, Push: 300 },
            { week: 'D2', date: '2026-05-25', WhatsApp: 1350, SMS: 820, Email: 450, 'RM Call': 180, 'In-App': 600, Push: 400 },
            { week: 'D3', date: '2026-05-26', WhatsApp: 1500, SMS: 900, Email: 480, 'RM Call': 200, 'In-App': 650, Push: 450 },
            { week: 'D4', date: '2026-05-27', WhatsApp: 1100, SMS: 750, Email: 380, 'RM Call': 140, 'In-App': 480, Push: 250 },
            { week: 'D5', date: '2026-05-28', WhatsApp: 1800, SMS: 1100, Email: 600, 'RM Call': 220, 'In-App': 800, Push: 500 },
            { week: 'D6', date: '2026-05-29', WhatsApp: 2100, SMS: 1250, Email: 750, 'RM Call': 250, 'In-App': 950, Push: 600 },
            { week: 'D7', date: '2026-05-30', WhatsApp: 2400, SMS: 1400, Email: 900, 'RM Call': 280, 'In-App': 1100, Push: 750 }
        ];
    }

    const channelLogs = await prisma.executionLog.groupBy({
        by: ['channel', 'status'],
        _count: true
    });
    
    const cpMap = {};
    channelLogs.forEach(g => {
        if (!cpMap[g.channel]) cpMap[g.channel] = { sent: 0, delivered: 0, read: 0, clicked: 0, converted: 0, failed: 0 };
        cpMap[g.channel].sent += g._count;
        if (g.status === 'DELIVERED') cpMap[g.channel].delivered += g._count;
        if (g.status === 'OPENED') {
            cpMap[g.channel].delivered += g._count;
            cpMap[g.channel].read += g._count;
        }
        if (g.status === 'CONVERTED') {
            cpMap[g.channel].delivered += g._count;
            cpMap[g.channel].read += g._count;
            cpMap[g.channel].converted += g._count;
        }
        if (g.status === 'FAILED') cpMap[g.channel].failed += g._count;
    });

    let channelPerformance = Object.keys(cpMap).map(channel => {
        const d = cpMap[channel];
        return {
            channel,
            sent: d.sent,
            deliveredPct: d.sent > 0 ? (d.delivered/d.sent*100).toFixed(1) : 0,
            readPct: d.sent > 0 ? (d.read/d.sent*100).toFixed(1) : 0,
            clickedPct: 0,
            convertedPct: d.sent > 0 ? (d.converted/d.sent*100).toFixed(1) : 0,
            optOutPct: 0.1, 
            costPerConversion: 50 
        };
    });

    if (channelPerformance.length === 0) {
        channelPerformance = [
            { channel: 'WhatsApp', sent: 11450, deliveredPct: '94.2', readPct: '82.5', clickedPct: '45.8', convertedPct: '12.4', optOutPct: 0.5, costPerConversion: 14 },
            { channel: 'SMS', sent: 7020, deliveredPct: '98.1', readPct: '60.4', clickedPct: '15.2', convertedPct: '3.1', optOutPct: 1.2, costPerConversion: 42 },
            { channel: 'Email', sent: 3960, deliveredPct: '99.5', readPct: '35.8', clickedPct: '8.4', convertedPct: '1.5', optOutPct: 0.8, costPerConversion: 65 },
            { channel: 'RM Call', sent: 1420, deliveredPct: '68.5', readPct: '68.5', clickedPct: '42.1', convertedPct: '28.5', optOutPct: 0.2, costPerConversion: 125 },
            { channel: 'In-App', sent: 5080, deliveredPct: '100.0', readPct: '45.2', clickedPct: '18.6', convertedPct: '5.2', optOutPct: 0.1, costPerConversion: 0 },
            { channel: 'Push', sent: 3250, deliveredPct: '85.4', readPct: '24.1', clickedPct: '6.5', convertedPct: '2.1', optOutPct: 2.4, costPerConversion: 0 }
        ];
    }

    return {
        totalCampaigns,
        activeCampaigns,
        totalSent,
        totalDelivered,
        totalConverted,
        deliveryRate: totalSent > 0 ? ((totalDelivered / totalSent) * 100).toFixed(1) : '0',
        conversionRate: totalSent > 0 ? ((totalConverted / totalSent) * 100).toFixed(1) : '0',
        funnelData: [
            { name: 'Sent', value: totalSent, fill: '#3b82f6' },
            { name: 'Delivered', value: totalDelivered, fill: '#06b6d4' },
            { name: 'Opened', value: totalOpened, fill: '#8b5cf6' },
            { name: 'Converted', value: totalConverted, fill: '#10b981' },
        ],
        trendsData,
        channelPerformance,
        suppressedCustomers: [],
        approvalChain: []
    };
};

module.exports = {
    getSegments, createSegment, getSegmentCustomers,
    getCampaigns, getCampaign, createCampaign, updateCampaign,
    activateCampaign, pauseCampaign, completeCampaign,
    triggerCampaign, recalculateABResults, getABResults,
    getExecutionLogs, getOutreachStats,
};
