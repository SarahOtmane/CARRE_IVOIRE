import { Test } from '@nestjs/testing'
import { HttpException, HttpStatus } from '@nestjs/common'
import { getModelToken } from '@nestjs/sequelize'
import { LoginAttemptsService } from './login-attempts.service'
import { LoginAttempt } from './login-attempt.model'

const makeMockModel = (record: Partial<LoginAttempt> | null = null) => {
  const instance = record
    ? {
        ...record,
        count: record.count ?? 0,
        blockedUntil: record.blockedUntil ?? null,
        save: jest.fn().mockResolvedValue(undefined),
        destroy: jest.fn().mockResolvedValue(undefined),
      }
    : null

  return {
    findOne: jest.fn().mockResolvedValue(instance),
    findOrCreate: jest.fn().mockResolvedValue([instance ?? { count: 0, blockedUntil: null, save: jest.fn() }, true]),
    destroy: jest.fn().mockResolvedValue(1),
  }
}

describe('LoginAttemptsService', () => {
  let service: LoginAttemptsService
  let model: ReturnType<typeof makeMockModel>

  async function setup(record: Partial<LoginAttempt> | null = null) {
    model = makeMockModel(record)
    const module = await Test.createTestingModule({
      providers: [
        LoginAttemptsService,
        { provide: getModelToken(LoginAttempt), useValue: model },
      ],
    }).compile()
    service = module.get(LoginAttemptsService)
  }

  describe('check()', () => {
    it('ne fait rien si aucun enregistrement', async () => {
      await setup(null)
      await expect(service.check('user@test.com')).resolves.toBeUndefined()
    })

    it('ne fait rien si count < MAX_ATTEMPTS et blockedUntil null', async () => {
      await setup({ count: 3, blockedUntil: null })
      await expect(service.check('user@test.com')).resolves.toBeUndefined()
    })

    it('lève 429 si blockedUntil est dans le futur', async () => {
      const blockedUntil = new Date(Date.now() + 5 * 60 * 1000)
      await setup({ count: 5, blockedUntil })
      await expect(service.check('user@test.com')).rejects.toBeInstanceOf(HttpException)
      const err = await service.check('user@test.com').catch((e) => e)
      expect((err as HttpException).getStatus()).toBe(HttpStatus.TOO_MANY_REQUESTS)
    })

    it('supprime l\'enregistrement si blockedUntil est expiré', async () => {
      const blockedUntil = new Date(Date.now() - 1000)
      await setup({ count: 5, blockedUntil })
      await service.check('user@test.com')
      expect(model.findOne).toHaveBeenCalled()
    })
  })

  describe('recordFailure()', () => {
    it('incrémente le compteur', async () => {
      const instance = { count: 2, blockedUntil: null, save: jest.fn() }
      model = { findOne: jest.fn(), findOrCreate: jest.fn().mockResolvedValue([instance, false]), destroy: jest.fn() }
      const module = await Test.createTestingModule({
        providers: [
          LoginAttemptsService,
          { provide: getModelToken(LoginAttempt), useValue: model },
        ],
      }).compile()
      service = module.get(LoginAttemptsService)

      await service.recordFailure('user@test.com')
      expect(instance.count).toBe(3)
      expect(instance.blockedUntil).toBeNull()
      expect(instance.save).toHaveBeenCalled()
    })

    it('bloque après 5 tentatives', async () => {
      const instance: { count: number; blockedUntil: Date | null; save: jest.Mock } = { count: 4, blockedUntil: null, save: jest.fn() }
      model = { findOne: jest.fn(), findOrCreate: jest.fn().mockResolvedValue([instance, false]), destroy: jest.fn() }
      const module = await Test.createTestingModule({
        providers: [
          LoginAttemptsService,
          { provide: getModelToken(LoginAttempt), useValue: model },
        ],
      }).compile()
      service = module.get(LoginAttemptsService)

      await service.recordFailure('user@test.com')
      expect(instance.count).toBe(5)
      expect(instance.blockedUntil).not.toBeNull()
      expect(instance.blockedUntil!.getTime()).toBeGreaterThan(Date.now())
    })
  })

  describe('clearAttempts()', () => {
    it('supprime l\'enregistrement de la BDD', async () => {
      await setup(null)
      await service.clearAttempts('user@test.com')
      expect(model.destroy).toHaveBeenCalledWith({ where: { email: 'user@test.com' } })
    })
  })
})
