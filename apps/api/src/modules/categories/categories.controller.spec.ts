import { Test } from '@nestjs/testing'
import { CategoriesController } from './categories.controller'
import { CategoriesService } from './categories.service'

const mockDto = { id: 1, name: 'Signature', slug: 'signature', displayOrder: 1, isActive: true }

describe('CategoriesController', () => {
  let controller: CategoriesController
  let service: jest.Mocked<CategoriesService>

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([mockDto]),
            create: jest.fn().mockResolvedValue(mockDto),
            update: jest.fn().mockResolvedValue(mockDto),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile()

    controller = module.get(CategoriesController)
    service = module.get(CategoriesService)
  })

  it('findAll délègue à categoriesService.findAll', async () => {
    const result = await controller.findAll()
    expect(service.findAll).toHaveBeenCalled()
    expect(result).toHaveLength(1)
  })

  it('create délègue à categoriesService.create', async () => {
    const result = await controller.create({ name: 'Signature', slug: 'signature' } as any)
    expect(service.create).toHaveBeenCalled()
    expect(result.id).toBe(1)
  })

  it('update délègue à categoriesService.update avec l\'id parsé', async () => {
    const result = await controller.update(1, { name: 'Updated' } as any)
    expect(service.update).toHaveBeenCalledWith(1, { name: 'Updated' })
    expect(result.id).toBe(1)
  })

  it('remove délègue à categoriesService.delete', async () => {
    await controller.remove(1)
    expect(service.delete).toHaveBeenCalledWith(1)
  })
})
