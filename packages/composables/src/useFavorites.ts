import { ref, computed, onMounted } from 'vue'
import type { ProductResponse } from '@carre-ivoire/types'
import { useAuthStore } from '@carre-ivoire/stores'
import { useApi } from './useApi'
import { useLoading } from './useLoading'

interface FavoriteItem {
  id: number
  product: ProductResponse
  addedAt: string
}

export function useFavorites() {
  const favorites = ref<FavoriteItem[]>([])
  const pendingIds = ref(new Set<number>())
  const { isLoading, withLoading } = useLoading()
  const api = useApi()
  const authStore = useAuthStore()

  const fetch = () =>
    withLoading(async () => {
      const res = await api.get('/favorites')
      favorites.value = res.data.data
    })

  const isFavorite = (productId: number) =>
    favorites.value.some((f) => f.product.id === productId)

  const add = async (productId: number) => {
    if (pendingIds.value.has(productId)) return

    const alreadyFav = isFavorite(productId)
    if (alreadyFav) return

    pendingIds.value.add(productId)
    // Optimiste : ajouter une entrée locale immédiatement
    favorites.value.push({
      id: -productId,
      product: { id: productId } as ProductResponse,
      addedAt: new Date().toISOString(),
    })

    try {
      const res = await api.post(`/favorites/${productId}`)
      // Remplacer l'entrée optimiste par la réponse serveur
      const serverItem: FavoriteItem = res.data.data
      const idx = favorites.value.findIndex((f) => f.id === -productId)
      if (idx !== -1) favorites.value.splice(idx, 1, serverItem)
    } catch {
      // Rollback
      favorites.value = favorites.value.filter((f) => f.id !== -productId)
    } finally {
      pendingIds.value.delete(productId)
    }
  }

  const remove = async (productId: number) => {
    if (pendingIds.value.has(productId)) return

    const snapshot = [...favorites.value]
    pendingIds.value.add(productId)
    // Optimiste : retirer immédiatement de la liste
    favorites.value = favorites.value.filter((f) => f.product.id !== productId)

    try {
      await api.delete(`/favorites/${productId}`)
    } catch {
      // Rollback
      favorites.value = snapshot
    } finally {
      pendingIds.value.delete(productId)
    }
  }

  const toggle = async (productId: number) => {
    if (isFavorite(productId)) {
      await remove(productId)
    } else {
      await add(productId)
    }
  }

  const isPending = computed(() => (productId: number) => pendingIds.value.has(productId))

  onMounted(() => {
    if (authStore.isAuthenticated) fetch()
  })

  return { favorites, isLoading, isPending, fetch, add, remove, toggle, isFavorite }
}
