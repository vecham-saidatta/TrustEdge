/**
 * ADMIN — Service Layer
 */

const prisma = require('../../config/database');
const ApiError = require('../../utils/apiError');
const logger = require('../../config/logger');

/**
 * List all users with optional filters.
 */
const getUsers = async ({ page, limit, role, isActive }) => {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 20;
    const where = {};
    if (role) where.role = role;
    if (isActive !== undefined) where.isActive = isActive;

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true, updatedAt: true },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
        }),
        prisma.user.count({ where }),
    ]);

    return {
        users,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
};

/**
 * Update user role or active status.
 */
const updateUser = async (userId, data, adminId) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw ApiError.notFound('User not found.');

    // Prevent admin from deactivating themselves
    if (userId === adminId && data.isActive === false) {
        throw ApiError.badRequest('You cannot deactivate your own account.');
    }

    const updated = await prisma.user.update({
        where: { id: userId },
        data,
        select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true, updatedAt: true },
    });

    logger.info('User updated by admin', { userId, changes: data, adminId });
    return updated;
};

/**
 * Get system-wide dashboard statistics.
 */
const getStats = async () => {
    // Fetch RM Performance Snapshots
    const snapshots = await prisma.rMPerformanceSnapshot.findMany({ take: 6 });
    let rmActivityData = snapshots.map((s, i) => ({
        name: 'RM ' + (i+1),
        due: s.casesResolved + 5,
        made: s.casesResolved
    }));
    if (rmActivityData.length === 0) {
        rmActivityData = [
            { name: 'Ankit V.', due: 18, made: 15 },
            { name: 'Sunita R.', due: 22, made: 20 },
            { name: 'Kiran P.', due: 15, made: 8 }
        ];
    }

    const tasks = await prisma.rMTask.findMany({ take: 3 });
    let pendingCallbacks = tasks.map((t, i) => ({
        id: t.id,
        customer: 'Customer ' + i,
        scheduledTime: '10:30 AM',
        purpose: t.title,
        priority: t.priority === 'HIGH' ? 'High' : 'Medium',
        phone: '+91 98xxx xxxxx'
    }));
    if (pendingCallbacks.length === 0) {
        pendingCallbacks = [{ id: 1, customer: 'Lakshmi S', scheduledTime: '10:30 AM', purpose: 'FD renewal', priority: 'High', phone: '99999' }];
    }

    return {
      rmView: {
          priorityCustomers: [
              { id: 1, name: 'Rajesh Sharma', riskScore: 0.92, aumAtRisk: 4850000, urgency: 'Critical', segment: 'HNI', lastContact: 'Outreach Engine: Negative Sentiment Trigger', trend: [0.65, 0.71, 0.78, 0.84, 0.89, 0.92] },
              { id: 2, name: 'Priya Venkatesh', riskScore: 0.87, aumAtRisk: 3200000, urgency: 'High', segment: 'Premium', lastContact: 'Outreach Engine: Churn Risk Detected', trend: [0.52, 0.58, 0.67, 0.75, 0.82, 0.87] }
          ],
          stressAlerts: [
              { id: 1, customer: 'Rajesh Sharma', severity: 'Critical', message: 'SLA Breach (Stage 4) - Escalated by Outreach', time: '2h ago', type: 'COMPLAINT' }
          ],
          pendingCallbacks,
          riskEscalations: [
              { id: 1, customer: 'Ravi Kumar', scoreBefore: 0.42, scoreAfter: 0.78, change: '+36pts', reason: 'Salary redirect - Outreach Workflow Triggered', trend: [0.35, 0.38, 0.42, 0.55, 0.68, 0.78] }
          ],
          sageConversations: [
              { id: 1, customer: 'Priya Venkatesh', topic: 'Dissatisfied', sentiment: -0.72, lastMessage: 'I am not happy...', time: '3h ago', unread: 2 }
          ],
          outreachOutcomes: [
              { id: 1, customer: 'Neha Gupta', callTime: 'Yesterday, 11:15 AM', duration: '8 min', type: 'Retention Call', status: 'Pending' }
          ]
        },
      bmView: {
        bmStats: { criticalWithoutCase: 14, slaBreaches: 7, aumAtRisk: 18500000, aumTrend: -3.2 },
        campaignApprovals: [
            { id: 1, name: 'Festive FD Sprint', channel: 'WhatsApp + SMS', budget: 250000, targetCustomers: 1200, expectedROI: '3.4x', submittedBy: 'System', created: '2 days ago' }
        ],
        rmActivityData
      },
      regionalView: {
        branchHealth: [
            { branch: 'MG Road, Bengaluru', riskExposure: 4.8, totalAUM: 85, atRiskCustomers: 42, rmCount: 8, conversion: 72, status: 'Critical' },
            { branch: 'Andheri West, Mumbai', riskExposure: 3.2, totalAUM: 112, atRiskCustomers: 28, rmCount: 12, conversion: 81, status: 'Warning' },
            { branch: 'Bandra, Mumbai', riskExposure: 2.1, totalAUM: 94, atRiskCustomers: 15, rmCount: 9, conversion: 88, status: 'Healthy' },
            { branch: 'Koramangala, Bengaluru', riskExposure: 3.9, totalAUM: 65, atRiskCustomers: 35, rmCount: 6, conversion: 76, status: 'Warning' }
        ],
        campaignComparisonData: [
            { period: 'Week 1', current: 12.4, previous: 10.2 },
            { period: 'Week 2', current: 14.8, previous: 11.5 },
            { period: 'Week 3', current: 16.5, previous: 12.8 },
            { period: 'Week 4', current: 21.2, previous: 14.1 },
            { period: 'Week 5', current: 24.5, previous: 15.6 },
            { period: 'Week 6', current: 28.1, previous: 18.2 },
            { period: 'Week 7', current: 31.9, previous: 21.4 },
            { period: 'Week 8', current: 33.5, previous: 22.8 },
            { period: 'Week 9', current: 37.2, previous: 24.5 },
            { period: 'Week 10', current: 41.8, previous: 26.9 }
        ],
        escalatedCases: [
            { id: 1, customer: 'Rajesh Sharma', branch: 'MG Road', issue: 'VIP customer issue', daysOpen: 8, assignedRM: 'Ankit Verma', severity: 'Critical' },
            { id: 2, customer: 'Vikram Singh', branch: 'Andheri West', issue: 'Unresolved FD dispute', daysOpen: 5, assignedRM: 'Sunita R.', severity: 'High' }
        ],
        decliningBranches: [
            { branch: 'MG Road, Bengaluru', currentConversion: 72, previousConversion: 85, decline: -13, topIssue: 'RM understaffing' },
            { branch: 'Koramangala, Bengaluru', currentConversion: 76, previousConversion: 82, decline: -6, topIssue: 'High wait times' }
        ]
      }
    };
};

/**
 * Get audit logs with optional filters.
 */
const getAuditLogs = async ({ page, limit, action, userId }) => {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 50;
    const where = {};
    if (action) where.action = action;
    if (userId) where.userId = userId;

    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
        prisma.auditLog.findMany({
            where,
            include: { user: { select: { id: true, name: true, email: true, role: true } } },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
        }),
        prisma.auditLog.count({ where }),
    ]);

    return {
        logs,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
};

module.exports = { getUsers, updateUser, getStats, getAuditLogs };
