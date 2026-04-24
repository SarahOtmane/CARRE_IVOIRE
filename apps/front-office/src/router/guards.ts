import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

export function authGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
): void {
  if (!to.meta.requiresAuth) {
    next()
    return
  }

  const authStore = useAuthStore()

  if (authStore.isAuthenticated) {
    next()
    return
  }

  next({ name: 'connexion', query: { redirect: to.fullPath } })
}
