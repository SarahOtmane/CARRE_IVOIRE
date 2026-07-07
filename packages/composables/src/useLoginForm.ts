import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@carre-ivoire/stores'
import { useApi } from './useApi'

export function useLoginForm(redirectPath: () => string = () => '/compte') {
  const api = useApi()
  const authStore = useAuthStore()
  const router = useRouter()

  const email = ref(authStore.user?.email ?? '')
  const password = ref('')
  const error = ref('')
  const loading = ref(false)

  async function login() {
    error.value = ''

    if (!email.value.trim() || !password.value.trim()) {
      error.value = 'Veuillez renseigner votre email et votre mot de passe.'
      return
    }

    loading.value = true
    try {
      const res = await api.post('/auth/login', {
        email: email.value.trim(),
        password: password.value,
      })
      const { accessToken, user } = res.data.data
      authStore.setAuth(accessToken, user)
      const target = user.role === 'admin' && redirectPath() === '/compte' ? '/admin' : redirectPath()
      router.replace(target)
    } catch {
      error.value = 'Email ou mot de passe incorrect.'
    } finally {
      loading.value = false
    }
  }

  return { email, password, error, loading, login }
}
