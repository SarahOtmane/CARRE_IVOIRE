import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('./useApi', () => ({ useApi: vi.fn() }))

const mockReplace = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ replace: mockReplace }),
}))

import { useApi } from './useApi'
import { useAuthStore } from '@carre-ivoire/stores'
import { useRegisterForm } from './useRegisterForm'

const mockApi = {
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
}

const validForm = {
  firstName: 'Jean',
  lastName: 'Dupont',
  email: 'jean@example.com',
  password: 'Password1',
}

const newUser = {
  id: 10,
  email: 'jean@example.com',
  firstName: 'Jean',
  lastName: 'Dupont',
  role: 'client' as const,
  customerNumber: 'CI-010',
}

describe('useRegisterForm', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    ;(useApi as ReturnType<typeof vi.fn>).mockReturnValue(mockApi)
  })

  it('initialise le formulaire avec des champs vides', () => {
    const { form, error, loading } = useRegisterForm()
    expect(form.value.firstName).toBe('')
    expect(form.value.lastName).toBe('')
    expect(form.value.email).toBe('')
    expect(form.value.password).toBe('')
    expect(error.value).toBe('')
    expect(loading.value).toBe(false)
  })

  describe('register() — validations', () => {
    it('affiche une erreur si prénom vide', async () => {
      const { form, error, register } = useRegisterForm()
      form.value = { ...validForm, firstName: '' }
      await register()
      expect(error.value).toBe('Veuillez renseigner votre prénom et votre nom.')
      expect(mockApi.post).not.toHaveBeenCalled()
    })

    it('affiche une erreur si nom vide', async () => {
      const { form, error, register } = useRegisterForm()
      form.value = { ...validForm, lastName: '' }
      await register()
      expect(error.value).toBe('Veuillez renseigner votre prénom et votre nom.')
    })

    it('affiche une erreur si prénom ne contient que des espaces', async () => {
      const { form, error, register } = useRegisterForm()
      form.value = { ...validForm, firstName: '   ' }
      await register()
      expect(error.value).toBe('Veuillez renseigner votre prénom et votre nom.')
    })

    it('affiche une erreur si email vide', async () => {
      const { form, error, register } = useRegisterForm()
      form.value = { ...validForm, email: '' }
      await register()
      expect(error.value).toBe('Veuillez renseigner votre email.')
    })

    it('affiche une erreur si email ne contient que des espaces', async () => {
      const { form, error, register } = useRegisterForm()
      form.value = { ...validForm, email: '   ' }
      await register()
      expect(error.value).toBe('Veuillez renseigner votre email.')
    })

    it('affiche une erreur si le mot de passe est trop court', async () => {
      const { form, error, register } = useRegisterForm()
      form.value = { ...validForm, password: 'Short1' }
      await register()
      expect(error.value).toContain('8 caractères')
    })

    it('affiche une erreur si le mot de passe n\'a pas de majuscule', async () => {
      const { form, error, register } = useRegisterForm()
      form.value = { ...validForm, password: 'nouppercase1' }
      await register()
      expect(error.value).toContain('majuscule')
    })

    it('affiche une erreur si le mot de passe n\'a pas de chiffre', async () => {
      const { form, error, register } = useRegisterForm()
      form.value = { ...validForm, password: 'NoNumber!' }
      await register()
      expect(error.value).toContain('chiffre')
    })
  })

  describe('register() — cas nominaux', () => {
    it('crée le compte, authentifie l\'utilisateur et redirige vers /compte', async () => {
      mockApi.post.mockResolvedValue({
        data: { data: { accessToken: 'new-token', user: newUser } },
      })
      const authStore = useAuthStore()

      const { form, register } = useRegisterForm()
      form.value = { ...validForm }
      await register()

      expect(mockApi.post).toHaveBeenCalledWith('/auth/register', {
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean@example.com',
        password: 'Password1',
      })
      expect(authStore.isAuthenticated).toBe(true)
      expect(mockReplace).toHaveBeenCalledWith('/compte')
    })

    it('affiche un message d\'erreur EMAIL_ALREADY_EXISTS', async () => {
      const err = { response: { data: { error: { code: 'EMAIL_ALREADY_EXISTS' } } } }
      mockApi.post.mockRejectedValue(err)

      const { form, error, register } = useRegisterForm()
      form.value = { ...validForm }
      await register()

      expect(error.value).toBe('Un compte existe déjà avec cet email.')
    })

    it('affiche un message d\'erreur générique pour les autres erreurs', async () => {
      mockApi.post.mockRejectedValue(new Error('Unknown'))

      const { form, error, register } = useRegisterForm()
      form.value = { ...validForm }
      await register()

      expect(error.value).toBe('Une erreur est survenue. Veuillez réessayer.')
    })

    it('désactive loading après succès', async () => {
      mockApi.post.mockResolvedValue({
        data: { data: { accessToken: 'tok', user: newUser } },
      })

      const { form, loading, register } = useRegisterForm()
      form.value = { ...validForm }
      await register()

      expect(loading.value).toBe(false)
    })

    it('désactive loading après erreur', async () => {
      mockApi.post.mockRejectedValue(new Error('fail'))

      const { form, loading, register } = useRegisterForm()
      form.value = { ...validForm }
      await register()

      expect(loading.value).toBe(false)
    })
  })
})
