import type { AuthUser } from '@carre-ivoire/types'

export type AuthUserDto = AuthUser

export interface AuthResponseDto {
  accessToken: string
  user: AuthUserDto
}
