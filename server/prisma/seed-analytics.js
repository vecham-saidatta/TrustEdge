const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding analytics data...');

  // Get a user to attach products to
  const user = await prisma.user.findFirst({ where: { role: 'CUSTOMER' } });
  if (!user) {
    console.log('No customer found. Exiting.');
    return;
  }

  // 1. Seed Customer Products
  await prisma.customerProduct.deleteMany();
  await prisma.customerProduct.createMany({
    data: [
      { userId: user.id, productType: 'FD', productName: 'TrustEdge Fixed Deposit', accountNumber: 'FD-2024-001', currentValue: 200000, investedAmount: 200000, interestRate: 7.5, startDate: new Date('2024-06-15'), maturityDate: new Date('2026-12-15'), status: 'ACTIVE' },
      { userId: user.id, productType: 'FD', productName: 'TrustEdge Tax Saver FD', accountNumber: 'FD-2025-002', currentValue: 100000, investedAmount: 100000, interestRate: 7.2, startDate: new Date('2025-01-10'), maturityDate: new Date('2026-01-10'), status: 'ACTIVE' },
      { userId: user.id, productType: 'RD', productName: 'Recurring Deposit', accountNumber: 'RD-2024-003', currentValue: 36000, investedAmount: 30000, monthlyAmount: 3000, interestRate: 6.8, startDate: new Date('2024-06-01'), maturityDate: new Date('2027-06-01'), status: 'ACTIVE' },
      { userId: user.id, productType: 'SIP', productName: 'TrustEdge Bluechip Fund', accountNumber: 'SIP-2024-001', currentValue: 65000, investedAmount: 55000, monthlyAmount: 5000, startDate: new Date('2024-01-15'), status: 'ACTIVE' },
      { userId: user.id, productType: 'LOAN', productName: 'Personal Loan', accountNumber: 'LN-2023-001', outstandingAmount: 120000, creditLimit: 500000, interestRate: 14.5, startDate: new Date('2023-05-10'), status: 'ACTIVE' },
      { userId: user.id, productType: 'LOAN', productName: 'Credit Card', accountNumber: 'CC-2022-001', outstandingAmount: 23400, creditLimit: 150000, interestRate: 24.0, startDate: new Date('2022-01-15'), status: 'ACTIVE' },
      { userId: user.id, productType: 'INSURANCE', productName: 'Term Life Cover', accountNumber: 'INS-2024-001', coverAmount: 5000000, premium: 12000, startDate: new Date('2024-09-01'), status: 'ACTIVE' },
    ]
  });

  // 2. Seed RM Profile and Tasks
  const employee = await prisma.user.findFirst({ where: { role: 'EMPLOYEE' } });
  if (employee) {
    await prisma.rMProfile.deleteMany();
    const rm = await prisma.rMProfile.create({
      data: {
        userId: employee.id,
        branchCode: 'BR-101',
        totalCustomers: 240,
        aum: 45000000,
        conversionRate: 18.5,
        avgSlaResponseTime: 4.2,
        rating: 4.8
      }
    });

    await prisma.rMTask.deleteMany();
    await prisma.rMTask.createMany({
      data: [
        { rmId: rm.id, title: 'Follow up with Priya on FD renewal', status: 'PENDING', priority: 'HIGH', dueDate: new Date() },
        { rmId: rm.id, title: 'Review home loan application for Amit', status: 'PENDING', priority: 'MEDIUM', dueDate: new Date(Date.now() + 86400000) },
        { rmId: rm.id, title: 'Welcome call for new HNI client', status: 'COMPLETED', priority: 'LOW', dueDate: new Date() }
      ]
    });
    
    await prisma.rMPerformanceSnapshot.deleteMany();
    await prisma.rMPerformanceSnapshot.createMany({
      data: Array.from({length: 6}).map((_, i) => ({
        rmId: rm.id,
        snapshotDate: new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000),
        conversionRate: 15 + Math.random() * 5,
        casesResolved: 40 + Math.floor(Math.random() * 20),
        slaBreachCount: Math.floor(Math.random() * 5)
      }))
    });
  }

  // 3. Seed ML Models
  await prisma.mLModelRegistry.deleteMany();
  await prisma.mLModelRegistry.createMany({
    data: [
      { modelName: 'ChurnPredictor_v4', version: '4.2.1', status: 'PRODUCTION', accuracy: 0.94, f1Score: 0.92, deployedAt: new Date('2026-01-15'), deployedBy: 'Data Science Team' },
      { modelName: 'NextBestOffer_RL', version: '2.0.0', status: 'PRODUCTION', accuracy: 0.88, f1Score: 0.85, deployedAt: new Date('2026-03-22'), deployedBy: 'Data Science Team' },
      { modelName: 'StressDetector_LLM', version: '1.5.0', status: 'STAGING', accuracy: 0.91, f1Score: 0.89, deployedAt: new Date('2026-05-10'), deployedBy: 'Data Science Team' },
    ]
  });

  // 4. Seed Balance Simulations
  await prisma.balanceSimulation.deleteMany();
  const simData = [];
  let baseP50 = 45000;
  for (let i = 1; i <= 90; i++) {
    baseP50 -= 100; // slow drain
    simData.push({
      userId: user.id,
      scenario: 'BASELINE',
      day: i,
      p10: baseP50 - (i * 200),
      p50: baseP50,
      p90: baseP50 + (i * 150)
    });
    simData.push({
      userId: user.id,
      scenario: 'INTERVENTION',
      day: i,
      p10: baseP50 - (i * 50),
      p50: baseP50 + (i * 100),
      p90: baseP50 + (i * 300)
    });
  }
  await prisma.balanceSimulation.createMany({ data: simData });

  console.log('Analytics seeding completed.');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(() => {
  prisma.$disconnect();
});
