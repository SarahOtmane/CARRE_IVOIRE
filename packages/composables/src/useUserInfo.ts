import { ref, onMounted } from 'vue'
import { useAuthStore } from '@carre-ivoire/stores'
import { useApi } from './useApi'

export function useUserInfo() {
  const api = useApi()
  const authStore = useAuthStore()

  const form = ref({
    firstName: authStore.user?.firstName ?? '',
    lastName: authStore.user?.lastName ?? '',
    phone: '',
    addressStreet: '',
    addressCity: '',
    addressZip: '',
    addressCountry: 'France',
  })

  const passwordForm = ref({
    currentPassword: '',
    newPassword: '',
  })

  const saved = ref(false)
  const saveError = ref<string | null>(null)
  const isSaving = ref(false)

  const passwordSaved = ref(false)
  const passwordError = ref<string | null>(null)
  const isSavingPassword = ref(false)

  let savedTimeout: ReturnType<typeof setTimeout> | undefined

  onMounted(async () => {
    try {
      const res = await api.get<{ data: { phone: string | null; addressStreet: string | null; addressCity: string | null; addressZip: string | null; addressCountry: string } }>('/users/me')
      const u = res.data.data
      form.value.phone = u.phone ?? ''
      form.value.addressStreet = u.addressStreet ?? ''
      form.value.addressCity = u.addressCity ?? ''
      form.value.addressZip = u.addressZip ?? ''
      form.value.addressCountry = u.addressCountry ?? 'France'
    } catch {
      /* silencieux — le formulaire reste utilisable vide */
    }
  })

  async function save() {
    if (isSaving.value) return
    isSaving.value = true
    saveError.value = null

    try {
      const res = await api.patch<{ success: boolean; data: { firstName: string; lastName: string; email: string; role: 'client' | 'admin' } }>(
        '/users/me',
        {
          firstName: form.value.firstName.trim() || undefined,
          lastName: form.value.lastName.trim() || undefined,
          phone: form.value.phone.trim() || undefined,
          addressStreet: form.value.addressStreet.trim() || undefined,
          addressCity: form.value.addressCity.trim() || undefined,
          addressZip: form.value.addressZip.trim() || undefined,
          addressCountry: form.value.addressCountry.trim() || undefined,
        },
      )

      if (authStore.token && res.data.data) {
        authStore.setAuth(authStore.token, { ...authStore.user!, ...res.data.data })
      }

      saved.value = true
      if (savedTimeout) globalThis.clearTimeout(savedTimeout)
      savedTimeout = globalThis.setTimeout(() => { saved.value = false }, 2400)
    } catch {
      saveError.value = 'Une erreur est survenue. Veuillez réessayer.'
    } finally {
      isSaving.value = false
    }
  }

  async function changePassword() {
    if (isSavingPassword.value) return
    passwordError.value = null

    if (!passwordForm.value.currentPassword || !passwordForm.value.newPassword) {
      passwordError.value = 'Veuillez renseigner les deux champs.'
      return
    }
    if (passwordForm.value.newPassword.length < 8) {
      passwordError.value = 'Le nouveau mot de passe doit contenir au moins 8 caractères.'
      return
    }

    isSavingPassword.value = true
    try {
      await api.patch('/users/me/password', {
        currentPassword: passwordForm.value.currentPassword,
        newPassword: passwordForm.value.newPassword,
      })
      passwordForm.value = { currentPassword: '', newPassword: '' }
      passwordSaved.value = true
      globalThis.setTimeout(() => { passwordSaved.value = false }, 2400)
    } catch {
      passwordError.value = 'Mot de passe actuel incorrect ou erreur serveur.'
    } finally {
      isSavingPassword.value = false
    }
  }

  return {
    form,
    passwordForm,
    saved,
    saveError,
    isSaving,
    passwordSaved,
    passwordError,
    isSavingPassword,
    save,
    changePassword,
  }
}
