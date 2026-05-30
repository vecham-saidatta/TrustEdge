/**
 * TRUTH — Service Layer
 * 
 * Unbiased financial product comparison engine.
 * Calculates total cost, surfaces hidden fees,
 * and recommends better alternatives — even from competitors.
 */

const prisma = require('../../config/database');
const ApiError = require('../../utils/apiError');
const logger = require('../../config/logger');

/**
 * List products with optional filters.
 */
const getProducts = async ({ page, limit, type, provider }) => {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 20;
    const where = { isActive: true };
    if (type) where.type = type;
    if (provider) where.provider = { contains: provider };

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
        prisma.financialProduct.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
        prisma.financialProduct.count({ where }),
    ]);

    return {
        products,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
};

/**
 * Get single product details.
 */
const getProductById = async (productId) => {
    const product = await prisma.financialProduct.findUnique({ where: { id: productId } });
    if (!product) throw ApiError.notFound('Product not found.');
    return product;
};

/**
 * Run an honest, unbiased comparison on a financial product.
 * 
 * Logic:
 * 1. Calculate total cost (principal + interest + all fees)
 * 2. Identify all hidden fees
 * 3. Find a better alternative of the same type
 * 4. Issue a verdict: RECOMMENDED / CAUTION / AVOID
 */
const compareProduct = async (userId, { productId, loanAmount, tenureMonths }) => {
    const product = await prisma.financialProduct.findUnique({ where: { id: productId } });
    if (!product) throw ApiError.notFound('Product not found.');

    const amount = loanAmount || 100000; // default ₹1,00,000
    const tenure = tenureMonths || 12; // default 12 months

    // ── Calculate Total Cost ──────────────────────────────
    const interestCost = (amount * product.interestRate * tenure) / (12 * 100);
    const totalFees = product.processingFee + (product.annualFee * Math.ceil(tenure / 12)) + product.prepaymentPenalty;
    const totalCost = amount + interestCost + totalFees;
    const hiddenFeesTotal = totalFees;

    // ── Build Reasoning ───────────────────────────────────
    const reasons = [];

    if (product.interestRate > 20) {
        reasons.push(`⚠️ Very high interest rate of ${product.interestRate}% — you'll pay ₹${interestCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })} in interest alone.`);
    } else if (product.interestRate > 15) {
        reasons.push(`⚠️ Above-average interest rate of ${product.interestRate}%.`);
    } else {
        reasons.push(`✅ Competitive interest rate of ${product.interestRate}%.`);
    }

    if (product.processingFee > 0) {
        reasons.push(`💰 Processing fee: ₹${product.processingFee.toLocaleString('en-IN')}`);
    }
    if (product.annualFee > 0) {
        reasons.push(`💰 Annual fee: ₹${product.annualFee.toLocaleString('en-IN')}/year (₹${(product.annualFee * Math.ceil(tenure / 12)).toLocaleString('en-IN')} over your tenure)`);
    }
    if (product.prepaymentPenalty > 0) {
        reasons.push(`💰 Prepayment penalty: ₹${product.prepaymentPenalty.toLocaleString('en-IN')} — you'll be charged if you repay early.`);
    }

    reasons.push(`📊 Total cost over ${tenure} months: ₹${totalCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })} (principal ₹${amount.toLocaleString('en-IN')} + interest ₹${interestCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })} + fees ₹${totalFees.toLocaleString('en-IN')})`);

    // ── Find Better Alternative ───────────────────────────
    const alternatives = await prisma.financialProduct.findMany({
        where: {
            type: product.type,
            isActive: true,
            id: { not: product.id },
            interestRate: { lt: product.interestRate },
        },
        orderBy: { interestRate: 'asc' },
        take: 1,
    });

    let betterAlternative = null;
    let betterAlternativeId = null;

    if (alternatives.length > 0) {
        const alt = alternatives[0];
        const altInterestCost = (amount * alt.interestRate * tenure) / (12 * 100);
        const altFees = alt.processingFee + (alt.annualFee * Math.ceil(tenure / 12)) + alt.prepaymentPenalty;
        const altTotalCost = amount + altInterestCost + altFees;

        if (altTotalCost < totalCost) {
            const savings = totalCost - altTotalCost;
            betterAlternative = {
                ...alt,
                totalCost: parseFloat(altTotalCost.toFixed(2)),
                savings: parseFloat(savings.toFixed(2)),
            };
            betterAlternativeId = alt.id;
            reasons.push(`\n🏆 BETTER ALTERNATIVE: "${alt.name}" by ${alt.provider} would save you ₹${savings.toLocaleString('en-IN', { maximumFractionDigits: 0 })} over the same period.`);
        }
    }

    // ── Determine Verdict ─────────────────────────────────
    let verdict = 'RECOMMENDED';
    if (product.riskLevel === 'HIGH' || product.interestRate > 25 || hiddenFeesTotal > amount * 0.05) {
        verdict = 'AVOID';
    } else if (product.interestRate > 15 || hiddenFeesTotal > 0 || betterAlternative) {
        verdict = 'CAUTION';
    }

    const reasoning = reasons.join('\n');

    // ── Save Comparison ───────────────────────────────────
    const comparison = await prisma.productComparison.create({
        data: {
            userId,
            productId,
            verdict,
            totalCost: parseFloat(totalCost.toFixed(2)),
            hiddenFeesTotal: parseFloat(hiddenFeesTotal.toFixed(2)),
            betterAlternativeId,
            reasoning,
        },
        include: {
            product: true,
            betterAlternative: true,
        },
    });

    logger.info('TRUTH comparison run', { userId, productId, verdict });
    return comparison;
};

/**
 * Get comparison history for a customer.
 */
const getComparisons = async (userId, { page, limit }) => {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 20;
    const skip = (page - 1) * limit;

    const [comparisons, total] = await Promise.all([
        prisma.productComparison.findMany({
            where: { userId },
            include: { product: true, betterAlternative: true },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
        }),
        prisma.productComparison.count({ where: { userId } }),
    ]);

    return {
        comparisons,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
};

module.exports = { getProducts, getProductById, compareProduct, getComparisons };
