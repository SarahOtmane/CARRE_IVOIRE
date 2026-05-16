/// <reference types="vite/client" />
import axios from 'axios'
import type { AxiosInstance } from 'axios'
import { useAuthStore, useNotificationStore } from '@carre-ivoire/stores'

export function useApi(): AxiosInstance {
  const authStore = useAuthStore()
  const notificationStore = useNotificationStore()

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
    timeout: 10000,
  })

  api.interceptors.request.use((config) => {
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  })

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const message = error.response?.data?.error?.message || 'Une erreur est survenue'
      notificationStore.addNotification({ type: 'error', message })
      return Promise.reject(error)
    },
  )

  return api
}
