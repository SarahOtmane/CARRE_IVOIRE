import { ref } from 'vue'
import type { Order } from '@carre-ivoire/types'
import { useApi } from './useApi'

export function useOrderDetail() {
  const api = useApi()
  const order = ref<Order | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchOrder(id: number | string) {
    isLoading.value = true
    error.value = null
    try {
      const res = await api.get<{ success: boolean; data: Order }>(`/orders/${id}`)
      order.value = res.data.data
    } catch {
      error.value = 'Impossible de charger cette commande.'
    } finally {
      isLoading.value = false
    }
  }

  return { order, isLoading, error, fetchOrder }
}
