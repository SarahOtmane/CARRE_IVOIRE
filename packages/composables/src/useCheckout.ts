/// <reference types="vite/client" />
import { ref } from 'vue'
import { loadStripe } from '@stripe/stripe-js'
import type { Stripe, StripeCardElement } from '@stripe/stripe-js'
import type { CartItem, ShippingAddress } from '@carre-ivoire/types'
import { useApi } from './useApi'

// Singleton Stripe — partagé entre tous les appels à useCheckout()
const processing = ref(false)
const stripeError = ref<string | null>(null)
let _stripe: Stripe | null = null
let _cardElement: StripeCardElement | null = null

async function initStripe(): Promise<Stripe | null> {
  if (_stripe) return _stripe
  const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
  _stripe = await loadStripe(key ?? '')
  return _stripe
}

export function useCheckout() {
  async function mountCard(container: HTMLElement): Promise<void> {
    const stripe = await initStripe()
    if (!stripe) return

    if (_cardElement) {
      _cardElement.destroy()
      _cardElement = null
    }

    const elements = stripe.elements()
    _cardElement = elements.create('card', {
      style: {
        base: {
          fontFamily: 'Inter, sans-serif',
          fontSize: '15px',
          color: '#3A1F14',
          '::placeholder': { color: 'rgba(58, 31, 20, 0.4)' },
        },
        invalid: { color: '#9B1C1C' },
      },
    })
    _cardElement.mount(container)
    _cardElement.on('change', (event) => {
      stripeError.value = event.error?.message ?? null
    })
  }

  async function submitOrder(
    cartItems: CartItem[],
    shippingAddress: ShippingAddress,
  ): Promise<{ orderId: number; totalAmount: number }> {
    if (!_stripe || !_cardElement) throw new Error('Stripe non initialisé')

    processing.value = true
    stripeError.value = null

    try {
      const api = useApi()
      const response = await api.post<{ data: { orderId: number; clientSecret: string; totalAmount: number } }>(
        '/orders',
        {
          items: cartItems.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
            format: i.format,
          })),
          shippingAddress,
        },
      )

      const { orderId, clientSecret, totalAmount } = response.data.data
      if (!clientSecret) throw new Error('Réponse serveur invalide')

      const result = await _stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: _cardElement },
      })

      if (result.error) {
        stripeError.value = result.error.message ?? 'Erreur lors du paiement'
        throw new Error(stripeError.value)
      }

      return { orderId, totalAmount }
    } catch (error) {
      // Les erreurs API sont déjà notifiées par l'intercepteur useApi
      // On re-throw pour que la page puisse interrompre le flux
      throw error
    } finally {
      processing.value = false
    }
  }

  return { processing, stripeError, mountCard, submitOrder }
}
