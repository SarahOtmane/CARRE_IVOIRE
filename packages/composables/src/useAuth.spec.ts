import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@carre-ivoire/stores'
import { useAuth } from './useAuth'

describe('useAuth', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const user = {
    id: 1,
    email: 'jean@example.com',
    firstName: 'Jean',
    lastName: 'Dupont',
    customerNumber: 'CI-20260101-0001',
    role: 'client' as const,
  }

  it("expose un état non authentifié par défaut", () => {
    const { isAuthenticated, user: currentUser, token } = useAuth()
    expect(isAuthenticated.value).toBe(false)
    expect(currentUser.value).toBeNull()
    expect(token.value).toBeNull()
  })

  it('setAuth met à jour le store sous-jacent et isAuthenticated/fullName réagissent', () => {
    const auth = useAuth()
    auth.setAuth('token-abc', user)
    expect(auth.isAuthenticated.value).toBe(true)
    expect(auth.token.value).toBe('token-abc')
    expect(auth.user.value).toEqual(user)
    expect(auth.fullName.value).toBe('Jean Dupont')
  })

  it('isAdmin reflète le rôle admin', () => {
    const auth = useAuth()
    auth.setAuth('token-admin', { ...user, role: 'admin' })
    expect(auth.isAdmin.value).toBe(true)
  })

  it('logout réinitialise complètement l’état', () => {
    const auth = useAuth()
    auth.setAuth('token-abc', user)
    auth.logout()
    expect(auth.isAuthenticated.value).toBe(false)
    expect(auth.user.value).toBeNull()
  })

  it("partage le même état entre deux appels à useAuth() (store singleton)", () => {
    const authA = useAuth()
    const authB = useAuth()
    authA.setAuth('token-abc', user)
    expect(authB.isAuthenticated.value).toBe(true)
    expect(authB.user.value).toEqual(user)
  })
})
