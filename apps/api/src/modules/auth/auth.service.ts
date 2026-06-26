import { Injectable } from '@nestjs/common'
import { LoginAttemptsService } from './login-attempts.service'
import { RefreshTokensRepository } from './refresh-tokens.repository'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import * as crypto from 'crypto'
import { ErrorCodes } from '@/common/constants'
import throwApiError from '@/common/errors/throw-api-error'
import { UsersRepository } from '@/modules/users/users.repository'
import { MailService } from '@/modules/mail/mail.service'
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
    private readonly mailService: MailService,
    private readonly loginAttempts: LoginAttemptsService,
    private readonly refreshTokensRepository: RefreshTokensRepository,
  ) { }

  async register(dto: RegisterDto): Promise<AuthResponseDto & TokenPair> {
    const exists = await this.usersRepository.emailExists(dto.email)
    if (exists) {
      throwApiError(ErrorCodes.EMAIL_ALREADY_EXISTS, 'Un compte existe déjà avec cette adresse email')
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
    await this.storeRefreshToken(user.id, tokens.refreshToken)
    return { ...tokens, user: this.toAuthUserDto(user) }
  }

  async login(dto: LoginDto): Promise<AuthResponseDto & TokenPair> {
    // Vérifier le blocage par email avant toute requête DB
    this.loginAttempts.check(dto.email)

    // Même message d'erreur pour email inconnu ou mot de passe incorrect (anti-énumération)
    const INVALID_CREDENTIALS = () => throwApiError(ErrorCodes.INVALID_CREDENTIALS, 'Identifiants invalides')

    const user = await this.usersRepository.findByEmail(dto.email)
    if (!user || !user.is_active) {
      this.loginAttempts.recordFailure(dto.email)
      INVALID_CREDENTIALS()
    }

    const passwordValid = await bcrypt.compare(dto.password, user!.password_hash)
    if (!passwordValid) {
      this.loginAttempts.recordFailure(dto.email)
      INVALID_CREDENTIALS()
    }

    this.loginAttempts.clearAttempts(dto.email)
    const tokens = this.generateTokens(user!)
    await this.storeRefreshToken(user!.id, tokens.refreshToken)
    return { ...tokens, user: this.toAuthUserDto(user!) }
  }

  async refresh(refreshToken: string | undefined): Promise<{ accessToken: string; refreshToken: string }> {
    if (!refreshToken) {
      throwApiError(ErrorCodes.UNAUTHORIZED, 'Refresh token manquant')
    }

    // 1. Vérifier la signature JWT
    let payload: JwtPayload
    try {
      payload = this.jwtService.verify<JwtPayload>(refreshToken!, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      })
    } catch {
      throwApiError(ErrorCodes.UNAUTHORIZED, 'Refresh token invalide ou expiré')
    }

    // 2. Vérifier que le token est connu et non révoqué en base
    const stored = await this.refreshTokensRepository.findValid(refreshToken!)
    if (!stored) {
      // Token inconnu ou déjà révoqué → révoquer tous les tokens de l'utilisateur (détection de replay)
      await this.refreshTokensRepository.revokeAllForUser(payload!.sub)
      throwApiError(ErrorCodes.UNAUTHORIZED, 'Refresh token révoqué')
    }

    const user = await this.usersRepository.findById(payload!.sub)
    if (!user || !user.is_active) {
      throwApiError(ErrorCodes.UNAUTHORIZED, 'Utilisateur introuvable')
    }

    // 3. Rotation : révoquer l'ancien, émettre un nouveau
    await this.refreshTokensRepository.revoke(refreshToken!)
    const newTokens = this.generateTokens(user!)
    await this.storeRefreshToken(user!.id, newTokens.refreshToken)

    return { accessToken: newTokens.accessToken, refreshToken: newTokens.refreshToken }
  }

  async revokeRefreshToken(refreshToken: string | undefined): Promise<void> {
    if (!refreshToken) return
    await this.refreshTokensRepository.revoke(refreshToken)
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersRepository.findByEmail(email)
    // Réponse identique qu'il y ait un compte ou non (anti-énumération)
    if (!user || !user.is_active) return

    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 6 * 60 * 60 * 1000) // 6h

    await this.usersRepository.setResetToken(user.id, token, expiresAt)

    const frontUrl = process.env.FRONTEND_URL ?? 'http://localhost:5173'
    const resetUrl = `${frontUrl}/reinitialiser-mot-de-passe?token=${token}`

    this.mailService.sendPasswordReset({
      to: user.email,
      firstName: user.first_name,
      resetUrl,
    }).catch(() => { /* ne jamais bloquer sur un échec email */ })
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.usersRepository.findByResetToken(token)
    if (!user) {
      throwApiError(ErrorCodes.INVALID_TOKEN, 'Lien de réinitialisation invalide ou expiré')
    }

    const newHash = await bcrypt.hash(newPassword, 12)
    await this.usersRepository.clearResetToken(user!.id, newHash)
  }

  private async storeRefreshToken(userId: number, token: string): Promise<void> {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 jours
    await this.refreshTokensRepository.store(userId, token, expiresAt)
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
