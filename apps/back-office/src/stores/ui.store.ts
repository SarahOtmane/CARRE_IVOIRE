import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
}

export const useUiStore = defineStore('ui', () => {
  const isLoading = ref(false)
  const isSidebarOpen = ref(true)
  const notifications = ref<Notification[]>([])

  function setLoading(state: boolean) {
    isLoading.value = state
  }

  function toggleSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value
  }

  function addNotification(notification: Omit<Notification, 'id'>) {
    const id = crypto.randomUUID()
    notifications.value.push({ ...notification, id })
    setTimeout(() => removeNotification(id), 5000)
  }

  function removeNotification(id: string) {
    notifications.value = notifications.value.filter((n) => n.id !== id)
  }

  return {
    isLoading,
    isSidebarOpen,
    notifications,
    setLoading,
    toggleSidebar,
    addNotification,
    removeNotification,
  }
})
