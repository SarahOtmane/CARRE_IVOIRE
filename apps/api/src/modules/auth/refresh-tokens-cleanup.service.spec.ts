import { Test } from '@nestjs/testing'
import { Logger } from '@nestjs/common'
import { RefreshTokensCleanupService } from './refresh-tokens-cleanup.service'
import { RefreshTokensRepository } from './refresh-tokens.repository'

describe('RefreshTokensCleanupService', () => {
  let service: RefreshTokensCleanupService
  let repo: jest.Mocked<RefreshTokensRepository>

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RefreshTokensCleanupService,
        {
          provide: RefreshTokensRepository,
          useValue: { pruneExpired: jest.fn().mockResolvedValue(undefined) },
        },
      ],
    }).compile()

    service = module.get(RefreshTokensCleanupService)
    repo = module.get(RefreshTokensRepository)
    jest.spyOn(Logger.prototype, 'debug').mockImplementation(() => {})
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {})
  })

  it('appelle pruneExpired lors du cron', async () => {
    await service.runCleanup()
    expect(repo.pruneExpired).toHaveBeenCalledTimes(1)
  })

  it('log une erreur si pruneExpired échoue (sans re-throw)', async () => {
    repo.pruneExpired.mockRejectedValue(new Error('DB down'))
    await expect(service.runCleanup()).resolves.toBeUndefined()
    expect(Logger.prototype.error).toHaveBeenCalled()
  })
})
