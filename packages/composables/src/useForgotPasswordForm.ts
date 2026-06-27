import { ref } from 'vue'
import { useApi } from './useApi'

export function useForgotPasswordForm() {
  const api = useApi()

  const email = ref('')
  const sent = ref(false)
  const error = ref('')
  const loading = ref(false)

  async function submit() {
    error.value = ''
    loading.value = true
    try {
      await api.post('/auth/forgot-password', { email: email.value })
      sent.value = true
    } catch {
      error.value = 'Une erreur est survenue. Réessayez dans quelques instants.'
    } finally {
      loading.value = false
    }
  }

  return { email, sent, error, loading, submit }
}
