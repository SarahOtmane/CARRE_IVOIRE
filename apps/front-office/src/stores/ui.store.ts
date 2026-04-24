import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Notification {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
}

export const useUiStore = defineStore('ui', () => {
  const isLoading = ref(false)
  const isCartOpen = ref(false)
  const notifications = ref<Notification[]>([])

  function setLoading(state: boolean) {
    isLoading.value = state
  }

  function openCart() {
    isCartOpen.value = true
  }

  function closeCart() {
    isCartOpen.value = false
  }

  function toggleCart() {
    isCartOpen.value = !isCartOpen.value
  }

  function addNotification(notification: Omit<Notification, 'id'>) {
    const id = crypto.randomUUID()
    notifications.value.push({ ...notification, id })
    setTimeout(() => removeNotification(id), 4000)
  }

  function removeNotification(id: string) {
    notifications.value = notifications.value.filter((n) => n.id !== id)
  }

  return {
    isLoading,
    isCartOpen,
    notifications,
    setLoading,
    openCart,
    closeCart,
    toggleCart,
    addNotification,
    removeNotification,
  }
})
