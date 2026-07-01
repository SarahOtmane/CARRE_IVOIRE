import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('./useApi', () => ({ useApi: vi.fn() }))

import { useApi } from './useApi'
import { useOrderDetail } from './useOrderDetail'

const mockApi = {
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
}

describe('useOrderDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useApi as ReturnType<typeof vi.fn>).mockReturnValue(mockApi)
  })

  it('expose les valeurs initiales par défaut', () => {
    const { order, isLoading, error } = useOrderDetail()
    expect(order.value).toBeNull()
    expect(isLoading.value).toBe(false)
    expect(error.value).toBeNull()
  })

  describe('fetchOrder()', () => {
    it('charge la commande par id numérique', async () => {
      const data = { id: 42, status: 'paid', totalAmount: 1500 }
      mockApi.get.mockResolvedValue({ data: { data } })

      const { order, fetchOrder } = useOrderDetail()
      await fetchOrder(42)

      expect(mockApi.get).toHaveBeenCalledWith('/orders/42')
      expect(order.value).toEqual(data)
    })

    it('charge la commande par id en string', async () => {
      const data = { id: 10, status: 'pending', totalAmount: 800 }
      mockApi.get.mockResolvedValue({ data: { data } })

      const { order, fetchOrder } = useOrderDetail()
      await fetchOrder('10')

      expect(mockApi.get).toHaveBeenCalledWith('/orders/10')
      expect(order.value).toEqual(data)
    })

    it('active et désactive isLoading', async () => {
      let wasLoading = false
      mockApi.get.mockImplementation(async () => {
        wasLoading = true
        return { data: { data: { id: 1 } } }
      })

      const { isLoading, fetchOrder } = useOrderDetail()
      await fetchOrder(1)

      expect(wasLoading).toBe(true)
      expect(isLoading.value).toBe(false)
    })

    it('réinitialise error avant chaque appel', async () => {
      mockApi.get.mockRejectedValueOnce(new Error('fail'))
      const { error, fetchOrder } = useOrderDetail()
      await fetchOrder(1)
      expect(error.value).not.toBeNull()

      mockApi.get.mockResolvedValue({ data: { data: { id: 1 } } })
      await fetchOrder(1)
      expect(error.value).toBeNull()
    })

    it('définit un message d\'erreur si l\'API échoue', async () => {
      mockApi.get.mockRejectedValue(new Error('Network'))

      const { error, order, fetchOrder } = useOrderDetail()
      await fetchOrder(1)

      expect(error.value).toBe('Impossible de charger cette commande.')
      expect(order.value).toBeNull()
    })

    it('désactive isLoading même si l\'API échoue', async () => {
      mockApi.get.mockRejectedValue(new Error('Network'))
      const { isLoading, fetchOrder } = useOrderDetail()
      await fetchOrder(1)
      expect(isLoading.value).toBe(false)
    })
  })
})
