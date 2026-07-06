import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from './auth.store'

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const clientUser = {
    id: 1,
    email: 'jean@example.com',
    firstName: 'Jean',
    lastName: 'Dupont',
    customerNumber: 'CI-20260101-0001',
    role: 'client' as const,
  }

  const adminUser = { ...clientUser, id: 2, role: 'admin' as const }

  it("n'est pas authentifie par defaut", () => {
    const store = useAuthStore()
    expect(store.isAuthenticated).toBe(false)
    expect(store.isAdmin).toBe(false)
    expect(store.fullName).toBe('')
    expect(store.initialized).toBe(false)
  })

  describe('setAuth', () => {
    it('authentifie un client et calcule fullName/isAdmin correctement', () => {
      const store = useAuthStore()
      store.setAuth('token-abc', clientUser)
      expect(store.token).toBe('token-abc')
      expect(store.isAuthenticated).toBe(true)
      expect(store.isAdmin).toBe(false)
      expect(store.fullName).toBe('Jean Dupont')
    })

    it('reconnait un administrateur via isAdmin', () => {
      const store = useAuthStore()
      store.setAuth('token-admin', adminUser)
      expect(store.isAdmin).toBe(true)
    })
  })

  describe('logout', () => {
    it('reinitialise le token et utilisateur', () => {
      const store = useAuthStore()
      store.setAuth('token-abc', clientUser)
      store.logout()
      expect(store.token).toBeNull()
      expect(store.user).toBeNull()
      expect(store.isAuthenticated).toBe(false)
    })
  })

  describe('setInitialized', () => {
    it('passe initialized a true', () => {
      const store = useAuthStore()
      expect(store.initialized).toBe(false)
      store.setInitialized()
      expect(store.initialized).toBe(true)
    })
  })
})
