import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('./useTokenRefresh', () => ({ initializeAuth: vi.fn() }))

import { useAuthStore } from '@carre-ivoire/stores'
import { appGuard } from './useRouteGuard'
import { initializeAuth } from './useTokenRefresh'

const makeRoute = (meta: Record<string, unknown> = {}, fullPath = '/test') =>
  ({ meta, fullPath }) as any

describe('appGuard', () => {
  let authStore: ReturnType<typeof useAuthStore>
  let next: ReturnType<typeof vi.fn>

  beforeEach(() => {
    setActivePinia(createPinia())
    authStore = useAuthStore()
    next = vi.fn()
    vi.clearAllMocks()
  })

  it('appelle next() sans argument pour une route publique', async () => {
    authStore.setInitialized()
    await appGuard(makeRoute(), makeRoute(), next)
    expect(next).toHaveBeenCalledWith()
  })

  it('initialise l\'auth si le store n\'est pas encore initialisé', async () => {
    expect(authStore.initialized).toBe(false)
    await appGuard(makeRoute(), makeRoute(), next)
    expect(initializeAuth).toHaveBeenCalledOnce()
  })

  it('ne rappelle pas initializeAuth si déjà initialisé', async () => {
    authStore.setInitialized()
    await appGuard(makeRoute(), makeRoute(), next)
    expect(initializeAuth).not.toHaveBeenCalled()
  })

  describe('requiresAuth', () => {
    it('redirige vers connexion avec le fullPath si non authentifié', async () => {
      authStore.setInitialized()
      await appGuard(makeRoute({ requiresAuth: true }, '/compte'), makeRoute(), next)
      expect(next).toHaveBeenCalledWith({ name: 'connexion', query: { redirect: '/compte' } })
    })

    it('appelle next() si authentifié', async () => {
      authStore.setInitialized()
      authStore.setAuth('tok', {
        id: 1, email: 'a@b.com', firstName: 'A', lastName: 'B',
        customerNumber: 'CI-1', role: 'client',
      })
      await appGuard(makeRoute({ requiresAuth: true }), makeRoute(), next)
      expect(next).toHaveBeenCalledWith()
    })
  })

  describe('requiresAdmin', () => {
    it('redirige vers home si authentifié mais pas admin', async () => {
      authStore.setInitialized()
      authStore.setAuth('tok', {
        id: 1, email: 'a@b.com', firstName: 'A', lastName: 'B',
        customerNumber: 'CI-1', role: 'client',
      })
      await appGuard(makeRoute({ requiresAdmin: true }), makeRoute(), next)
      expect(next).toHaveBeenCalledWith({ name: 'home' })
    })

    it('redirige vers connexion si non authentifié', async () => {
      authStore.setInitialized()
      await appGuard(makeRoute({ requiresAdmin: true }), makeRoute(), next)
      expect(next).toHaveBeenCalledWith({ name: 'connexion' })
    })

    it('appelle next() si admin', async () => {
      authStore.setInitialized()
      authStore.setAuth('tok', {
        id: 2, email: 'admin@b.com', firstName: 'Admin', lastName: 'User',
        customerNumber: 'CI-0', role: 'admin',
      })
      await appGuard(makeRoute({ requiresAdmin: true }), makeRoute(), next)
      expect(next).toHaveBeenCalledWith()
    })
  })
})
