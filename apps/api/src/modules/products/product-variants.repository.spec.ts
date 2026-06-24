import { Test } from '@nestjs/testing'
import { getModelToken } from '@nestjs/sequelize'
import { ProductVariantsRepository } from './product-variants.repository'
import { ProductVariant } from './product-variant.model'

const mockTransaction = { commit: jest.fn(), rollback: jest.fn() } as any

describe('ProductVariantsRepository', () => {
  let repo: ProductVariantsRepository
  let model: { update: jest.Mock }

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProductVariantsRepository,
        {
          provide: getModelToken(ProductVariant),
          useValue: { update: jest.fn() },
        },
      ],
    }).compile()

    repo = module.get(ProductVariantsRepository)
    model = module.get(getModelToken(ProductVariant))
  })

  describe('incrementStock', () => {
    it('incrémente le stock via Sequelize.literal et transmet la transaction', async () => {
      model.update.mockResolvedValue([1])
      await repo.incrementStock(10, 3, mockTransaction)
      expect(model.update).toHaveBeenCalledWith(
        expect.objectContaining({ stock: expect.anything() }),
        expect.objectContaining({ where: { id: 10 }, transaction: mockTransaction }),
      )
    })
  })

  describe('decrementStock', () => {
    it('retourne le nombre de lignes affectées en cas de succès (filtré par productId)', async () => {
      model.update.mockResolvedValue([1])
      const result = await repo.decrementStock(10, 1, 2, mockTransaction)
      expect(result).toBe(1)
      expect(model.update).toHaveBeenCalledWith(
        expect.objectContaining({ stock: expect.anything() }),
        expect.objectContaining({
          where: expect.objectContaining({ id: 10, productId: 1, isActive: 1 }),
          transaction: mockTransaction,
        }),
      )
    })

    it('retourne 0 si le stock est insuffisant (rowsAffected === 0)', async () => {
      model.update.mockResolvedValue([0])
      const result = await repo.decrementStock(10, 1, 1000, mockTransaction)
      expect(result).toBe(0)
    })
  })
})
