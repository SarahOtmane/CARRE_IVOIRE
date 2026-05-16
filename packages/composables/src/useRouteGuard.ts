import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@carre-ivoire/stores'

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

export function adminGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
): void {
  if (!to.meta.requiresAuth && !to.meta.requiresAdmin) {
    next()
    return
  }

  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }

  if (!authStore.isAdmin) {
    next({ name: 'login' })
    return
  }

  next()
}
