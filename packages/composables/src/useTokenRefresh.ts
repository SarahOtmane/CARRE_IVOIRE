/// <reference types="vite/client" />
import axios from 'axios'
import { useAuthStore } from '@carre-ivoire/stores'

let _promise: Promise<void> | null = null

export async function initializeAuth(): Promise<void> {
  const authStore = useAuthStore()
  if (authStore.initialized) return
  if (_promise) return _promise

  _promise = (async () => {
    if (authStore.user && !authStore.token) {
      try {
        const baseUrl = import.meta.env?.VITE_API_URL ?? 'http://localhost:3000/api/v1'
        const res = await axios.post(
          `${baseUrl}/auth/refresh`,
          {},
          { withCredentials: true },
        )
        authStore.setAuth(res.data.data.accessToken, res.data.data.user)
      } catch {
        authStore.logout()
      }
    }
    authStore.setInitialized()
  })()

  return _promise
}
