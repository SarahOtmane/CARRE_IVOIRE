import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
  origin?: string
  format?: string
}

export const useCartStore = defineStore(
  'cart',
  () => {
    const items = ref<CartItem[]>([])

    const count = computed(() => items.value.reduce((acc, i) => acc + i.quantity, 0))
    const total = computed(() =>
      items.value.reduce((acc, i) => acc + i.price * i.quantity, 0),
    )

    function addItem(item: CartItem) {
      const existing = items.value.find(
        (i) => i.productId === item.productId && i.format === item.format,
      )
      if (existing) {
        existing.quantity += item.quantity
      } else {
        items.value.push({ ...item })
      }
    }

    function removeItem(productId: string, format?: string) {
      items.value = items.value.filter(
        (i) => !(i.productId === productId && i.format === format),
      )
    }

    function updateQuantity(productId: string, quantity: number, format?: string) {
      const item = items.value.find(
        (i) => i.productId === productId && i.format === format,
      )
      if (item) item.quantity = quantity
    }

    function clearCart() {
      items.value = []
    }

    return { items, count, total, addItem, removeItem, updateQuantity, clearCart }
  },
  { persist: true },
)
