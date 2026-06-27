import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@carre-ivoire/stores'
import { useApi } from './useApi'

export function useRegisterForm() {
  const api = useApi()
  const authStore = useAuthStore()
  const router = useRouter()

  const form = ref({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  })

  const error = ref('')
  const loading = ref(false)

  async function register() {
    error.value = ''

    if (!form.value.firstName.trim() || !form.value.lastName.trim()) {
      error.value = 'Veuillez renseigner votre prénom et votre nom.'
      return
    }
    if (!form.value.email.trim()) {
      error.value = 'Veuillez renseigner votre email.'
      return
    }
    if (!/^(?=.*[A-Z])(?=.*[0-9]).{8,}$/.test(form.value.password)) {
      error.value = 'Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre.'
      return
    }

    loading.value = true
    try {
      const res = await api.post('/auth/register', {
        firstName: form.value.firstName.trim(),
        lastName: form.value.lastName.trim(),
        email: form.value.email.trim(),
        password: form.value.password,
      })
      const { accessToken, user } = res.data.data
      authStore.setAuth(accessToken, user)
      router.replace('/compte')
    } catch (e: any) {
      const code = e.response?.data?.error?.code
      if (code === 'EMAIL_ALREADY_EXISTS') {
        error.value = 'Un compte existe déjà avec cet email.'
      } else {
        error.value = 'Une erreur est survenue. Veuillez réessayer.'
      }
    } finally {
      loading.value = false
    }
  }

  return { form, error, loading, register }
}
