/**
 * Centralized error codes for API responses
 * Used across all services and controllers for consistency
 */

export const ErrorCodes = {
    // Auth errors
    UNAUTHORIZED: 'UNAUTHORIZED',
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
    EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',
    REFRESH_TOKEN_INVALID: 'REFRESH_TOKEN_INVALID',

    // Product errors
    PRODUCT_NOT_FOUND: 'PRODUCT_NOT_FOUND',
    CATEGORY_NOT_FOUND: 'CATEGORY_NOT_FOUND',
    USER_NOT_FOUND: 'USER_NOT_FOUND',

    // Order errors
    CART_EMPTY: 'CART_EMPTY',
    OUT_OF_STOCK: 'OUT_OF_STOCK',
    ORDER_NOT_FOUND: 'ORDER_NOT_FOUND',
    INVALID_ORDER_STATUS: 'INVALID_ORDER_STATUS',

    // Stripe errors
    INVALID_WEBHOOK_SIGNATURE: 'INVALID_WEBHOOK_SIGNATURE',
    PAYMENT_INTENT_FAILED: 'PAYMENT_INTENT_FAILED',

    // Validation errors
    INVALID_INPUT: 'INVALID_INPUT',
    MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',

    // Permission errors
    FORBIDDEN: 'FORBIDDEN',
    ADMIN_ONLY: 'ADMIN_ONLY',

    // General errors
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
    NOT_FOUND: 'NOT_FOUND',
    CONFLICT: 'CONFLICT',
} as const

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes]
