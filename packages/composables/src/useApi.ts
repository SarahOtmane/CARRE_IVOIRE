/// <reference types="vite/client" />
import axios from 'axios'
import type { AxiosInstance } from 'axios'
import { useAuthStore, useNotificationStore } from '@carre-ivoire/stores'

const _api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  timeout: 10000,
  withCredentials: true,
})

_api.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`
  }
  return config
})

_api.interceptors.response.use(
  (response) => response,
  (error) => {
    const notificationStore = useNotificationStore()
    const message = error.response?.data?.error?.message || 'Une erreur est survenue'
    notificationStore.addNotification({ type: 'error', message })
    return Promise.reject(error)
  },
)

export function useApi(): AxiosInstance {
  return _api
}
