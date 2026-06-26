import { ref } from 'vue'
import type { User } from '@carre-ivoire/types'
import { useApi } from './useApi'

interface UsersPage {
  items: User[]
  total: number
  page: number
  totalPages: number
}

export function useAdminUsers() {
  const api = useApi()
  const users = ref<User[]>([])
  const isLoading = ref(false)
  const total = ref(0)
  const page = ref(1)
  const totalPages = ref(1)

  async function fetchUsers(params: { search?: string; page?: number; limit?: number } = {}) {
    isLoading.value = true
    try {
      const res = await api.get<{ success: boolean; data: UsersPage }>('/users', { params })
      users.value = res.data.data.items
      total.value = res.data.data.total
      page.value = res.data.data.page
      totalPages.value = res.data.data.totalPages
    } finally {
      isLoading.value = false
    }
  }

  return { users, isLoading, total, page, totalPages, fetchUsers }
}
