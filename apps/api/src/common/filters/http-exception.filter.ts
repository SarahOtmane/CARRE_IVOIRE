import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common'
import type { Response } from 'express'
import { getHttpStatusFromErrorCode } from '@/common/constants'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const rawResponse = exception.getResponse() as Record<string, unknown>

    const code = (rawResponse?.['code'] as string) ?? undefined
    const status = code ? getHttpStatusFromErrorCode(code as any) : exception.getStatus()

    response.status(status).json({
      success: false,
      error: {
        code: code ?? 'INTERNAL_SERVER_ERROR',
        message: (rawResponse?.['message'] as string) ?? exception.message,
        statusCode: status,
      },
      timestamp: new Date().toISOString(),
    })
  }
}
