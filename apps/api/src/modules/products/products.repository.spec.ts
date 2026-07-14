import { Test } from '@nestjs/testing'
import { getModelToken } from '@nestjs/sequelize'
import { ProductsRepository } from './products.repository'
import { Product } from './product.model'

const mockTransaction = { commit: jest.fn(), rollback: jest.fn() } as any

const mockProduct = { id: 1, name: 'Carré Noir', slug: 'carre-noir', price: 390, isActive: 1 }

describe('ProductsRepository', () => {
  let repo: ProductsRepository
  let model: {
    update: jest.Mock
    findAll: jest.Mock
    findOne: jest.Mock
    findByPk: jest.Mock
    findAndCountAll: jest.Mock
    create: jest.Mock
    destroy: jest.Mock
  }

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProductsRepository,
        {
          provide: getModelToken(Product),
          useValue: {
            update: jest.fn().mockResolvedValue([1]),
            findAll: jest.fn().mockResolvedValue([mockProduct]),
            findOne: jest.fn().mockResolvedValue(mockProduct),
            findByPk: jest.fn().mockResolvedValue(mockProduct),
            findAndCountAll: jest.fn().mockResolvedValue({ rows: [mockProduct], count: 1 }),
            create: jest.fn().mockResolvedValue(mockProduct),
            destroy: jest.fn().mockResolvedValue(1),
          },
        },
      ],
    }).compile()

    repo = module.get(ProductsRepository)
    model = module.get(getModelToken(Product))
  })

  describe('findAll', () => {
    it('retourne les produits paginés', async () => {
      const result = await repo.findAll({ page: 1, limit: 12 })
      expect(model.findAndCountAll).toHaveBeenCalled()
      expect(result.count).toBe(1)
    })

    it('filtre par categoryId si fourni', async () => {
      await repo.findAll({ categoryId: 2 })
      expect(model.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ categoryId: 2 }) }),
      )
    })

    it('applique le tri par prix ascendant', async () => {
      await repo.findAll({ sort: 'price_asc' })
      const call = model.findAndCountAll.mock.calls[0][0]
      expect(JSON.stringify(call.order)).toContain('price')
    })

    it('applique le tri par prix descendant', async () => {
      await repo.findAll({ sort: 'price_desc' })
      const call = model.findAndCountAll.mock.calls[0][0]
      expect(JSON.stringify(call.order)).toContain('DESC')
    })

    it('applique le tri par nouveauté', async () => {
      await repo.findAll({ sort: 'newest' })
      const call = model.findAndCountAll.mock.calls[0][0]
      expect(JSON.stringify(call.order)).toContain('created_at')
    })

    it('passe la recherche fulltext si search fourni', async () => {
      await repo.findAll({ search: 'chocolat' })
      const call = model.findAndCountAll.mock.calls[0][0]
      expect(call.replacements).toEqual({ search: 'chocolat' })
    })

    it('filtre par isSeasonal=true', async () => {
      await repo.findAll({ isSeasonal: true })
      expect(model.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ isSeasonal: 1 }) }),
      )
    })

    it('filtre par isSeasonal=false → 0', async () => {
      await repo.findAll({ isSeasonal: false })
      expect(model.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ isSeasonal: 0 }) }),
      )
    })

    it('filtre par categoryId si fourni', async () => {
      await repo.findAll({ categoryId: 3 })
      expect(model.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ categoryId: 3 }) }),
      )
    })

    it('plafonne limit à 50', async () => {
      await repo.findAll({ limit: 200 })
      const call = model.findAndCountAll.mock.calls[0][0]
      expect(call.limit).toBe(50)
    })
  })

  describe('findBySlug', () => {
    it('retourne le produit par slug', async () => {
      const result = await repo.findBySlug('carre-noir')
      expect(model.findOne).toHaveBeenCalledWith(
        expect.objectContaining({ where: { slug: 'carre-noir', isActive: 1 } }),
      )
      expect(result).toEqual(mockProduct)
    })
  })

  describe('findById', () => {
    it('retourne le produit par PK', async () => {
      const result = await repo.findById(1)
      expect(model.findByPk).toHaveBeenCalledWith(1, expect.anything())
      expect(result).toEqual(mockProduct)
    })
  })

  describe('findAllByIds', () => {
    it('retourne une liste vide si aucun id fourni', async () => {
      const result = await repo.findAllByIds([])
      expect(result).toEqual([])
      expect(model.findAll).not.toHaveBeenCalled()
    })

    it('recherche par ids si fournis', async () => {
      await repo.findAllByIds([1, 2], mockTransaction)
      expect(model.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: [1, 2] }, transaction: mockTransaction }),
      )
    })
  })

  describe('create', () => {
    it('crée le produit avec les bons champs', async () => {
      await repo.create({ name: 'X', slug: 'x', price: 100, categoryId: 1, isActive: true, isSeasonal: false } as any)
      expect(model.create).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'X', slug: 'x', price: 100, isActive: 1, isSeasonal: 0 }),
      )
    })

    it('isActive=false → 0', async () => {
      await repo.create({ name: 'X', slug: 'x', price: 100, categoryId: 1, isActive: false, isSeasonal: true } as any)
      expect(model.create).toHaveBeenCalledWith(
        expect.objectContaining({ isActive: 0, isSeasonal: 1 }),
      )
    })
  })

  describe('update', () => {
    it('met à jour les champs fournis et retourne le produit', async () => {
      model.findByPk.mockResolvedValue(mockProduct)
      const result = await repo.update(1, { name: 'Updated' } as any)
      expect(model.update).toHaveBeenCalled()
      expect(result).toEqual(mockProduct)
    })

    it('couvre tous les champs du DTO (buildUpdateData)', async () => {
      model.findByPk.mockResolvedValue(mockProduct)
      await repo.update(1, {
        name: 'N', slug: 's', shortDescription: 'sd', description: 'd',
        price: 100, discountPrice: 90, imageUrl: 'img.jpg', categoryId: 2,
        stock: 10, stockStatus: 'in_stock', taxRateId: null,
        isActive: false, isSeasonal: true, displayOrder: 1,
        badge: 'new', 
        arome: 'cacao intense',
        ingredients: 'cacao', 
        degustation: 'température ambiente', 
        conservation: '16 et 18 °C', 
        allergens: 'none', weightGrams: 70,
      } as any)
      const call = model.update.mock.calls[0][0]
      expect(call.name).toBe('N')
      expect(call.isActive).toBe(0)
      expect(call.isSeasonal).toBe(1)
      expect(call.taxRateId).toBeNull()
    })
  })

  describe('findAllActive', () => {
    it('retourne uniquement les produits actifs', async () => {
      await repo.findAllActive()
      expect(model.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: { isActive: 1 } }),
      )
    })
  })

  describe('delete', () => {
    it('supprime le produit par id', async () => {
      await repo.delete(1)
      expect(model.destroy).toHaveBeenCalledWith({ where: { id: 1 } })
    })
  })

  describe('incrementStock', () => {
    it('incrémente le stock via Sequelize.literal et transmet la transaction', async () => {
      await repo.incrementStock(1, 3, mockTransaction)
      expect(model.update).toHaveBeenCalledWith(
        expect.objectContaining({ stock: expect.anything() }),
        expect.objectContaining({ where: { id: 1 }, transaction: mockTransaction }),
      )
    })

    it('prend la valeur absolue de la quantité', async () => {
      await repo.incrementStock(1, -5)
      expect(model.update).toHaveBeenCalled()
    })
  })

  describe('decrementStock', () => {
    it('retourne le nombre de lignes affectées en cas de succès', async () => {
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
