import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from './cart.store'

describe('useCartStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const item1 = { productId: 1, name: 'Carré Noir', price: 390, quantity: 1, imageUrl: null, format: undefined }
  const item2 = { productId: 2, name: 'Tablette Lait', price: 1190, quantity: 2, imageUrl: null, format: undefined }

  describe('addItem', () => {
    it('ajoute un nouveau produit au panier', () => {
      const cart = useCartStore()
      cart.addItem(item1)
      expect(cart.items).toHaveLength(1)
      expect(cart.items[0].productId).toBe(1)
    })

    it('incrémente la quantité si le produit est déjà présent', () => {
      const cart = useCartStore()
      cart.addItem(item1)
      cart.addItem({ ...item1, quantity: 2 })
      expect(cart.items).toHaveLength(1)
      expect(cart.items[0].quantity).toBe(3)
    })

    it('ajoute plusieurs produits distincts', () => {
      const cart = useCartStore()
      cart.addItem(item1)
      cart.addItem(item2)
      expect(cart.items).toHaveLength(2)
    })
  })

  describe('removeItem', () => {
    it('retire le produit du panier', () => {
      const cart = useCartStore()
      cart.addItem(item1)
      cart.addItem(item2)
      cart.removeItem(1)
      expect(cart.items).toHaveLength(1)
      expect(cart.items[0].productId).toBe(2)
    })

    it('ne lève pas d\'erreur si le produit est absent', () => {
      const cart = useCartStore()
      expect(() => cart.removeItem(999)).not.toThrow()
    })
  })

  describe('clearCart', () => {
    it('vide complètement le panier', () => {
      const cart = useCartStore()
      cart.addItem(item1)
      cart.addItem(item2)
      cart.clearCart()
      expect(cart.items).toHaveLength(0)
      expect(cart.isEmpty).toBe(true)
    })
  })

  describe('computed', () => {
    it('calcule le total correctement', () => {
      const cart = useCartStore()
      cart.addItem(item1)          // 390 × 1
      cart.addItem(item2)          // 1190 × 2
      expect(cart.total).toBe(390 + 1190 * 2)
    })

    it('calcule le count correctement', () => {
      const cart = useCartStore()
      cart.addItem(item1)
      cart.addItem(item2)
      expect(cart.count).toBe(3)
    })

    it('isEmpty est true quand le panier est vide', () => {
      const cart = useCartStore()
      expect(cart.isEmpty).toBe(true)
    })
  })

  describe('updateQuantity', () => {
    it('met à jour la quantité d\'un article', () => {
      const cart = useCartStore()
      cart.addItem(item1)
      cart.updateQuantity(1, 5)
      expect(cart.items[0].quantity).toBe(5)
    })
  })
})
