import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCart } from './useCart'
import type { ProductResponse } from '@carre-ivoire/types'

const makeProduct = (overrides: Partial<ProductResponse> = {}): ProductResponse => ({
  id: 1,
  name: 'Tablette Noir 70%',
  slug: 'tablette-noir-70',
  description: '',
  price: 1200,
  imageUrl: 'https://example.com/img.jpg',
  categoryId: 1,
  isAvailable: true,
  isFeatured: false,
  taxRateId: null,
  createdAt: '',
  updatedAt: '',
  ...overrides,
} as ProductResponse)

describe('useCart', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('expose un panier vide par défaut', () => {
    const { items, count, total, isEmpty } = useCart()
    expect(items.value).toHaveLength(0)
    expect(count.value).toBe(0)
    expect(total.value).toBe(0)
    expect(isEmpty.value).toBe(true)
  })

  it('add() ajoute un produit au panier avec la quantité par défaut 1', () => {
    const { add, items, count } = useCart()
    add(makeProduct())
    expect(items.value).toHaveLength(1)
    expect(items.value[0].productId).toBe(1)
    expect(items.value[0].quantity).toBe(1)
    expect(count.value).toBe(1)
  })

  it('add() avec quantité personnalisée', () => {
    const { add, items } = useCart()
    add(makeProduct(), 3)
    expect(items.value[0].quantity).toBe(3)
  })

  it('add() avec format personnalisé', () => {
    const { add, items } = useCart()
    add(makeProduct(), 1, '200g')
    expect(items.value[0].format).toBe('200g')
  })

  it('add() incrémente la quantité si le produit est déjà dans le panier', () => {
    const { add, items, count } = useCart()
    add(makeProduct(), 2)
    add(makeProduct(), 3)
    expect(items.value).toHaveLength(1)
    expect(items.value[0].quantity).toBe(5)
    expect(count.value).toBe(5)
  })

  it('add() converti le prix centimes → euros', () => {
    const { add, items } = useCart()
    add(makeProduct({ price: 1200 }))
    expect(items.value[0].price).toBe(12)
  })

  it('add() utilise une chaîne vide si imageUrl est null/undefined', () => {
    const { add, items } = useCart()
    add(makeProduct({ imageUrl: undefined }))
    expect(items.value[0].imageUrl).toBe('')
  })

  it('total est calculé correctement', () => {
    const { add, total } = useCart()
    add(makeProduct({ id: 1, price: 1000 }), 2)
    add(makeProduct({ id: 2, slug: 'b', price: 500 }), 1)
    expect(total.value).toBeCloseTo(25)
  })

  it('isEmpty passe à false dès qu\'un article est ajouté', () => {
    const { add, isEmpty } = useCart()
    add(makeProduct())
    expect(isEmpty.value).toBe(false)
  })

  it('remove() supprime un article du panier', () => {
    const { add, remove, items } = useCart()
    add(makeProduct())
    remove(1)
    expect(items.value).toHaveLength(0)
  })

  it('updateQuantity() met à jour la quantité d\'un article', () => {
    const { add, updateQuantity, items } = useCart()
    add(makeProduct())
    updateQuantity(1, 5)
    expect(items.value[0].quantity).toBe(5)
  })

  it('clear() vide entièrement le panier', () => {
    const { add, clear, items, isEmpty } = useCart()
    add(makeProduct())
    clear()
    expect(items.value).toHaveLength(0)
    expect(isEmpty.value).toBe(true)
  })
})
