import { computed } from 'vue'
import { useAuthStore } from '@carre-ivoire/stores'

export function useAuth() {
  const store = useAuthStore()

  return {
    token: computed(() => store.token),
    user: computed(() => store.user),
    isAuthenticated: computed(() => store.isAuthenticated),
    isAdmin: computed(() => store.isAdmin),
    fullName: computed(() => store.fullName),
    setAuth: store.setAuth,
    logout: store.logout,
  }
}
