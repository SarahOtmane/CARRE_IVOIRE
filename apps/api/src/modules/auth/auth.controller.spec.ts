import { Test } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { ThrottlerGuard } from '@nestjs/throttler'

const mockAuthResult = {
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  user: { id: 1, email: 'test@example.com', firstName: 'Jean', lastName: 'Dupont', role: 'client', customerNumber: 'CI-00000001' },
}

describe('AuthController', () => {
  let controller: AuthController
  let authService: jest.Mocked<AuthService>

  const mockRes = { cookie: jest.fn().mockReturnThis(), clearCookie: jest.fn().mockReturnThis() } as any
  const mockReq = { cookies: { refresh_token: 'old-refresh' } } as any

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn().mockResolvedValue(mockAuthResult),
            login: jest.fn().mockResolvedValue(mockAuthResult),
            refresh: jest.fn().mockResolvedValue({ accessToken: 'new-access', refreshToken: 'new-refresh' }),
            revokeRefreshToken: jest.fn().mockResolvedValue(undefined),
            forgotPassword: jest.fn().mockResolvedValue(undefined),
            resetPassword: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    })
      .overrideGuard(ThrottlerGuard).useValue({ canActivate: () => true })
      .compile()

    controller = module.get(AuthController)
    authService = module.get(AuthService)
  })

  describe('register', () => {
    it('appelle authService.register et set le cookie refresh_token', async () => {
      const dto = { email: 'new@test.com', password: 'pass123', firstName: 'A', lastName: 'B' } as any
      const result = await controller.register(dto, mockRes)
      expect(authService.register).toHaveBeenCalledWith(dto)
      expect(mockRes.cookie).toHaveBeenCalledWith('refresh_token', 'refresh-token', expect.objectContaining({ httpOnly: true }))
      expect(result).toEqual({ accessToken: 'access-token', user: mockAuthResult.user })
    })
  })

  describe('login', () => {
    it('appelle authService.login et retourne accessToken + user', async () => {
      const dto = { email: 'test@example.com', password: 'pass123' } as any
      const result = await controller.login(dto, mockRes)
      expect(authService.login).toHaveBeenCalledWith(dto)
      expect(result).toHaveProperty('accessToken', 'access-token')
    })
  })

  describe('refresh', () => {
    it('lit le cookie et retourne un nouvel accessToken', async () => {
      const result = await controller.refresh(mockReq, mockRes)
      expect(authService.refresh).toHaveBeenCalledWith('old-refresh')
      expect(result).toHaveProperty('accessToken', 'new-access')
      expect(mockRes.cookie).toHaveBeenCalledWith('refresh_token', 'new-refresh', expect.anything())
    })
  })

  describe('logout', () => {
    it('révoque le token et vide le cookie', async () => {
      const result = await controller.logout(mockReq, mockRes)
      expect(authService.revokeRefreshToken).toHaveBeenCalledWith('old-refresh')
      expect(mockRes.clearCookie).toHaveBeenCalledWith('refresh_token')
      expect(result).toHaveProperty('message')
    })
  })

  describe('forgotPassword', () => {
    it('délègue à authService.forgotPassword et retourne un message générique', async () => {
      const result = await controller.forgotPassword({ email: 'test@test.com' })
      expect(authService.forgotPassword).toHaveBeenCalledWith('test@test.com')
      expect(result).toHaveProperty('message')
    })
  })

  describe('resetPassword', () => {
    it('délègue à authService.resetPassword et retourne un message', async () => {
      const result = await controller.resetPassword({ token: 'abc', newPassword: 'newpass' } as any)
      expect(authService.resetPassword).toHaveBeenCalledWith('abc', 'newpass')
      expect(result).toHaveProperty('message')
    })
  })
})
