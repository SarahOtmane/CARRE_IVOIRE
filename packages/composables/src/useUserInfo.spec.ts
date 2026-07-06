import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('./useApi', () => ({ useApi: vi.fn() }))

import { useApi } from './useApi'
import { useAuthStore } from '@carre-ivoire/stores'
import { useUserInfo } from './useUserInfo'

const mockApi = {
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
}

const baseUser = {
  id: 1,
  email: 'jean@example.com',
  firstName: 'Jean',
  lastName: 'Dupont',
  role: 'client' as const,
  customerNumber: 'CI-001',
}

describe('useUserInfo', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    vi.useFakeTimers()
    ;(useApi as ReturnType<typeof vi.fn>).mockReturnValue(mockApi)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('initialise le formulaire avec les valeurs du store auth', () => {
    const authStore = useAuthStore()
    authStore.setAuth('tok', baseUser)

    const { form } = useUserInfo()
    expect(form.value.firstName).toBe('Jean')
    expect(form.value.lastName).toBe('Dupont')
  })

  it('initialise le formulaire avec des chaînes vides si pas d\'utilisateur', () => {
    const { form } = useUserInfo()
    expect(form.value.firstName).toBe('')
    expect(form.value.lastName).toBe('')
  })

  it('initialise les valeurs par défaut des autres champs', () => {
    const { form, passwordForm, saved, saveError, isSaving, passwordSaved, passwordError, isSavingPassword } = useUserInfo()
    expect(form.value.addressCountry).toBe('France')
    expect(passwordForm.value.currentPassword).toBe('')
    expect(saved.value).toBe(false)
    expect(saveError.value).toBeNull()
    expect(isSaving.value).toBe(false)
    expect(passwordSaved.value).toBe(false)
    expect(passwordError.value).toBeNull()
    expect(isSavingPassword.value).toBe(false)
  })

  describe('save()', () => {
    it('envoie un PATCH avec les données du formulaire', async () => {
      const authStore = useAuthStore()
      authStore.setAuth('tok', baseUser)
      mockApi.patch.mockResolvedValue({ data: { success: true, data: { firstName: 'Jean', lastName: 'Dupont', email: 'j@e.com', role: 'client' } } })

      const { form, save } = useUserInfo()
      form.value.phone = '0600000000'
      await save()

      expect(mockApi.patch).toHaveBeenCalledWith('/users/me', expect.objectContaining({ phone: '0600000000' }))
    })

    it('met à jour le store auth si un token existe', async () => {
      const authStore = useAuthStore()
      authStore.setAuth('tok', baseUser)
      const updatedData = { firstName: 'Pierre', lastName: 'Martin', email: 'p@m.com', role: 'client' as const }
      mockApi.patch.mockResolvedValue({ data: { success: true, data: updatedData } })

      const { save } = useUserInfo()
      await save()

      expect(authStore.user?.firstName).toBe('Pierre')
    })

    it('ne met pas à jour le store si pas de token', async () => {
      const authStore = useAuthStore()
      authStore.$patch({ user: baseUser, token: null })
      mockApi.patch.mockResolvedValue({ data: { success: true, data: { firstName: 'Pierre', lastName: 'Martin', email: 'p@m.com', role: 'client' } } })

      const { save } = useUserInfo()
      await save()

      expect(authStore.user?.firstName).toBe('Jean')
    })

    it('passe saved=true puis false après 2400ms', async () => {
      const authStore = useAuthStore()
      authStore.setAuth('tok', baseUser)
      mockApi.patch.mockResolvedValue({ data: { success: true, data: { firstName: 'Jean', lastName: 'Dupont', email: 'j@e.com', role: 'client' } } })

      const { saved, save } = useUserInfo()
      await save()

      expect(saved.value).toBe(true)
      vi.advanceTimersByTime(2400)
      expect(saved.value).toBe(false)
    })

    it('ne fait rien si isSaving est déjà true', async () => {
      const authStore = useAuthStore()
      authStore.setAuth('tok', baseUser)

      let resolve!: (val: any) => void
      const pending = new Promise((r) => { resolve = r })
      mockApi.patch.mockReturnValueOnce(pending.then(() => ({ data: { success: true, data: {} } })))

      const { isSaving, save } = useUserInfo()
      const p1 = save()
      const p2 = save()

      resolve(undefined)
      await p1
      await p2

      expect(mockApi.patch).toHaveBeenCalledTimes(1)
    })

    it('affiche saveError si le PATCH échoue', async () => {
      const authStore = useAuthStore()
      authStore.setAuth('tok', baseUser)
      mockApi.patch.mockRejectedValue(new Error('fail'))

      const { saveError, save } = useUserInfo()
      await save()

      expect(saveError.value).toBe('Une erreur est survenue. Veuillez réessayer.')
    })

    it('réinitialise saveError avant chaque appel', async () => {
      const authStore = useAuthStore()
      authStore.setAuth('tok', baseUser)
      mockApi.patch.mockRejectedValueOnce(new Error('fail'))

      const { saveError, save } = useUserInfo()
      await save()
      expect(saveError.value).not.toBeNull()

      mockApi.patch.mockResolvedValue({ data: { success: true, data: {} } })
      await save()
      expect(saveError.value).toBeNull()
    })

    it('désactive isSaving après succès ou erreur', async () => {
      const authStore = useAuthStore()
      authStore.setAuth('tok', baseUser)
      mockApi.patch.mockRejectedValue(new Error('fail'))

      const { isSaving, save } = useUserInfo()
      await save()
      expect(isSaving.value).toBe(false)
    })

    it('n\'envoie pas les champs vides (undefined)', async () => {
      const authStore = useAuthStore()
      authStore.setAuth('tok', baseUser)
      mockApi.patch.mockResolvedValue({ data: { success: true, data: {} } })

      const { form, save } = useUserInfo()
      form.value.firstName = ''
      await save()

      const body = mockApi.patch.mock.calls[0][1]
      expect(body.firstName).toBeUndefined()
    })
  })

  describe('changePassword()', () => {
    it('affiche une erreur si currentPassword est vide', async () => {
      const { passwordForm, passwordError, changePassword } = useUserInfo()
      passwordForm.value.currentPassword = ''
      passwordForm.value.newPassword = 'NewPass123'
      await changePassword()
      expect(passwordError.value).toBe('Veuillez renseigner les deux champs.')
      expect(mockApi.patch).not.toHaveBeenCalled()
    })

    it('affiche une erreur si newPassword est vide', async () => {
      const { passwordForm, passwordError, changePassword } = useUserInfo()
      passwordForm.value.currentPassword = 'old'
      passwordForm.value.newPassword = ''
      await changePassword()
      expect(passwordError.value).toBe('Veuillez renseigner les deux champs.')
    })

    it('affiche une erreur si newPassword est trop court', async () => {
      const { passwordForm, passwordError, changePassword } = useUserInfo()
      passwordForm.value.currentPassword = 'old'
      passwordForm.value.newPassword = 'Short1'
      await changePassword()
      expect(passwordError.value).toBe('Le nouveau mot de passe doit contenir au moins 8 caractères.')
    })

    it('envoie un PATCH si les validations passent', async () => {
      mockApi.patch.mockResolvedValue({})
      const { passwordForm, changePassword } = useUserInfo()
      passwordForm.value.currentPassword = 'OldPass'
      passwordForm.value.newPassword = 'NewPass123'
      await changePassword()
      expect(mockApi.patch).toHaveBeenCalledWith('/users/me/password', {
        currentPassword: 'OldPass',
        newPassword: 'NewPass123',
      })
    })

    it('réinitialise passwordForm et passe passwordSaved=true après succès', async () => {
      mockApi.patch.mockResolvedValue({})
      const { passwordForm, passwordSaved, changePassword } = useUserInfo()
      passwordForm.value.currentPassword = 'old'
      passwordForm.value.newPassword = 'NewPass123'
      await changePassword()

      expect(passwordForm.value.currentPassword).toBe('')
      expect(passwordForm.value.newPassword).toBe('')
      expect(passwordSaved.value).toBe(true)
    })

    it('passe passwordSaved=false après 2400ms', async () => {
      mockApi.patch.mockResolvedValue({})
      const { passwordForm, passwordSaved, changePassword } = useUserInfo()
      passwordForm.value.currentPassword = 'old'
      passwordForm.value.newPassword = 'NewPass123'
      await changePassword()

      expect(passwordSaved.value).toBe(true)
      vi.advanceTimersByTime(2400)
      expect(passwordSaved.value).toBe(false)
    })

    it('affiche passwordError si le PATCH échoue', async () => {
      mockApi.patch.mockRejectedValue(new Error('fail'))
      const { passwordForm, passwordError, changePassword } = useUserInfo()
      passwordForm.value.currentPassword = 'old'
      passwordForm.value.newPassword = 'NewPass123'
      await changePassword()
      expect(passwordError.value).toBe('Mot de passe actuel incorrect ou erreur serveur.')
    })

    it('ne fait rien si isSavingPassword est déjà true', async () => {
      let resolve!: (val: any) => void
      const pending = new Promise((r) => { resolve = r })
      mockApi.patch.mockReturnValueOnce(pending)

      const { passwordForm, changePassword } = useUserInfo()
      passwordForm.value.currentPassword = 'old'
      passwordForm.value.newPassword = 'NewPass123'

      const p1 = changePassword()
      const p2 = changePassword()

      resolve(undefined)
      await p1
      await p2

      expect(mockApi.patch).toHaveBeenCalledTimes(1)
    })

    it('désactive isSavingPassword après succès ou erreur', async () => {
      mockApi.patch.mockRejectedValue(new Error('fail'))
      const { passwordForm, isSavingPassword, changePassword } = useUserInfo()
      passwordForm.value.currentPassword = 'old'
      passwordForm.value.newPassword = 'NewPass123'
      await changePassword()
      expect(isSavingPassword.value).toBe(false)
    })
  })
})
