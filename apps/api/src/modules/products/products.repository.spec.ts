import { Test } from '@nestjs/testing'
import { getModelToken } from '@nestjs/sequelize'
import { ProductsRepository } from './products.repository'
import { Product } from './product.model'

const mockTransaction = { commit: jest.fn(), rollback: jest.fn() } as any

describe('ProductsRepository', () => {
  let repo: ProductsRepository
  let model: { update: jest.Mock }

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProductsRepository,
        {
          provide: getModelToken(Product),
          useValue: { update: jest.fn() },
        },
      ],
    }).compile()

    repo = module.get(ProductsRepository)
    model = module.get(getModelToken(Product))
  })

  describe('incrementStock', () => {
    it('incrémente le stock via Sequelize.literal et transmet la transaction', async () => {
      model.update.mockResolvedValue([1])
      await repo.incrementStock(1, 3, mockTransaction)
      expect(model.update).toHaveBeenCalledWith(
        expect.objectContaining({ stock: expect.anything() }),
        expect.objectContaining({ where: { id: 1 }, transaction: mockTransaction }),
      )
    })
  })

  describe('decrementStock', () => {
    it('retourne le nombre de lignes affectées en cas de succès', async () => {
      model.update.mockResolvedValue([1])
      const result = await repo.decrementStock(1, 2, mockTransaction)
      expect(result).toBe(1)
      expect(model.update).toHaveBeenCalledWith(
        expect.objectContaining({ stock: expect.anything() }),
        expect.objectContaining({
          where: expect.objectContaining({ id: 1, isActive: 1 }),
          transaction: mockTransaction,
        }),
      )
    })

    it('retourne 0 si le stock est insuffisant (rowsAffected === 0)', async () => {
      model.update.mockResolvedValue([0])
      const result = await repo.decrementStock(1, 1000, mockTransaction)
      expect(result).toBe(0)
    })
  })
})
