import { Test } from '@nestjs/testing'
import { getModelToken } from '@nestjs/sequelize'
import { FavoritesRepository } from './favorites.repository'
import { Favorite } from './favorite.model'

describe('FavoritesRepository', () => {
  let repo: FavoritesRepository
  let model: {
    findAll: jest.Mock
    findOne: jest.Mock
    create: jest.Mock
    destroy: jest.Mock
  }

  const mockFavorite = { id: 1, userId: 1, productId: 10 }

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FavoritesRepository,
        {
          provide: getModelToken(Favorite),
          useValue: {
            findAll: jest.fn().mockResolvedValue([mockFavorite]),
            findOne: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockResolvedValue(mockFavorite),
            destroy: jest.fn().mockResolvedValue(1),
          },
        },
      ],
    }).compile()

    repo = module.get(FavoritesRepository)
    model = module.get(getModelToken(Favorite))
  })

  it('findByUserId retourne les favoris avec le produit inclus', async () => {
    const result = await repo.findByUserId(1)
    expect(model.findAll).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 1 } }),
    )
    expect(result).toHaveLength(1)
  })

  it('findOne retourne null si le favori n\'existe pas', async () => {
    expect(await repo.findOne(1, 99)).toBeNull()
  })

  it('findOne retourne le favori si trouvé', async () => {
    model.findOne.mockResolvedValue(mockFavorite)
    expect(await repo.findOne(1, 10)).toEqual(mockFavorite)
  })

  it('create crée un favori avec userId et productId', async () => {
    await repo.create(1, 10)
    expect(model.create).toHaveBeenCalledWith(expect.objectContaining({ userId: 1, productId: 10 }))
  })

  it('delete supprime le favori par userId + productId', async () => {
    await repo.delete(1, 10)
    expect(model.destroy).toHaveBeenCalledWith({ where: { userId: 1, productId: 10 } })
  })
})
