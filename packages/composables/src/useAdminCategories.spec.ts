import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('./useApi', () => ({ useApi: vi.fn() }))

import { useApi } from './useApi'
import { useAdminCategories } from './useAdminCategories'

const mockApi = {
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
}

describe('useAdminCategories', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    ;(useApi as ReturnType<typeof vi.fn>).mockReturnValue(mockApi)
  })

  it('expose des catégories vides et isLoading=false par défaut', () => {
    const { categories, isLoading } = useAdminCategories()
    expect(categories.value).toEqual([])
    expect(isLoading.value).toBe(false)
  })

  it('fetchAll() charge les catégories depuis l\'API', async () => {
    const data = [{ id: 1, name: 'Tablettes' }, { id: 2, name: 'Bonbons' }]
    mockApi.get.mockResolvedValue({ data: { data } })

    const { categories, fetchAll } = useAdminCategories()
    await fetchAll()

    expect(mockApi.get).toHaveBeenCalledWith('/categories')
    expect(categories.value).toEqual(data)
  })

  it('fetchAll() gère les erreurs sans crash', async () => {
    mockApi.get.mockRejectedValue(new Error('Network error'))
    const { fetchAll } = useAdminCategories()
    await expect(fetchAll()).rejects.toThrow()
  })

  it('create() envoie un POST et ajoute la catégorie à la liste', async () => {
    const newCat = { id: 3, name: 'Pralinés' }
    mockApi.post.mockResolvedValue({ data: { data: newCat } })
    mockApi.get.mockResolvedValue({ data: { data: [{ id: 1, name: 'Tablettes' }] } })

    const { categories, fetchAll, create } = useAdminCategories()
    await fetchAll()
    await create({ name: 'Pralinés' })

    expect(mockApi.post).toHaveBeenCalledWith('/categories', { name: 'Pralinés' })
    expect(categories.value).toContainEqual(newCat)
  })

  it('update() envoie un PATCH et met à jour la catégorie dans la liste', async () => {
    const initial = [{ id: 1, name: 'Tablettes' }]
    const updated = { id: 1, name: 'Tablettes Noires' }
    mockApi.get.mockResolvedValue({ data: { data: initial } })
    mockApi.patch.mockResolvedValue({ data: { data: updated } })

    const { categories, fetchAll, update } = useAdminCategories()
    await fetchAll()
    await update(1, { name: 'Tablettes Noires' })

    expect(mockApi.patch).toHaveBeenCalledWith('/categories/1', { name: 'Tablettes Noires' })
    expect(categories.value[0].name).toBe('Tablettes Noires')
  })

  it('update() ne plante pas si l\'id n\'est pas trouvé dans la liste', async () => {
    mockApi.get.mockResolvedValue({ data: { data: [] } })
    mockApi.patch.mockResolvedValue({ data: { data: { id: 99, name: 'Ghost' } } })

    const { fetchAll, update } = useAdminCategories()
    await fetchAll()
    await expect(update(99, { name: 'Ghost' })).resolves.toBeUndefined()
  })

  it('remove() envoie un DELETE et retire la catégorie de la liste', async () => {
    const initial = [{ id: 1, name: 'Tablettes' }, { id: 2, name: 'Bonbons' }]
    mockApi.get.mockResolvedValue({ data: { data: initial } })
    mockApi.delete.mockResolvedValue({})

    const { categories, fetchAll, remove } = useAdminCategories()
    await fetchAll()
    await remove(1)

    expect(mockApi.delete).toHaveBeenCalledWith('/categories/1')
    expect(categories.value).toHaveLength(1)
    expect(categories.value[0].id).toBe(2)
  })
})
