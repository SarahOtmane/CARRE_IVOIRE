import { Test } from '@nestjs/testing'
import { getModelToken } from '@nestjs/sequelize'
import { ProductVariantsRepository } from './product-variants.repository'
import { ProductVariant } from './product-variant.model'

const mockTransaction = { commit: jest.fn(), rollback: jest.fn() } as any
const mockVariant = { id: 10, productId: 1, label: '70g', price: 390, stock: 50 }

describe('ProductVariantsRepository', () => {
  let repo: ProductVariantsRepository
  let model: {
    update: jest.Mock
    findAll: jest.Mock
    findByPk: jest.Mock
    create: jest.Mock
    destroy: jest.Mock
  }

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProductVariantsRepository,
        {
          provide: getModelToken(ProductVariant),
          useValue: {
            update: jest.fn().mockResolvedValue([1]),
            findAll: jest.fn().mockResolvedValue([mockVariant]),
            findByPk: jest.fn().mockResolvedValue(mockVariant),
            create: jest.fn().mockResolvedValue(mockVariant),
            destroy: jest.fn().mockResolvedValue(1),
          },
        },
      ],
    }).compile()

    repo = module.get(ProductVariantsRepository)
    model = module.get(getModelToken(ProductVariant))
  })

  describe('findByProductId', () => {
    it('retourne les variantes actives triées par displayOrder', async () => {
      const result = await repo.findByProductId(1)
      expect(model.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: { productId: 1, isActive: 1 } }),
      )
      expect(result).toHaveLength(1)
    })
  })

  describe('findById', () => {
    it('retourne la variante par PK', async () => {
      const result = await repo.findById(10)
      expect(model.findByPk).toHaveBeenCalledWith(10, expect.objectContaining({ transaction: undefined }))
      expect(result).toEqual(mockVariant)
    })

    it('retourne null si introuvable', async () => {
      model.findByPk.mockResolvedValue(null)
      expect(await repo.findById(99)).toBeNull()
    })
  })

  describe('create', () => {
    it('crée la variante avec isActive converti en 0/1', async () => {
      await repo.create(1, { label: '70g', price: 390, isActive: true } as any)
      expect(model.create).toHaveBeenCalledWith(
        expect.objectContaining({ productId: 1, label: '70g', price: 390, isActive: 1 }),
      )
    })

    it('isActive=false → 0', async () => {
      await repo.create(1, { label: '70g', price: 390, isActive: false } as any)
      expect(model.create).toHaveBeenCalledWith(expect.objectContaining({ isActive: 0 }))
    })
  })

  describe('update', () => {
    it('met à jour les champs définis et retourne la variante', async () => {
      model.findByPk.mockResolvedValue(mockVariant)
      const result = await repo.update(10, { price: 450 } as any)
      expect(model.update).toHaveBeenCalled()
      expect(result).toEqual(mockVariant)
    })

    it('convertit isActive boolean en 0/1', async () => {
      model.findByPk.mockResolvedValue(mockVariant)
      await repo.update(10, { isActive: false } as any)
      const call = model.update.mock.calls[0][0]
      expect(call.isActive).toBe(0)
    })

    it('couvre tous les champs du DTO en une seule passe', async () => {
      model.findByPk.mockResolvedValue(mockVariant)
      await repo.update(10, {
        label: 'Grand', weightGrams: 200, price: 500, stock: 10,
        stockStatus: 'low_stock', displayOrder: 3, isActive: true,
      } as any)
      const call = model.update.mock.calls[0][0]
      expect(call.label).toBe('Grand')
      expect(call.weightGrams).toBe(200)
      expect(call.stockStatus).toBe('low_stock')
      expect(call.isActive).toBe(1)
    })
  })

  describe('delete', () => {
    it('supprime la variante par id', async () => {
      await repo.delete(10)
      expect(model.destroy).toHaveBeenCalledWith({ where: { id: 10 } })
    })
  })

  describe('incrementStock', () => {
    it('incrémente le stock via Sequelize.literal et transmet la transaction', async () => {
      await repo.incrementStock(10, 3, mockTransaction)
      expect(model.update).toHaveBeenCalledWith(
        expect.objectContaining({ stock: expect.anything() }),
        expect.objectContaining({ where: { id: 10 }, transaction: mockTransaction }),
      )
    })
  })

  describe('decrementStock', () => {
    it('retourne le nombre de lignes affectées en cas de succès (filtré par productId)', async () => {
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
