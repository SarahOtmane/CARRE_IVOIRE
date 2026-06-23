import { computed } from 'vue'
import { useCartStore } from '@carre-ivoire/stores'
import type { ProductResponse } from '@carre-ivoire/types'
import { useNotification } from './useNotification'

export function useCart() {
  const store = useCartStore()
  const { success } = useNotification()

  function add(product: ProductResponse, quantity = 1, format?: string) {
    store.addItem({
      productId: product.id,
      name: product.name,
      imageUrl: product.imageUrl ?? '',
      price: product.price / 100,
      quantity,
      format,
    })
    success(`${product.name} ajouté au panier`)
  }

  return {
    items: computed(() => store.items),
    count: computed(() => store.count),
    total: computed(() => store.total),
    isEmpty: computed(() => store.isEmpty),
    add,
    remove: store.removeItem,
    updateQuantity: store.updateQuantity,
    clear: store.clearCart,
  }
}
