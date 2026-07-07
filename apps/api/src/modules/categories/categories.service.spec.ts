import { Test } from '@nestjs/testing'
import { CategoriesService } from './categories.service'
import { CategoriesRepository } from './categories.repository'

const mockCategory = {
  id: 1, name: 'Signature', slug: 'carres-signature', description: 'Description',
  imageUrl: null, displayOrder: 1, isActive: 1,
  created_at: new Date(), updated_at: new Date(),
}

describe('CategoriesService', () => {
  let service: CategoriesService
  let repo: jest.Mocked<CategoriesRepository>

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: CategoriesRepository,
          useValue: {
            findAll: jest.fn().mockResolvedValue([mockCategory]),
            findById: jest.fn().mockResolvedValue(mockCategory),
            findBySlug: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockResolvedValue(mockCategory),
            update: jest.fn().mockResolvedValue(mockCategory),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile()

    service = module.get(CategoriesService)
    repo = module.get(CategoriesRepository)
  })

  describe('findAll', () => {
    it('retourne la liste des catégories mappées en DTO', async () => {
      const result = await service.findAll()
      expect(result).toHaveLength(1)
      expect(result[0].slug).toBe('carres-signature')
      expect(result[0].isActive).toBe(true)
    })

    it('mappe description=null et imageUrl non-null (branches ?? restantes)', async () => {
      const cat = { ...mockCategory, description: null, imageUrl: 'img.jpg', isActive: 0 }
      repo.findAll.mockResolvedValueOnce([cat as any])
      const result = await service.findAll()
      expect(result[0].description).toBeUndefined()
      expect(result[0].imageUrl).toBe('img.jpg')
      expect(result[0].isActive).toBe(false)
    })
  })

  describe('create', () => {
    it('crée une catégorie si le slug est libre', async () => {
      const dto = { name: 'Signature', slug: 'nouveau-slug', displayOrder: 0 } as any
      const result = await service.create(dto)
      expect(repo.findBySlug).toHaveBeenCalledWith('nouveau-slug')
      expect(repo.create).toHaveBeenCalledWith(dto)
      expect(result.id).toBe(1)
    })

    it('lève CATEGORY_SLUG_EXISTS si le slug est déjà pris', async () => {
      repo.findBySlug.mockResolvedValue(mockCategory as any)
      await expect(service.create({ slug: 'carres-signature' } as any)).rejects.toMatchObject({
        response: expect.objectContaining({ code: 'CATEGORY_SLUG_EXISTS' }),
      })
    })
  })

  describe('update', () => {
    it('met à jour la catégorie si elle existe', async () => {
      const result = await service.update(1, { name: 'Nouveau nom' } as any)
      expect(repo.update).toHaveBeenCalledWith(1, { name: 'Nouveau nom' })
      expect(result.id).toBe(1)
    })

    it('lève CATEGORY_NOT_FOUND si la catégorie n\'existe pas', async () => {
      repo.findById.mockResolvedValue(null)
      await expect(service.update(99, {} as any)).rejects.toMatchObject({
        response: expect.objectContaining({ code: 'CATEGORY_NOT_FOUND' }),
      })
    })
  })

  describe('delete', () => {
    it('supprime la catégorie si elle existe', async () => {
      await expect(service.delete(1)).resolves.toBeUndefined()
      expect(repo.delete).toHaveBeenCalledWith(1)
    })

    it('lève CATEGORY_NOT_FOUND si la catégorie n\'existe pas', async () => {
      repo.findById.mockResolvedValue(null)
      await expect(service.delete(99)).rejects.toMatchObject({
        response: expect.objectContaining({ code: 'CATEGORY_NOT_FOUND' }),
      })
    })

    it('lève CONFLICT si des produits utilisent la catégorie (FK constraint)', async () => {
      const fkError = new Error('FK')
      ;(fkError as any).name = 'SequelizeForeignKeyConstraintError'
      repo.delete.mockRejectedValue(fkError)
      await expect(service.delete(1)).rejects.toMatchObject({
        response: expect.objectContaining({ code: 'CONFLICT' }),
      })
    })

    it('relance les erreurs non-FK', async () => {
      const otherError = new Error('DB crash')
      ;(otherError as any).name = 'SequelizeConnectionError'
      repo.delete.mockRejectedValue(otherError)
      await expect(service.delete(1)).rejects.toThrow('DB crash')
    })
  })
})
