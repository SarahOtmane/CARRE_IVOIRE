import { Test } from '@nestjs/testing'
import { TaxRatesController } from './tax-rates.controller'
import { TaxRatesService } from './tax-rates.service'

const mockRate = { id: 1, label: 'Standard', rate: 20, isDefault: true }

describe('TaxRatesController', () => {
  let controller: TaxRatesController
  let service: jest.Mocked<TaxRatesService>

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [TaxRatesController],
      providers: [
        {
          provide: TaxRatesService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([mockRate]),
            create: jest.fn().mockResolvedValue(mockRate),
            update: jest.fn().mockResolvedValue(mockRate),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile()

    controller = module.get(TaxRatesController)
    service = module.get(TaxRatesService)
  })

  it('findAll délègue à taxRatesService.findAll', async () => {
    const result = await controller.findAll()
    expect(service.findAll).toHaveBeenCalled()
    expect(result).toHaveLength(1)
  })

  it('create délègue à taxRatesService.create', async () => {
    const result = await controller.create({ label: 'Standard', rate: 20 } as any)
    expect(service.create).toHaveBeenCalled()
    expect(result.id).toBe(1)
  })

  it('update délègue à taxRatesService.update', async () => {
    await controller.update(1, { label: 'Updated' } as any)
    expect(service.update).toHaveBeenCalledWith(1, { label: 'Updated' })
  })

  it('remove délègue à taxRatesService.delete', async () => {
    await controller.remove(1)
    expect(service.delete).toHaveBeenCalledWith(1)
  })
})
