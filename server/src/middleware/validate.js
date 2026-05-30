/**
 * TRUSTEDGE — Zod Validation Middleware
 * 
 * Wraps a Zod schema and validates the request body (or query/params).
 * Returns clean, human-readable validation errors.
 * 
 * Usage:
 *   const { z } = require('zod');
 *   const schema = z.object({ email: z.string().email() });
 *   router.post('/login', validate(schema), controller.login);
 */

const { ZodError } = require('zod');
const ApiResponse = require('../utils/apiResponse');

/**
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 * @param {'body'|'query'|'params'} source - Which part of the request to validate
 * @returns {Function} Express middleware
 */
const validate = (schema, source = 'body') => {
    return (req, res, next) => {
        try {
            // Parse and validate — also strips unknown fields
            const validated = schema.parse(req[source]);
            req[source] = validated; // Replace with cleaned data
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                // Format Zod issues into readable messages
                const errors = error.issues.map((issue) => ({
                    field: issue.path.join('.') || 'unknown',
                    message: issue.message,
                }));
                return ApiResponse.error(res, 400, 'Validation failed', errors);
            }
            next(error);
        }
    };
};

module.exports = validate;
