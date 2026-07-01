import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('./useApi', () => ({ useApi: vi.fn() }))

import { useApi } from './useApi'
import { useProducts, useProduct, useCategories } from './useProducts'

const mockApi = {
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
}

describe('useProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useApi as ReturnType<typeof vi.fn>).mockReturnValue(mockApi)
  })

  it('expose une liste vide et isLoading=false par défaut', () => {
    const { result, isLoading } = useProducts()
    expect(result.value.items).toEqual([])
    expect(result.value.total).toBe(0)
    expect(result.value.page).toBe(1)
    expect(result.value.totalPages).toBe(1)
    expect(isLoading.value).toBe(false)
  })

  it('fetch() charge les produits depuis l\'API', async () => {
    const data = { items: [{ id: 1, name: 'Tablette' }], total: 1, page: 1, totalPages: 1 }
    mockApi.get.mockResolvedValue({ data: { data } })

    const { result, fetch } = useProducts()
    await fetch()

    expect(mockApi.get).toHaveBeenCalledWith(expect.stringContaining('/products?'))
    expect(result.value).toEqual(data)
  })

  it('fetch() construit les paramètres de query correctement', async () => {
    mockApi.get.mockResolvedValue({ data: { data: { items: [], total: 0, page: 1, totalPages: 1 } } })

    const { fetch } = useProducts()
    await fetch({ categoryId: 5, search: 'noir', sort: 'price_asc', page: 2, limit: 12 })

    const url = mockApi.get.mock.calls[0][0] as string
    expect(url).toContain('categoryId=5')
    expect(url).toContain('search=noir')
    expect(url).toContain('sort=price_asc')
    expect(url).toContain('page=2')
    expect(url).toContain('limit=12')
  })

  it('fetch() n\'inclut pas les paramètres falsy', async () => {
    mockApi.get.mockResolvedValue({ data: { data: { items: [], total: 0, page: 1, totalPages: 1 } } })

    const { fetch } = useProducts()
    await fetch({})

    const url = mockApi.get.mock.calls[0][0] as string
    expect(url).not.toContain('categoryId')
    expect(url).not.toContain('search')
  })

  it('fetch() utilise la query initiale si aucun argument passé', async () => {
    mockApi.get.mockResolvedValue({ data: { data: { items: [], total: 0, page: 1, totalPages: 1 } } })

    const { fetch } = useProducts({ categoryId: 3 })
    await fetch()

    const url = mockApi.get.mock.calls[0][0] as string
    expect(url).toContain('categoryId=3')
  })
})

describe('useProduct', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useApi as ReturnType<typeof vi.fn>).mockReturnValue(mockApi)
  })

  it('expose product=null et isLoading=false par défaut', () => {
    const { product, isLoading } = useProduct('tablette-noir')
    expect(product.value).toBeNull()
    expect(isLoading.value).toBe(false)
  })

  it('refresh() charge le produit par slug', async () => {
    const data = { id: 1, name: 'Tablette Noir', slug: 'tablette-noir' }
    mockApi.get.mockResolvedValue({ data: { data } })

    const { product, refresh } = useProduct('tablette-noir')
    await refresh()

    expect(mockApi.get).toHaveBeenCalledWith('/products/tablette-noir')
    expect(product.value).toEqual(data)
  })
})

describe('useCategories', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useApi as ReturnType<typeof vi.fn>).mockReturnValue(mockApi)
  })

  it('expose categories=[] et isLoading=false par défaut', () => {
    const { categories, isLoading } = useCategories()
    expect(categories.value).toEqual([])
    expect(isLoading.value).toBe(false)
  })

  it('fetch() charge les catégories', async () => {
    const data = [{ id: 1, name: 'Tablettes' }]
    mockApi.get.mockResolvedValue({ data: { data } })

    const { categories, fetch } = useCategories()
    await fetch()

    expect(mockApi.get).toHaveBeenCalledWith('/categories')
    expect(categories.value).toEqual(data)
  })
})
