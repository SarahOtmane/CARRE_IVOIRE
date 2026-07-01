import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

vi.mock('./useApi', () => ({ useApi: vi.fn() }))

import { useApi } from './useApi'
import { useProductSearch } from './useProductSearch'

const mockApi = {
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
}

describe('useProductSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    ;(useApi as ReturnType<typeof vi.fn>).mockReturnValue(mockApi)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('expose des résultats vides et isSearching=false par défaut', () => {
    const { results, isSearching } = useProductSearch()
    expect(results.value).toEqual([])
    expect(isSearching.value).toBe(false)
  })

  describe('search()', () => {
    it('ne fait rien si la query est vide ou uniquement des espaces', () => {
      const { search, isSearching, results } = useProductSearch()
      search('')
      expect(isSearching.value).toBe(false)
      expect(results.value).toEqual([])

      search('   ')
      expect(isSearching.value).toBe(false)
    })

    it('vide les résultats et isSearching si query est vide', async () => {
      const items = [{ id: 1, name: 'Tablette' }]
      mockApi.get.mockResolvedValue({ data: { data: { items } } })

      const { search, results } = useProductSearch()
      search('choc')
      await vi.advanceTimersByTimeAsync(300)
      expect(results.value).toEqual(items)

      search('')
      expect(results.value).toEqual([])
    })

    it('active isSearching immédiatement pour une query non vide', () => {
      const { search, isSearching } = useProductSearch()
      mockApi.get.mockResolvedValue({ data: { data: { items: [] } } })
      search('choc')
      expect(isSearching.value).toBe(true)
    })

    it('attend 300ms avant d\'appeler l\'API (debounce)', async () => {
      mockApi.get.mockResolvedValue({ data: { data: { items: [] } } })
      const { search } = useProductSearch()

      search('choc')
      expect(mockApi.get).not.toHaveBeenCalled()

      await vi.advanceTimersByTimeAsync(299)
      expect(mockApi.get).not.toHaveBeenCalled()

      await vi.advanceTimersByTimeAsync(1)
      expect(mockApi.get).toHaveBeenCalledTimes(1)
    })

    it('annule le timer précédent si une nouvelle search est lancée', async () => {
      mockApi.get.mockResolvedValue({ data: { data: { items: [] } } })
      const { search } = useProductSearch()

      search('c')
      await vi.advanceTimersByTimeAsync(100)
      search('ch')
      await vi.advanceTimersByTimeAsync(100)
      search('cho')
      await vi.advanceTimersByTimeAsync(300)

      expect(mockApi.get).toHaveBeenCalledTimes(1)
      expect(mockApi.get).toHaveBeenCalledWith(expect.stringContaining('search=cho'))
    })

    it('remplit results avec les items retournés par l\'API', async () => {
      const items = [{ id: 1, name: 'Tablette Noir' }, { id: 2, name: 'Tablette Lait' }]
      mockApi.get.mockResolvedValue({ data: { data: { items } } })

      const { search, results } = useProductSearch()
      search('tablette')
      await vi.advanceTimersByTimeAsync(300)

      expect(results.value).toEqual(items)
    })

    it('utilise la limit passée en paramètre', async () => {
      mockApi.get.mockResolvedValue({ data: { data: { items: [] } } })
      const { search } = useProductSearch()
      search('choc', 5)
      await vi.advanceTimersByTimeAsync(300)

      expect(mockApi.get).toHaveBeenCalledWith(expect.stringContaining('limit=5'))
    })

    it('ignore le résultat d\'une recherche obsolète (latestQuery)', async () => {
      const items1 = [{ id: 1, name: 'choc' }]
      const items2 = [{ id: 2, name: 'chocolat' }]

      let resolve1!: (val: any) => void
      const slow1 = new Promise((r) => { resolve1 = r }).then(() => ({ data: { data: { items: items1 } } }))

      mockApi.get
        .mockReturnValueOnce(slow1)
        .mockResolvedValueOnce({ data: { data: { items: items2 } } })

      const { search, results } = useProductSearch()

      search('choc')
      await vi.advanceTimersByTimeAsync(300)

      search('chocolat')
      await vi.advanceTimersByTimeAsync(300)

      resolve1(undefined)
      await Promise.resolve()

      expect(results.value).toEqual(items2)
    })

    it('désactive isSearching après la réponse API', async () => {
      mockApi.get.mockResolvedValue({ data: { data: { items: [] } } })
      const { search, isSearching } = useProductSearch()
      search('choc')
      await vi.advanceTimersByTimeAsync(300)
      expect(isSearching.value).toBe(false)
    })
  })

  describe('clear()', () => {
    it('vide les résultats, désactive isSearching et annule le timer', async () => {
      mockApi.get.mockResolvedValue({ data: { data: { items: [{ id: 1 }] } } })
      const { search, clear, results, isSearching } = useProductSearch()

      search('choc')
      clear()

      await vi.advanceTimersByTimeAsync(400)

      expect(results.value).toEqual([])
      expect(isSearching.value).toBe(false)
      expect(mockApi.get).not.toHaveBeenCalled()
    })
  })
})
