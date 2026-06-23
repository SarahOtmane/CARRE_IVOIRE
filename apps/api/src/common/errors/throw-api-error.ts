import { HttpException } from '@nestjs/common'
import { getHttpStatusFromErrorCode } from '@/common/constants'
import type { ErrorCode } from '@/common/constants'

export function throwApiError(code: ErrorCode, message?: string): never {
    const status = getHttpStatusFromErrorCode(code)
    throw new HttpException({ code, message: message ?? code }, status)
}

export default throwApiError
