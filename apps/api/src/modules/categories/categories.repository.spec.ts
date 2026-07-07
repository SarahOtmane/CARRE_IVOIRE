import { Test } from '@nestjs/testing'
import { getModelToken } from '@nestjs/sequelize'
import { CategoriesRepository } from './categories.repository'
import { Category } from './category.model'

describe('CategoriesRepository', () => {
  let repo: CategoriesRepository
  let model: {
    findAll: jest.Mock
    findByPk: jest.Mock
    findOne: jest.Mock
    create: jest.Mock
    update: jest.Mock
    destroy: jest.Mock
  }

  const mockCategory = { id: 1, name: 'Signature', slug: 'signature' }

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CategoriesRepository,
        {
          provide: getModelToken(Category),
          useValue: {
            findAll: jest.fn().mockResolvedValue([mockCategory]),
            findByPk: jest.fn().mockResolvedValue(mockCategory),
            findOne: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockResolvedValue(mockCategory),
            update: jest.fn().mockResolvedValue([1]),
            destroy: jest.fn().mockResolvedValue(1),
          },
        },
      ],
    }).compile()

    repo = module.get(CategoriesRepository)
    model = module.get(getModelToken(Category))
  })

  it('findAll retourne les catégories actives', async () => {
    const result = await repo.findAll()
    expect(model.findAll).toHaveBeenCalledWith(
      expect.objectContaining({ where: { isActive: 1 } }),
    )
    expect(result).toHaveLength(1)
  })

  it('findById retourne la catégorie par PK', async () => {
    const result = await repo.findById(1)
    expect(model.findByPk).toHaveBeenCalledWith(1)
    expect(result).toEqual(mockCategory)
  })

  it('findBySlug retourne null si le slug est inconnu', async () => {
    expect(await repo.findBySlug('unknown')).toBeNull()
  })

  it('create crée la catégorie avec les bons champs', async () => {
    const dto = { name: 'Nouveau', slug: 'nouveau', displayOrder: 1, isActive: true } as any
    await repo.create(dto)
    expect(model.create).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Nouveau', slug: 'nouveau', isActive: 1 }),
    )
  })

  it('create avec isActive=false → 0', async () => {
    await repo.create({ name: 'X', slug: 'x', isActive: false } as any)
    expect(model.create).toHaveBeenCalledWith(expect.objectContaining({ isActive: 0 }))
  })

  it('update met à jour les champs définis et retourne la catégorie mise à jour', async () => {
    model.findByPk.mockResolvedValue(mockCategory)
    const result = await repo.update(1, { name: 'Updated', isActive: false } as any)
    expect(model.update).toHaveBeenCalled()
    expect(result).toEqual(mockCategory)
  })

  it('update ne modifie pas les champs undefined', async () => {
    model.findByPk.mockResolvedValue(mockCategory)
    await repo.update(1, {} as any)
    const call = model.update.mock.calls[0][0]
    expect(Object.keys(call)).toHaveLength(0)
  })

  it('update couvre tous les champs du DTO', async () => {
    model.findByPk.mockResolvedValue(mockCategory)
    await repo.update(1, { name: 'N', slug: 's', description: 'desc', imageUrl: 'img.jpg', displayOrder: 5, isActive: true } as any)
    const call = model.update.mock.calls[0][0]
    expect(call.slug).toBe('s')
    expect(call.description).toBe('desc')
    expect(call.imageUrl).toBe('img.jpg')
    expect(call.displayOrder).toBe(5)
    expect(call.isActive).toBe(1)
  })

  it('delete supprime par id', async () => {
    await repo.delete(1)
    expect(model.destroy).toHaveBeenCalledWith({ where: { id: 1 } })
  })
})
