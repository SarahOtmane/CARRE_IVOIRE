import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Product {
  id: number
  name: string
  slug: string
  price: number
  shortDesc?: string
  imageUrl?: string
  categoryId: number
  stock: number
  isActive: boolean
  isSeasonal?: boolean
}

interface ProductFilters {
  categorySlug?: string
  page: number
  limit: number
}

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([])
  const currentProduct = ref<Product | null>(null)
  const total = ref(0)
  const filters = ref<ProductFilters>({ page: 1, limit: 12 })
  const loading = ref(false)

  function setProducts(data: Product[], count: number) {
    products.value = data
    total.value = count
  }

  function setCurrentProduct(product: Product) {
    currentProduct.value = product
  }

  function setFilters(partial: Partial<ProductFilters>) {
    filters.value = { ...filters.value, ...partial }
  }

  function setLoading(state: boolean) {
    loading.value = state
  }

  function reset() {
    products.value = []
    currentProduct.value = null
    total.value = 0
    filters.value = { page: 1, limit: 12 }
  }

  return {
    products,
    currentProduct,
    total,
    filters,
    loading,
    setProducts,
    setCurrentProduct,
    setFilters,
    setLoading,
    reset,
  }
})
