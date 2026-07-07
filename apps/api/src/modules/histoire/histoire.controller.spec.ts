import { Test } from '@nestjs/testing'
import { HistoireController } from './histoire.controller'
import { HistoireService } from './histoire.service'

const mockDto = {
  id: 1,
  key: 'enfance',
  displayOrder: 0,
  imageSide: 'left' as const,
  image: 'https://example.com/img.webp',
  imageAlt: 'Cabosses de cacao',
  paragraphs: ['Un premier paragraphe.'],
}

describe('HistoireController', () => {
  let controller: HistoireController
  let service: jest.Mocked<HistoireService>

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [HistoireController],
      providers: [
        {
          provide: HistoireService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([mockDto]),
            update: jest.fn().mockResolvedValue(mockDto),
          },
        },
      ],
    }).compile()

    controller = module.get(HistoireController)
    service = module.get(HistoireService)
  })

  it('findAll délègue à histoireService.findAll', async () => {
    const result = await controller.findAll()
    expect(service.findAll).toHaveBeenCalled()
    expect(result).toHaveLength(1)
  })

  it("update délègue à histoireService.update avec l'id parsé", async () => {
    const result = await controller.update(1, { imageAlt: 'Nouveau' })
    expect(service.update).toHaveBeenCalledWith(1, { imageAlt: 'Nouveau' })
    expect(result.id).toBe(1)
  })
})
