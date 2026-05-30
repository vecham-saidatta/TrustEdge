/**
 * TRUSTEDGE CORE — Service Layer
 * 
 * Business logic for:
 * - Financial profile retrieval
 * - Transaction history with filters
 * - Stress alert management
 * - Rule-based stress analysis engine
 */

const prisma = require('../../config/database');
const ApiError = require('../../utils/apiError');
const logger = require('../../config/logger');

/**
 * Get financial profile for a customer.
 */
const getProfile = async (userId) => {
    const profile = await prisma.financialProfile.findUnique({
        where: { userId },
    });

    if (!profile) {
        throw ApiError.notFound('No financial profile found. Please contact support.');
    }

    return profile;
};

/**
 * Get paginated transactions with optional filters.
 */
const getTransactions = async (userId, { page, limit, category, type }) => {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 20;
    const where = { userId };
    if (category) where.category = category;
    if (type) where.type = type;

    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
        prisma.transaction.findMany({
            where,
            orderBy: { transactionDate: 'desc' },
            skip,
            take: limit,
        }),
        prisma.transaction.count({ where }),
    ]);

    return {
        transactions,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

/**
 * Get stress alerts — role-aware:
 * CUSTOMER: own alerts only
 * EMPLOYEE: alerts assigned to them
 * ADMIN: all alerts
 */
const getAlerts = async (user, { page, limit, status, severity }) => {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 20;
    const where = {};

    // Role-based filtering
    if (user.role === 'CUSTOMER') {
        where.userId = user.id;
    } else if (user.role === 'EMPLOYEE') {
        where.assignedEmployeeId = user.id;
    }
    // ADMIN sees all — no filter

    if (status) where.status = status;
    if (severity) where.severity = severity;

    const skip = (page - 1) * limit;

    const [alerts, total] = await Promise.all([
        prisma.stressAlert.findMany({
            where,
            include: {
                customer: { select: { id: true, name: true, email: true, role: true } },
                employee: { select: { id: true, name: true, email: true, role: true } },
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
        }),
        prisma.stressAlert.count({ where }),
    ]);

    return {
        alerts,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

/**
 * Update alert status (Employee/Admin only).
 */
const updateAlert = async (alertId, userId, userRole, { status }) => {
    const alert = await prisma.stressAlert.findUnique({ where: { id: alertId } });

    if (!alert) {
        throw ApiError.notFound('Alert not found.');
    }

    // Employee can only update their assigned alerts
    if (userRole === 'EMPLOYEE' && alert.assignedEmployeeId !== userId) {
        throw ApiError.forbidden('You can only update alerts assigned to you.');
    }

    const updateData = { status };
    if (status === 'RESOLVED') {
        updateData.resolvedAt = new Date();
    }

    const updated = await prisma.stressAlert.update({
        where: { id: alertId },
        data: updateData,
        include: {
            customer: { select: { id: true, name: true, email: true } },
            employee: { select: { id: true, name: true, email: true } },
        },
    });

    logger.info('Alert updated', { alertId, status, updatedBy: userId });
    return updated;
};

/**
 * Run stress analysis on a customer's recent transactions.
 * This is the rule-based engine (MVP — no ML).
 * 
 * Rules:
 * 1. SALARY_DROP: Salary decreased >15% month-over-month
 * 2. EMERGENCY_WITHDRAWAL: 3+ emergency withdrawals in 7 days
 * 3. MIN_PAYMENT_REPEAT: (simulated) 
 * 4. LOW_BALANCE: Balance below ₹10,000 for 5+ days
 */
const analyzeStress = async (customerId, triggeredBy) => {
    // Verify customer exists
    const customer = await prisma.user.findUnique({ where: { id: customerId } });
    if (!customer || customer.role !== 'CUSTOMER') {
        throw ApiError.notFound('Customer not found.');
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Fetch recent transactions
    const transactions = await prisma.transaction.findMany({
        where: {
            userId: customerId,
            transactionDate: { gte: thirtyDaysAgo },
        },
        orderBy: { transactionDate: 'desc' },
    });

    const patterns = [];
    let maxSeverity = 'LOW';
    const severityRank = { LOW: 1, MODERATE: 2, HIGH: 3, CRITICAL: 4 };

    // Rule 1: Salary drop detection
    const salaries = transactions
        .filter((t) => t.category === 'SALARY' && t.type === 'CREDIT')
        .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate));

    if (salaries.length >= 2) {
        const latest = salaries[0].amount;
        const previous = salaries[1].amount;
        const dropPercent = ((previous - latest) / previous) * 100;

        if (dropPercent > 15) {
            const severity = dropPercent > 30 ? 'CRITICAL' : dropPercent > 20 ? 'HIGH' : 'MODERATE';
            patterns.push({
                type: 'SALARY_DROP',
                severity,
                detail: `Salary dropped by ${dropPercent.toFixed(1)}% (₹${previous.toLocaleString()} → ₹${latest.toLocaleString()})`,
            });
            if (severityRank[severity] > severityRank[maxSeverity]) maxSeverity = severity;
        }
    }

    // Rule 2: Emergency withdrawal frequency
    const emergencyWithdrawals = transactions.filter(
        (t) => t.category === 'EMERGENCY' && t.type === 'DEBIT' && new Date(t.transactionDate) >= sevenDaysAgo
    );

    if (emergencyWithdrawals.length >= 3) {
        const total = emergencyWithdrawals.reduce((sum, t) => sum + t.amount, 0);
        const severity = emergencyWithdrawals.length >= 5 ? 'CRITICAL' : 'MODERATE';
        patterns.push({
            type: 'EMERGENCY_WITHDRAWAL',
            severity,
            detail: `${emergencyWithdrawals.length} emergency withdrawals in 7 days totaling ₹${total.toLocaleString()}`,
        });
        if (severityRank[severity] > severityRank[maxSeverity]) maxSeverity = severity;
    }

    // Rule 3: High expense ratio
    const totalIncome = transactions.filter((t) => t.type === 'CREDIT').reduce((s, t) => s + t.amount, 0);
    const totalExpense = transactions.filter((t) => t.type === 'DEBIT').reduce((s, t) => s + t.amount, 0);

    if (totalIncome > 0 && totalExpense / totalIncome > 0.9) {
        const ratio = ((totalExpense / totalIncome) * 100).toFixed(1);
        const severity = totalExpense > totalIncome ? 'HIGH' : 'MODERATE';
        patterns.push({
            type: 'LARGE_EXPENSE',
            severity,
            detail: `Expenses are ${ratio}% of income this month. Spending exceeds safe limits.`,
        });
        if (severityRank[severity] > severityRank[maxSeverity]) maxSeverity = severity;
    }

    // Calculate risk score (0.0 to 1.0)
    const riskScore = Math.min(patterns.length * 0.25 + (severityRank[maxSeverity] * 0.15), 1.0);

    // Create alerts for detected patterns
    let alertsGenerated = 0;
    for (const pattern of patterns) {
        await prisma.stressAlert.create({
            data: {
                userId: customerId,
                alertType: pattern.type,
                severity: pattern.severity,
                message: pattern.detail,
                status: 'OPEN',
            },
        });
        alertsGenerated++;
    }

    // Update financial profile
    await prisma.financialProfile.upsert({
        where: { userId: customerId },
        update: {
            riskScore,
            stressLevel: maxSeverity,
            lastAssessedAt: now,
        },
        create: {
            userId: customerId,
            riskScore,
            stressLevel: maxSeverity,
            lastAssessedAt: now,
        },
    });

    logger.info('Stress analysis complete', { customerId, riskScore, patterns: patterns.length, triggeredBy });

    return {
        stressLevel: maxSeverity,
        riskScore: parseFloat(riskScore.toFixed(2)),
        alertsGenerated,
        patterns,
    };
};

module.exports = {
    getProfile,
    getTransactions,
    getAlerts,
    updateAlert,
    analyzeStress,
};
