import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('./useApi', () => ({ useApi: vi.fn() }))

import { useApi } from './useApi'
import { useForgotPasswordForm } from './useForgotPasswordForm'

const mockApi = {
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
}

describe('useForgotPasswordForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useApi as ReturnType<typeof vi.fn>).mockReturnValue(mockApi)
  })

  it('initialise les champs par défaut', () => {
    const { email, sent, error, loading } = useForgotPasswordForm()
    expect(email.value).toBe('')
    expect(sent.value).toBe(false)
    expect(error.value).toBe('')
    expect(loading.value).toBe(false)
  })

  describe('submit()', () => {
    it('envoie un POST avec l\'email et passe sent=true en cas de succès', async () => {
      mockApi.post.mockResolvedValue({})
      const { email, sent, submit } = useForgotPasswordForm()
      email.value = 'user@example.com'
      await submit()

      expect(mockApi.post).toHaveBeenCalledWith('/auth/forgot-password', { email: 'user@example.com' })
      expect(sent.value).toBe(true)
    })

    it('laisse sent=false et affiche une erreur si l\'API échoue', async () => {
      mockApi.post.mockRejectedValue(new Error('Network'))
      const { email, sent, error, submit } = useForgotPasswordForm()
      email.value = 'user@example.com'
      await submit()

      expect(sent.value).toBe(false)
      expect(error.value).toBe('Une erreur est survenue. Réessayez dans quelques instants.')
    })

    it('réinitialise error avant chaque soumission', async () => {
      mockApi.post.mockRejectedValueOnce(new Error('fail'))
      const { email, error, submit } = useForgotPasswordForm()
      email.value = 'a@b.com'
      await submit()
      expect(error.value).not.toBe('')

      mockApi.post.mockResolvedValue({})
      await submit()
      expect(error.value).toBe('')
    })

    it('active loading pendant l\'appel puis le remet à false', async () => {
      let wasLoading = false
      mockApi.post.mockImplementation(async () => {
        wasLoading = true
        return {}
      })

      const { email, loading, submit } = useForgotPasswordForm()
      email.value = 'a@b.com'
      await submit()

      expect(wasLoading).toBe(true)
      expect(loading.value).toBe(false)
    })

    it('désactive loading même après une erreur', async () => {
      mockApi.post.mockRejectedValue(new Error('fail'))
      const { email, loading, submit } = useForgotPasswordForm()
      email.value = 'a@b.com'
      await submit()
      expect(loading.value).toBe(false)
    })
  })
})
