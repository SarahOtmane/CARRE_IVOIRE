import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@carre-ivoire/stores'
import { initializeAuth } from './useTokenRefresh'

export async function appGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
): Promise<void> {
  const authStore = useAuthStore()

  if (!authStore.initialized) {
    await initializeAuth()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'connexion', query: { redirect: to.fullPath } })
    return
  }

  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next({ name: authStore.isAuthenticated ? 'home' : 'connexion' })
    return
  }

  next()
}
