import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('./useApi', () => ({ useApi: vi.fn() }))

import { useApi } from './useApi'
import { useAdminProducts } from './useAdminProducts'

const mockApi = {
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
}

const makeProduct = (id = 1) => ({
  id,
  name: `Produit ${id}`,
  slug: `produit-${id}`,
  price: 1000,
  isAvailable: true,
})

describe('useAdminProducts', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    ;(useApi as ReturnType<typeof vi.fn>).mockReturnValue(mockApi)
  })

  it('expose les valeurs initiales par défaut', () => {
    const { products, total, current, isLoading } = useAdminProducts()
    expect(products.value).toEqual([])
    expect(total.value).toBe(0)
    expect(current.value).toBeNull()
    expect(isLoading.value).toBe(false)
  })

  describe('fetchAll()', () => {
    it('charge les produits depuis l\'API avec pagination', async () => {
      const items = [makeProduct(1), makeProduct(2)]
      mockApi.get.mockResolvedValue({ data: { data: { items, total: 2 } } })

      const { products, total, fetchAll } = useAdminProducts()
      await fetchAll()

      expect(mockApi.get).toHaveBeenCalledWith('/products?page=1&limit=50')
      expect(products.value).toEqual(items)
      expect(total.value).toBe(2)
    })

    it('accepte des paramètres de pagination personnalisés', async () => {
      mockApi.get.mockResolvedValue({ data: { data: { items: [], total: 0 } } })
      const { fetchAll } = useAdminProducts()
      await fetchAll(2, 10)

      expect(mockApi.get).toHaveBeenCalledWith('/products?page=2&limit=10')
    })
  })

  describe('create()', () => {
    it('envoie un POST, ajoute le produit en tête de liste et retourne le produit créé', async () => {
      const newProduct = makeProduct(99)
      mockApi.post.mockResolvedValue({ data: { data: newProduct } })

      const { products, create } = useAdminProducts()
      const result = await create({ name: 'Nouveau', price: 999 } as any)

      expect(mockApi.post).toHaveBeenCalledWith('/products', { name: 'Nouveau', price: 999 })
      expect(products.value[0]).toEqual(newProduct)
      expect(result).toEqual(newProduct)
    })
  })

  describe('update()', () => {
    it('envoie un PATCH et met à jour le produit dans la liste et current', async () => {
      const initial = makeProduct(1)
      const updated = { ...initial, name: 'Modifié' }
      mockApi.get.mockResolvedValue({ data: { data: { items: [initial], total: 1 } } })
      mockApi.patch.mockResolvedValue({ data: { data: updated } })

      const { products, current, fetchAll, update } = useAdminProducts()
      await fetchAll()
      current.value = initial as any
      await update(1, { name: 'Modifié' } as any)

      expect(products.value[0].name).toBe('Modifié')
      expect(current.value?.name).toBe('Modifié')
    })

    it('ne plante pas si l\'id n\'est pas dans la liste', async () => {
      mockApi.patch.mockResolvedValue({ data: { data: makeProduct(99) } })
      const { update } = useAdminProducts()
      await expect(update(99, {} as any)).resolves.toBeUndefined()
    })

    it('ne met pas à jour current si les ids ne correspondent pas', async () => {
      const initial = makeProduct(5)
      mockApi.get.mockResolvedValue({ data: { data: { items: [initial], total: 1 } } })
      mockApi.patch.mockResolvedValue({ data: { data: { ...initial, name: 'Changed' } } })

      const { products, current, fetchAll, update } = useAdminProducts()
      await fetchAll()
      current.value = makeProduct(999) as any
      await update(5, { name: 'Changed' } as any)

      expect(products.value[0].name).toBe('Changed')
      expect(current.value?.id).toBe(999)
    })
  })

  describe('remove()', () => {
    it('envoie un DELETE et retire le produit de la liste', async () => {
      const items = [makeProduct(1), makeProduct(2)]
      mockApi.get.mockResolvedValue({ data: { data: { items, total: 2 } } })
      mockApi.delete.mockResolvedValue({})

      const { products, fetchAll, remove } = useAdminProducts()
      await fetchAll()
      await remove(1)

      expect(mockApi.delete).toHaveBeenCalledWith('/products/1')
      expect(products.value).toHaveLength(1)
      expect(products.value[0].id).toBe(2)
    })
  })
})
