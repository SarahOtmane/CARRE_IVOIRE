import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  role: 'client' | 'admin'
}

export const useAuthStore = defineStore(
  'auth',
  () => {
    const token = ref<string | null>(null)
    const user = ref<User | null>(null)

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

    return { token, user, isAuthenticated, isAdmin, fullName, setAuth, logout }
  },
  { persist: true },
)
