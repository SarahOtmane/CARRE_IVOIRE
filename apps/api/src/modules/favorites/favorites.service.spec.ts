import { Test } from '@nestjs/testing'
import { FavoritesService } from './favorites.service'
import { FavoritesRepository } from './favorites.repository'
import { ProductsRepository } from '@/modules/products/products.repository'

const mockFavorite = { id: 1, userId: 1, productId: 1, product: { id: 1, name: 'Carré Noir' }, created_at: new Date() }

describe('FavoritesService', () => {
  let service: FavoritesService
  let favoritesRepo: jest.Mocked<FavoritesRepository>
  let productsRepo: jest.Mocked<ProductsRepository>

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FavoritesService,
        {
          provide: FavoritesRepository,
          useValue: {
            findByUserId: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: ProductsRepository,
          useValue: { findById: jest.fn() },
        },
      ],
    }).compile()

    service = module.get(FavoritesService)
    favoritesRepo = module.get(FavoritesRepository)
    productsRepo = module.get(ProductsRepository)
  })

  describe('findByUser', () => {
    it('retourne les favoris mappés', async () => {
      favoritesRepo.findByUserId.mockResolvedValue([mockFavorite as any])
      const result = await service.findByUser(1)
      expect(result).toEqual([{ id: 1, product: mockFavorite.product, addedAt: mockFavorite.created_at }])
    })
  })

  describe('add', () => {
    it('lève PRODUCT_NOT_FOUND si le produit n\'existe pas', async () => {
      productsRepo.findById.mockResolvedValue(null)
      await expect(service.add(1, 999)).rejects.toMatchObject({
        response: expect.objectContaining({ code: 'PRODUCT_NOT_FOUND' }),
      })
    })

    it('lève FAVORITE_ALREADY_EXISTS si déjà en favoris', async () => {
      productsRepo.findById.mockResolvedValue({ id: 1 } as any)
      favoritesRepo.findOne.mockResolvedValue(mockFavorite as any)
      await expect(service.add(1, 1)).rejects.toMatchObject({
        response: expect.objectContaining({ code: 'FAVORITE_ALREADY_EXISTS' }),
      })
      expect(favoritesRepo.create).not.toHaveBeenCalled()
    })

    it('ajoute le favori si le produit existe et n\'est pas déjà favori', async () => {
      productsRepo.findById.mockResolvedValue({ id: 1 } as any)
      favoritesRepo.findOne.mockResolvedValue(null)
      favoritesRepo.create.mockResolvedValue(mockFavorite as any)
      const result = await service.add(1, 1)
      expect(result).toEqual({ id: 1, product: { id: 1 }, addedAt: mockFavorite.created_at })
    })
  })

  describe('remove', () => {
    it('lève NOT_FOUND si le favori est introuvable', async () => {
      favoritesRepo.findOne.mockResolvedValue(null)
      await expect(service.remove(1, 999)).rejects.toMatchObject({
        response: expect.objectContaining({ code: 'NOT_FOUND' }),
      })
    })

    it('supprime le favori s\'il existe', async () => {
      favoritesRepo.findOne.mockResolvedValue(mockFavorite as any)
      await service.remove(1, 1)
      expect(favoritesRepo.delete).toHaveBeenCalledWith(1, 1)
    })
  })
})
