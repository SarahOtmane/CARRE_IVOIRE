import { ref } from 'vue'
import type { OrderResponse } from '@carre-ivoire/types'
import { OrderStatus } from '@carre-ivoire/types'
import { useApi } from './useApi'
import { useLoading } from './useLoading'
import { useNotification } from './useNotification'

export { OrderStatus }

export function useAdminOrders() {
  const orders = ref<OrderResponse[]>([])
  const total = ref(0)
  const current = ref<OrderResponse | null>(null)
  const { isLoading, withLoading } = useLoading()
  const api = useApi()
  const { success } = useNotification()

  const fetchAll = (page = 1, status?: OrderStatus) =>
    withLoading(async () => {
      const params = new URLSearchParams({ page: String(page), limit: '50' })
      if (status) params.set('status', status)
      const res = await api.get(`/orders?${params}`)
      orders.value = res.data.data.items ?? res.data.data
      total.value = res.data.data.total ?? orders.value.length
    })

  const fetchOne = (id: number) =>
    withLoading(async () => {
      const res = await api.get(`/orders/${id}`)
      current.value = res.data.data
    })

  const updateStatus = (id: number, status: OrderStatus) =>
    withLoading(async () => {
      await api.patch(`/orders/${id}/status`, { status })
      const order = orders.value.find((o) => o.id === id)
      if (order) order.status = status
      if (current.value?.id === id) current.value = { ...current.value, status }
      success('Statut mis à jour')
    })

  return { orders, total, current, isLoading, fetchAll, fetchOne, updateStatus, OrderStatus }
}
