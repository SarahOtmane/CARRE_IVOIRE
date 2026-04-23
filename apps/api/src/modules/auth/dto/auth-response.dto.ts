export class AuthUserDto {
  id: number
  email: string
  firstName: string
  lastName: string
  customerNumber: string
  role: string
}

export class AuthResponseDto {
  accessToken: string
  user: AuthUserDto
}
