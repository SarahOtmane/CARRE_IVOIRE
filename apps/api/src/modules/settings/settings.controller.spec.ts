import { Test } from '@nestjs/testing'
import { SettingsController } from './settings.controller'
import { SettingsService } from './settings.service'

const mockSettings = { shippingFlat: 800, shippingFreeFrom: 7000, bccEmail: 'bcc@test.com', address: '4 rue du Nil' }

describe('SettingsController', () => {
  let controller: SettingsController
  let service: jest.Mocked<SettingsService>

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [SettingsController],
      providers: [
        {
          provide: SettingsService,
          useValue: {
            getAll: jest.fn().mockResolvedValue(mockSettings),
            update: jest.fn().mockResolvedValue(mockSettings),
          },
        },
      ],
    }).compile()

    controller = module.get(SettingsController)
    service = module.get(SettingsService)
  })

  it('getPublic retourne uniquement shippingFlat et shippingFreeFrom', async () => {
    const result = await controller.getPublic()
    expect(result).toEqual({ shippingFlat: 800, shippingFreeFrom: 7000 })
    expect(result).not.toHaveProperty('bccEmail')
  })

  it('getAll retourne tous les settings', async () => {
    const result = await controller.getAll()
    expect(service.getAll).toHaveBeenCalled()
    expect(result).toEqual(mockSettings)
  })

  it('update délègue à settingsService.update', async () => {
    const dto = { shippingFlat: 500 } as any
    const result = await controller.update(dto)
    expect(service.update).toHaveBeenCalledWith(dto)
    expect(result).toEqual(mockSettings)
  })
})
