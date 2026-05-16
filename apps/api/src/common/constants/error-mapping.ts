import { ErrorCodes, type ErrorCode } from './error-codes'

export const ErrorHttpStatus: Record<ErrorCode, number> = {
    [ErrorCodes.UNAUTHORIZED]: 401,
    [ErrorCodes.INVALID_CREDENTIALS]: 401,
    [ErrorCodes.EMAIL_ALREADY_EXISTS]: 409,
    [ErrorCodes.TOKEN_EXPIRED]: 401,
    [ErrorCodes.REFRESH_TOKEN_INVALID]: 401,

    [ErrorCodes.PRODUCT_NOT_FOUND]: 404,
    [ErrorCodes.CATEGORY_NOT_FOUND]: 404,
    [ErrorCodes.USER_NOT_FOUND]: 404,

    [ErrorCodes.CART_EMPTY]: 400,
    [ErrorCodes.OUT_OF_STOCK]: 409,
    [ErrorCodes.ORDER_NOT_FOUND]: 404,
    [ErrorCodes.INVALID_ORDER_STATUS]: 400,

    [ErrorCodes.INVALID_WEBHOOK_SIGNATURE]: 400,
    [ErrorCodes.PAYMENT_INTENT_FAILED]: 402,

    [ErrorCodes.INVALID_INPUT]: 400,
    [ErrorCodes.MISSING_REQUIRED_FIELD]: 400,

    [ErrorCodes.FORBIDDEN]: 403,
    [ErrorCodes.ADMIN_ONLY]: 403,

    [ErrorCodes.INTERNAL_SERVER_ERROR]: 500,
    [ErrorCodes.NOT_FOUND]: 404,
    [ErrorCodes.CONFLICT]: 409,

    [ErrorCodes.EMAIL_NOT_VERIFIED]: 403,
    [ErrorCodes.INVALID_TOKEN]: 401,
    [ErrorCodes.PAYMENT_METHOD_DECLINED]: 402,
    [ErrorCodes.COUPON_INVALID]: 400,
    [ErrorCodes.ADDRESS_NOT_FOUND]: 404,
    [ErrorCodes.SESSION_EXPIRED]: 401,
    [ErrorCodes.RATE_LIMITED]: 429,
} as const

export function getHttpStatusFromErrorCode(code: ErrorCode): number {
    return ErrorHttpStatus[code] ?? 500
}

export default getHttpStatusFromErrorCode
