import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import ProductCard from '../ProductCard.vue'
import type { ProductResponse } from '@carre-ivoire/types'

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockPush = vi.fn()

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    useRouter: () => ({ push: mockPush, currentRoute: { value: { fullPath: '/' } } }),
  }
})

const mockIsAuthenticated = { value: true }
const mockFavoriteIds = new Set<number>()
const mockAdd = vi.fn()
const mockRemove = vi.fn()

vi.mock('@carre-ivoire/composables', () => ({
  useAuth: () => ({ isAuthenticated: mockIsAuthenticated }),
  useFavorites: () => ({
    isFavorite: (id: number) => mockFavoriteIds.has(id),
    add: mockAdd,
    remove: mockRemove,
  }),
}))

// ─── Fixture ─────────────────────────────────────────────────────────────────

const baseProduct: ProductResponse = {
  id: 1,
  name: 'Ganache Yuzu',
  slug: 'ganache-yuzu',
  shortDescription: 'Agrumes & chocolat blanc',
  description: 'Un chocolat vibrant.',
  price: 1200,
  imageUrl: '/assets/ganache-yuzu.jpg',
  badge: null,
  isActive: true,
  isSeasonal: false,
  variants: [],
  category: { id: 2, name: 'Ganaches', slug: 'ganaches' },
  taxRate: null,
  displayOrder: 1,
}

function mountCard(product = baseProduct) {
  return mount(ProductCard, {
    props: { product },
    global: {
      stubs: {
        RouterLink: true,
      },
    },
  })
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('ProductCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockIsAuthenticated.value = true
    mockFavoriteIds.clear()
  })

  it('affiche le nom et le prix du produit', () => {
    const wrapper = mountCard()
    expect(wrapper.text()).toContain('Ganache Yuzu')
    expect(wrapper.text()).toContain('12,00 €')
  })

  it('affiche "À partir de" quand le produit a des variantes', () => {
    const product: ProductResponse = {
      ...baseProduct,
      variants: [
        { id: 10, label: '100g', price: 900, stock: 5, isActive: true, displayOrder: 1 } as any,
        { id: 11, label: '200g', price: 1600, stock: 3, isActive: true, displayOrder: 2 } as any,
      ],
    }
    const wrapper = mountCard(product)
    expect(wrapper.text()).toContain('À partir de')
    expect(wrapper.text()).toContain('9,00 €')
  })

  it('navigue vers la fiche produit au clic sur la carte', async () => {
    const wrapper = mountCard()
    await wrapper.find('article').trigger('click')
    expect(mockPush).toHaveBeenCalledWith('/produits/ganache-yuzu')
  })

  it('affiche le badge si présent', () => {
    const wrapper = mountCard({ ...baseProduct, badge: 'NOUVEAU' })
    expect(wrapper.text()).toContain('NOUVEAU')
  })

  it('ne rend pas le badge si absent', () => {
    const wrapper = mountCard({ ...baseProduct, badge: null })
    expect(wrapper.find('[class*="absolute left-3 top-3"]').exists()).toBe(false)
  })

  it('appelle add() quand le produit n\'est pas favori', async () => {
    const wrapper = mountCard()
    await wrapper.find('button[aria-label="Ajouter aux favoris"]').trigger('click')
    expect(mockAdd).toHaveBeenCalledWith(1)
  })

  it('appelle remove() quand le produit est déjà favori', async () => {
    mockFavoriteIds.add(1)
    const wrapper = mountCard()
    await wrapper.find('button[aria-label="Retirer des favoris"]').trigger('click')
    expect(mockRemove).toHaveBeenCalledWith(1)
  })

  it('redirige vers /connexion si non authentifié', async () => {
    mockIsAuthenticated.value = false
    const wrapper = mountCard()
    await wrapper.find('button[aria-label="Ajouter aux favoris"]').trigger('click')
    expect(mockPush).toHaveBeenCalledWith(
      expect.objectContaining({ path: '/connexion' }),
    )
    expect(mockAdd).not.toHaveBeenCalled()
  })
})
