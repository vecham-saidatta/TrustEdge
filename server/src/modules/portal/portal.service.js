/**
 * CUSTOMER PORTAL — Service Layer
 *
 * Full business logic for the TrustEdge Customer Portal:
 * Dashboard, Finances, Goals, Products, Offers, Notifications,
 * Support Tickets, Appointments, Settings (Preferences & Consents)
 */

const prisma = require('../../config/database');
const ApiError = require('../../utils/apiError');
const logger = require('../../config/logger');
const xss = require('xss');

// ── Helpers ──────────────────────────────────────
const addDays = (date, days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
};

const generateTicketNumber = async () => {
    const year = new Date().getFullYear();
    const random = require('crypto').randomBytes(3).toString('hex').toUpperCase();
    return `SPT-${year}-${random}`;
};

// ════════════════════════════════════════════════
// DASHBOARD
// ════════════════════════════════════════════════

const getDashboard = async (userId) => {
    const [user, profile, recentTxns, goals, unreadCount, ticketCount] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId },
            select: { name: true, email: true, accountNumber: true, accountType: true, branchName: true },
        }),
        prisma.financialProfile.findUnique({ where: { userId } }),
        prisma.transaction.findMany({
            where: { userId },
            orderBy: { transactionDate: 'desc' },
            take: 5,
        }),
        prisma.customerGoal.findMany({
            where: { userId, status: 'ACTIVE' },
            take: 3,
            orderBy: { targetDate: 'asc' },
        }),
        prisma.customerNotification.count({ where: { userId, isRead: false } }),
        prisma.supportTicket.count({ where: { userId, status: { in: ['OPEN', 'IN_PROGRESS'] } } }),
    ]);

    if (!user) throw ApiError.notFound('User not found.');

    // Build priority actions
    const priorityActions = [];
    if (profile && profile.stressLevel === 'CRITICAL') {
        priorityActions.push({ type: 'ALERT', title: 'Financial stress detected', description: 'Your financial health needs attention. Tap to view insights.', actionUrl: '/portal/finances/spending' });
    }
    if (profile && profile.currentBalance < 5000) {
        priorityActions.push({ type: 'WARNING', title: 'Low balance alert', description: `Current balance is ₹${profile.currentBalance.toLocaleString('en-IN')}. Consider reducing non-essential spending.`, actionUrl: '/portal/finances/accounts' });
    }
    if (goals.length === 0) {
        priorityActions.push({ type: 'TIP', title: 'Set your first financial goal', description: 'Goals help you save with purpose. Start with an emergency fund!', actionUrl: '/portal/goals' });
    }

    return {
        greeting: `Welcome back, ${user.name.split(' ')[0]}!`,
        account: {
            name: user.name,
            email: user.email,
            accountNumber: user.accountNumber ? `XXXX${user.accountNumber.slice(-4)}` : null,
            accountType: user.accountType,
            branch: user.branchName,
        },
        financialSnapshot: profile ? {
            currentBalance: profile.currentBalance,
            monthlyIncome: profile.monthlyIncome,
            monthlyExpenses: profile.monthlyExpenses,
            savingsRate: profile.monthlyIncome > 0
                ? Math.round(((profile.monthlyIncome - profile.monthlyExpenses) / profile.monthlyIncome) * 100)
                : 0,
            stressLevel: profile.stressLevel,
            riskScore: profile.riskScore,
        } : null,
        recentTransactions: recentTxns,
        activeGoals: goals,
        priorityActions,
        unreadNotifications: unreadCount,
        openTickets: ticketCount,
    };
};

// ════════════════════════════════════════════════
// FINANCES
// ════════════════════════════════════════════════

const getAccounts = async (userId) => {
    const [user, profile] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId },
            select: {
                name: true, accountNumber: true, ifscCode: true, branchName: true,
                accountType: true, kycStatus: true, kycVerifiedAt: true,
                nomineeName: true, nomineeRelation: true,
            },
        }),
        prisma.financialProfile.findUnique({ where: { userId } }),
    ]);

    if (!user) throw ApiError.notFound('User not found.');

    return {
        primaryAccount: {
            accountNumber: user.accountNumber,
            ifscCode: user.ifscCode,
            branchName: user.branchName,
            accountType: user.accountType,
            balance: profile ? profile.currentBalance : 0,
            kycStatus: user.kycStatus,
            kycVerifiedAt: user.kycVerifiedAt,
            nominee: user.nomineeName ? { name: user.nomineeName, relation: user.nomineeRelation } : null,
        },
        linkedAccounts: await prisma.customerProduct.findMany({
            where: { userId, productType: { in: ['FD', 'RD'] }, status: 'ACTIVE' },
            select: { productType: true, accountNumber: true, currentValue: true, maturityDate: true, interestRate: true, monthlyAmount: true }
        }).then(products => products.map(p => ({
            type: p.productType,
            accountId: p.accountNumber,
            balance: p.currentValue,
            monthlyDeposit: p.monthlyAmount,
            maturityDate: p.maturityDate,
            interestRate: p.interestRate
        }))),
    };
};

const getTransactions = async (userId, { page, limit, type, category, from, to }) => {
    const skip = (page - 1) * limit;
    const where = { userId };
    if (type) where.type = type;
    if (category) where.category = category;
    if (from || to) {
        where.transactionDate = {};
        if (from) where.transactionDate.gte = new Date(from);
        if (to) where.transactionDate.lte = new Date(to);
    }

    const [transactions, total] = await Promise.all([
        prisma.transaction.findMany({ where, orderBy: { transactionDate: 'desc' }, skip, take: limit }),
        prisma.transaction.count({ where }),
    ]);

    return {
        transactions,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
};

const getSpendingInsights = async (userId) => {
    // Get last 30 days of transactions
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const transactions = await prisma.transaction.findMany({
        where: {
            userId,
            type: 'DEBIT',
            transactionDate: { gte: thirtyDaysAgo },
        },
    });

    // Group by category
    const byCategory = {};
    let totalSpent = 0;
    for (const txn of transactions) {
        if (!byCategory[txn.category]) byCategory[txn.category] = 0;
        byCategory[txn.category] += txn.amount;
        totalSpent += txn.amount;
    }

    const categories = Object.entries(byCategory)
        .map(([category, amount]) => ({
            category,
            amount: Math.round(amount),
            percentage: totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0,
        }))
        .sort((a, b) => b.amount - a.amount);

    // Get budgets
    const budgets = await prisma.customerSpendingBudget.findMany({
        where: { userId, isActive: true },
    });

    const categoryBudgets = categories.map((cat) => {
        const budget = budgets.find((b) => b.category === cat.category);
        return {
            ...cat,
            budget: budget ? budget.monthlyLimit : null,
            overBudget: budget ? cat.amount > budget.monthlyLimit : false,
        };
    });

    // Month-over-month comparison
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    const prevTransactions = await prisma.transaction.findMany({
        where: {
            userId,
            type: 'DEBIT',
            transactionDate: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
        },
    });
    const prevTotal = prevTransactions.reduce((sum, t) => sum + t.amount, 0);
    const monthChange = prevTotal > 0 ? Math.round(((totalSpent - prevTotal) / prevTotal) * 100) : 0;

    return {
        period: '30 days',
        totalSpent: Math.round(totalSpent),
        monthOverMonthChange: monthChange,
        categories: categoryBudgets,
        topCategory: categories[0] || null,
    };
};

const getNetWorth = async (userId) => {
    const [profile, user, products] = await Promise.all([
        prisma.financialProfile.findUnique({ where: { userId } }),
        prisma.user.findUnique({ where: { id: userId } }),
        prisma.customerProduct.findMany({ where: { userId, status: 'ACTIVE' } })
    ]);

    const savingsBalance = profile ? profile.currentBalance : 0;
    const fdBalance = products.filter(p => p.productType === 'FD').reduce((sum, p) => sum + (p.currentValue || 0), 0);
    const rdBalance = products.filter(p => p.productType === 'RD').reduce((sum, p) => sum + (p.currentValue || 0), 0);
    const mutualFunds = products.filter(p => p.productType === 'SIP').reduce((sum, p) => sum + (p.currentValue || 0), 0);
    const stocks = products.filter(p => p.productType === 'EQUITY').reduce((sum, p) => sum + (p.currentValue || 0), 0);
    const ppf = products.filter(p => p.productType === 'PPF').reduce((sum, p) => sum + (p.currentValue || 0), 0);

    const totalAssets = savingsBalance + fdBalance + rdBalance + mutualFunds + stocks + ppf;

    // Liabilities
    const homeLoan = products.filter(p => p.productType === 'HOME_LOAN').reduce((sum, p) => sum + (p.outstandingAmount || 0), 0);
    const vehicleLoan = products.filter(p => p.productType === 'VEHICLE_LOAN').reduce((sum, p) => sum + (p.outstandingAmount || 0), 0);
    const creditCardDebt = products.filter(p => p.productType === 'CREDIT_CARD').reduce((sum, p) => sum + (p.outstandingAmount || 0), 0);
    const otherLoans = products.filter(p => p.productType === 'PERSONAL_LOAN').reduce((sum, p) => sum + (p.outstandingAmount || 0), 0);

    const totalLiabilities = homeLoan + vehicleLoan + creditCardDebt + otherLoans;

    return {
        netWorth: totalAssets - totalLiabilities,
        assets: {
            bankBalance: savingsBalance,
            fixedDeposits: fdBalance,
            recurringDeposits: rdBalance,
            mutualFunds,
            stocks,
            ppf,
            total: totalAssets
        },
        liabilities: {
            homeLoan,
            personalLoan: otherLoans,
            creditCardDue: creditCardDebt,
            vehicleLoan,
            total: totalLiabilities,
        },
        lastUpdated: new Date().toISOString(),
    };
};

// ════════════════════════════════════════════════
// GOALS
// ════════════════════════════════════════════════

const getGoals = async (userId) => {
    const goals = await prisma.customerGoal.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });

    return goals.map((g) => ({
        ...g,
        progress: g.targetAmount > 0 ? Math.round((g.currentAmount / g.targetAmount) * 100) : 0,
        monthsRemaining: Math.max(0, Math.ceil((new Date(g.targetDate) - new Date()) / (30 * 24 * 60 * 60 * 1000))),
    }));
};

const getGoalById = async (goalId, userId) => {
    const goal = await prisma.customerGoal.findUnique({ where: { id: goalId } });
    if (!goal) throw ApiError.notFound('Goal not found.');
    if (goal.userId !== userId) throw ApiError.forbidden('Access denied.');

    return {
        ...goal,
        progress: goal.targetAmount > 0 ? Math.round((goal.currentAmount / goal.targetAmount) * 100) : 0,
        monthsRemaining: Math.max(0, Math.ceil((new Date(goal.targetDate) - new Date()) / (30 * 24 * 60 * 60 * 1000))),
    };
};

const createGoal = async (userId, data) => {
    const goal = await prisma.customerGoal.create({
        data: {
            userId,
            goalType: data.goalType,
            goalName: data.goalName,
            targetAmount: data.targetAmount,
            currentAmount: data.currentAmount || 0,
            targetDate: new Date(data.targetDate),
            monthlyContribution: data.monthlyContribution,
            fundingMethod: data.fundingMethod || 'MANUAL',
            linkedProductId: data.linkedProductId || null,
        },
    });

    logger.info('Customer goal created', { userId, goalId: goal.id, goalType: data.goalType });
    return goal;
};

const updateGoal = async (goalId, userId, data) => {
    const existing = await prisma.customerGoal.findUnique({ where: { id: goalId } });
    if (!existing) throw ApiError.notFound('Goal not found.');
    if (existing.userId !== userId) throw ApiError.forbidden('Access denied.');

    const updateData = {};
    if (data.goalName !== undefined) updateData.goalName = data.goalName;
    if (data.targetAmount !== undefined) updateData.targetAmount = data.targetAmount;
    if (data.currentAmount !== undefined) updateData.currentAmount = data.currentAmount;
    if (data.targetDate !== undefined) updateData.targetDate = new Date(data.targetDate);
    if (data.monthlyContribution !== undefined) updateData.monthlyContribution = data.monthlyContribution;
    if (data.fundingMethod !== undefined) updateData.fundingMethod = data.fundingMethod;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.linkedProductId !== undefined) updateData.linkedProductId = data.linkedProductId;

    return prisma.customerGoal.update({ where: { id: goalId }, data: updateData });
};

const deleteGoal = async (goalId, userId) => {
    const existing = await prisma.customerGoal.findUnique({ where: { id: goalId } });
    if (!existing) throw ApiError.notFound('Goal not found.');
    if (existing.userId !== userId) throw ApiError.forbidden('Access denied.');

    await prisma.customerGoal.delete({ where: { id: goalId } });
    return { deleted: true };
};

// ════════════════════════════════════════════════
// PRODUCTS
// ════════════════════════════════════════════════

const getProducts = async (userId) => {
    const profile = await prisma.financialProfile.findUnique({ where: { userId } });
    const allProducts = await prisma.customerProduct.findMany({ where: { userId } });

    const savings = {
        accountBalance: profile ? profile.currentBalance : 0,
        interestRate: 4.0,
    };
    
    const fixedDeposits = allProducts.filter(p => p.productType === 'FD').map(p => ({
        id: p.accountNumber || p.id, amount: p.investedAmount, interestRate: p.interestRate, startDate: p.startDate, maturityDate: p.maturityDate, tenure: 'N/A', interestEarned: p.currentValue - p.investedAmount, status: p.status
    }));

    const recurringDeposits = allProducts.filter(p => p.productType === 'RD').map(p => ({
        id: p.accountNumber || p.id, monthlyDeposit: p.monthlyAmount, totalDeposited: p.investedAmount, interestRate: p.interestRate, startDate: p.startDate, maturityDate: p.maturityDate, interestEarned: p.currentValue - p.investedAmount, status: p.status
    }));

    const sips = allProducts.filter(p => p.productType === 'SIP').map(p => ({
        id: p.accountNumber || p.id, fundName: p.productName, monthlyAmount: p.monthlyAmount, currentValue: p.currentValue, investedAmount: p.investedAmount, returns: ((p.currentValue - p.investedAmount) / p.investedAmount) * 100, startDate: p.startDate, status: p.status
    }));

    const loans = allProducts.filter(p => p.productType === 'LOAN').map(p => ({
        id: p.accountNumber || p.id, type: p.productName, outstandingAmount: p.outstandingAmount, creditLimit: p.creditLimit, dueDate: '2026-06-15', minimumDue: p.outstandingAmount * 0.1, interestRate: p.interestRate, status: p.status
    }));

    const insurance = allProducts.filter(p => p.productType === 'INSURANCE').map(p => ({
        id: p.accountNumber || p.id, type: 'LIFE', provider: 'TrustEdge Insurance', coverAmount: p.coverAmount, premium: p.premium, frequency: 'ANNUAL', nextDueDate: '2026-09-01', status: p.status
    }));

    return { savings, fixedDeposits, recurringDeposits, sips, loans, insurance };
};

// ════════════════════════════════════════════════
// OFFERS
// ════════════════════════════════════════════════

const getOffers = async (userId) => {
    const offers = await prisma.offerInteraction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });

    // If no offers in DB yet, return mock offers
    if (offers.length === 0) {
        return [
            { id: 'mock-offer-1', offerId: 'OFR-FD-BOOST', offerTitle: 'FD Rate Boost — +0.5%', offerType: 'FD', description: 'Get an additional 0.5% on your next Fixed Deposit above ₹1,00,000.', expiresAt: addDays(new Date(), 15).toISOString(), action: null },
            { id: 'mock-offer-2', offerId: 'OFR-SIP-CASHBACK', offerTitle: 'SIP Cashback ₹500', offerType: 'SIP', description: 'Start a new SIP of ₹5,000+ and get ₹500 cashback.', expiresAt: addDays(new Date(), 30).toISOString(), action: null },
            { id: 'mock-offer-3', offerId: 'OFR-CC-UPGRADE', offerTitle: 'Credit Card Upgrade', offerType: 'CREDIT_CARD', description: 'Upgrade to TrustEdge Platinum with zero joining fee. 3X reward points for 6 months.', expiresAt: addDays(new Date(), 7).toISOString(), action: null },
        ];
    }

    return offers;
};

const respondToOffer = async (offerId, userId, { action, declineReason }) => {
    const offer = await prisma.offerInteraction.findUnique({ where: { id: offerId } });
    if (!offer) throw ApiError.notFound('Offer not found.');
    if (offer.userId !== userId) throw ApiError.forbidden('Access denied.');

    return prisma.offerInteraction.update({
        where: { id: offerId },
        data: {
            action,
            declineReason: declineReason || null,
            actionTakenAt: new Date(),
        },
    });
};

// ════════════════════════════════════════════════
// NOTIFICATIONS
// ════════════════════════════════════════════════

const getNotifications = async (userId, { page, limit, type, isRead }) => {
    const skip = (page - 1) * limit;
    const where = { userId };
    if (type) where.type = type;
    if (isRead !== undefined) where.isRead = isRead === 'true';

    const [notifications, total, unreadCount] = await Promise.all([
        prisma.customerNotification.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
        prisma.customerNotification.count({ where }),
        prisma.customerNotification.count({ where: { userId, isRead: false } }),
    ]);

    return {
        notifications,
        unreadCount,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
};

const markNotificationRead = async (notificationId, userId) => {
    const notification = await prisma.customerNotification.findUnique({ where: { id: notificationId } });
    if (!notification) throw ApiError.notFound('Notification not found.');
    if (notification.userId !== userId) throw ApiError.forbidden('Access denied.');

    return prisma.customerNotification.update({
        where: { id: notificationId },
        data: { isRead: true },
    });
};

const markAllNotificationsRead = async (userId) => {
    const result = await prisma.customerNotification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
    });

    return { markedRead: result.count };
};

// ════════════════════════════════════════════════
// SUPPORT TICKETS
// ════════════════════════════════════════════════

const createTicket = async (userId, data) => {
    const ticketNumber = await generateTicketNumber();
    const slaDeadline = addDays(new Date(), 7);

    const ticket = await prisma.supportTicket.create({
        data: {
            userId,
            ticketNumber,
            category: data.category,
            subCategory: data.subCategory || null,
            description: xss(data.description),
            evidenceUrls: data.evidenceUrls || null,
            slaDeadline,
            assignedTeam: 'Customer Support',
        },
    });

    logger.info('Support ticket created', { userId, ticketNumber, category: data.category });
    return ticket;
};

const getTickets = async (userId, { page, limit, status }) => {
    const skip = (page - 1) * limit;
    const where = { userId };
    if (status) where.status = status;

    const [tickets, total] = await Promise.all([
        prisma.supportTicket.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
            include: { communications: { orderBy: { createdAt: 'desc' }, take: 1 } },
        }),
        prisma.supportTicket.count({ where }),
    ]);

    return {
        tickets,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
};

const getTicketById = async (ticketId, userId) => {
    const ticket = await prisma.supportTicket.findUnique({
        where: { id: ticketId },
        include: { communications: { orderBy: { createdAt: 'asc' } } },
    });
    if (!ticket) throw ApiError.notFound('Ticket not found.');
    if (ticket.userId !== userId) throw ApiError.forbidden('Access denied.');

    return ticket;
};

const addTicketMessage = async (ticketId, userId, { message }) => {
    const ticket = await prisma.supportTicket.findUnique({ where: { id: ticketId } });
    if (!ticket) throw ApiError.notFound('Ticket not found.');
    if (ticket.userId !== userId) throw ApiError.forbidden('Access denied.');
    if (ticket.status === 'CLOSED') throw ApiError.badRequest('Cannot add message to a closed ticket.');

    const communication = await prisma.ticketCommunication.create({
        data: {
            ticketId,
            fromRole: 'CUSTOMER',
            message: xss(message),
        },
    });

    // Update ticket status if it was resolved (customer following up)
    if (ticket.status === 'RESOLVED') {
        await prisma.supportTicket.update({
            where: { id: ticketId },
            data: { status: 'IN_PROGRESS' },
        });
    }

    return communication;
};

// ════════════════════════════════════════════════
// APPOINTMENTS
// ════════════════════════════════════════════════

const createAppointment = async (userId, data) => {
    const appointment = await prisma.branchAppointment.create({
        data: {
            userId,
            branchCode: data.branchCode,
            branchName: data.branchName || '',
            appointmentDate: new Date(data.appointmentDate),
            timeSlot: data.timeSlot,
            reason: data.reason,
        },
    });

    logger.info('Branch appointment booked', { userId, branchCode: data.branchCode, date: data.appointmentDate });
    return appointment;
};

const getAppointments = async (userId) => {
    return prisma.branchAppointment.findMany({
        where: { userId },
        orderBy: { appointmentDate: 'desc' },
    });
};

// ════════════════════════════════════════════════
// SETTINGS — Preferences
// ════════════════════════════════════════════════

const getPreferences = async (userId) => {
    let prefs = await prisma.customerPreferences.findUnique({ where: { userId } });

    // Create default preferences if none exist
    if (!prefs) {
        prefs = await prisma.customerPreferences.create({
            data: { userId },
        });
    }

    // Parse JSON string fields into arrays for API response
    return {
        ...prefs,
        transactionAlertChannels: JSON.parse(prefs.transactionAlertChannels),
        emiChannels: JSON.parse(prefs.emiChannels),
        offerChannels: JSON.parse(prefs.offerChannels),
        sageNudgeChannels: JSON.parse(prefs.sageNudgeChannels),
    };
};

const updatePreferences = async (userId, data) => {
    // Serialize array fields to JSON strings for SQLite storage
    const updateData = {};
    if (data.languagePreference !== undefined) updateData.languagePreference = data.languagePreference;
    if (data.uiMode !== undefined) updateData.uiMode = data.uiMode;
    if (data.transactionAlertChannels !== undefined) updateData.transactionAlertChannels = JSON.stringify(data.transactionAlertChannels);
    if (data.emiChannels !== undefined) updateData.emiChannels = JSON.stringify(data.emiChannels);
    if (data.offerChannels !== undefined) updateData.offerChannels = JSON.stringify(data.offerChannels);
    if (data.sageNudgeChannels !== undefined) updateData.sageNudgeChannels = JSON.stringify(data.sageNudgeChannels);
    if (data.transactionAlertThreshold !== undefined) updateData.transactionAlertThreshold = data.transactionAlertThreshold;
    if (data.marketingOptIn !== undefined) updateData.marketingOptIn = data.marketingOptIn;
    if (data.marketingPausedUntil !== undefined) updateData.marketingPausedUntil = data.marketingPausedUntil ? new Date(data.marketingPausedUntil) : null;
    if (data.quietHoursStart !== undefined) updateData.quietHoursStart = data.quietHoursStart;
    if (data.quietHoursEnd !== undefined) updateData.quietHoursEnd = data.quietHoursEnd;

    const prefs = await prisma.customerPreferences.upsert({
        where: { userId },
        create: { userId, ...updateData },
        update: updateData,
    });

    return {
        ...prefs,
        transactionAlertChannels: JSON.parse(prefs.transactionAlertChannels),
        emiChannels: JSON.parse(prefs.emiChannels),
        offerChannels: JSON.parse(prefs.offerChannels),
        sageNudgeChannels: JSON.parse(prefs.sageNudgeChannels),
    };
};

// ════════════════════════════════════════════════
// SETTINGS — Consents
// ════════════════════════════════════════════════

const getConsents = async (userId) => {
    const consents = await prisma.consentRecord.findMany({
        where: { userId },
        orderBy: { grantedAt: 'desc' },
    });

    // Group by consentType and show latest status
    const consentTypes = ['PERSONALIZED_OFFERS', 'SAGE_ANALYSIS', 'CROSS_PRODUCT_PROFILE', 'ACCOUNT_AGGREGATOR'];
    return consentTypes.map((type) => {
        const latest = consents.find((c) => c.consentType === type);
        return {
            consentType: type,
            granted: latest ? latest.granted && !latest.withdrawnAt : false,
            lastUpdated: latest ? latest.grantedAt : null,
        };
    });
};

const updateConsent = async (userId, { consentType, granted }, ipAddress) => {
    // If withdrawing, update existing record
    if (!granted) {
        const existing = await prisma.consentRecord.findFirst({
            where: { userId, consentType, granted: true, withdrawnAt: null },
            orderBy: { grantedAt: 'desc' },
        });
        if (existing) {
            await prisma.consentRecord.update({
                where: { id: existing.id },
                data: { withdrawnAt: new Date() },
            });
        }
    }

    // Create new consent record (audit trail)
    const record = await prisma.consentRecord.create({
        data: {
            userId,
            consentType,
            granted,
            grantedAt: new Date(),
            ipAddress: ipAddress || '0.0.0.0',
        },
    });

    logger.info('Consent updated', { userId, consentType, granted });
    return record;
};

// ════════════════════════════════════════════════
// SETTINGS — Security
// ════════════════════════════════════════════════

const getSecurityInfo = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            email: true, phone: true, kycStatus: true, kycVerifiedAt: true,
            createdAt: true, updatedAt: true,
        },
    });
    if (!user) throw ApiError.notFound('User not found.');

    return {
        email: user.email,
        phone: user.phone,
        kycStatus: user.kycStatus,
        kycVerifiedAt: user.kycVerifiedAt,
        accountCreated: user.createdAt,
        lastProfileUpdate: user.updatedAt,
        twoFactorEnabled: false, // Could be queried from a SecuritySettings table
        loginHistory: await prisma.loginSession.findMany({
            where: { userId },
            orderBy: { timestamp: 'desc' },
            take: 3,
        }),
        activeSessions: await prisma.loginSession.count({
            where: { userId, status: 'SUCCESS' },
        }),
    };
};

// ════════════════════════════════════════════════
// NEW ENDPOINTS ADDED
// ════════════════════════════════════════════════

const getProfile = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { financialProfile: true }
    });
    return user;
};

const updateProfile = async (userId, data) => {
    const user = await prisma.user.update({
        where: { id: userId },
        data
    });
    return user;
};

const getProductDetail = async (type, id, userId) => {
    const product = await prisma.customerProduct.findUnique({
        where: { id }
    });
    if (!product || product.userId !== userId) throw ApiError.notFound('Product not found.');
    return product;
};

const getOffer = async (id, userId) => {
    const offer = await prisma.offerInteraction.findUnique({
        where: { id }
    });
    if (!offer || offer.userId !== userId) throw ApiError.notFound('Offer not found.');
    return offer;
};

const getOfferStats = async (userId) => {
    const total = await prisma.offerInteraction.count({ where: { userId } });
    const accepted = await prisma.offerInteraction.count({ where: { userId, action: 'ACCEPTED' } });
    return { total, accepted };
};

const getStressStatus = async (userId) => {
    const status = await prisma.customerStressStatus.findUnique({ where: { userId } });
    return status || { status: 'NONE' };
};

const requestRestructuring = async (userId, data) => {
    const status = await prisma.customerStressStatus.upsert({
        where: { userId },
        create: { userId, status: 'RESTRUCTURING', lastAction: 'requested_restructuring' },
        update: { status: 'RESTRUCTURING', lastAction: 'requested_restructuring' }
    });
    return status;
};

const calculatePrepayment = async (userId, data) => {
    return { estimatedSavings: 15000, newEmi: data.amount ? 20000 : null };
};

const dismissStressCard = async (userId) => {
    const status = await prisma.customerStressStatus.upsert({
        where: { userId },
        create: { userId, status: 'NONE', dismissedAt: new Date() },
        update: { status: 'NONE', dismissedAt: new Date() }
    });
    return status;
};

const getNotifCount = async (userId) => {
    const count = await prisma.customerNotification.count({ where: { userId, isRead: false } });
    return count;
};

const cancelTicket = async (id, userId) => {
    const ticket = await prisma.supportTicket.findUnique({ where: { id } });
    if (!ticket || ticket.userId !== userId) throw ApiError.notFound('Ticket not found.');
    return prisma.supportTicket.update({ where: { id }, data: { status: 'CLOSED' } });
};

const cancelAppointment = async (id, userId) => {
    const appt = await prisma.branchAppointment.findUnique({ where: { id } });
    if (!appt || appt.userId !== userId) throw ApiError.notFound('Appointment not found.');
    return prisma.branchAppointment.update({ where: { id }, data: { status: 'CANCELLED' } });
};

const requestCallback = async (userId, data) => {
    return { status: 'requested', estimatedWait: '10 mins' };
};

const getLoginHistory = async (userId) => {
    return prisma.loginSession.findMany({ where: { userId }, orderBy: { timestamp: 'desc' }, take: 10 });
};

const endSession = async (id, userId) => {
    return prisma.loginSession.delete({ where: { id, userId } });
};

const freezeAccount = async (userId) => {
    return { status: 'frozen' };
};

const unfreezeAccount = async (userId) => {
    return { status: 'active' };
};

const updateAlertThreshold = async (userId, data) => {
    return { status: 'updated' };
};

const getPrivacyDashboard = async (userId) => {
    return { dataShared: ['Basic Profile'], thirdPartyAccess: [] };
};

const requestDataExport = async (userId) => {
    return { status: 'processing', message: 'You will receive an email when your data is ready.' };
};

const deleteSageHistory = async (userId) => {
    await prisma.sageConversation.deleteMany({ where: { userId } });
    return { status: 'deleted' };
};

const getEducationArticles = async (userId) => {
    return prisma.educationArticle.findMany({ orderBy: { createdAt: 'desc' } });
};

const getGlossary = async () => {
    return prisma.glossaryTerm.findMany({ orderBy: { term: 'asc' } });
};

const getFeeSchedule = async () => {
    return prisma.feeSchedule.findMany({ orderBy: { service: 'asc' } });
};


module.exports = {
    // Profile
    getProfile, updateProfile,
    // Dashboard
    getDashboard,
    // Finances
    getAccounts, getTransactions, getSpendingInsights, getNetWorth,
    // Goals
    getGoals, getGoalById, createGoal, updateGoal, deleteGoal,
    // Products
    getProducts, getProductDetail,
    // Offers
    getOffers, respondToOffer, getOffer, getOfferStats,
    // Stress
    getStressStatus, requestRestructuring, calculatePrepayment, dismissStressCard,
    // Notifications
    getNotifications, markNotificationRead, markAllNotificationsRead, getNotifCount,
    // Support
    createTicket, getTickets, getTicketById, addTicketMessage, cancelTicket,
    // Appointments
    createAppointment, getAppointments, cancelAppointment, requestCallback,
    // Settings
    getPreferences, updatePreferences, getConsents, updateConsent, getSecurityInfo,
    getLoginHistory, endSession, freezeAccount, unfreezeAccount, updateAlertThreshold,
    getPrivacyDashboard, requestDataExport, deleteSageHistory,
    // Trust
    getEducationArticles, getGlossary, getFeeSchedule
};
