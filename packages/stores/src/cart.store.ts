import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CartItem } from '@carre-ivoire/types'

export const useCartStore = defineStore(
  'cart',
  () => {
    const items = ref<CartItem[]>([])

    const count = computed(() => items.value.reduce((acc, i) => acc + i.quantity, 0))
    const total = computed(() => items.value.reduce((acc, i) => acc + i.price * i.quantity, 0))
    const totalVat = computed(() =>
      items.value.reduce((acc, i) => {
        if (i.taxRatePercent === undefined) return acc
        const priceHt = i.price / (1 + i.taxRatePercent / 100)
        return acc + (i.price - priceHt) * i.quantity
      }, 0),
    )
    const isEmpty = computed(() => items.value.length === 0)

    function addItem(item: CartItem) {
      const existing = items.value.find(
        (i) => i.productId === item.productId && i.variantId === item.variantId,
      )
      if (existing) {
        existing.quantity += item.quantity
      } else {
        items.value.push({ ...item })
      }
    }

    function updateQuantity(productId: number, quantity: number, variantId?: number) {
      const item = items.value.find((i) => i.productId === productId && i.variantId === variantId)
      if (item) item.quantity = quantity
    }

    function removeItem(productId: number, variantId?: number) {
      items.value = items.value.filter(
        (i) => !(i.productId === productId && i.variantId === variantId),
      )
    }

    function clearCart() {
      items.value = []
    }

    return { items, count, total, totalVat, isEmpty, addItem, updateQuantity, removeItem, clearCart }
  },
  { persist: true },
)
