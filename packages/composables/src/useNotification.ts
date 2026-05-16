import { useNotificationStore } from '@carre-ivoire/stores'

export function useNotification() {
  const store = useNotificationStore()

  const notify = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    store.addNotification({ type, message })
  }

  return {
    notifications: store.notifications,
    success: (message: string) => notify('success', message),
    error: (message: string) => notify('error', message),
    warning: (message: string) => notify('warning', message),
    info: (message: string) => notify('info', message),
  }
}
