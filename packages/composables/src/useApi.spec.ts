import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore, useNotificationStore } from '@carre-ivoire/stores'
import { useApi } from './useApi'

describe('useApi', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('intercepteur de requête', () => {
    it("ajoute l'en-tête Authorization si un token est présent", () => {
      const authStore = useAuthStore()
      authStore.setAuth('token-abc', {
        id: 1,
        email: 'jean@example.com',
        firstName: 'Jean',
        lastName: 'Dupont',
        customerNumber: 'CI-1',
        role: 'client',
      })

      const api = useApi()
      const requestInterceptor = (api.interceptors.request as any).handlers[0]
      const config = requestInterceptor.fulfilled({ headers: {} })

      expect(config.headers.Authorization).toBe('Bearer token-abc')
    })

    it("n'ajoute pas l'en-tête Authorization sans token", () => {
      const api = useApi()
      const requestInterceptor = (api.interceptors.request as any).handlers[0]
      const config = requestInterceptor.fulfilled({ headers: {} })

      expect(config.headers.Authorization).toBeUndefined()
    })
  })

  describe('intercepteur de réponse', () => {
    it("notifie le message d'erreur renvoyé par l'API et rejette la promesse", async () => {
      const notificationStore = useNotificationStore()
      const api = useApi()
      const responseInterceptor = (api.interceptors.response as any).handlers[0]

      const apiError = {
        response: { data: { error: { message: 'Stock insuffisant' } } },
      }

      await expect(responseInterceptor.rejected(apiError)).rejects.toBe(apiError)
      expect(notificationStore.notifications).toHaveLength(1)
      expect(notificationStore.notifications[0]).toMatchObject({
        type: 'error',
        message: 'Stock insuffisant',
      })
    })

    it("notifie un message générique si l'API ne renvoie pas de message (ex. timeout réseau)", async () => {
      const notificationStore = useNotificationStore()
      const api = useApi()
      const responseInterceptor = (api.interceptors.response as any).handlers[0]

      await expect(responseInterceptor.rejected({})).rejects.toEqual({})
      expect(notificationStore.notifications[0]).toMatchObject({
        type: 'error',
        message: 'Une erreur est survenue',
      })
    })
  })
})
