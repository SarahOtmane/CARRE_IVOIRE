import { Test } from '@nestjs/testing'
import { ProductsService } from './products.service'
import { ProductsRepository } from './products.repository'

const mockProduct = {
  id: 1, name: 'Carré Noir', slug: 'carre-noir', price: 390,
  shortDescription: 'Ganache grand cru', description: null,
  discountPrice: null, imageUrl: null, images: null,
  categoryId: 1, category: { id: 1, name: 'Signature', slug: 'carres-signature' },
  stock: 100, stockStatus: 'in_stock',
  taxRateId: null, taxRate: null,
  isActive: 1, isSeasonal: 0, displayOrder: 1,
  badge: null, ingredients: null, allergens: null, weightGrams: null,
  created_at: new Date(), updated_at: new Date(),
}

describe('ProductsService', () => {
  let service: ProductsService
  let repo: jest.Mocked<ProductsRepository>

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: ProductsRepository,
          useValue: {
            findAll: jest.fn(),
            findBySlug: jest.fn(),
            findById: jest.fn(),
            findAllByIds: jest.fn(),
            findAllActive: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            incrementStock: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get(ProductsService)
    repo = module.get(ProductsRepository)
  })

  describe('findBySlug', () => {
    it('retourne le produit si le slug existe', async () => {
      repo.findBySlug.mockResolvedValue(mockProduct as any)
      const result = await service.findBySlug('carre-noir')
      expect(result.id).toBe(1)
      expect(result.slug).toBe('carre-noir')
      expect(repo.findBySlug).toHaveBeenCalledWith('carre-noir')
    })

    it('lève une erreur PRODUCT_NOT_FOUND si le slug est inconnu', async () => {
      repo.findBySlug.mockResolvedValue(null)
      await expect(service.findBySlug('inconnu')).rejects.toMatchObject({
        response: expect.objectContaining({ code: 'PRODUCT_NOT_FOUND' }),
      })
    })
  })

  describe('findAll', () => {
    it('retourne les produits paginés', async () => {
      repo.findAll.mockResolvedValue({ rows: [mockProduct as any], count: 1 })
      const result = await service.findAll({ limit: 12, page: 1 })
      expect(result.total).toBe(1)
      expect(result.items).toHaveLength(1)
      expect(result.totalPages).toBe(1)
    })
  })

  describe('create', () => {
    it('crée un produit et le retourne', async () => {
      repo.create.mockResolvedValue(mockProduct as any)
      const dto = { name: 'Carré Noir', slug: 'carre-noir', price: 390, categoryId: 1 }
      const result = await service.create(dto as any)
      expect(result.id).toBe(1)
      expect(repo.create).toHaveBeenCalled()
    })
  })

  describe('delete', () => {
    it('lève PRODUCT_NOT_FOUND si le produit n\'existe pas', async () => {
      repo.findById.mockResolvedValue(null)
      await expect(service.delete(999)).rejects.toMatchObject({
        response: expect.objectContaining({ code: 'PRODUCT_NOT_FOUND' }),
      })
    })

    it('supprime le produit s\'il existe', async () => {
      repo.findById.mockResolvedValue(mockProduct as any)
      repo.delete.mockResolvedValue()
      await expect(service.delete(1)).resolves.toBeUndefined()
      expect(repo.delete).toHaveBeenCalledWith(1)
    })
  })
})
