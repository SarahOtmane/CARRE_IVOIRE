import { Test } from '@nestjs/testing'
import { FavoritesController } from './favorites.controller'
import { FavoritesService } from './favorites.service'

const mockUser = { id: 1, email: 'user@test.com', role: 'client' as const }
const mockFavorite = { id: 1, userId: 1, productId: 10, product: { id: 10, name: 'Carré Noir' } }

describe('FavoritesController', () => {
  let controller: FavoritesController
  let service: jest.Mocked<FavoritesService>

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [FavoritesController],
      providers: [
        {
          provide: FavoritesService,
          useValue: {
            findByUser: jest.fn().mockResolvedValue([mockFavorite]),
            add: jest.fn().mockResolvedValue(mockFavorite),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile()

    controller = module.get(FavoritesController)
    service = module.get(FavoritesService)
  })

  it('findAll délègue à favoritesService.findByUser', async () => {
    const result = await controller.findAll(mockUser)
    expect(service.findByUser).toHaveBeenCalledWith(1)
    expect(result).toHaveLength(1)
  })

  it('add délègue à favoritesService.add', async () => {
    const result = await controller.add(mockUser, 10)
    expect(service.add).toHaveBeenCalledWith(1, 10)
    expect(result).toEqual(mockFavorite)
  })

  it('remove délègue à favoritesService.remove', async () => {
    await controller.remove(mockUser, 10)
    expect(service.remove).toHaveBeenCalledWith(1, 10)
  })
})
