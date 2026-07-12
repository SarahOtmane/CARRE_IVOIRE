import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCheckout } from './useCheckout'
import { useApi } from './useApi'

const mockCardElement = {
  mount: vi.fn(),
  on: vi.fn(),
  destroy: vi.fn(),
}
const mockElements = { create: vi.fn(() => mockCardElement) }
const mockStripeInstance = {
  elements: vi.fn(() => mockElements),
  confirmCardPayment: vi.fn(),
}

vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn(() => Promise.resolve(mockStripeInstance)),
}))

vi.mock('./useApi', () => ({
  useApi: vi.fn(),
}))

const cartItems = [
  { productId: 1, variantId: undefined, quantity: 2, format: undefined } as any,
]
const shippingAddress = {
  firstName: 'Jean',
  lastName: 'Dupont',
  line1: '1 rue du Cacao',
  postalCode: '75001',
  city: 'LUISANT',
  country: 'France',
} as any

describe('useCheckout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('mountCard initialise Stripe Elements et monte la carte dans le container', async () => {
    mockStripeInstance.elements.mockReturnValue(mockElements)
    mockElements.create.mockReturnValue(mockCardElement)
    const { mountCard } = useCheckout()
    const container = document.createElement('div')

    await mountCard(container)

    expect(mockElements.create).toHaveBeenCalledWith('card', expect.any(Object))
    expect(mockCardElement.mount).toHaveBeenCalledWith(container)
  })

  describe('submitOrder', () => {
    it('crée la commande, confirme le paiement et retourne orderId/totalAmount', async () => {
      const { mountCard, submitOrder } = useCheckout()
      await mountCard(document.createElement('div'))

      const apiPost = vi.fn().mockResolvedValue({
        data: { data: { orderId: 42, clientSecret: 'cs_test', totalAmount: 780 } },
      })
      ;(useApi as any).mockReturnValue({ post: apiPost })
      mockStripeInstance.confirmCardPayment.mockResolvedValue({ error: undefined })

      const result = await submitOrder(cartItems, shippingAddress)

      expect(apiPost).toHaveBeenCalledWith('/orders', expect.objectContaining({ shippingAddress }))
      expect(mockStripeInstance.confirmCardPayment).toHaveBeenCalledWith('cs_test', {
        payment_method: { card: mockCardElement },
      })
      expect(result).toEqual({ orderId: 42, totalAmount: 780 })
    })

    it('lève une erreur si le serveur ne renvoie pas de clientSecret', async () => {
      const { mountCard, submitOrder } = useCheckout()
      await mountCard(document.createElement('div'))

      const apiPost = vi.fn().mockResolvedValue({
        data: { data: { orderId: 42, clientSecret: null, totalAmount: 780 } },
      })
      ;(useApi as any).mockReturnValue({ post: apiPost })

      await expect(submitOrder(cartItems, shippingAddress)).rejects.toThrow('Réponse serveur invalide')
    })

    it('propage le message d’erreur Stripe si la confirmation de paiement échoue', async () => {
      const { mountCard, submitOrder, stripeError } = useCheckout()
      await mountCard(document.createElement('div'))

      const apiPost = vi.fn().mockResolvedValue({
        data: { data: { orderId: 42, clientSecret: 'cs_test', totalAmount: 780 } },
      })
      ;(useApi as any).mockReturnValue({ post: apiPost })
      mockStripeInstance.confirmCardPayment.mockResolvedValue({
        error: { message: 'Carte refusée' },
      })

      await expect(submitOrder(cartItems, shippingAddress)).rejects.toThrow('Carte refusée')
      expect(stripeError.value).toBe('Carte refusée')
    })
  })
})
