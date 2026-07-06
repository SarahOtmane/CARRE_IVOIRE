import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('./useApi', () => ({ useApi: vi.fn() }))

import { useApi } from './useApi'
import { useNewsletter } from './useNewsletter'

const mockApi = {
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
}

describe('useNewsletter', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    ;(useApi as ReturnType<typeof vi.fn>).mockReturnValue(mockApi)
  })

  it('expose isLoading=false par défaut', () => {
    const { isLoading } = useNewsletter()
    expect(isLoading.value).toBe(false)
  })

  it('subscribe() envoie un POST avec l\'email', async () => {
    mockApi.post.mockResolvedValue({})
    const { subscribe } = useNewsletter()
    await subscribe('test@example.com')

    expect(mockApi.post).toHaveBeenCalledWith('/newsletter/subscribe', { email: 'test@example.com' })
  })

  it('subscribe() active isLoading pendant l\'appel puis le remet à false', async () => {
    let wasLoading = false
    mockApi.post.mockImplementation(async () => {
      wasLoading = true
      return {}
    })

    const { isLoading, subscribe } = useNewsletter()
    await subscribe('a@b.com')

    expect(wasLoading).toBe(true)
    expect(isLoading.value).toBe(false)
  })

  it('subscribe() lève une erreur si l\'API échoue', async () => {
    mockApi.post.mockRejectedValue(new Error('Network'))
    const { subscribe } = useNewsletter()
    await expect(subscribe('a@b.com')).rejects.toThrow()
  })

  it('subscribe() remet isLoading à false même après une erreur', async () => {
    mockApi.post.mockRejectedValue(new Error('Network'))
    const { isLoading, subscribe } = useNewsletter()

    try {
      await subscribe('a@b.com')
    } catch {
      // attendu
    }

    expect(isLoading.value).toBe(false)
  })
})
