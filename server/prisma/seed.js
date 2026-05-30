/**
 * LIFELINE — Database Seed Script
 * 
 * Populates the database with realistic demo data:
 * - 3 users (1 Customer, 1 Employee, 1 Admin)
 * - Financial profile for the customer
 * - 30 days of transactions
 * - Stress alerts
 * - Shield check-ins for the employee
 * - SAGE conversations
 * - Financial products for TRUTH comparison
 * - Audit logs
 * 
 * Run: npm run db:seed
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding LIFELINE database...\n');

    // ── Clean existing data ─────────────────────────────────
    console.log('  Cleaning existing data...');
    await prisma.auditLog.deleteMany();
    await prisma.productComparison.deleteMany();
    await prisma.financialProduct.deleteMany();
    await prisma.sageConversation.deleteMany();
    await prisma.shieldCheckin.deleteMany();
    await prisma.stressAlert.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.financialProfile.deleteMany();
    await prisma.complaint.deleteMany();
    await prisma.aBTestResult.deleteMany();
    await prisma.executionLog.deleteMany();
    await prisma.channelConfig.deleteMany();
    await prisma.variant.deleteMany();
    await prisma.campaign.deleteMany();
    await prisma.audienceSegment.deleteMany();
    await prisma.churnReport.deleteMany();
    await prisma.customerSignal.deleteMany();
    await prisma.feedbackInsight.deleteMany();
    await prisma.retentionMetrics.deleteMany();
    await prisma.retentionJourney.deleteMany();
    await prisma.retentionOffer.deleteMany();
    await prisma.offerLibrary.deleteMany();
    await prisma.customerHealthScore.deleteMany();
    // Customer Portal tables
    await prisma.ticketCommunication.deleteMany();
    await prisma.supportTicket.deleteMany();
    await prisma.customerNotification.deleteMany();
    await prisma.offerInteraction.deleteMany();
    await prisma.customerSpendingBudget.deleteMany();
    await prisma.branchAppointment.deleteMany();
    await prisma.consentRecord.deleteMany();
    await prisma.customerPreferences.deleteMany();
    await prisma.customerGoal.deleteMany();
    await prisma.user.deleteMany();

    // ── 1. Create Users ─────────────────────────────────────
    console.log('  Creating users...');
    const passwordHash = await bcrypt.hash('Test@1234', 12);

    const customer = await prisma.user.create({
        data: {
            name: 'Arjun Sharma',
            email: 'arjun@lifeline.com',
            passwordHash,
            role: 'CUSTOMER',
            phone: '+91-9876543210',
            dateOfBirth: '1993-04-15',
            gender: 'MALE',
            panNumber: 'ABCPS1234F',
            aadhaarNumber: '2345-6789-0123',
            address: '42, 3rd Cross, Indiranagar',
            city: 'Bengaluru',
            state: 'Karnataka',
            pincode: '560038',
            accountNumber: '300912345678',
            ifscCode: 'TRST0001234',
            branchName: 'Indiranagar, Bengaluru',
            accountType: 'SAVINGS',
            kycStatus: 'VERIFIED',
            kycVerifiedAt: new Date('2023-01-10'),
            nomineeName: 'Sunita Sharma',
            nomineeRelation: 'Spouse',
        },
    });

    const customer2 = await prisma.user.create({
        data: {
            name: 'Meena Krishnan',
            email: 'meena@lifeline.com',
            passwordHash,
            role: 'CUSTOMER',
            phone: '+91-9845671230',
            dateOfBirth: '1990-11-22',
            gender: 'FEMALE',
            panNumber: 'BKRPM5678G',
            aadhaarNumber: '3456-7890-1234',
            address: '18, Velachery Main Road',
            city: 'Chennai',
            state: 'Tamil Nadu',
            pincode: '600042',
            accountNumber: '300987654321',
            ifscCode: 'TRST0002345',
            branchName: 'Velachery, Chennai',
            accountType: 'SALARY',
            kycStatus: 'VERIFIED',
            kycVerifiedAt: new Date('2022-08-05'),
            nomineeName: 'Rajan Krishnan',
            nomineeRelation: 'Father',
        },
    });

    const customer3 = await prisma.user.create({
        data: {
            name: 'Deepak Verma',
            email: 'deepak@lifeline.com',
            passwordHash,
            role: 'CUSTOMER',
            phone: '+91-9012345678',
            dateOfBirth: '1988-07-03',
            gender: 'MALE',
            panNumber: 'CVDPV9999H',
            aadhaarNumber: '4567-8901-2345',
            address: '7, Rajouri Garden, Block C',
            city: 'New Delhi',
            state: 'Delhi',
            pincode: '110027',
            accountNumber: '301112223334',
            ifscCode: 'TRST0003456',
            branchName: 'Rajouri Garden, Delhi',
            accountType: 'SAVINGS',
            kycStatus: 'VERIFIED',
            kycVerifiedAt: new Date('2021-03-20'),
            nomineeName: 'Kavita Verma',
            nomineeRelation: 'Mother',
        },
    });

    const employee = await prisma.user.create({
        data: {
            name: 'Priya Patel',
            email: 'priya@lifeline.com',
            passwordHash,
            role: 'EMPLOYEE',
            phone: '+91-9988776655',
            dateOfBirth: '1995-02-18',
            gender: 'FEMALE',
            city: 'Bengaluru',
            state: 'Karnataka',
            branchName: 'Indiranagar, Bengaluru',
            kycStatus: 'VERIFIED',
        },
    });

    const employee2 = await prisma.user.create({
        data: {
            name: 'Rahul Mehta',
            email: 'rahul@lifeline.com',
            passwordHash,
            role: 'EMPLOYEE',
            phone: '+91-9876012345',
            dateOfBirth: '1992-09-10',
            gender: 'MALE',
            city: 'Mumbai',
            state: 'Maharashtra',
            branchName: 'Andheri, Mumbai',
            kycStatus: 'VERIFIED',
        },
    });

    const employee3 = await prisma.user.create({
        data: {
            name: 'Sneha Iyer',
            email: 'sneha@lifeline.com',
            passwordHash,
            role: 'EMPLOYEE',
            phone: '+91-9543210987',
            dateOfBirth: '1994-06-25',
            gender: 'FEMALE',
            city: 'Chennai',
            state: 'Tamil Nadu',
            branchName: 'Anna Nagar, Chennai',
            kycStatus: 'VERIFIED',
        },
    });

    const employee4 = await prisma.user.create({
        data: {
            name: 'Vikram Singh',
            email: 'vikram@lifeline.com',
            passwordHash,
            role: 'EMPLOYEE',
            phone: '+91-9871234560',
            dateOfBirth: '1989-12-01',
            gender: 'MALE',
            city: 'New Delhi',
            state: 'Delhi',
            branchName: 'Connaught Place, Delhi',
            kycStatus: 'VERIFIED',
        },
    });

    const admin = await prisma.user.create({
        data: {
            name: 'Admin User',
            email: 'admin@lifeline.com',
            passwordHash,
            role: 'ADMIN',
            phone: '+91-9000000001',
            city: 'Bengaluru',
            state: 'Karnataka',
            kycStatus: 'VERIFIED',
        },
    });

    console.log(`    ✅ Customer: arjun@lifeline.com (password: Test@1234)`);
    console.log(`    ✅ Customer: meena@lifeline.com (password: Test@1234)`);
    console.log(`    ✅ Customer: deepak@lifeline.com (password: Test@1234)`);
    console.log(`    ✅ Employee: priya@lifeline.com (password: Test@1234)`);
    console.log(`    ✅ Employee: rahul@lifeline.com (password: Test@1234)`);
    console.log(`    ✅ Employee: sneha@lifeline.com (password: Test@1234)`);
    console.log(`    ✅ Employee: vikram@lifeline.com (password: Test@1234)`);
    console.log(`    ✅ Admin:    admin@lifeline.com (password: Test@1234)`);

    // ── 2. Financial Profiles ───────────────────────────────
    console.log('  Creating financial profiles...');
    await prisma.financialProfile.create({
        data: {
            userId: customer.id,
            monthlyIncome: 50000,
            monthlyExpenses: 38000,
            currentBalance: 12500,
            riskScore: 0.65,
            stressLevel: 'MODERATE',
            lastAssessedAt: new Date(),
        },
    });
    await prisma.financialProfile.create({
        data: {
            userId: customer2.id,
            monthlyIncome: 75000,
            monthlyExpenses: 42000,
            currentBalance: 185000,
            riskScore: 0.2,
            stressLevel: 'LOW',
            lastAssessedAt: new Date(),
        },
    });
    await prisma.financialProfile.create({
        data: {
            userId: customer3.id,
            monthlyIncome: 30000,
            monthlyExpenses: 28000,
            currentBalance: 3200,
            riskScore: 0.88,
            stressLevel: 'CRITICAL',
            lastAssessedAt: new Date(),
        },
    });

    // ── 3. Transactions (30 days) ───────────────────────────
    console.log('  Creating transactions...');
    const transactions = [];
    const now = new Date();

    // Salary — credited on 1st of each month
    for (let m = 0; m < 3; m++) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - m);
        date.setDate(1);
        // Salary drops over time (stress pattern)
        const salary = m === 0 ? 42000 : m === 1 ? 48000 : 55000;
        transactions.push({
            userId: customer.id,
            type: 'CREDIT',
            category: 'SALARY',
            amount: salary,
            description: `Monthly salary - ${date.toLocaleString('default', { month: 'long' })}`,
            transactionDate: date,
        });
    }

    // Regular expenses
    const expenseTemplates = [
        { category: 'RENT', amount: 15000, desc: 'Monthly rent payment' },
        { category: 'UTILITIES', amount: 3500, desc: 'Electricity and water bill' },
        { category: 'FOOD', amount: 8000, desc: 'Groceries and dining' },
        { category: 'ENTERTAINMENT', amount: 2500, desc: 'Subscriptions and outings' },
        { category: 'TRANSPORT', amount: 3000, desc: 'Fuel and transport' },
    ];

    for (let d = 0; d < 30; d++) {
        const date = new Date(now);
        date.setDate(date.getDate() - d);
        const template = expenseTemplates[d % expenseTemplates.length];
        transactions.push({
            userId: customer.id,
            type: 'DEBIT',
            category: template.category,
            amount: template.amount + Math.floor(Math.random() * 500),
            description: template.desc,
            transactionDate: date,
        });
    }

    // Emergency withdrawals (stress pattern — 3 in one week)
    for (let i = 0; i < 3; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i - 1);
        transactions.push({
            userId: customer.id,
            type: 'DEBIT',
            category: 'EMERGENCY',
            amount: 5000 + Math.floor(Math.random() * 3000),
            description: 'Emergency cash withdrawal',
            transactionDate: date,
        });
    }

    // Meena's transactions (healthy spender)
    for (let m = 0; m < 3; m++) {
        const date = new Date(now); date.setMonth(date.getMonth() - m); date.setDate(1);
        transactions.push({ userId: customer2.id, type: 'CREDIT', category: 'SALARY', amount: 75000, description: `Monthly salary - ${date.toLocaleString('default', { month: 'long' })}`, transactionDate: date });
    }
    for (let d = 0; d < 20; d++) {
        const date = new Date(now); date.setDate(date.getDate() - d);
        const cats = [
            { category: 'RENT', amount: 18000, desc: 'Apartment rent' },
            { category: 'FOOD', amount: 6000, desc: 'Groceries' },
            { category: 'UTILITIES', amount: 2800, desc: 'Bills' },
            { category: 'INVESTMENT', amount: 10000, desc: 'SIP mutual fund' },
            { category: 'ENTERTAINMENT', amount: 1500, desc: 'Netflix & outings' },
        ];
        const t = cats[d % cats.length];
        transactions.push({ userId: customer2.id, type: 'DEBIT', category: t.category, amount: t.amount + Math.floor(Math.random() * 300), description: t.desc, transactionDate: date });
    }

    // Deepak's transactions (struggling — critical stress)
    for (let m = 0; m < 3; m++) {
        const date = new Date(now); date.setMonth(date.getMonth() - m); date.setDate(1);
        const salary = m === 0 ? 25000 : m === 1 ? 28000 : 32000; // declining salary
        transactions.push({ userId: customer3.id, type: 'CREDIT', category: 'SALARY', amount: salary, description: `Monthly salary - ${date.toLocaleString('default', { month: 'long' })}`, transactionDate: date });
    }
    for (let d = 0; d < 25; d++) {
        const date = new Date(now); date.setDate(date.getDate() - d);
        const cats = [
            { category: 'RENT', amount: 12000, desc: 'Rent payment' },
            { category: 'FOOD', amount: 5000, desc: 'Groceries' },
            { category: 'UTILITIES', amount: 2500, desc: 'Electricity bill' },
            { category: 'EMERGENCY', amount: 4000, desc: 'Medical expense' },
            { category: 'TRANSPORT', amount: 2000, desc: 'Auto & bus fare' },
        ];
        const t = cats[d % cats.length];
        transactions.push({ userId: customer3.id, type: 'DEBIT', category: t.category, amount: t.amount + Math.floor(Math.random() * 500), description: t.desc, transactionDate: date });
    }
    // Deepak's emergency withdrawals (5 in a week — very stressed)
    for (let i = 0; i < 5; i++) {
        const date = new Date(now); date.setDate(date.getDate() - i);
        transactions.push({ userId: customer3.id, type: 'DEBIT', category: 'EMERGENCY', amount: 2000 + Math.floor(Math.random() * 2000), description: 'Emergency withdrawal', transactionDate: date });
    }

    await prisma.transaction.createMany({ data: transactions });
    console.log(`    ✅ ${transactions.length} transactions created`);

    // ── 4. Stress Alerts ────────────────────────────────────
    console.log('  Creating stress alerts...');
    const alertsData = [
        // Arjun's alerts (assigned to Priya)
        { userId: customer.id, assignedEmployeeId: employee.id, alertType: 'SALARY_DROP', severity: 'HIGH', message: 'Salary has dropped by 23% compared to the 3-month average. This may indicate job instability.', status: 'OPEN' },
        { userId: customer.id, assignedEmployeeId: employee.id, alertType: 'EMERGENCY_WITHDRAWAL', severity: 'MODERATE', message: '3 emergency withdrawals detected in the past 7 days totaling ₹19,500.', status: 'ACKNOWLEDGED' },
        { userId: customer.id, alertType: 'LOW_BALANCE', severity: 'MODERATE', message: 'Account balance has been below ₹15,000 for 5 consecutive days.', status: 'OPEN' },

        // Meena's alerts (assigned to Rahul — low severity)
        { userId: customer2.id, assignedEmployeeId: employee2.id, alertType: 'LARGE_EXPENSE', severity: 'LOW', message: 'Large investment of ₹10,000 detected — SIP mutual fund. Consistent investing pattern.', status: 'RESOLVED' },

        // Deepak's alerts (critical — assigned to Sneha & Vikram)
        { userId: customer3.id, assignedEmployeeId: employee3.id, alertType: 'SALARY_DROP', severity: 'CRITICAL', message: 'Salary dropped 22% over 3 months (₹32,000 → ₹25,000). Potential job loss risk detected.', status: 'OPEN' },
        { userId: customer3.id, assignedEmployeeId: employee3.id, alertType: 'LOW_BALANCE', severity: 'CRITICAL', message: 'Balance critically low at ₹3,200 — less than 12% of monthly expenses.', status: 'OPEN' },
        { userId: customer3.id, assignedEmployeeId: employee4.id, alertType: 'EMERGENCY_WITHDRAWAL', severity: 'HIGH', message: '5 emergency withdrawals in 5 days totaling ₹15,800. Urgent financial distress pattern.', status: 'OPEN' },
        { userId: customer3.id, assignedEmployeeId: employee4.id, alertType: 'MIN_PAYMENT_REPEAT', severity: 'HIGH', message: 'Minimum credit card payments repeated for 3 consecutive months. Debt spiral risk.', status: 'ACKNOWLEDGED' },
    ];
    await prisma.stressAlert.createMany({ data: alertsData });
    console.log(`    ✅ ${alertsData.length} stress alerts created`);

    // ── 5. Shield Check-ins (all employees) ──────────────────
    console.log('  Creating SHIELD check-ins...');
    const checkins = [];

    // Priya — handling Arjun's case, moderate stress
    for (let d = 0; d < 7; d++) {
        const date = new Date(now); date.setDate(date.getDate() - d);
        checkins.push({ employeeId: employee.id, stressScore: d < 3 ? 7 + Math.floor(Math.random() * 3) : 3 + Math.floor(Math.random() * 3), mood: d < 2 ? 'STRUGGLING' : d < 4 ? 'OKAY' : 'GOOD', notes: d < 2 ? 'Had to reject 3 loan applications today. One customer was very distressed.' : null, difficultCasesCount: d < 3 ? 3 + Math.floor(Math.random() * 2) : 1, peerSupportRequested: d < 2, shiftDate: date });
    }

    // Rahul — healthy, low stress employee
    for (let d = 0; d < 7; d++) {
        const date = new Date(now); date.setDate(date.getDate() - d);
        checkins.push({ employeeId: employee2.id, stressScore: 2 + Math.floor(Math.random() * 2), mood: d < 1 ? 'OKAY' : 'GOOD', notes: d === 0 ? 'Great day — helped 2 customers restructure their loans successfully.' : null, difficultCasesCount: Math.floor(Math.random() * 2), peerSupportRequested: false, shiftDate: date });
    }

    // Sneha — handling Deepak's critical cases, high stress
    for (let d = 0; d < 7; d++) {
        const date = new Date(now); date.setDate(date.getDate() - d);
        checkins.push({ employeeId: employee3.id, stressScore: d < 4 ? 8 + Math.floor(Math.random() * 2) : 5 + Math.floor(Math.random() * 2), mood: d < 3 ? 'OVERWHELMED' : d < 5 ? 'STRUGGLING' : 'OKAY', notes: d < 3 ? 'Deepak\'s case is weighing on me. His family depends on him and his salary keeps dropping.' : d === 3 ? 'Need to decompress. Requested peer support session.' : null, difficultCasesCount: d < 4 ? 4 + Math.floor(Math.random() * 3) : 2, peerSupportRequested: d < 3, shiftDate: date });
    }

    // Vikram — moderate, experienced employee
    for (let d = 0; d < 7; d++) {
        const date = new Date(now); date.setDate(date.getDate() - d);
        checkins.push({ employeeId: employee4.id, stressScore: d < 2 ? 6 + Math.floor(Math.random() * 2) : 3 + Math.floor(Math.random() * 2), mood: d < 2 ? 'OKAY' : 'GOOD', notes: d === 0 ? 'Handled 2 critical debt spiral cases today. Emotionally draining but managed well.' : null, difficultCasesCount: d < 2 ? 2 + Math.floor(Math.random() * 2) : 1, peerSupportRequested: d === 0, shiftDate: date });
    }

    await prisma.shieldCheckin.createMany({ data: checkins });
    console.log(`    ✅ ${checkins.length} SHIELD check-ins created (4 employees)`);

    // ── 6. SAGE Conversations ──────────────────────────────
    console.log('  Creating SAGE conversations...');
    await prisma.sageConversation.createMany({
        data: [
            {
                userId: customer.id,
                topic: 'BUDGETING',
                userMessage: 'My salary dropped this month. How should I adjust my budget?',
                sageResponse: 'I understand that can be stressful. Let\'s start by looking at your essential expenses — rent, food, and utilities. These should be your priority. For this month, consider pausing non-essential spending like entertainment subscriptions. Would you like me to help create a temporary budget plan?',
                helpful: true,
            },
            {
                userId: customer.id,
                topic: 'SAVING',
                userMessage: 'How much should I keep as an emergency fund?',
                sageResponse: 'A good rule of thumb is to save 3 to 6 months of your essential expenses. Based on your profile, your essentials are around ₹26,500/month. So aim for ₹80,000 to ₹1,60,000 as an emergency fund. Start small — even ₹2,000/month builds up. Consistency matters more than the amount.',
                helpful: true,
            },
            {
                userId: customer.id,
                topic: 'DEBT',
                userMessage: 'Is it bad to only pay the minimum on my credit card?',
                sageResponse: 'Paying only the minimum means you\'re mostly paying interest, not reducing your actual debt. For example, a ₹50,000 balance at 36% APR with minimum payments could take 8+ years to pay off and cost you ₹90,000+ in interest. Try to pay at least 2-3x the minimum. Would you like me to show you a payoff plan?',
                helpful: null,
            },
        ],
    });
    console.log(`    ✅ 3 SAGE conversations created`);

    // ── 7. Financial Products (for TRUTH) ──────────────────
    console.log('  Creating financial products...');
    await prisma.financialProduct.createMany({
        data: [
            {
                name: 'QuickCash Personal Loan',
                provider: 'FastBank',
                type: 'LOAN',
                interestRate: 18.5,
                processingFee: 2500,
                annualFee: 0,
                prepaymentPenalty: 3000,
                minAmount: 50000,
                maxAmount: 500000,
                riskLevel: 'HIGH',
                description: 'Fast approval personal loan with high interest rate and hidden prepayment penalty.',
            },
            {
                name: 'TrustBuilder Personal Loan',
                provider: 'LIFELINE Bank',
                type: 'LOAN',
                interestRate: 11.5,
                processingFee: 1000,
                annualFee: 0,
                prepaymentPenalty: 0,
                minAmount: 25000,
                maxAmount: 1000000,
                riskLevel: 'LOW',
                description: 'Transparent personal loan with no hidden fees and zero prepayment penalty.',
            },
            {
                name: 'RewardMax Credit Card',
                provider: 'SpendMore Bank',
                type: 'CREDIT_CARD',
                interestRate: 42.0,
                processingFee: 500,
                annualFee: 3000,
                prepaymentPenalty: 0,
                minAmount: 0,
                maxAmount: 200000,
                riskLevel: 'HIGH',
                description: 'High rewards but 42% APR and ₹3,000 annual fee that kicks in after the first year.',
            },
            {
                name: 'SimpleSave Credit Card',
                provider: 'LIFELINE Bank',
                type: 'CREDIT_CARD',
                interestRate: 24.0,
                processingFee: 0,
                annualFee: 0,
                prepaymentPenalty: 0,
                minAmount: 0,
                maxAmount: 150000,
                riskLevel: 'LOW',
                description: 'No-annual-fee credit card with reasonable 24% APR and no hidden charges.',
            },
            {
                name: 'GrowthPlus Fixed Deposit',
                provider: 'StableBank',
                type: 'SAVINGS',
                interestRate: 7.5,
                processingFee: 0,
                annualFee: 0,
                prepaymentPenalty: 1000,
                minAmount: 10000,
                maxAmount: 10000000,
                riskLevel: 'LOW',
                description: 'Fixed deposit with 7.5% return but premature withdrawal penalty of ₹1,000.',
            },
            {
                name: 'FlexiSave Account',
                provider: 'LIFELINE Bank',
                type: 'SAVINGS',
                interestRate: 6.5,
                processingFee: 0,
                annualFee: 0,
                prepaymentPenalty: 0,
                minAmount: 1000,
                maxAmount: 10000000,
                riskLevel: 'LOW',
                description: 'Flexible savings with no lock-in period and zero penalties. Slightly lower rate for full flexibility.',
            },
        ],
    });
    console.log(`    ✅ 6 financial products created`);

    // ── 8. Audit Logs ────────────────────────────────────────
    console.log('  Creating audit logs...');
    await prisma.auditLog.createMany({
        data: [
            {
                userId: customer.id,
                action: 'REGISTER',
                entityType: 'User',
                entityId: customer.id,
                details: JSON.stringify({ role: 'CUSTOMER' }),
                ipAddress: '127.0.0.1',
            },
            {
                userId: employee.id,
                action: 'REGISTER',
                entityType: 'User',
                entityId: employee.id,
                details: JSON.stringify({ role: 'EMPLOYEE' }),
                ipAddress: '127.0.0.1',
            },
            {
                userId: admin.id,
                action: 'REGISTER',
                entityType: 'User',
                entityId: admin.id,
                details: JSON.stringify({ role: 'ADMIN' }),
                ipAddress: '127.0.0.1',
            },
            {
                action: 'STRESS_ALERT_GENERATED',
                entityType: 'StressAlert',
                details: JSON.stringify({ alertType: 'SALARY_DROP', severity: 'HIGH' }),
            },
        ],
    });
    console.log(`    ✅ 4 audit logs created`);

    // ── Signal Engine: 120+ days of customer signals ────────
    console.log('  Creating 120-day signal history...');
    const SIGNAL_TYPES = [
        { type: 'TRANSACTION', subTypes: ['UPI', 'NEFT', 'IMPS', 'ATM', 'POS', 'AUTO_DEBIT'], valueRange: [100, 50000] },
        { type: 'DIGITAL', subTypes: ['APP_OPEN', 'WEB_LOGIN', 'BILL_PAY', 'RECHARGE', 'STATEMENT_VIEW'], valueRange: [1, 5] },
        { type: 'LOGIN', subTypes: ['MOBILE', 'WEB', 'ATM'], valueRange: [1, 3] },
        { type: 'COMPLAINT', subTypes: ['SERVICE', 'CHARGE', 'FRAUD', 'APP_BUG', 'DELAY'], valueRange: [1, 1] },
        { type: 'SUPPORT_CALL', subTypes: ['IVR', 'AGENT', 'CHAT'], valueRange: [1, 2] },
        { type: 'LIFE_EVENT', subTypes: ['ADDRESS_CHANGE', 'SALARY_CHANGE', 'NEW_LOAN', 'MARRIAGE'], valueRange: [1, 1] },
        { type: 'MARKET', subTypes: ['COMPETITOR_OFFER', 'RATE_CHANGE', 'NEW_PRODUCT'], valueRange: [1, 1] },
        { type: 'PRODUCT_INQUIRY', subTypes: ['FD', 'LOAN', 'CREDIT_CARD', 'INSURANCE'], valueRange: [1, 3] },
        { type: 'PAYMENT_BOUNCE', subTypes: ['EMI_MISS', 'CHEQUE_BOUNCE', 'MANDATE_FAIL'], valueRange: [500, 25000] },
        { type: 'BALANCE_DROP', subTypes: ['LARGE_WITHDRAWAL', 'SWEEP_OUT', 'TRANSFER_OUT'], valueRange: [5000, 100000] },
    ];

    // Customer profiles for signal generation
    const customerProfiles = [
        { user: customer,  riskBias: 0.4, dailyTxns: 3, complaintRate: 0.06, bounceRate: 0.03 },  // Moderate risk
        { user: customer2, riskBias: 0.1, dailyTxns: 4, complaintRate: 0.01, bounceRate: 0.005 }, // Low risk
        { user: customer3, riskBias: 0.7, dailyTxns: 2, complaintRate: 0.12, bounceRate: 0.08 },  // High risk
    ];

    const allSignals = [];
    const signalNow = new Date();

    for (const profile of customerProfiles) {
        for (let day = 120; day >= 0; day--) {
            const date = new Date(signalNow.getTime() - day * 86400000);

            // Daily transactions (2-5 per day)
            const txnCount = Math.floor(Math.random() * profile.dailyTxns) + 1;
            for (let t = 0; t < txnCount; t++) {
                const sig = SIGNAL_TYPES[0]; // TRANSACTION
                allSignals.push({
                    userId: profile.user.id,
                    type: sig.type,
                    subType: sig.subTypes[Math.floor(Math.random() * sig.subTypes.length)],
                    value: Math.floor(Math.random() * (sig.valueRange[1] - sig.valueRange[0])) + sig.valueRange[0],
                    timestamp: new Date(date.getTime() + Math.random() * 86400000),
                });
            }

            // Digital engagement (most days)
            if (Math.random() < 0.7) {
                const sig = SIGNAL_TYPES[1]; // DIGITAL
                allSignals.push({
                    userId: profile.user.id,
                    type: sig.type,
                    subType: sig.subTypes[Math.floor(Math.random() * sig.subTypes.length)],
                    value: Math.floor(Math.random() * 4) + 1,
                    timestamp: new Date(date.getTime() + Math.random() * 86400000),
                });
            }

            // Login sessions
            if (Math.random() < 0.6) {
                allSignals.push({
                    userId: profile.user.id,
                    type: 'LOGIN',
                    subType: ['MOBILE', 'WEB'][Math.floor(Math.random() * 2)],
                    value: 1,
                    timestamp: new Date(date.getTime() + Math.random() * 86400000),
                });
            }

            // Complaints (based on risk profile)
            if (Math.random() < profile.complaintRate) {
                const sig = SIGNAL_TYPES[3]; // COMPLAINT
                allSignals.push({
                    userId: profile.user.id,
                    type: sig.type,
                    subType: sig.subTypes[Math.floor(Math.random() * sig.subTypes.length)],
                    value: 1,
                    timestamp: new Date(date.getTime() + Math.random() * 86400000),
                });
            }

            // Payment bounces (high risk customers)
            if (Math.random() < profile.bounceRate) {
                const sig = SIGNAL_TYPES[8]; // PAYMENT_BOUNCE
                allSignals.push({
                    userId: profile.user.id,
                    type: sig.type,
                    subType: sig.subTypes[Math.floor(Math.random() * sig.subTypes.length)],
                    value: Math.floor(Math.random() * 20000) + 2000,
                    timestamp: new Date(date.getTime() + Math.random() * 86400000),
                });
            }

            // Balance drops (occasional)
            if (Math.random() < profile.riskBias * 0.05) {
                allSignals.push({
                    userId: profile.user.id,
                    type: 'BALANCE_DROP',
                    subType: ['LARGE_WITHDRAWAL', 'TRANSFER_OUT'][Math.floor(Math.random() * 2)],
                    value: Math.floor(Math.random() * 80000) + 10000,
                    timestamp: new Date(date.getTime() + Math.random() * 86400000),
                });
            }

            // Life events (rare)
            if (Math.random() < 0.008) {
                const sig = SIGNAL_TYPES[5]; // LIFE_EVENT
                allSignals.push({
                    userId: profile.user.id,
                    type: sig.type,
                    subType: sig.subTypes[Math.floor(Math.random() * sig.subTypes.length)],
                    value: 1,
                    timestamp: new Date(date.getTime() + Math.random() * 86400000),
                });
            }

            // Market signals (sporadic)
            if (Math.random() < 0.02) {
                allSignals.push({
                    userId: profile.user.id,
                    type: 'MARKET',
                    subType: ['COMPETITOR_OFFER', 'RATE_CHANGE'][Math.floor(Math.random() * 2)],
                    value: 1,
                    timestamp: new Date(date.getTime() + Math.random() * 86400000),
                });
            }

            // Product inquiries (weekly)
            if (Math.random() < 0.1) {
                const sig = SIGNAL_TYPES[7]; // PRODUCT_INQUIRY
                allSignals.push({
                    userId: profile.user.id,
                    type: sig.type,
                    subType: sig.subTypes[Math.floor(Math.random() * sig.subTypes.length)],
                    value: 1,
                    timestamp: new Date(date.getTime() + Math.random() * 86400000),
                });
            }

            // Support calls
            if (Math.random() < profile.complaintRate * 0.5) {
                allSignals.push({
                    userId: profile.user.id,
                    type: 'SUPPORT_CALL',
                    subType: ['IVR', 'AGENT', 'CHAT'][Math.floor(Math.random() * 3)],
                    value: 1,
                    timestamp: new Date(date.getTime() + Math.random() * 86400000),
                });
            }
        }
    }

    // Batch insert in chunks of 500
    for (let i = 0; i < allSignals.length; i += 500) {
        await prisma.customerSignal.createMany({ data: allSignals.slice(i, i + 500) });
    }
    console.log(`    ✅ ${allSignals.length} signals created across 120+ days for 3 customers`);

    console.log('  Creating outreach segments...');
    await prisma.audienceSegment.createMany({ data: [
        { name: 'High-Risk Customers', description: 'Customers with risk score > 0.6', filterJson: '{}', customerCount: 1 },
        { name: 'Low Balance (<₹10K)', description: 'Balance below 10000', filterJson: '{}', customerCount: 2 },
        { name: 'New Customers (30d)', description: 'Joined within last 30 days', filterJson: '{}', customerCount: 3 },
    ]});
    console.log('    ✅ 3 audience segments created');

    // ── Retention Hub: Seed Offer Library ────────────────────
    console.log('  Creating offer library templates...');
    await prisma.offerLibrary.createMany({ data: [
        { name: 'Fee Waiver — 90 Days', category: 'FEE_WAIVER', tier: 'LOW_COST', description: 'Waive all account maintenance fees for 90 days.', whyShown: 'We noticed your account activity has changed recently.', problemSolved: 'This removes fee pressure so you can focus on what matters.', customerGain: 'All fees waived for 90 days — no action needed.', validityDays: 90, targetRiskLevels: '["AT_RISK","CRITICAL"]', targetReasons: '["FEE_SENSITIVITY","INACTIVITY"]', cooldownDays: 60, maxPerCustomer: 1, requiresApproval: false },
        { name: 'FD Rate Boost — +1.5%', category: 'RATE_ADJUSTMENT', tier: 'PREMIUM', description: 'Premium FD rate boost for high-value retention.', whyShown: 'As a valued customer, we have a special rate for you.', problemSolved: 'Earn more on your savings with our best available rate.', customerGain: '+1.5% FD rate for 6 months on deposits above ₹1L.', validityDays: 30, targetRiskLevels: '["HIGH","CRITICAL"]', targetReasons: '["COMPETITOR_EXPOSURE","FEE_SENSITIVITY"]', cooldownDays: 90, maxPerCustomer: 1, requiresApproval: true },
        { name: 'Cashback Boost — ₹500', category: 'REWARD_BOOST', tier: 'STANDARD', description: 'Instant ₹500 loyalty credit on next 3 transactions.', whyShown: 'We appreciate your loyalty and want to reward you.', problemSolved: 'A small thank-you for banking with us.', customerGain: '₹500 cashback split across your next 3 transactions.', validityDays: 30, targetRiskLevels: '["MODERATE","HIGH"]', targetReasons: '["LOW_DIGITAL_ADOPTION","INACTIVITY"]', cooldownDays: 30, maxPerCustomer: 2, requiresApproval: false },
        { name: 'Service Recovery — ₹500 Credit', category: 'SERVICE_RECOVERY', tier: 'STANDARD', description: 'Apology credit for service issues.', whyShown: 'We know your recent experience was not up to our standards.', problemSolved: 'We want to make things right with a service recovery credit.', customerGain: '₹500 credited to your account within 24 hours.', validityDays: 7, targetRiskLevels: '["AT_RISK","HIGH","CRITICAL"]', targetReasons: '["POOR_SERVICE"]', cooldownDays: 14, maxPerCustomer: 3, requiresApproval: false },
        { name: 'Digital Banking Starter Pack', category: 'BUNDLE_UPGRADE', tier: 'LOW_COST', description: 'Free premium features for 60 days to boost digital adoption.', whyShown: 'We noticed you haven\'t explored our digital tools yet.', problemSolved: 'Get the most out of your banking with premium digital features.', customerGain: '60 days of premium digital banking — free transfers, insights & more.', validityDays: 60, targetRiskLevels: '["MODERATE","AT_RISK"]', targetReasons: '["LOW_DIGITAL_ADOPTION"]', cooldownDays: 90, maxPerCustomer: 1, requiresApproval: false },
        { name: 'Welcome Back — Reactivation Bonus', category: 'REACTIVATION_PROMPT', tier: 'STANDARD', description: 'Special reactivation offer for dormant accounts.', whyShown: 'We miss you! Your account has been inactive.', problemSolved: 'Reactivate your account and enjoy exclusive benefits.', customerGain: '₹200 bonus + waived fees for 30 days on reactivation.', validityDays: 30, targetRiskLevels: '["AT_RISK","CRITICAL"]', targetReasons: '["INACTIVITY"]', cooldownDays: 60, maxPerCustomer: 1, requiresApproval: false },
    ]});
    console.log('    ✅ 6 offer library templates created');

    console.log('\n✅ Seeding complete! Database is ready for demo.\n');
    console.log('📋 Test Accounts (all passwords: Test@1234):');
    console.log('   Customers:');
    console.log('     arjun@lifeline.com  — Moderate stress, salary dropping');
    // ── Seed PULSE Feedback Insights ────────────────────────
    console.log('📊 Seeding PULSE Feedback Insights...');
    const feedbackData = [
        { periodLabel: '2026-W18', channel: 'WHATSAPP', riskLevel: 'CRITICAL', sampleSize: 45, deliveryRate: 0.94, openRate: 0.72, conversionRate: 0.18, complaintRate: 0.02, costPerConversion: 44.4, insight: 'WhatsApp is the top performer for CRITICAL risk — 18% conversion at ₹44/conversion.', recommendedAction: 'INCREASE_WEIGHT' },
        { periodLabel: '2026-W18', channel: 'RM_CALL', riskLevel: 'CRITICAL', sampleSize: 30, deliveryRate: 0.70, openRate: 0.60, conversionRate: 0.22, complaintRate: 0.01, costPerConversion: 681.8, insight: 'RM_CALL has highest conversion (22%) for CRITICAL risk but cost is ₹682/conversion.', recommendedAction: 'MAINTAIN' },
        { periodLabel: '2026-W18', channel: 'SMS', riskLevel: 'HIGH', sampleSize: 120, deliveryRate: 0.95, openRate: 0.60, conversionRate: 0.09, complaintRate: 0.03, costPerConversion: 55.6, insight: 'SMS shows solid 9% conversion for HIGH risk customers at low cost.', recommendedAction: 'MAINTAIN' },
        { periodLabel: '2026-W18', channel: 'EMAIL', riskLevel: 'MODERATE', sampleSize: 200, deliveryRate: 0.85, openRate: 0.30, conversionRate: 0.04, complaintRate: 0.05, costPerConversion: 50.0, insight: 'EMAIL has low conversion (4%) for MODERATE risk. Consider reducing weight.', recommendedAction: 'DECREASE_WEIGHT' },
        { periodLabel: '2026-W18', channel: 'PUSH', riskLevel: 'HIGH', sampleSize: 80, deliveryRate: 0.80, openRate: 0.25, conversionRate: 0.03, complaintRate: 0.08, costPerConversion: 33.3, insight: 'PUSH notifications for HIGH risk have high complaint rate (8%). Reducing frequency.', recommendedAction: 'DECREASE_WEIGHT' },
        { periodLabel: '2026-W18', channel: 'INAPP', riskLevel: 'MODERATE', sampleSize: 150, deliveryRate: 0.99, openRate: 0.50, conversionRate: 0.15, complaintRate: 0.01, costPerConversion: 3.3, insight: 'In-app messages are highly cost-effective for MODERATE risk at ₹3.3/conversion.', recommendedAction: 'INCREASE_WEIGHT' },
        { periodLabel: '2026-W18', channel: 'BRANCH', riskLevel: 'CRITICAL', sampleSize: 15, deliveryRate: 0.60, openRate: 0.90, conversionRate: 0.30, complaintRate: 0.00, costPerConversion: 666.7, insight: 'Branch visits yield 30% conversion for CRITICAL but have highest cost. Reserve for premium.', recommendedAction: 'MAINTAIN' },
        { periodLabel: '2026-W19', channel: 'WHATSAPP', riskLevel: 'HIGH', sampleSize: 90, deliveryRate: 0.92, openRate: 0.70, conversionRate: 0.14, complaintRate: 0.02, costPerConversion: 57.1, insight: 'WhatsApp maintains strong performance for HIGH risk — 14% conversion improving.', recommendedAction: 'INCREASE_WEIGHT' },
        { periodLabel: '2026-W19', channel: 'SMS', riskLevel: 'MODERATE', sampleSize: 180, deliveryRate: 0.96, openRate: 0.62, conversionRate: 0.08, complaintRate: 0.03, costPerConversion: 62.5, insight: 'SMS converts 8% for MODERATE risk, reliable and cost-effective.', recommendedAction: 'MAINTAIN' },
        { periodLabel: '2026-W19', channel: 'INAPP', riskLevel: 'HIGH', sampleSize: 70, deliveryRate: 0.99, openRate: 0.55, conversionRate: 0.16, complaintRate: 0.01, costPerConversion: 3.1, insight: 'In-app for HIGH risk improved to 16% conversion. Best cost efficiency in system.', recommendedAction: 'INCREASE_WEIGHT' },
    ];
    for (const fi of feedbackData) {
        await prisma.feedbackInsight.create({ data: fi });
    }
    console.log(`   ✅ ${feedbackData.length} feedback insights seeded`);

    console.log('     meena@lifeline.com  — Healthy finances, low stress');
    console.log('     deepak@lifeline.com — Critical stress, very low balance');
    console.log('   Employees:');
    console.log('     priya@lifeline.com  — Moderate stress (handles Arjun)');
    console.log('     rahul@lifeline.com  — Low stress, healthy');
    console.log('     sneha@lifeline.com  — High stress (handles Deepak\'s critical cases)');
    console.log('     vikram@lifeline.com — Moderate, experienced');
    console.log('   Admin:');
    console.log('     admin@lifeline.com');

    // ═══════════════════════════════════════════════════════════
    // CUSTOMER PORTAL — Seed Data
    // ═══════════════════════════════════════════════════════════

    // ── Customer Goals ──────────────────────────────────────
    console.log('  Creating customer goals...');
    await prisma.customerGoal.createMany({ data: [
        { userId: customer.id, goalType: 'EMERGENCY_FUND', goalName: 'Emergency Fund', targetAmount: 150000, currentAmount: 42000, targetDate: new Date('2027-03-31'), monthlyContribution: 5000, fundingMethod: 'AUTO_TRANSFER', status: 'ACTIVE' },
        { userId: customer.id, goalType: 'VACATION', goalName: 'Goa Trip 2027', targetAmount: 60000, currentAmount: 18000, targetDate: new Date('2027-01-15'), monthlyContribution: 3000, fundingMethod: 'MANUAL', status: 'ACTIVE' },
        { userId: customer.id, goalType: 'VEHICLE', goalName: 'New Bike Down Payment', targetAmount: 80000, currentAmount: 80000, targetDate: new Date('2026-06-30'), monthlyContribution: 0, fundingMethod: 'MANUAL', status: 'COMPLETED' },
        { userId: customer2.id, goalType: 'HOME', goalName: 'Dream Home Down Payment', targetAmount: 1500000, currentAmount: 520000, targetDate: new Date('2028-12-31'), monthlyContribution: 25000, fundingMethod: 'LINKED_SIP', status: 'ACTIVE' },
        { userId: customer2.id, goalType: 'EDUCATION', goalName: 'MBA Fund', targetAmount: 800000, currentAmount: 210000, targetDate: new Date('2028-06-30'), monthlyContribution: 15000, fundingMethod: 'LINKED_RD', status: 'ACTIVE' },
        { userId: customer3.id, goalType: 'EMERGENCY_FUND', goalName: 'Emergency Savings', targetAmount: 100000, currentAmount: 8500, targetDate: new Date('2027-12-31'), monthlyContribution: 2000, fundingMethod: 'MANUAL', status: 'PAUSED' },
    ]});
    console.log('    ✅ 6 customer goals created');

    // ── Customer Preferences ────────────────────────────────
    console.log('  Creating customer preferences...');
    await prisma.customerPreferences.createMany({ data: [
        { userId: customer.id, languagePreference: 'EN', uiMode: 'STANDARD', transactionAlertThreshold: 2000, marketingOptIn: true, quietHoursStart: 22, quietHoursEnd: 7 },
        { userId: customer2.id, languagePreference: 'EN', uiMode: 'STANDARD', transactionAlertThreshold: 5000, marketingOptIn: true, quietHoursStart: 23, quietHoursEnd: 8 },
        { userId: customer3.id, languagePreference: 'HI', uiMode: 'SIMPLIFIED', transactionAlertThreshold: 500, marketingOptIn: false, quietHoursStart: 21, quietHoursEnd: 9 },
    ]});
    console.log('    ✅ 3 customer preferences created');

    // ── Consent Records ────────────────────────────────────
    console.log('  Creating consent records...');
    await prisma.consentRecord.createMany({ data: [
        { userId: customer.id, consentType: 'PERSONALIZED_OFFERS', granted: true, grantedAt: new Date('2024-06-15'), ipAddress: '49.207.12.34' },
        { userId: customer.id, consentType: 'SAGE_ANALYSIS', granted: true, grantedAt: new Date('2024-06-15'), ipAddress: '49.207.12.34' },
        { userId: customer.id, consentType: 'CROSS_PRODUCT_PROFILE', granted: false, grantedAt: new Date('2024-06-15'), ipAddress: '49.207.12.34' },
        { userId: customer2.id, consentType: 'PERSONALIZED_OFFERS', granted: true, grantedAt: new Date('2023-08-10'), ipAddress: '103.21.56.78' },
        { userId: customer2.id, consentType: 'SAGE_ANALYSIS', granted: true, grantedAt: new Date('2023-08-10'), ipAddress: '103.21.56.78' },
        { userId: customer2.id, consentType: 'CROSS_PRODUCT_PROFILE', granted: true, grantedAt: new Date('2023-08-10'), ipAddress: '103.21.56.78' },
        { userId: customer2.id, consentType: 'ACCOUNT_AGGREGATOR', granted: true, grantedAt: new Date('2024-01-05'), ipAddress: '103.21.56.78' },
    ]});
    console.log('    ✅ 7 consent records created');

    // ── Spending Budgets ────────────────────────────────────
    console.log('  Creating spending budgets...');
    await prisma.customerSpendingBudget.createMany({ data: [
        { userId: customer.id, category: 'FOOD', monthlyLimit: 10000, isActive: true },
        { userId: customer.id, category: 'ENTERTAINMENT', monthlyLimit: 3000, isActive: true },
        { userId: customer.id, category: 'TRANSPORT', monthlyLimit: 4000, isActive: true },
        { userId: customer2.id, category: 'FOOD', monthlyLimit: 8000, isActive: true },
        { userId: customer2.id, category: 'ENTERTAINMENT', monthlyLimit: 5000, isActive: true },
    ]});
    console.log('    ✅ 5 spending budgets created');

    // ── Customer Notifications ──────────────────────────────
    console.log('  Creating customer notifications...');
    const notifNow = new Date();
    await prisma.customerNotification.createMany({ data: [
        { userId: customer.id, type: 'TRANSACTION', title: 'Salary Credited', message: 'Your salary of ₹42,000 has been credited to your account.', channel: 'IN_APP', isRead: true, actionUrl: null, createdAt: new Date(notifNow.getTime() - 2 * 86400000) },
        { userId: customer.id, type: 'BALANCE_ALERT', title: 'Low Balance Warning', message: 'Your account balance is below ₹15,000. Consider reviewing your expenses.', channel: 'IN_APP', isRead: false, actionUrl: '/portal/finances/spending', createdAt: new Date(notifNow.getTime() - 1 * 86400000) },
        { userId: customer.id, type: 'SAGE_NUDGE', title: 'Savings Tip from Sage', message: 'Your emergency fund is 28% funded. Saving ₹5,000/month will get you there by March 2027!', channel: 'IN_APP', isRead: false, actionUrl: '/portal/goals', createdAt: new Date(notifNow.getTime() - 4 * 3600000) },
        { userId: customer.id, type: 'OFFER', title: 'Special FD Rate for You', message: 'Lock in 7.8% on a 1-year FD. Limited time offer!', channel: 'IN_APP', isRead: false, actionUrl: '/portal/offers', createdAt: new Date(notifNow.getTime() - 1 * 3600000) },
        { userId: customer.id, type: 'SECURITY', title: 'Login from New Device', message: "A new login was detected from Chrome on Windows 11. If this wasn't you, please change your password immediately.", channel: 'IN_APP', isRead: true, actionUrl: '/portal/settings/security', createdAt: new Date(notifNow.getTime() - 3 * 86400000) },
        { userId: customer.id, type: 'EMI_REMINDER', title: 'Credit Card Due in 5 Days', message: 'Your credit card payment of ₹12,000 is due on June 15. Pay now to avoid late fees.', channel: 'IN_APP', isRead: false, actionUrl: '/portal/finances/accounts', createdAt: new Date(notifNow.getTime() - 2 * 3600000) },
        { userId: customer2.id, type: 'SIP_CONFIRMATION', title: 'SIP Processed', message: 'Your SIP of ₹10,000 in TrustEdge Bluechip Fund has been processed successfully.', channel: 'IN_APP', isRead: true, actionUrl: null, createdAt: new Date(notifNow.getTime() - 1 * 86400000) },
        { userId: customer2.id, type: 'OFFER', title: 'Pre-Approved Home Loan', message: 'You are pre-approved for a home loan up to ₹50 Lakhs at 8.5%. Apply now!', channel: 'IN_APP', isRead: false, actionUrl: '/portal/offers', createdAt: new Date(notifNow.getTime() - 6 * 3600000) },
        { userId: customer2.id, type: 'ANNOUNCEMENT', title: 'New Feature: Net Worth Tracker', message: 'Track all your assets and liabilities in one place. Try our new Net Worth feature!', channel: 'IN_APP', isRead: false, actionUrl: '/portal/finances/networth', createdAt: new Date(notifNow.getTime() - 12 * 3600000) },
        { userId: customer3.id, type: 'BALANCE_ALERT', title: 'Critical Balance Alert', message: 'Your balance is critically low at ₹3,200. Immediate action recommended.', channel: 'IN_APP', isRead: false, actionUrl: '/portal/finances/accounts', createdAt: new Date(notifNow.getTime() - 30 * 60000) },
        { userId: customer3.id, type: 'SAGE_NUDGE', title: 'Financial Health Check', message: 'Your financial stress level is Critical. Sage can help you build a recovery plan.', channel: 'IN_APP', isRead: false, actionUrl: '/sage', createdAt: new Date(notifNow.getTime() - 5 * 3600000) }
    ]});
    console.log('    ✅ 11 customer notifications created');

    // ── Offer Interactions ──────────────────────────────────
    console.log('  Creating offer interactions...');
    await prisma.offerInteraction.createMany({ data: [
        { userId: customer.id, offerId: 'OFR-FD-BOOST', offerTitle: 'FD Rate Boost — +0.5%', offerType: 'FD', viewedAt: new Date(notifNow.getTime() - 3 * 86400000), action: null, expiresAt: new Date(notifNow.getTime() + 15 * 86400000) },
        { userId: customer.id, offerId: 'OFR-SIP-CASHBACK', offerTitle: 'SIP Cashback ₹500', offerType: 'SIP', viewedAt: new Date(notifNow.getTime() - 5 * 86400000), action: 'ACCEPTED', actionTakenAt: new Date(notifNow.getTime() - 4 * 86400000), expiresAt: new Date(notifNow.getTime() + 25 * 86400000) },
        { userId: customer.id, offerId: 'OFR-CC-UPGRADE', offerTitle: 'Credit Card Upgrade', offerType: 'CREDIT_CARD', viewedAt: new Date(notifNow.getTime() - 1 * 86400000), action: null, expiresAt: new Date(notifNow.getTime() + 7 * 86400000) },
        { userId: customer2.id, offerId: 'OFR-HOME-LOAN', offerTitle: 'Pre-Approved Home Loan ₹50L', offerType: 'LOAN', viewedAt: new Date(notifNow.getTime() - 2 * 86400000), action: 'EXPLORING', actionTakenAt: new Date(notifNow.getTime() - 1 * 86400000), expiresAt: new Date(notifNow.getTime() + 30 * 86400000) },
        { userId: customer2.id, offerId: 'OFR-RD-SPECIAL', offerTitle: 'RD at 7.2% — Special Rate', offerType: 'RD', viewedAt: new Date(notifNow.getTime() - 7 * 86400000), action: 'DECLINED', declineReason: 'Already have an RD', actionTakenAt: new Date(notifNow.getTime() - 6 * 86400000), expiresAt: new Date(notifNow.getTime() + 10 * 86400000) },
    ]});
    console.log('    ✅ 5 offer interactions created');

    // ── Support Tickets ─────────────────────────────────────
    console.log('  Creating support tickets...');
    const ticket1 = await prisma.supportTicket.create({ data: {
        userId: customer.id, ticketNumber: 'SPT-2026-00001', category: 'TRANSACTION', subCategory: 'Failed UPI', description: 'I made a UPI payment of ₹3,500 to a vendor but the amount was debited and the vendor did not receive the money. Transaction ID: UPI-2026052912345.', status: 'IN_PROGRESS', slaDeadline: new Date(notifNow.getTime() + 5 * 86400000), assignedTeam: 'Transaction Support',
    }});
    const ticket2 = await prisma.supportTicket.create({ data: {
        userId: customer.id, ticketNumber: 'SPT-2026-00002', category: 'ACCOUNT', subCategory: 'Statement Request', description: 'Please provide my account statement for the last 6 months in PDF format.', status: 'RESOLVED', resolutionNote: 'Statement has been emailed to your registered email address.', slaDeadline: new Date(notifNow.getTime() - 3 * 86400000), assignedTeam: 'Account Services', resolvedAt: new Date(notifNow.getTime() - 4 * 86400000),
    }});
    const ticket3 = await prisma.supportTicket.create({ data: {
        userId: customer3.id, ticketNumber: 'SPT-2026-00003', category: 'LOAN', subCategory: 'EMI Restructuring', description: 'Due to salary reduction, I am unable to pay my current EMI. Please help me restructure the payment plan.', status: 'OPEN', slaDeadline: new Date(notifNow.getTime() + 7 * 86400000), assignedTeam: 'Loan Support',
    }});
    
    await prisma.ticketCommunication.createMany({ data: [
        { ticketId: ticket1.id, fromRole: 'CUSTOMER', message: 'I made a UPI payment of ₹3,500 to a vendor but the amount was debited and the vendor did not receive the money. Transaction ID: UPI-2026052912345.', createdAt: new Date(notifNow.getTime() - 2 * 86400000) },
        { ticketId: ticket1.id, fromRole: 'SUPPORT', message: 'We are investigating your transaction. The refund process has been initiated and should reflect within 3-5 business days.', createdAt: new Date(notifNow.getTime() - 1 * 86400000) },
    ]});
    console.log('    ✅ 3 support tickets and communications created');

    // ── Seeding 20+ Customers and Churn Reports (from TrustEdge Antigravity Plan) ──
    await seedAtRiskCustomers();
}

// Indian names for realistic demo
const INDIAN_NAMES = [
  'Priya Sharma', 'Rahul Verma', 'Anita Krishnamurthy', 'Mohammed Shaikh',
  'Deepa Nair', 'Suresh Patel', 'Kavitha Reddy', 'Arjun Mehta',
  'Lakshmi Iyer', 'Vikram Sen', 'Sunita Gupta', 'Rajesh Yadav',
  'Pooja Mishra', 'Arun Kumar', 'Meena Pillai', 'Sanjay Chopra',
  'Rekha Joshi', 'Vinod Tiwari', 'Nalini Rao', 'Prakash Patil',
  'Geeta Saxena', 'Manoj Dubey', 'Shanti Nambiar', 'Ramesh Bangera',
  'Usha Hegde', 'Naresh Gowda', 'Bharati Kulkarni', 'Santosh More',
];

// Customer profiles: 5 AT_RISK + 5 DORMANT + 10 STABLE
const CUSTOMER_PROFILES = [
  // --- AT_RISK (churn probability > 0.70) ---
  { riskTier: 'AT_RISK', salary_drop_pct: 72, app_logins: 1, num_sip_cancelled: 3, num_complaints: 3, competitor_ratio: 0.45, emi_missed: 1, fd_cancelled: 1, balance: 42000, income: 65000 },
  { riskTier: 'AT_RISK', salary_drop_pct: 85, app_logins: 0, num_sip_cancelled: 2, num_complaints: 2, competitor_ratio: 0.60, emi_missed: 1, fd_cancelled: 0, balance: 8200,  income: 40000 },
  { riskTier: 'AT_RISK', salary_drop_pct: 60, app_logins: 2, num_sip_cancelled: 3, num_complaints: 4, competitor_ratio: 0.35, emi_missed: 0, fd_cancelled: 1, balance: 31000, income: 55000 },
  { riskTier: 'AT_RISK', salary_drop_pct: 90, app_logins: 0, num_sip_cancelled: 1, num_complaints: 5, competitor_ratio: 0.70, emi_missed: 2, fd_cancelled: 1, balance: 5600,  income: 30000 },
  { riskTier: 'AT_RISK', salary_drop_pct: 55, app_logins: 3, num_sip_cancelled: 2, num_complaints: 2, competitor_ratio: 0.40, emi_missed: 1, fd_cancelled: 0, balance: 67000, income: 90000 },
  // --- DORMANT ---
  { riskTier: 'DORMANT', salary_drop_pct: 10, app_logins: 0, num_sip_cancelled: 0, num_complaints: 0, competitor_ratio: 0.05, emi_missed: 0, fd_cancelled: 0, balance: 120000, income: 45000 },
  { riskTier: 'DORMANT', salary_drop_pct: 5, app_logins: 1, num_sip_cancelled: 0, num_complaints: 1, competitor_ratio: 0.08, emi_missed: 0, fd_cancelled: 0, balance: 88000, income: 55000 },
  { riskTier: 'DORMANT', salary_drop_pct: 0, app_logins: 0, num_sip_cancelled: 0, num_complaints: 0, competitor_ratio: 0.02, emi_missed: 0, fd_cancelled: 0, balance: 200000, income: 80000 },
  { riskTier: 'DORMANT', salary_drop_pct: 8, app_logins: 1, num_sip_cancelled: 1, num_complaints: 0, competitor_ratio: 0.10, emi_missed: 0, fd_cancelled: 0, balance: 55000, income: 40000 },
  { riskTier: 'DORMANT', salary_drop_pct: 3, app_logins: 0, num_sip_cancelled: 0, num_complaints: 0, competitor_ratio: 0.04, emi_missed: 0, fd_cancelled: 0, balance: 310000, income: 100000 },
  // --- STABLE ---
  { riskTier: 'STABLE', salary_drop_pct: 0, app_logins: 15, num_sip_cancelled: 0, num_complaints: 0, competitor_ratio: 0.02, emi_missed: 0, fd_cancelled: 0, balance: 284320, income: 120000 },
  { riskTier: 'STABLE', salary_drop_pct: 5, app_logins: 20, num_sip_cancelled: 0, num_complaints: 0, competitor_ratio: 0.01, emi_missed: 0, fd_cancelled: 0, balance: 176000, income: 95000 },
  { riskTier: 'STABLE', salary_drop_pct: 0, app_logins: 12, num_sip_cancelled: 0, num_complaints: 1, competitor_ratio: 0.03, emi_missed: 0, fd_cancelled: 0, balance: 92000, income: 75000 },
  { riskTier: 'STABLE', salary_drop_pct: 2, app_logins: 18, num_sip_cancelled: 0, num_complaints: 0, competitor_ratio: 0.01, emi_missed: 0, fd_cancelled: 0, balance: 432000, income: 150000 },
  { riskTier: 'STABLE', salary_drop_pct: 0, app_logins: 25, num_sip_cancelled: 0, num_complaints: 0, competitor_ratio: 0.02, emi_missed: 0, fd_cancelled: 0, balance: 198000, income: 110000 },
  { riskTier: 'STABLE', salary_drop_pct: 3, app_logins: 10, num_sip_cancelled: 0, num_complaints: 0, competitor_ratio: 0.05, emi_missed: 0, fd_cancelled: 0, balance: 78000, income: 60000 },
  { riskTier: 'STABLE', salary_drop_pct: 0, app_logins: 16, num_sip_cancelled: 0, num_complaints: 0, competitor_ratio: 0.01, emi_missed: 0, fd_cancelled: 0, balance: 540000, income: 200000 },
  { riskTier: 'STABLE', salary_drop_pct: 7, app_logins: 9, num_sip_cancelled: 0, num_complaints: 1, competitor_ratio: 0.02, emi_missed: 0, fd_cancelled: 0, balance: 62000, income: 50000 },
  { riskTier: 'STABLE', salary_drop_pct: 1, app_logins: 22, num_sip_cancelled: 0, num_complaints: 0, competitor_ratio: 0.01, emi_missed: 0, fd_cancelled: 0, balance: 370000, income: 140000 },
  { riskTier: 'STABLE', salary_drop_pct: 4, app_logins: 14, num_sip_cancelled: 0, num_complaints: 0, competitor_ratio: 0.03, emi_missed: 0, fd_cancelled: 0, balance: 145000, income: 85000 }
];

async function seedAtRiskCustomers() {
  console.log('🌱 Seeding TrustEdge synthetic at-risk customers...');
  
  for (let i = 0; i < CUSTOMER_PROFILES.length; i++) {
    const profile = CUSTOMER_PROFILES[i];
    const name = INDIAN_NAMES[i % INDIAN_NAMES.length];
    const email = `${name.split(' ')[0].toLowerCase()}.${i}@demo.trustedge.in`;

    // 1. Create User
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        name,
        email,
        passwordHash: '$2b$10$demo_hash_placeholder',
        role: 'CUSTOMER',
        phone: `+9198${String(10000000 + i).slice(1)}`,
        branchName: ['Mumbai Main', 'Delhi Central', 'Bengaluru Tech Park', 'Chennai North', 'Hyderabad Jubilee'][i % 5],
        accountType: ['SAVINGS', 'SALARY', 'CURRENT'][i % 3],
        city: ['Mumbai', 'Delhi', 'Bengaluru', 'Chennai', 'Hyderabad'][i % 5],
        kycStatus: 'VERIFIED',
        accountNumber: '3009' + String(10000000 + i).slice(1) + '88',
      },
    });

    // 2. Create FinancialProfile
    await prisma.financialProfile.upsert({
      where: { userId: user.id },
      update: { currentBalance: profile.balance, monthlyIncome: profile.income },
      create: {
        userId: user.id,
        monthlyIncome: profile.income,
        monthlyExpenses: Math.floor(profile.income * 0.72),
        currentBalance: profile.balance,
        riskScore: computeRiskScoreFromProfile(profile),
        stressLevel: profile.riskTier === 'AT_RISK' ? 'HIGH' : 'LOW',
      },
    });

    // 3. Create ChurnReport
    const riskScore = computeRiskScoreFromProfile(profile);
    await prisma.churnReport.create({
      data: {
        userId: user.id,
        periodStart: new Date(Date.now() - 90 * 86400000),
        periodEnd: new Date(),
        overallRisk: riskScore,
        riskLevel: profile.riskTier,
        churnProbability: riskScore,
        signalSummary: JSON.stringify({ salary_drop_pct: profile.salary_drop_pct, app_logins: profile.app_logins }),
        dailyRiskCurve: JSON.stringify(generateDailyRiskCurve(riskScore)),
        topRiskFactors: JSON.stringify(getTopRiskFactors(profile)),
        recommendations: getRecommendation(profile),
        ghostJourney: JSON.stringify({ p50_churn_by_day60: riskScore, expected_aum_loss: `₹${Math.round(profile.balance * riskScore).toLocaleString('en-IN')}` }),
      },
    });

    // 4. Upsert CustomerHealthScore
    await prisma.customerHealthScore.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        healthScore: 1.0 - riskScore,
        healthLevel: profile.riskTier,
        lifecycleStage: profile.riskTier,
        disengagementReason: getDominantReason(profile),
        digitalAdoption: profile.app_logins / 30.0,
        complaintVelocity: profile.num_complaints / 3.0,
        suggestedOffer: getSuggestedOffer(profile),
        suggestedChannel: profile.riskTier === 'AT_RISK' ? 'RM_CALL' : 'EMAIL',
        suggestedMessage: getRecommendation(profile),
      },
    });

    console.log(`  ✅ ${profile.riskTier.padEnd(8)} · ${name}`);
  }
}

function computeRiskScoreFromProfile(p) {
  return Math.min(0.99, Math.max(0.01,
    0.30 * (p.salary_drop_pct / 100.0) +
    0.20 * (1.0 - Math.min(p.app_logins / 20.0, 1.0)) +
    0.15 * Math.min(p.num_sip_cancelled / 3.0, 1.0) +
    0.15 * Math.min(p.num_complaints / 3.0, 1.0) +
    0.10 * p.competitor_ratio +
    0.05 * p.emi_missed +
    0.05 * p.fd_cancelled
  ));
}

function getDominantReason(p) {
  if (p.num_complaints >= 2 || p.emi_missed >= 1) return 'FEE_SENSITIVITY';
  if (p.app_logins <= 2) return 'LOW_DIGITAL_ADOPTION';
  if (p.salary_drop_pct >= 50) return 'LIFE_EVENT';
  if (p.competitor_ratio >= 0.3) return 'COMPETITOR_EXPOSURE';
  return 'INACTIVITY';
}

function getSuggestedOffer(p) {
  const reason = getDominantReason(p);
  const offers = {
    FEE_SENSITIVITY: 'EMI Relief Package — waive next EMI + 0.25% rate reduction',
    LOW_DIGITAL_ADOPTION: 'Digital Activation Bonus — ₹500 cashback on first 5 digital transactions',
    LIFE_EVENT: 'Salary Account Upgrade — zero-fee premium account for 6 months',
    COMPETITOR_EXPOSURE: 'Rate Match Guarantee — FD rate matched to any competitor + 0.10%',
    INACTIVITY: 'Welcome Back FD — special 7.25% p.a. for returning customers',
  };
  return offers[reason] || offers['INACTIVITY'];
}

function getRecommendation(p) {
  if (p.riskTier === 'AT_RISK') return 'Schedule RM call within 24h — present personalized retention offer';
  if (p.riskTier === 'DORMANT') return 'Send in-app re-engagement nudge with savings rate highlight';
  return 'Include in standard engagement campaign — no urgent action needed';
}

function getTopRiskFactors(p) {
  const factors = [
    { factor: 'Salary Drop', score: p.salary_drop_pct / 100.0 },
    { factor: 'App Inactivity', score: 1.0 - Math.min(p.app_logins / 20.0, 1.0) },
    { factor: 'SIP Cancellations', score: p.num_sip_cancelled / 3.0 },
    { factor: 'Complaint Frequency', score: p.num_complaints / 5.0 },
    { factor: 'Competitor Transfers', score: p.competitor_ratio },
  ];
  return factors.sort((a, b) => b.score - a.score).slice(0, 3);
}

function generateDailyRiskCurve(baseRisk) {
  return Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    probability: Math.min(1.0, baseRisk * (1.0 + i * 0.01)),
  }));
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error('❌ Seeding failed:', e);
        await prisma.$disconnect();
        process.exit(1);
    });
