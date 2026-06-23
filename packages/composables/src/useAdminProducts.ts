import { ref } from 'vue'
import type { ProductResponse, CreateProductDto, UpdateProductDto } from '@carre-ivoire/types'
import { useApi } from './useApi'
import { useLoading } from './useLoading'
import { useNotification } from './useNotification'

export function useAdminProducts() {
  const products = ref<ProductResponse[]>([])
  const total = ref(0)
  const current = ref<ProductResponse | null>(null)
  const { isLoading, withLoading } = useLoading()
  const api = useApi()
  const { success } = useNotification()

  const fetchAll = (page = 1, limit = 50) =>
    withLoading(async () => {
      const res = await api.get(`/products?page=${page}&limit=${limit}`)
      products.value = res.data.data.items
      total.value = res.data.data.total
    })

  const fetchOne = (id: number) =>
    withLoading(async () => {
      const res = await api.get(`/products/by-id/${id}`)
      current.value = res.data.data
    })

  const create = (dto: CreateProductDto) =>
    withLoading(async () => {
      const res = await api.post('/products', dto)
      products.value.unshift(res.data.data)
      success('Produit créé')
      return res.data.data as ProductResponse
    })

  const update = (id: number, dto: UpdateProductDto) =>
    withLoading(async () => {
      const res = await api.patch(`/products/${id}`, dto)
      const idx = products.value.findIndex((p) => p.id === id)
      if (idx !== -1) products.value[idx] = res.data.data
      if (current.value?.id === id) current.value = res.data.data
      success('Produit mis à jour')
    })

  const remove = (id: number) =>
    withLoading(async () => {
      await api.delete(`/products/${id}`)
      products.value = products.value.filter((p) => p.id !== id)
      success('Produit supprimé')
    })

  return { products, total, current, isLoading, fetchAll, fetchOne, create, update, remove }
}
