import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('./useApi', () => ({ useApi: vi.fn() }))

const mockReplace = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ replace: mockReplace }),
}))

import { useApi } from './useApi'
import { useAuthStore } from '@carre-ivoire/stores'
import { useLoginForm } from './useLoginForm'

const mockApi = {
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
}

const clientUser = {
  id: 1,
  email: 'jean@example.com',
  firstName: 'Jean',
  lastName: 'Dupont',
  role: 'client' as const,
  customerNumber: 'CI-001',
}

const adminUser = { ...clientUser, role: 'admin' as const }

describe('useLoginForm', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    ;(useApi as ReturnType<typeof vi.fn>).mockReturnValue(mockApi)
  })

  it('initialise les champs à vide si pas d\'utilisateur dans le store', () => {
    const { email, password, error, loading } = useLoginForm()
    expect(email.value).toBe('')
    expect(password.value).toBe('')
    expect(error.value).toBe('')
    expect(loading.value).toBe(false)
  })

  it('pré-remplit l\'email depuis le store si un utilisateur est connecté', () => {
    const authStore = useAuthStore()
    authStore.setAuth('tok', clientUser)

    const { email } = useLoginForm()
    expect(email.value).toBe(clientUser.email)
  })

  describe('login()', () => {
    it('affiche une erreur si email ou mot de passe vide', async () => {
      const { email, password, error, login } = useLoginForm()
      email.value = ''
      password.value = ''
      await login()
      expect(error.value).toBe('Veuillez renseigner votre email et votre mot de passe.')
      expect(mockApi.post).not.toHaveBeenCalled()
    })

    it('affiche une erreur si email vide', async () => {
      const { email, password, error, login } = useLoginForm()
      email.value = '   '
      password.value = 'pass'
      await login()
      expect(error.value).toBe('Veuillez renseigner votre email et votre mot de passe.')
    })

    it('affiche une erreur si mot de passe vide', async () => {
      const { email, password, error, login } = useLoginForm()
      email.value = 'a@b.com'
      password.value = '   '
      await login()
      expect(error.value).toBe('Veuillez renseigner votre email et votre mot de passe.')
    })

    it('se connecte avec succès et redirige le client vers /compte', async () => {
      mockApi.post.mockResolvedValue({
        data: { data: { accessToken: 'token-abc', user: clientUser } },
      })
      const authStore = useAuthStore()

      const { email, password, login } = useLoginForm()
      email.value = 'jean@example.com'
      password.value = 'password123'
      await login()

      expect(mockApi.post).toHaveBeenCalledWith('/auth/login', {
        email: 'jean@example.com',
        password: 'password123',
      })
      expect(authStore.isAuthenticated).toBe(true)
      expect(mockReplace).toHaveBeenCalledWith('/compte')
    })

    it('redirige l\'admin vers /admin si redirectPath est /compte', async () => {
      mockApi.post.mockResolvedValue({
        data: { data: { accessToken: 'admin-tok', user: adminUser } },
      })

      const { email, password, login } = useLoginForm()
      email.value = 'admin@example.com'
      password.value = 'admin123'
      await login()

      expect(mockReplace).toHaveBeenCalledWith('/admin')
    })

    it('utilise un redirectPath personnalisé pour un client', async () => {
      mockApi.post.mockResolvedValue({
        data: { data: { accessToken: 'tok', user: clientUser } },
      })

      const { email, password, login } = useLoginForm(() => '/boutique')
      email.value = 'jean@example.com'
      password.value = 'password123'
      await login()

      expect(mockReplace).toHaveBeenCalledWith('/boutique')
    })

    it('ne redirige pas l\'admin vers /admin si redirectPath n\'est pas /compte', async () => {
      mockApi.post.mockResolvedValue({
        data: { data: { accessToken: 'admin-tok', user: adminUser } },
      })

      const { email, password, login } = useLoginForm(() => '/checkout')
      email.value = 'admin@example.com'
      password.value = 'pass'
      await login()

      expect(mockReplace).toHaveBeenCalledWith('/checkout')
    })

    it('affiche un message d\'erreur si l\'API retourne une erreur', async () => {
      mockApi.post.mockRejectedValue(new Error('Unauthorized'))

      const { email, password, error, login } = useLoginForm()
      email.value = 'jean@example.com'
      password.value = 'wrongpass'
      await login()

      expect(error.value).toBe('Email ou mot de passe incorrect.')
    })

    it('désactive loading après succès', async () => {
      mockApi.post.mockResolvedValue({
        data: { data: { accessToken: 'tok', user: clientUser } },
      })

      const { email, password, loading, login } = useLoginForm()
      email.value = 'jean@example.com'
      password.value = 'pass'
      await login()

      expect(loading.value).toBe(false)
    })

    it('désactive loading même après une erreur', async () => {
      mockApi.post.mockRejectedValue(new Error('fail'))

      const { email, password, loading, login } = useLoginForm()
      email.value = 'a@b.com'
      password.value = 'pass'
      await login()

      expect(loading.value).toBe(false)
    })
  })
})
