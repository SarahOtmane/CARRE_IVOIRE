import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common'
import type { Response } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const status = exception.getStatus()
    const exceptionResponse = exception.getResponse() as Record<string, unknown>

    response.status(status).json({
      success: false,
      error: {
        code: (exceptionResponse['code'] as string) ?? 'INTERNAL_ERROR',
        message:
          (exceptionResponse['message'] as string) ?? exception.message,
        statusCode: status,
      },
      timestamp: new Date().toISOString(),
    })
  }
}
