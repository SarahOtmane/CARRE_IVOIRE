import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common'
import type { Response } from 'express'
import { getHttpStatusFromErrorCode } from '@/common/constants'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    if (exception instanceof HttpException) {
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
      return
    }

    // Erreur imprévue (Sequelize, TypeError, etc.) — ne jamais exposer la stack/message brut au client
    this.logger.error(exception instanceof Error ? exception.stack : exception)

    response.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Une erreur est survenue',
        statusCode: 500,
      },
      timestamp: new Date().toISOString(),
    })
  }
}
