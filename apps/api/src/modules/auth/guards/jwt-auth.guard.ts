import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ErrorCodes } from '@/common/constants'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser>(err: Error | null, user: TUser): TUser {
    if (err || !user) {
      throw err ?? new UnauthorizedException({
        code: ErrorCodes.UNAUTHORIZED,
        message: 'Token invalide ou manquant',
      })
    }
    return user
  }
}
