import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('./useApi', () => ({ useApi: vi.fn() }))

import { useApi } from './useApi'
import { useAdminProductVariants } from './useAdminProductVariants'

const mockApi = {
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
}

const makeVariant = (id = 1) => ({ id, label: `Variante ${id}`, stock: 10, priceModifier: 0 })

describe('useAdminProductVariants', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    ;(useApi as ReturnType<typeof vi.fn>).mockReturnValue(mockApi)
  })

  it('expose des variantes vides et isLoading=false par défaut', () => {
    const { variants, isLoading } = useAdminProductVariants()
    expect(variants.value).toEqual([])
    expect(isLoading.value).toBe(false)
  })

  describe('fetchAll()', () => {
    it('charge les variantes d\'un produit', async () => {
      const data = [makeVariant(1), makeVariant(2)]
      mockApi.get.mockResolvedValue({ data: { data } })

      const { variants, fetchAll } = useAdminProductVariants()
      await fetchAll(10)

      expect(mockApi.get).toHaveBeenCalledWith('/products/10/variants')
      expect(variants.value).toEqual(data)
    })
  })

  describe('create()', () => {
    it('envoie un POST, ajoute la variante à la liste et retourne la variante créée', async () => {
      const newVariant = makeVariant(5)
      mockApi.post.mockResolvedValue({ data: { data: newVariant } })

      const { variants, create } = useAdminProductVariants()
      const result = await create(10, { label: 'Variante 5' } as any)

      expect(mockApi.post).toHaveBeenCalledWith('/products/10/variants', { label: 'Variante 5' })
      expect(variants.value).toContainEqual(newVariant)
      expect(result).toEqual(newVariant)
    })
  })

  describe('update()', () => {
    it('envoie un PATCH et met à jour la variante dans la liste', async () => {
      const initial = makeVariant(1)
      const updated = { ...initial, stock: 99 }
      mockApi.get.mockResolvedValue({ data: { data: [initial] } })
      mockApi.patch.mockResolvedValue({ data: { data: updated } })

      const { variants, fetchAll, update } = useAdminProductVariants()
      await fetchAll(10)
      await update(10, 1, { stock: 99 } as any)

      expect(mockApi.patch).toHaveBeenCalledWith('/products/10/variants/1', { stock: 99 })
      expect(variants.value[0].stock).toBe(99)
    })

    it('ne plante pas si la variante n\'est pas trouvée dans la liste', async () => {
      mockApi.patch.mockResolvedValue({ data: { data: makeVariant(99) } })
      const { update } = useAdminProductVariants()
      await expect(update(10, 99, {} as any)).resolves.toBeUndefined()
    })
  })

  describe('remove()', () => {
    it('envoie un DELETE et retire la variante de la liste', async () => {
      const data = [makeVariant(1), makeVariant(2)]
      mockApi.get.mockResolvedValue({ data: { data } })
      mockApi.delete.mockResolvedValue({})

      const { variants, fetchAll, remove } = useAdminProductVariants()
      await fetchAll(10)
      await remove(10, 1)

      expect(mockApi.delete).toHaveBeenCalledWith('/products/10/variants/1')
      expect(variants.value).toHaveLength(1)
      expect(variants.value[0].id).toBe(2)
    })
  })
})
