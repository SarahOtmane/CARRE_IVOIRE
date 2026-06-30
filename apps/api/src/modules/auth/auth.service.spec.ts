import { Test, TestingModule } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { AuthService } from './auth.service'
import { LoginAttemptsService } from './login-attempts.service'
import { RefreshTokensRepository } from './refresh-tokens.repository'
import { UsersRepository } from '@/modules/users/users.repository'
import { MailService } from '@/modules/mail/mail.service'

const mockUser = {
  id: 1, email: 'test@example.com', password_hash: '',
  first_name: 'Jean', last_name: 'Dupont',
  role: 'client', customer_number: 'CI-20260619-0001',
  is_active: 1, phone: null,
  resetToken: null, resetTokenExpires: null,
}

describe('AuthService', () => {
  let service: AuthService
  let usersRepo: jest.Mocked<UsersRepository>
  let jwtService: jest.Mocked<JwtService>
  let mailService: jest.Mocked<MailService>
  let refreshRepo: jest.Mocked<RefreshTokensRepository>
  let module: TestingModule

  beforeEach(async () => {
    mockUser.password_hash = await bcrypt.hash('password123', 10)

    module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersRepository,
          useValue: {
            findByEmail: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            emailExists: jest.fn(),
            findByResetToken: jest.fn(),
            setResetToken: jest.fn(),
            clearResetToken: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn().mockReturnValue('mock-token'), verify: jest.fn() },
        },
        {
          provide: MailService,
          useValue: { sendPasswordReset: jest.fn().mockResolvedValue(undefined) },
        },
        {
          provide: LoginAttemptsService,
          useValue: {
            check: jest.fn(),
            recordFailure: jest.fn(),
            clearAttempts: jest.fn(),
          },
        },
        {
          provide: RefreshTokensRepository,
          useValue: {
            store: jest.fn().mockResolvedValue(undefined),
            findValid: jest.fn().mockResolvedValue(null),
            revoke: jest.fn().mockResolvedValue(undefined),
            revokeAllForUser: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile()

    service = module.get(AuthService)
    usersRepo = module.get(UsersRepository)
    jwtService = module.get(JwtService)
    mailService = module.get(MailService)
    refreshRepo = module.get(RefreshTokensRepository)
  })

  describe('register', () => {
    it('crée un compte et retourne les tokens si l\'email est unique', async () => {
      usersRepo.emailExists.mockResolvedValue(false)
      usersRepo.create.mockResolvedValue(mockUser as any)
      const result = await service.register({ email: 'new@example.com', password: 'password123', firstName: 'Jean', lastName: 'Dupont' })
      expect(result.accessToken).toBe('mock-token')
      expect(result.user.email).toBe('test@example.com')
    })

    it('génère les tokens avec les fallbacks env vars si les secrets ne sont pas définis', async () => {
      const saved = {
        JWT_SECRET: process.env.JWT_SECRET,
        JWT_EXPIRATION: process.env.JWT_EXPIRATION,
        REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
        REFRESH_TOKEN_EXPIRATION: process.env.REFRESH_TOKEN_EXPIRATION,
      }
      delete process.env.JWT_SECRET
      delete process.env.JWT_EXPIRATION
      delete process.env.REFRESH_TOKEN_SECRET
      delete process.env.REFRESH_TOKEN_EXPIRATION
      usersRepo.emailExists.mockResolvedValue(false)
      usersRepo.create.mockResolvedValue(mockUser as any)
      const result = await service.register({ email: 'new@example.com', password: 'p', firstName: 'A', lastName: 'B' })
      Object.assign(process.env, saved)
      expect(result.accessToken).toBeDefined()
    })

    it('lève EMAIL_ALREADY_EXISTS si l\'email est déjà utilisé', async () => {
      usersRepo.emailExists.mockResolvedValue(true)
      await expect(
        service.register({ email: 'existing@example.com', password: 'password123', firstName: 'Jean', lastName: 'Dupont' }),
      ).rejects.toMatchObject({
        response: expect.objectContaining({ code: 'EMAIL_ALREADY_EXISTS' }),
      })
    })
  })

  describe('login', () => {
    it('retourne les tokens si les identifiants sont corrects', async () => {
      usersRepo.findByEmail.mockResolvedValue(mockUser as any)
      const result = await service.login({ email: 'test@example.com', password: 'password123' })
      expect(result.accessToken).toBe('mock-token')
    })

    it('lève INVALID_CREDENTIALS si le mot de passe est incorrect', async () => {
      usersRepo.findByEmail.mockResolvedValue(mockUser as any)
      await expect(service.login({ email: 'test@example.com', password: 'wrong' })).rejects.toMatchObject({
        response: expect.objectContaining({ code: 'INVALID_CREDENTIALS' }),
      })
    })

    it('lève INVALID_CREDENTIALS si l\'email est inconnu', async () => {
      usersRepo.findByEmail.mockResolvedValue(null)
      await expect(service.login({ email: 'nobody@example.com', password: 'password123' })).rejects.toMatchObject({
        response: expect.objectContaining({ code: 'INVALID_CREDENTIALS' }),
      })
    })

    it('lève INVALID_CREDENTIALS si le compte est inactif', async () => {
      usersRepo.findByEmail.mockResolvedValue({ ...mockUser, is_active: 0 } as any)
      await expect(service.login({ email: 'test@example.com', password: 'password123' })).rejects.toMatchObject({
        response: expect.objectContaining({ code: 'INVALID_CREDENTIALS' }),
      })
    })
  })

  describe('forgotPassword', () => {
    it('génère un token et envoie l\'email si le compte existe', async () => {
      usersRepo.findByEmail.mockResolvedValue(mockUser as any)
      usersRepo.setResetToken.mockResolvedValue()
      await service.forgotPassword('test@example.com')
      expect(usersRepo.setResetToken).toHaveBeenCalled()
      expect(mailService.sendPasswordReset).toHaveBeenCalled()
    })

    it('ne fait rien si l\'email est inconnu (anti-énumération)', async () => {
      usersRepo.findByEmail.mockResolvedValue(null)
      await expect(service.forgotPassword('nobody@example.com')).resolves.toBeUndefined()
      expect(usersRepo.setResetToken).not.toHaveBeenCalled()
    })

    it('ne fait rien si le compte est inactif', async () => {
      usersRepo.findByEmail.mockResolvedValue({ ...mockUser, is_active: 0 } as any)
      await expect(service.forgotPassword('test@example.com')).resolves.toBeUndefined()
      expect(usersRepo.setResetToken).not.toHaveBeenCalled()
    })

    it('utilise le fallback localhost si FRONTEND_URL non défini (branche ??)', async () => {
      const saved = process.env.FRONTEND_URL
      delete process.env.FRONTEND_URL
      usersRepo.findByEmail.mockResolvedValue(mockUser as any)
      usersRepo.setResetToken.mockResolvedValue()
      await service.forgotPassword('test@example.com')
      process.env.FRONTEND_URL = saved
      expect(mailService.sendPasswordReset).toHaveBeenCalledWith(
        expect.objectContaining({ resetUrl: expect.stringContaining('localhost:5173') }),
      )
    })
  })

  describe('resetPassword', () => {
    it('change le mot de passe si le token est valide', async () => {
      usersRepo.findByResetToken.mockResolvedValue(mockUser as any)
      usersRepo.clearResetToken.mockResolvedValue()
      await service.resetPassword('valid-token', 'newpass123')
      expect(usersRepo.clearResetToken).toHaveBeenCalledWith(mockUser.id, expect.any(String))
    })

    it('lève INVALID_TOKEN si le token est inconnu ou expiré', async () => {
      usersRepo.findByResetToken.mockResolvedValue(null)
      await expect(service.resetPassword('bad-token', 'newpass')).rejects.toMatchObject({
        response: expect.objectContaining({ code: 'INVALID_TOKEN' }),
      })
    })
  })

  describe('refresh', () => {
    it('lève UNAUTHORIZED si le refreshToken est absent', async () => {
      await expect(service.refresh(undefined)).rejects.toMatchObject({
        response: expect.objectContaining({ code: 'UNAUTHORIZED' }),
      })
    })

    it('lève UNAUTHORIZED si le JWT est invalide ou expiré', async () => {
      jwtService.verify.mockImplementation(() => { throw new Error('invalid') })
      await expect(service.refresh('bad-token')).rejects.toMatchObject({
        response: expect.objectContaining({ code: 'UNAUTHORIZED' }),
      })
    })

    it('révoque tous les tokens et lève UNAUTHORIZED si le token n\'est pas en BDD (replay detection)', async () => {
      jwtService.verify.mockReturnValue({ sub: 1, email: 'test@example.com', role: 'client' })
      refreshRepo.findValid.mockResolvedValue(null)
      await expect(service.refresh('stolen-token')).rejects.toMatchObject({
        response: expect.objectContaining({ code: 'UNAUTHORIZED' }),
      })
      expect(refreshRepo.revokeAllForUser).toHaveBeenCalledWith(1)
    })

    it('retourne de nouveaux tokens si le refresh token est valide', async () => {
      jwtService.verify.mockReturnValue({ sub: 1, email: 'test@example.com', role: 'client' })
      refreshRepo.findValid.mockResolvedValue({ id: 1 } as any)
      usersRepo.findById.mockResolvedValue(mockUser as any)
      jwtService.sign.mockReturnValue('new-token')
      const result = await service.refresh('valid-refresh')
      expect(result).toHaveProperty('accessToken', 'new-token')
      expect(result).toHaveProperty('refreshToken', 'new-token')
      expect(refreshRepo.revoke).toHaveBeenCalledWith('valid-refresh')
    })

    it('lève UNAUTHORIZED si l\'utilisateur est introuvable ou inactif', async () => {
      jwtService.verify.mockReturnValue({ sub: 99, email: 'nobody@test.com', role: 'client' })
      refreshRepo.findValid.mockResolvedValue({ id: 1 } as any)
      usersRepo.findById.mockResolvedValue(null)
      await expect(service.refresh('valid-token')).rejects.toMatchObject({
        response: expect.objectContaining({ code: 'UNAUTHORIZED' }),
      })
    })
  })

  describe('revokeRefreshToken', () => {
    it('appelle refreshRepo.revoke si le token est fourni', async () => {
      await service.revokeRefreshToken('some-token')
      expect(refreshRepo.revoke).toHaveBeenCalledWith('some-token')
    })

    it('ne fait rien si le token est undefined', async () => {
      await service.revokeRefreshToken(undefined)
      expect(refreshRepo.revoke).not.toHaveBeenCalled()
    })
  })
})
