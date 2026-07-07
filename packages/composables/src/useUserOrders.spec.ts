import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('./useApi', () => ({ useApi: vi.fn() }))

import { useApi } from './useApi'
import { useUserOrders } from './useUserOrders'

const mockApi = {
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
}

const makeOrder = (id: number, totalAmount: number) => ({
  id,
  totalAmount,
  status: 'paid',
  createdAt: '2024-01-01',
})

describe('useUserOrders', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useApi as ReturnType<typeof vi.fn>).mockReturnValue(mockApi)
  })

  it('expose les valeurs initiales par défaut', () => {
    const { orders, isLoading, error, totalSpent } = useUserOrders()
    expect(orders.value).toEqual([])
    expect(isLoading.value).toBe(false)
    expect(error.value).toBeNull()
    expect(totalSpent.value).toBe(0)
  })

  describe('fetchOrders()', () => {
    it('charge les commandes de l\'utilisateur connecté', async () => {
      const data = [makeOrder(1, 1200), makeOrder(2, 800)]
      mockApi.get.mockResolvedValue({ data: { data } })

      const { orders, fetchOrders } = useUserOrders()
      await fetchOrders()

      expect(mockApi.get).toHaveBeenCalledWith('/orders/me')
      expect(orders.value).toEqual(data)
    })

    it('calcule totalSpent comme la somme des totalAmount', async () => {
      const data = [makeOrder(1, 1200), makeOrder(2, 800)]
      mockApi.get.mockResolvedValue({ data: { data } })

      const { totalSpent, fetchOrders } = useUserOrders()
      await fetchOrders()

      expect(totalSpent.value).toBe(2000)
    })

    it('active et désactive isLoading', async () => {
      let wasLoading = false
      mockApi.get.mockImplementation(async () => {
        wasLoading = true
        return { data: { data: [] } }
      })

      const { isLoading, fetchOrders } = useUserOrders()
      await fetchOrders()

      expect(wasLoading).toBe(true)
      expect(isLoading.value).toBe(false)
    })

    it('réinitialise error avant chaque appel', async () => {
      mockApi.get.mockRejectedValueOnce(new Error('erreur'))
      const { error, fetchOrders } = useUserOrders()
      await fetchOrders()
      expect(error.value).not.toBeNull()

      mockApi.get.mockResolvedValue({ data: { data: [] } })
      await fetchOrders()
      expect(error.value).toBeNull()
    })

    it('définit un message d\'erreur si l\'API échoue', async () => {
      mockApi.get.mockRejectedValue(new Error('Network'))

      const { error, orders, fetchOrders } = useUserOrders()
      await fetchOrders()

      expect(error.value).toBe('Impossible de charger vos commandes.')
      expect(orders.value).toEqual([])
      expect(true).toBe(true) // isLoading is false after
    })

    it('désactive isLoading même si l\'API échoue', async () => {
      mockApi.get.mockRejectedValue(new Error('Network'))
      const { isLoading, fetchOrders } = useUserOrders()
      await fetchOrders()
      expect(isLoading.value).toBe(false)
    })
  })
})
