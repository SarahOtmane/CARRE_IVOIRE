import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('./useApi', () => ({ useApi: vi.fn() }))

import { useApi } from './useApi'
import { useAdminOrders, OrderStatus } from './useAdminOrders'

const mockApi = {
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
}

describe('useAdminOrders', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    ;(useApi as ReturnType<typeof vi.fn>).mockReturnValue(mockApi)
  })

  it('expose les valeurs initiales par défaut', () => {
    const { orders, total, current, isLoading } = useAdminOrders()
    expect(orders.value).toEqual([])
    expect(total.value).toBe(0)
    expect(current.value).toBeNull()
    expect(isLoading.value).toBe(false)
  })

  it('ré-exporte OrderStatus', () => {
    expect(OrderStatus).toBeDefined()
  })

  describe('fetchAll()', () => {
    it('charge les commandes avec pagination (format items/total)', async () => {
      const items = [{ id: 1, status: 'pending' }, { id: 2, status: 'paid' }]
      mockApi.get.mockResolvedValue({ data: { data: { items, total: 2 } } })

      const { orders, total, fetchAll } = useAdminOrders()
      await fetchAll()

      expect(mockApi.get).toHaveBeenCalledWith(expect.stringContaining('/orders?'))
      expect(orders.value).toEqual(items)
      expect(total.value).toBe(2)
    })

    it('charge les commandes au format tableau simple (fallback)', async () => {
      const data = [{ id: 1, status: 'pending' }]
      mockApi.get.mockResolvedValue({ data: { data } })

      const { orders, total, fetchAll } = useAdminOrders()
      await fetchAll()

      expect(orders.value).toEqual(data)
      expect(total.value).toBe(1)
    })

    it('inclut le filtre de statut dans l\'URL si fourni', async () => {
      mockApi.get.mockResolvedValue({ data: { data: { items: [], total: 0 } } })
      const { fetchAll } = useAdminOrders()
      await fetchAll(1, OrderStatus.CONFIRMED)

      expect(mockApi.get).toHaveBeenCalledWith(expect.stringContaining('status='))
    })

    it('n\'inclut pas de filtre statut si non fourni', async () => {
      mockApi.get.mockResolvedValue({ data: { data: { items: [], total: 0 } } })
      const { fetchAll } = useAdminOrders()
      await fetchAll()

      const url = mockApi.get.mock.calls[0][0] as string
      expect(url).not.toContain('status=')
    })
  })

  describe('fetchOne()', () => {
    it('charge une commande par id et la stocke dans current', async () => {
      const order = { id: 42, status: 'paid' }
      mockApi.get.mockResolvedValue({ data: { data: order } })

      const { current, fetchOne } = useAdminOrders()
      await fetchOne(42)

      expect(mockApi.get).toHaveBeenCalledWith('/orders/42')
      expect(current.value).toEqual(order)
    })
  })

  describe('updateStatus()', () => {
    it('met à jour le statut dans la liste et dans current', async () => {
      const order = { id: 1, status: 'pending' }
      mockApi.get.mockResolvedValueOnce({ data: { data: { items: [order], total: 1 } } })
      mockApi.get.mockResolvedValueOnce({ data: { data: order } })
      mockApi.patch.mockResolvedValue({})

      const { orders, current, fetchAll, fetchOne, updateStatus } = useAdminOrders()
      await fetchAll()
      await fetchOne(1)
      await updateStatus(1, OrderStatus.PAID)

      expect(mockApi.patch).toHaveBeenCalledWith('/orders/1/status', { status: OrderStatus.PAID })
      expect(orders.value[0].status).toBe(OrderStatus.PAID)
      expect(current.value?.status).toBe(OrderStatus.PAID)
    })

    it('ne plante pas si la commande n\'est pas dans la liste', async () => {
      mockApi.patch.mockResolvedValue({})
      const { updateStatus } = useAdminOrders()
      await expect(updateStatus(999, OrderStatus.PAID)).resolves.toBeUndefined()
    })

    it('ne met pas à jour current si l\'id ne correspond pas', async () => {
      const order = { id: 5, status: 'pending' }
      mockApi.get.mockResolvedValueOnce({ data: { data: { items: [], total: 0 } } })
      mockApi.get.mockResolvedValueOnce({ data: { data: order } })
      mockApi.patch.mockResolvedValue({})

      const { current, fetchAll, fetchOne, updateStatus } = useAdminOrders()
      await fetchAll()
      await fetchOne(5)
      await updateStatus(99, OrderStatus.PAID)

      expect(current.value?.status).toBe('pending')
    })
  })
})
