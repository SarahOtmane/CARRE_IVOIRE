import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { UsersRepository } from '@/modules/users/users.repository'
import type { User } from '@/modules/users/users.model'
import type { RegisterDto } from './dto/register.dto'
import type { LoginDto } from './dto/login.dto'
import type { AuthResponseDto, AuthUserDto } from './dto/auth-response.dto'
import type { JwtPayload } from './strategies/jwt.strategy'

interface TokenPair {
  accessToken: string
  refreshToken: string
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto & TokenPair> {
    const exists = await this.usersRepository.emailExists(dto.email)
    if (exists) {
      throw new ConflictException({
        code: 'EMAIL_ALREADY_EXISTS',
        message: 'Un compte existe déjà avec cette adresse email',
      })
    }

    const passwordHash = await bcrypt.hash(dto.password, 12)

    const user = await this.usersRepository.create({
      email: dto.email,
      password_hash: passwordHash,
      first_name: dto.firstName,
      last_name: dto.lastName,
      role: 'client',
    })

    const tokens = this.generateTokens(user)
    return { ...tokens, user: this.toAuthUserDto(user) }
  }

  async login(dto: LoginDto): Promise<AuthResponseDto & TokenPair> {
    // Même message d'erreur pour email inconnu ou mot de passe incorrect (anti-énumération)
    const INVALID_CREDENTIALS = new UnauthorizedException({
      code: 'UNAUTHORIZED',
      message: 'Identifiants invalides',
    })

    const user = await this.usersRepository.findByEmail(dto.email)
    if (!user || !user.is_active) throw INVALID_CREDENTIALS

    const passwordValid = await bcrypt.compare(dto.password, user.password_hash)
    if (!passwordValid) throw INVALID_CREDENTIALS

    const tokens = this.generateTokens(user)
    return { ...tokens, user: this.toAuthUserDto(user) }
  }

  async refresh(refreshToken: string | undefined): Promise<{ accessToken: string }> {
    if (!refreshToken) {
      throw new UnauthorizedException({
        code: 'UNAUTHORIZED',
        message: 'Refresh token manquant',
      })
    }
    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      })
      const user = await this.usersRepository.findById(payload.sub)
      if (!user || !user.is_active) {
        throw new UnauthorizedException({ code: 'UNAUTHORIZED', message: 'Token invalide' })
      }
      const accessToken = this.signAccessToken(user)
      return { accessToken }
    } catch {
      throw new UnauthorizedException({
        code: 'UNAUTHORIZED',
        message: 'Refresh token invalide ou expiré',
      })
    }
  }

  private generateTokens(user: User): TokenPair {
    const accessToken = this.signAccessToken(user)
    const refreshToken = this.jwtService.sign(
      { sub: user.id, email: user.email, role: user.role } satisfies JwtPayload,
      {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: process.env.REFRESH_TOKEN_EXPIRATION ?? '7d',
      },
    )
    return { accessToken, refreshToken }
  }

  private signAccessToken(user: User): string {
    return this.jwtService.sign(
      { sub: user.id, email: user.email, role: user.role } satisfies JwtPayload,
      {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRATION ?? '24h',
      },
    )
  }

  private toAuthUserDto(user: User): AuthUserDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      customerNumber: user.customer_number,
      role: user.role,
    }
  }
}
