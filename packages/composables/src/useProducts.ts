import { ref, onMounted } from 'vue'
import type { ProductResponse, CategoryResponse } from '@carre-ivoire/types'
import { useApi } from './useApi'
import { useLoading } from './useLoading'

interface ProductQuery {
  categoryId?: number
  page?: number
  limit?: number
}

interface ProductsResult {
  items: ProductResponse[]
  total: number
  page: number
  totalPages: number
}

export function useProducts(initialQuery: ProductQuery = {}) {
  const result = ref<ProductsResult>({ items: [], total: 0, page: 1, totalPages: 1 })
  const { isLoading, withLoading } = useLoading()
  const api = useApi()

  const fetch = (query: ProductQuery = initialQuery) =>
    withLoading(async () => {
      const params = new URLSearchParams()
      if (query.categoryId) params.set('categoryId', String(query.categoryId))
      if (query.page) params.set('page', String(query.page))
      if (query.limit) params.set('limit', String(query.limit))

      const res = await api.get(`/products?${params}`)
      result.value = res.data.data
    })

  onMounted(() => fetch())

  return { result, isLoading, fetch }
}

export function useProduct(slug: string) {
  const product = ref<ProductResponse | null>(null)
  const { isLoading, withLoading } = useLoading()
  const api = useApi()

  const fetch = () =>
    withLoading(async () => {
      const res = await api.get(`/products/${slug}`)
      product.value = res.data.data
    })

  onMounted(fetch)

  return { product, isLoading, refresh: fetch }
}

export function useCategories() {
  const categories = ref<CategoryResponse[]>([])
  const { isLoading, withLoading } = useLoading()
  const api = useApi()

  const fetch = () =>
    withLoading(async () => {
      const res = await api.get('/categories')
      categories.value = res.data.data
    })

  onMounted(fetch)

  return { categories, isLoading, fetch }
}
