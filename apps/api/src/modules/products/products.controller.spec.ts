import { Test } from '@nestjs/testing'
import { ProductsController } from './products.controller'
import { ProductsService } from './products.service'
import { ProductVariantsService } from './product-variants.service'

const mockProduct = {
  id: 1, name: 'Carré Noir', slug: 'carre-noir', price: 390,
  stock: 100, stockStatus: 'in_stock', isActive: true, isSeasonal: false,
  displayOrder: 1, categoryId: 1, variants: [],
}

const mockVariant = { id: 10, productId: 1, label: '70g', price: 390, stock: 50 }

describe('ProductsController', () => {
  let controller: ProductsController
  let productsService: jest.Mocked<ProductsService>
  let variantsService: jest.Mocked<ProductVariantsService>

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue({ items: [mockProduct], total: 1, page: 1, limit: 12, totalPages: 1 }),
            findBySlug: jest.fn().mockResolvedValue(mockProduct),
            create: jest.fn().mockResolvedValue(mockProduct),
            update: jest.fn().mockResolvedValue(mockProduct),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: ProductVariantsService,
          useValue: {
            findByProductId: jest.fn().mockResolvedValue([mockVariant]),
            create: jest.fn().mockResolvedValue(mockVariant),
            update: jest.fn().mockResolvedValue(mockVariant),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile()

    controller = module.get(ProductsController)
    productsService = module.get(ProductsService)
    variantsService = module.get(ProductVariantsService)
  })

  it('findAll délègue à productsService.findAll', async () => {
    const result = await controller.findAll({} as any)
    expect(productsService.findAll).toHaveBeenCalled()
    expect(result.total).toBe(1)
  })

  it('findBySlug délègue à productsService.findBySlug', async () => {
    const result = await controller.findBySlug('carre-noir')
    expect(productsService.findBySlug).toHaveBeenCalledWith('carre-noir')
    expect(result).toEqual(mockProduct)
  })

  it('create délègue à productsService.create', async () => {
    const result = await controller.create({ name: 'Test', slug: 'test', price: 390, categoryId: 1 } as any)
    expect(productsService.create).toHaveBeenCalled()
    expect(result.id).toBe(1)
  })

  it('update délègue à productsService.update', async () => {
    await controller.update(1, { name: 'Updated' } as any)
    expect(productsService.update).toHaveBeenCalledWith(1, { name: 'Updated' })
  })

  it('remove délègue à productsService.delete', async () => {
    await controller.remove(1)
    expect(productsService.delete).toHaveBeenCalledWith(1)
  })

  it('findVariants délègue à variantsService.findByProductId', async () => {
    const result = await controller.findVariants(1)
    expect(variantsService.findByProductId).toHaveBeenCalledWith(1)
    expect(result).toHaveLength(1)
  })

  it('createVariant délègue à variantsService.create', async () => {
    await controller.createVariant(1, { label: '70g', price: 390 } as any)
    expect(variantsService.create).toHaveBeenCalledWith(1, { label: '70g', price: 390 })
  })

  it('updateVariant délègue à variantsService.update', async () => {
    await controller.updateVariant(1, 10, { price: 450 } as any)
    expect(variantsService.update).toHaveBeenCalledWith(1, 10, { price: 450 })
  })

  it('removeVariant délègue à variantsService.delete', async () => {
    await controller.removeVariant(1, 10)
    expect(variantsService.delete).toHaveBeenCalledWith(1, 10)
  })
})
