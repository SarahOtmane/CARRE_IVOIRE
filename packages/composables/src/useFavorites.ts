import { ref, onMounted } from 'vue'
import type { ProductResponse } from '@carre-ivoire/types'
import { useApi } from './useApi'
import { useLoading } from './useLoading'

interface FavoriteItem {
  id: number
  product: ProductResponse
  addedAt: string
}

export function useFavorites() {
  const favorites = ref<FavoriteItem[]>([])
  const { isLoading, withLoading } = useLoading()
  const api = useApi()

  const fetch = () =>
    withLoading(async () => {
      const res = await api.get('/favorites')
      favorites.value = res.data.data
    })

  const add = async (productId: number) => {
    const res = await api.post(`/favorites/${productId}`)
    await fetch()
    return res.data.data
  }

  const remove = async (productId: number) => {
    await api.delete(`/favorites/${productId}`)
    favorites.value = favorites.value.filter((f) => f.product.id !== productId)
  }

  const isFavorite = (productId: number) =>
    favorites.value.some((f) => f.product.id === productId)

  onMounted(fetch)

  return { favorites, isLoading, fetch, add, remove, isFavorite }
}
