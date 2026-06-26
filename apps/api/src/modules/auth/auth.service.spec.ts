import { Test } from '@nestjs/testing'
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

  beforeEach(async () => {
    mockUser.password_hash = await bcrypt.hash('password123', 10)

    const module = await Test.createTestingModule({
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
  })

  describe('register', () => {
    it('crée un compte et retourne les tokens si l\'email est unique', async () => {
      usersRepo.emailExists.mockResolvedValue(false)
      usersRepo.create.mockResolvedValue(mockUser as any)
      const result = await service.register({ email: 'new@example.com', password: 'password123', firstName: 'Jean', lastName: 'Dupont' })
      expect(result.accessToken).toBe('mock-token')
      expect(result.user.email).toBe('test@example.com')
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
  })
})
