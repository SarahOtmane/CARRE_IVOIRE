import { Test } from '@nestjs/testing'
import { ProductVariantsService } from './product-variants.service'
import { ProductVariantsRepository } from './product-variants.repository'
import { ProductsRepository } from './products.repository'

const mockVariant = {
  id: 1,
  productId: 1,
  label: '250g',
  weightGrams: 250,
  price: 2000,
  stock: 10,
  stockStatus: 'in_stock',
  displayOrder: 1,
  isActive: 1,
  created_at: new Date(),
  updated_at: new Date(),
}

describe('ProductVariantsService', () => {
  let service: ProductVariantsService
  let variantsRepo: jest.Mocked<ProductVariantsRepository>
  let productsRepo: jest.Mocked<ProductsRepository>

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProductVariantsService,
        {
          provide: ProductVariantsRepository,
          useValue: {
            findByProductId: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: ProductsRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get(ProductVariantsService)
    variantsRepo = module.get(ProductVariantsRepository)
    productsRepo = module.get(ProductsRepository)
  })

  describe('findByProductId', () => {
    it('retourne les variantes mappées en DTO', async () => {
      variantsRepo.findByProductId.mockResolvedValue([mockVariant as any])
      const result = await service.findByProductId(1)
      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({ id: 1, label: '250g', price: 2000, isActive: true })
    })
  })

  describe('create', () => {
    it('lève PRODUCT_NOT_FOUND si le produit n\'existe pas', async () => {
      productsRepo.findById.mockResolvedValue(null)
      await expect(
        service.create(999, { label: '250g', price: 2000 } as any),
      ).rejects.toMatchObject({ response: expect.objectContaining({ code: 'PRODUCT_NOT_FOUND' }) })
      expect(variantsRepo.create).not.toHaveBeenCalled()
    })

    it('crée la variante si le produit existe', async () => {
      productsRepo.findById.mockResolvedValue({ id: 1 } as any)
      variantsRepo.create.mockResolvedValue(mockVariant as any)
      const result = await service.create(1, { label: '250g', price: 2000 } as any)
      expect(result.id).toBe(1)
      expect(variantsRepo.create).toHaveBeenCalledWith(1, { label: '250g', price: 2000 })
    })
  })

  describe('update', () => {
    it('lève VARIANT_NOT_FOUND si la variante n\'existe pas', async () => {
      variantsRepo.findById.mockResolvedValue(null)
      await expect(
        service.update(1, 999, { stock: 5 } as any),
      ).rejects.toMatchObject({ response: expect.objectContaining({ code: 'VARIANT_NOT_FOUND' }) })
    })

    it('lève VARIANT_NOT_FOUND si la variante appartient à un autre produit', async () => {
      variantsRepo.findById.mockResolvedValue({ ...mockVariant, productId: 2 } as any)
      await expect(
        service.update(1, 1, { stock: 5 } as any),
      ).rejects.toMatchObject({ response: expect.objectContaining({ code: 'VARIANT_NOT_FOUND' }) })
    })

    it('met à jour la variante si elle appartient au bon produit', async () => {
      variantsRepo.findById.mockResolvedValue(mockVariant as any)
      variantsRepo.update.mockResolvedValue({ ...mockVariant, stock: 5 } as any)
      const result = await service.update(1, 1, { stock: 5 } as any)
      expect(result.stock).toBe(5)
    })
  })

  describe('delete', () => {
    it('lève VARIANT_NOT_FOUND si la variante est introuvable', async () => {
      variantsRepo.findById.mockResolvedValue(null)
      await expect(service.delete(1, 999)).rejects.toMatchObject({
        response: expect.objectContaining({ code: 'VARIANT_NOT_FOUND' }),
      })
    })

    it('supprime la variante si elle appartient au bon produit', async () => {
      variantsRepo.findById.mockResolvedValue(mockVariant as any)
      await service.delete(1, 1)
      expect(variantsRepo.delete).toHaveBeenCalledWith(1)
    })
  })
})
