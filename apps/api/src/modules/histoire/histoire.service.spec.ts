import { Test } from '@nestjs/testing'
import { HistoireService } from './histoire.service'
import { HistoireSectionRepository } from './histoire-section.repository'

const mockSection = {
  id: 1,
  key: 'enfance',
  displayOrder: 0,
  image: 'https://example.com/img.webp',
  imageAlt: 'Cabosses de cacao',
  paragraphs: JSON.stringify(['Un premier paragraphe.']),
}

describe('HistoireService', () => {
  let service: HistoireService
  let repo: jest.Mocked<HistoireSectionRepository>

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        HistoireService,
        {
          provide: HistoireSectionRepository,
          useValue: {
            findAll: jest.fn().mockResolvedValue([mockSection]),
            findById: jest.fn().mockResolvedValue(mockSection),
            update: jest.fn().mockResolvedValue(mockSection),
          },
        },
      ],
    }).compile()

    service = module.get(HistoireService)
    repo = module.get(HistoireSectionRepository)
  })

  describe('findAll', () => {
    it('retourne les sections mappées en DTO avec imageSide dérivé', async () => {
      const result = await service.findAll()
      expect(result).toHaveLength(1)
      expect(result[0].key).toBe('enfance')
      expect(result[0].imageSide).toBe('left')
    })

    it('déduit imageSide=right pour un displayOrder impair', async () => {
      repo.findAll.mockResolvedValueOnce([{ ...mockSection, displayOrder: 1 } as any])
      const result = await service.findAll()
      expect(result[0].imageSide).toBe('right')
    })
  })

  describe('update', () => {
    it('met à jour la section si elle existe', async () => {
      const result = await service.update(1, { imageAlt: 'Nouveau' })
      expect(repo.update).toHaveBeenCalledWith(1, { imageAlt: 'Nouveau' })
      expect(result.id).toBe(1)
    })

    it("lève NOT_FOUND si la section n'existe pas", async () => {
      repo.findById.mockResolvedValue(null)
      await expect(service.update(99, {})).rejects.toMatchObject({
        response: expect.objectContaining({ code: 'NOT_FOUND' }),
      })
    })
  })
})
