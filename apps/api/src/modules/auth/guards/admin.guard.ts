import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common'
import { ErrorCodes } from '@/common/constants'
import throwApiError from '@/common/errors/throw-api-error'
import type { JwtUser } from '../strategies/jwt.strategy'

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user: JwtUser }>()
    const user = request.user

    if (!user || user.role !== 'admin') {
      throwApiError(ErrorCodes.FORBIDDEN, 'Accès réservé aux administrateurs')
    }
    return true
  }
}
