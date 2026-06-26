import { ref, computed } from 'vue'
import type { Order } from '@carre-ivoire/types'
import { useApi } from './useApi'

export function useUserOrders() {
  const api = useApi()
  const orders = ref<Order[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const totalSpent = computed(() =>
    orders.value.reduce((acc, o) => acc + o.totalAmount, 0),
  )

  async function fetchOrders() {
    isLoading.value = true
    error.value = null
    try {
      const res = await api.get<{ success: boolean; data: Order[] }>('/orders/me')
      orders.value = res.data.data
    } catch {
      error.value = 'Impossible de charger vos commandes.'
    } finally {
      isLoading.value = false
    }
  }

  return { orders, isLoading, error, totalSpent, fetchOrders }
}
