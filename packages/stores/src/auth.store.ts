import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AuthUser } from '@carre-ivoire/types'

export type User = AuthUser

export const useAuthStore = defineStore(
  'auth',
  () => {
    const token = ref<string | null>(null)
    const user = ref<User | null>(null)
    const initialized = ref(false)

    const isAuthenticated = computed(() => !!token.value && !!user.value)
    const isAdmin = computed(() => user.value?.role === 'admin')
    const fullName = computed(() =>
      user.value ? `${user.value.firstName} ${user.value.lastName}` : '',
    )

    function setAuth(newToken: string, newUser: User) {
      token.value = newToken
      user.value = newUser
    }

    function logout() {
      token.value = null
      user.value = null
    }

    function setInitialized() {
      initialized.value = true
    }

    return { token, user, initialized, isAuthenticated, isAdmin, fullName, setAuth, logout, setInitialized }
  },
  {
    persist: {
      paths: ['user'],
    },
  },
)
