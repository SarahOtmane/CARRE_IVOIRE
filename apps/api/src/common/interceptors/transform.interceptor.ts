import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { map } from 'rxjs/operators'

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  // Return type is `any` to avoid Observable dual-instance conflict:
  // @angular-devkit pins rxjs@7.8.1 in apps/api/node_modules while
  // NestJS 11 resolves to rxjs@7.8.2 in root/node_modules.
  intercept(_context: ExecutionContext, next: CallHandler<any>): any {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return next.handle().pipe(
      (map((data: any) => ({
        success: true as const,
        data,
        timestamp: new Date().toISOString(),
      })) as any),
    )
  }
}
