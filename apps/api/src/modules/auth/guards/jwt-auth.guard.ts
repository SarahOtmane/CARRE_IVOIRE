import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ErrorCodes } from '@/common/constants'
import throwApiError from '@/common/errors/throw-api-error'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser>(err: Error | null, user: TUser): TUser {
    if (err) throw err
    if (!user) throwApiError(ErrorCodes.UNAUTHORIZED, 'Token invalide ou manquant')
    return user
  }
}
