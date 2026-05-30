/**
 * TRUSTEDGE — Constants
 * 
 * Central place for all app-wide constants.
 * Avoids magic strings scattered across the codebase.
 */

const ROLES = {
    CUSTOMER: 'CUSTOMER',
    EMPLOYEE: 'EMPLOYEE',
    ADMIN: 'ADMIN',
};

const STRESS_LEVELS = {
    LOW: 'LOW',
    MODERATE: 'MODERATE',
    HIGH: 'HIGH',
    CRITICAL: 'CRITICAL',
};

const TRANSACTION_TYPES = {
    CREDIT: 'CREDIT',
    DEBIT: 'DEBIT',
};

const EVENT_TYPES = {
    SALARY_DROP: 'SALARY_DROP',
    EMERGENCY_WITHDRAWAL: 'EMERGENCY_WITHDRAWAL',
    MIN_PAYMENT_REPEAT: 'MIN_PAYMENT_REPEAT',
    LOW_BALANCE: 'LOW_BALANCE',
    LARGE_EXPENSE: 'LARGE_EXPENSE',
};

const PRODUCT_VERDICTS = {
    RECOMMENDED: 'RECOMMENDED',
    CAUTION: 'CAUTION',
    AVOID: 'AVOID',
};

module.exports = {
    ROLES,
    STRESS_LEVELS,
    TRANSACTION_TYPES,
    EVENT_TYPES,
    PRODUCT_VERDICTS,
};
