import { Test } from '@nestjs/testing'
import { getModelToken } from '@nestjs/sequelize'
import { HistoireSectionRepository } from './histoire-section.repository'
import { HistoireSection } from './histoire-section.model'

describe('HistoireSectionRepository', () => {
  let repo: HistoireSectionRepository
  let model: {
    findAll: jest.Mock
    findByPk: jest.Mock
    update: jest.Mock
  }

  const mockSection = {
    id: 1,
    key: 'enfance',
    displayOrder: 0,
    image: 'https://example.com/img.webp',
    imageAlt: 'Cabosses de cacao',
    paragraphs: "['Un premier paragraphe.']",
  }

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        HistoireSectionRepository,
        {
          provide: getModelToken(HistoireSection),
          useValue: {
            findAll: jest.fn().mockResolvedValue([mockSection]),
            findByPk: jest.fn().mockResolvedValue(mockSection),
            update: jest.fn().mockResolvedValue([1]),
          },
        },
      ],
    }).compile()

    repo = module.get(HistoireSectionRepository)
    model = module.get(getModelToken(HistoireSection))
  })

  it('findAll retourne les sections triées par displayOrder', async () => {
    const result = await repo.findAll()
    expect(model.findAll).toHaveBeenCalledWith(
      expect.objectContaining({ order: [['displayOrder', 'ASC']] }),
    )
    expect(result).toHaveLength(1)
  })

  it('findById retourne la section par PK', async () => {
    const result = await repo.findById(1)
    expect(model.findByPk).toHaveBeenCalledWith(1)
    expect(result).toEqual(mockSection)
  })

  it('update met à jour les champs définis et retourne la section mise à jour', async () => {
    const result = await repo.update(1, { imageAlt: 'Nouveau texte alt' })
    expect(model.update).toHaveBeenCalledWith(
      expect.objectContaining({ imageAlt: 'Nouveau texte alt' }),
      { where: { id: 1 } },
    )
    expect(result).toEqual(mockSection)
  })

  it('update ne modifie pas les champs undefined', async () => {
    await repo.update(1, {})
    const call = model.update.mock.calls[0][0]
    expect(Object.keys(call)).toHaveLength(0)
  })

  it('update couvre tous les champs du DTO', async () => {
    await repo.update(1, {
      image: 'https://example.com/new.webp',
      imageAlt: 'Alt',
      paragraphs: ['A', 'B'],
    })
    const call = model.update.mock.calls[0][0]
    expect(call.image).toBe('https://example.com/new.webp')
    expect(call.imageAlt).toBe('Alt')
    expect(call.paragraphs).toEqual(JSON.stringify(['A', 'B']))
  })
})
