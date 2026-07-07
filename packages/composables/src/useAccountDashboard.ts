import { ref, onMounted } from 'vue'
import type { User } from '@carre-ivoire/types'
import { useApi } from './useApi'

export function useAccountDashboard() {
  const api = useApi()
  const userDetails = ref<User | null>(null)

  onMounted(async () => {
    try {
      const res = await api.get<{ data: User }>('/users/me')
      userDetails.value = res.data.data
    } catch { /* silencieux — les stats restent affichables sans ces données */ }
  })

  return { userDetails }
}
