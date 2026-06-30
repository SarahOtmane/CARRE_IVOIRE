import { Test } from '@nestjs/testing'
import { getModelToken } from '@nestjs/sequelize'
import { RefreshTokensRepository } from './refresh-tokens.repository'
import { RefreshToken } from './refresh-token.model'

describe('RefreshTokensRepository', () => {
  let repo: RefreshTokensRepository
  let model: {
    create: jest.Mock
    findOne: jest.Mock
    update: jest.Mock
    destroy: jest.Mock
  }

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RefreshTokensRepository,
        {
          provide: getModelToken(RefreshToken),
          useValue: {
            create: jest.fn().mockResolvedValue(undefined),
            findOne: jest.fn().mockResolvedValue(null),
            update: jest.fn().mockResolvedValue([1]),
            destroy: jest.fn().mockResolvedValue(1),
          },
        },
      ],
    }).compile()

    repo = module.get(RefreshTokensRepository)
    model = module.get(getModelToken(RefreshToken))
  })

  describe('hash', () => {
    it('produit un hash sha256 hex de 64 caractères', () => {
      const h = RefreshTokensRepository.hash('token123')
      expect(h).toHaveLength(64)
      expect(/^[a-f0-9]+$/.test(h)).toBe(true)
    })

    it('produit le même hash pour le même token', () => {
      expect(RefreshTokensRepository.hash('abc')).toBe(RefreshTokensRepository.hash('abc'))
    })

    it('produit des hashs différents pour des tokens différents', () => {
      expect(RefreshTokensRepository.hash('abc')).not.toBe(RefreshTokensRepository.hash('xyz'))
    })
  })

  describe('store', () => {
    it('crée un enregistrement avec le hash du token', async () => {
      const expires = new Date(Date.now() + 86400000)
      await repo.store(1, 'mytoken', expires)
      expect(model.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 1,
          tokenHash: RefreshTokensRepository.hash('mytoken'),
          expiresAt: expires,
          revokedAt: null,
        }),
      )
    })
  })

  describe('findValid', () => {
    it('appelle findOne avec le hash et les conditions non-révoqué + non-expiré', async () => {
      await repo.findValid('sometoken')
      expect(model.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            tokenHash: RefreshTokensRepository.hash('sometoken'),
            revokedAt: null,
          }),
        }),
      )
    })

    it('retourne null si le token est introuvable', async () => {
      model.findOne.mockResolvedValue(null)
      expect(await repo.findValid('unknown')).toBeNull()
    })
  })

  describe('revoke', () => {
    it('met à jour revokedAt pour le hash du token', async () => {
      await repo.revoke('mytoken')
      expect(model.update).toHaveBeenCalledWith(
        expect.objectContaining({ revokedAt: expect.any(Date) }),
        expect.objectContaining({ where: { tokenHash: RefreshTokensRepository.hash('mytoken') } }),
      )
    })
  })

  describe('revokeAllForUser', () => {
    it('révoque tous les tokens non-révoqués d\'un utilisateur', async () => {
      await repo.revokeAllForUser(42)
      expect(model.update).toHaveBeenCalledWith(
        expect.objectContaining({ revokedAt: expect.any(Date) }),
        expect.objectContaining({ where: { userId: 42, revokedAt: null } }),
      )
    })
  })

  describe('pruneExpired', () => {
    it('détruit les tokens expirés', async () => {
      await repo.pruneExpired()
      expect(model.destroy).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ expiresAt: expect.anything() }) }),
      )
    })
  })
})
