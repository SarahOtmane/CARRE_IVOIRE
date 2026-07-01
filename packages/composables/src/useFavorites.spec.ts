import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('./useApi', () => ({ useApi: vi.fn() }))

import { useApi } from './useApi'
import { useFavorites } from './useFavorites'

const mockApi = {
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
}

const makeFavItem = (productId: number) => ({
  id: productId * 10,
  product: { id: productId, name: `Produit ${productId}`, price: 1000 } as any,
  addedAt: '2024-01-01T00:00:00.000Z',
})

describe('useFavorites', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useApi as ReturnType<typeof vi.fn>).mockReturnValue(mockApi)
  })

  it('expose des favoris vides et isLoading=false par défaut', () => {
    const { favorites, isLoading } = useFavorites()
    expect(favorites.value).toEqual([])
    expect(isLoading.value).toBe(false)
  })

  describe('fetch()', () => {
    it('charge les favoris depuis l\'API', async () => {
      const data = [makeFavItem(1), makeFavItem(2)]
      mockApi.get.mockResolvedValue({ data: { data } })

      const { favorites, fetch } = useFavorites()
      await fetch()

      expect(mockApi.get).toHaveBeenCalledWith('/favorites')
      expect(favorites.value).toEqual(data)
    })
  })

  describe('isFavorite()', () => {
    it('retourne false si le produit n\'est pas dans les favoris', () => {
      const { isFavorite } = useFavorites()
      expect(isFavorite(99)).toBe(false)
    })

    it('retourne true si le produit est dans les favoris', async () => {
      mockApi.get.mockResolvedValue({ data: { data: [makeFavItem(5)] } })
      const { fetch, isFavorite } = useFavorites()
      await fetch()
      expect(isFavorite(5)).toBe(true)
    })
  })

  describe('isPending', () => {
    it('retourne false pour un produit non en cours de traitement', () => {
      const { isPending } = useFavorites()
      expect(isPending.value(1)).toBe(false)
    })
  })

  describe('add()', () => {
    it('ajoute un favori de manière optimiste puis remplace par la réponse serveur', async () => {
      const serverItem = makeFavItem(1)
      mockApi.post.mockResolvedValue({ data: { data: serverItem } })

      const { favorites, add } = useFavorites()
      await add(1)

      expect(mockApi.post).toHaveBeenCalledWith('/favorites/1')
      expect(favorites.value).toHaveLength(1)
      expect(favorites.value[0]).toEqual(serverItem)
    })

    it('rollback optimiste si le POST échoue', async () => {
      mockApi.post.mockRejectedValue(new Error('Network'))

      const { favorites, add } = useFavorites()
      await add(1)

      expect(favorites.value).toHaveLength(0)
    })

    it('ne fait rien si le produit est déjà dans les favoris', async () => {
      mockApi.get.mockResolvedValue({ data: { data: [makeFavItem(1)] } })
      const { fetch, add } = useFavorites()
      await fetch()
      await add(1)

      expect(mockApi.post).not.toHaveBeenCalled()
    })

    it('ne fait rien si un add est déjà en cours pour ce produit', async () => {
      let resolve!: (val: any) => void
      const pending = new Promise((r) => { resolve = r })
      mockApi.post.mockReturnValueOnce(pending.then(() => ({ data: { data: makeFavItem(1) } })))

      const { add } = useFavorites()

      const p1 = add(1)
      const p2 = add(1)

      resolve(undefined)
      await p1
      await p2

      expect(mockApi.post).toHaveBeenCalledTimes(1)
    })

    it('supprime le produit de pendingIds après ajout', async () => {
      mockApi.post.mockResolvedValue({ data: { data: makeFavItem(7) } })
      const { add, isPending } = useFavorites()
      await add(7)
      expect(isPending.value(7)).toBe(false)
    })
  })

  describe('remove()', () => {
    it('supprime un favori de manière optimiste', async () => {
      mockApi.get.mockResolvedValue({ data: { data: [makeFavItem(1)] } })
      mockApi.delete.mockResolvedValue({})

      const { favorites, fetch, remove } = useFavorites()
      await fetch()
      await remove(1)

      expect(mockApi.delete).toHaveBeenCalledWith('/favorites/1')
      expect(favorites.value).toHaveLength(0)
    })

    it('rollback si le DELETE échoue', async () => {
      mockApi.get.mockResolvedValue({ data: { data: [makeFavItem(1)] } })
      mockApi.delete.mockRejectedValue(new Error('Network'))

      const { favorites, fetch, remove } = useFavorites()
      await fetch()
      await remove(1)

      expect(favorites.value).toHaveLength(1)
    })

    it('ne fait rien si un remove est déjà en cours pour ce produit', async () => {
      mockApi.get.mockResolvedValue({ data: { data: [makeFavItem(2)] } })
      let resolve!: (val: any) => void
      const pending = new Promise((r) => { resolve = r })
      mockApi.delete.mockReturnValueOnce(pending)

      const { fetch, remove } = useFavorites()
      await fetch()

      const p1 = remove(2)
      const p2 = remove(2)

      resolve(undefined)
      await p1
      await p2

      expect(mockApi.delete).toHaveBeenCalledTimes(1)
    })
  })

  describe('toggle()', () => {
    it('appelle add si le produit n\'est pas dans les favoris', async () => {
      mockApi.post.mockResolvedValue({ data: { data: makeFavItem(3) } })
      const { toggle, favorites } = useFavorites()
      await toggle(3)
      expect(favorites.value).toHaveLength(1)
    })

    it('appelle remove si le produit est déjà dans les favoris', async () => {
      mockApi.get.mockResolvedValue({ data: { data: [makeFavItem(3)] } })
      mockApi.delete.mockResolvedValue({})
      const { fetch, toggle, favorites } = useFavorites()
      await fetch()
      await toggle(3)
      expect(favorites.value).toHaveLength(0)
    })
  })
})
