/**
 * ADMIN — Customer 360 Service
 * Aggregated per-customer data for the admin Customer360 dashboard.
 * Pulls from: core, signal, retention, complaints, sage modules.
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const ApiError = require('../../utils/apiError');

/**
 * Get full Customer 360 profile for admin view.
 * Returns: customer info, financial profile, health score.
 */
const getCustomer360Profile = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true, name: true, email: true, phone: true, role: true,
            accountNumber: true, branchName: true, accountType: true,
            kycStatus: true, isActive: true, createdAt: true,
            financialProfile: true,
        },
    });
    if (!user) throw ApiError.notFound('Customer not found');

    // Health score (if calculated)
    const healthScore = await prisma.customerHealthScore.findUnique({
        where: { userId },
    });

    // Latest churn report summary
    const latestReport = await prisma.churnReport.findFirst({
        where: { userId },
        orderBy: { generatedAt: 'desc' },
        select: {
            id: true, overallRisk: true, riskLevel: true,
            churnProbability: true, generatedAt: true,
        },
    });

    return { customer: user, healthScore, latestReport };
};

/**
 * Get transactions for a specific customer (admin view).
 */
const getCustomer360Transactions = async (userId, query = {}) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 20;
    const skip = (page - 1) * limit;
    const where = { userId };
    if (query.category) where.category = query.category;
    if (query.type) where.type = query.type;

    const [transactions, total] = await Promise.all([
        prisma.transaction.findMany({
            where, orderBy: { transactionDate: 'desc' }, skip, take: limit,
        }),
        prisma.transaction.count({ where }),
    ]);

    return { transactions, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

/**
 * Get complaints for a specific customer (admin view).
 */
const getCustomer360Complaints = async (userId) => {
    return prisma.complaint.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 50,
    });
};

/**
 * Get SAGE conversations for a specific customer (admin view).
 */
const getCustomer360SageHistory = async (userId) => {
    return prisma.sageConversation.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 30,
        select: {
            id: true, topic: true, userMessage: true, sageResponse: true,
            helpful: true, createdAt: true,
        },
    });
};

/**
 * Get retention offers + journeys for a specific customer (admin view).
 */
const getCustomer360Retention = async (userId) => {
    const [offers, journeys] = await Promise.all([
        prisma.retentionOffer.findMany({
            where: { userId },
            include: { offerLibrary: { select: { name: true, category: true, tier: true } } },
            orderBy: { createdAt: 'desc' },
            take: 20,
        }),
        prisma.retentionJourney.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 20,
        }),
    ]);
    return { offers, journeys };
};

/**
 * Get outreach/execution logs for a specific customer (admin view).
 */
const getCustomer360Outreach = async (userId) => {
    return prisma.executionLog.findMany({
        where: { recipientId: userId },
        include: {
            campaign: { select: { id: true, name: true, status: true } },
            variant: { select: { id: true, label: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 30,
    });
};

/**
 * Get signals timeline for a specific customer (admin view).
 */
const getCustomer360Signals = async (userId, days = 90) => {
    const since = new Date(Date.now() - days * 86400000);
    return prisma.customerSignal.findMany({
        where: { userId, timestamp: { gte: since } },
        orderBy: { timestamp: 'desc' },
        take: 100,
    });
};

/**
 * Get product portfolio for a specific customer (admin view).
 * Generates deterministic per-customer holdings from real financial data.
 * Each customer gets a unique portfolio based on their balance, income, and risk.
 */
const getCustomer360Products = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, createdAt: true },
    });
    if (!user) throw ApiError.notFound('Customer not found');

    const fp = await prisma.financialProfile.findUnique({ where: { userId } });
    const balance = fp?.currentBalance ?? 50000;
    const income = fp?.monthlyIncome ?? 45000;
    const expenses = fp?.monthlyExpenses ?? 30000;
    const riskScore = fp?.riskScore ?? 0.3;

    // Deterministic seed from userId
    const seed = userId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const r = (n) => ((seed * 9301 + 49297 + n * 7919) % 233280) / 233280; // 0-1 range

    const accountAgeDays = Math.floor((Date.now() - new Date(user.createdAt).getTime()) / 86400000);
    const isHighValue = balance > 300000 || income > 80000;
    const savingsRate = Math.max(0, income - expenses);

    // Count transaction categories to infer product usage
    const txnCounts = await prisma.transaction.groupBy({
        by: ['category'],
        where: { userId },
        _count: true,
    });
    const txnMap = txnCounts.reduce((a, t) => { a[t.category] = t._count; return a; }, {});
    const hasSipTxns = (txnMap.SIP || 0) + (txnMap.SIP_CANCEL || 0) > 0;
    const hasEmiTxns = (txnMap.EMI || 0) > 0;
    const hasInsurance = (txnMap.INSURANCE || 0) > 0;

    const products = [];

    // 1. Savings Account (everyone has one)
    const savingsBalance = balance > 0 ? balance : 25000 + Math.floor(r(1) * 50000);
    const savingsTrend = riskScore > 0.6 ? 'down' : riskScore > 0.3 ? 'neutral' : 'up';
    const savingsChange = savingsTrend === 'down' ? `-${(10 + Math.floor(r(2) * 20))}%` : savingsTrend === 'up' ? `+${(5 + Math.floor(r(3) * 12))}%` : '0%';
    products.push({
        name: 'Savings Account', type: 'SAVINGS', balance: savingsBalance,
        trend: savingsTrend, change: savingsChange, maturity: null, status: 'Active',
        sparkline: Array.from({ length: 8 }, (_, i) => Math.max(1, savingsBalance / 10000 + (savingsTrend === 'down' ? (7 - i) * 0.5 : i * 0.3) + r(i + 10) * 2)),
    });

    // 2. Fixed Deposit (if savings > 100k or high-value)
    if (balance > 100000 || isHighValue) {
        const fdAmount = Math.round((balance * (0.3 + r(20) * 0.3)) / 10000) * 10000;
        const maturityDate = new Date(Date.now() + (90 + Math.floor(r(21) * 270)) * 86400000);
        const daysToMaturity = Math.floor((maturityDate - Date.now()) / 86400000);
        products.push({
            name: `Fixed Deposit - ${daysToMaturity < 90 ? '6M' : '1Y'}`, type: 'FD',
            balance: fdAmount, trend: 'neutral', change: '0%',
            maturity: maturityDate.toISOString().split('T')[0],
            status: daysToMaturity < 30 ? 'Maturing Soon' : 'Active',
            sparkline: Array.from({ length: 8 }, () => fdAmount / 100000),
        });
    }

    // 3. SIP / Mutual Fund (if has SIP transactions or savingsRate > 10k)
    if (hasSipTxns || savingsRate > 10000) {
        const sipAmount = Math.round((savingsRate * (0.15 + r(30) * 0.2)) / 500) * 500;
        const isCancelled = riskScore > 0.7 && r(31) > 0.4;
        products.push({
            name: `SIP - ${['HDFC Mid Cap', 'Axis Bluechip', 'SBI Small Cap', 'ICICI Pru Value'][seed % 4]}`,
            type: 'SIP', balance: isCancelled ? 0 : sipAmount * (6 + Math.floor(r(32) * 18)),
            trend: isCancelled ? 'down' : 'up', change: isCancelled ? 'Cancelled' : `+${(8 + Math.floor(r(33) * 14))}%`,
            maturity: null, status: isCancelled ? 'Cancelled' : 'Active',
            sparkline: isCancelled
                ? [15, 15, 15, 15, 0, 0, 0, 0]
                : Array.from({ length: 8 }, (_, i) => sipAmount / 1000 * (1 + i * 0.08 + r(34 + i) * 0.1)),
        });
    }

    // 4. Loan (if has EMI transactions)
    if (hasEmiTxns) {
        const loanTypes = ['Car Loan', 'Personal Loan', 'Home Loan', 'Education Loan'];
        const loanType = loanTypes[seed % 4];
        const outstandingBase = loanType === 'Home Loan' ? 2500000 : loanType === 'Car Loan' ? 680000 : 350000;
        const outstanding = Math.round(outstandingBase * (0.4 + r(40) * 0.6));
        products.push({
            name: loanType, type: 'LOAN', balance: -outstanding,
            trend: 'down', change: 'EMI Regular',
            maturity: new Date(Date.now() + (365 + Math.floor(r(41) * 730)) * 86400000).toISOString().split('T')[0],
            status: 'Active',
            sparkline: Array.from({ length: 8 }, (_, i) => outstanding / 100000 * (1 - i * 0.04)),
        });
    }

    // 5. Credit Card (65% chance for any customer)
    if (r(50) > 0.35) {
        const ccBalance = Math.round((expenses * (0.2 + r(51) * 0.4)) / 100) * 100;
        products.push({
            name: `Credit Card - ${['Platinum', 'Gold', 'Signature', 'Classic'][seed % 4]}`,
            type: 'CARD', balance: -ccBalance,
            trend: riskScore > 0.5 ? 'up' : 'neutral', change: riskScore > 0.5 ? `+${Math.floor(r(52) * 15)}%` : 'Stable',
            maturity: null, status: 'Active',
            sparkline: Array.from({ length: 8 }, (_, i) => ccBalance / 10000 + r(53 + i) * 0.5),
        });
    }

    // 6. Insurance (if has insurance transactions or high-value)
    if (hasInsurance || isHighValue) {
        const coverAmount = Math.round((income * 12 * (5 + r(60) * 10)) / 100000) * 100000;
        products.push({
            name: `Term Life Insurance`, type: 'INSURANCE', balance: coverAmount,
            trend: 'neutral', change: 'Premium Paid',
            maturity: new Date(Date.now() + (300 + Math.floor(r(61) * 65)) * 86400000).toISOString().split('T')[0],
            status: 'Active',
            sparkline: Array.from({ length: 8 }, () => 5),
        });
    }

    return { products, source: 'derived', basedOn: { balance, income, expenses, riskScore, accountAgeDays } };
};

module.exports = {
    getCustomer360Profile,
    getCustomer360Transactions,
    getCustomer360Complaints,
    getCustomer360SageHistory,
    getCustomer360Retention,
    getCustomer360Outreach,
    getCustomer360Signals,
    getCustomer360Products,
};
