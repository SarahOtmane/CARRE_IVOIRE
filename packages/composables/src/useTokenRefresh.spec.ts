import { describe, it, expect, beforeEach, vi } from 'vitest'

const baseUser = {
  id: 1,
  email: 'a@b.com',
  firstName: 'A',
  lastName: 'B',
  customerNumber: 'CI-1',
  role: 'client' as const,
}

describe('initializeAuth', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  async function setup(opts: {
    initialized?: boolean
    user?: typeof baseUser | null
    token?: string | null
    axiosPost?: ReturnType<typeof vi.fn>
  } = {}) {
    const mockPost = opts.axiosPost ?? vi.fn()
    vi.doMock('axios', () => ({ default: { post: mockPost } }))

    const { setActivePinia, createPinia } = await import('pinia')
    setActivePinia(createPinia())

    const { useAuthStore } = await import('@carre-ivoire/stores')
    const authStore = useAuthStore()

    if (opts.initialized) authStore.setInitialized()
    if (opts.user !== undefined) authStore.$patch({ user: opts.user })
    if (opts.token) authStore.$patch({ token: opts.token })

    const { initializeAuth } = await import('./useTokenRefresh')
    return { authStore, initializeAuth, mockPost }
  }

  it('retourne immédiatement si le store est déjà initialisé', async () => {
    const { initializeAuth, mockPost } = await setup({ initialized: true })
    await initializeAuth()
    expect(mockPost).not.toHaveBeenCalled()
  })

  it('appelle setInitialized() même si pas d\'utilisateur', async () => {
    const { authStore, initializeAuth } = await setup()
    await initializeAuth()
    expect(authStore.initialized).toBe(true)
  })

  it('ne fait pas d\'appel refresh si token déjà présent', async () => {
    const { initializeAuth, mockPost } = await setup({ user: baseUser, token: 'existing-token' })
    await initializeAuth()
    expect(mockPost).not.toHaveBeenCalled()
  })

  it('appelle /auth/refresh si user existe sans token', async () => {
    const mockPost = vi.fn().mockResolvedValue({
      data: { data: { accessToken: 'new-token', user: { ...baseUser, firstName: 'Updated' } } },
    })
    const { authStore, initializeAuth } = await setup({ user: baseUser, axiosPost: mockPost })
    await initializeAuth()

    expect(mockPost).toHaveBeenCalledWith(
      expect.stringContaining('/auth/refresh'),
      {},
      { withCredentials: true },
    )
    expect(authStore.token).toBe('new-token')
    expect(authStore.initialized).toBe(true)
  })

  it('appelle logout() si /auth/refresh échoue', async () => {
    const mockPost = vi.fn().mockRejectedValue(new Error('Network'))
    const { authStore, initializeAuth } = await setup({ user: baseUser, axiosPost: mockPost })
    await initializeAuth()

    expect(authStore.token).toBeNull()
    expect(authStore.user).toBeNull()
    expect(authStore.initialized).toBe(true)
  })

  it('le deuxième appel simultané utilise le même promise (singleton)', async () => {
    let resolveRefresh!: () => void
    const blocker = new Promise<void>((r) => { resolveRefresh = r })
    const mockPost = vi.fn().mockReturnValue(
      blocker.then(() => ({ data: { data: { accessToken: 'tok', user: baseUser } } })),
    )
    const { initializeAuth } = await setup({ user: baseUser, axiosPost: mockPost })

    const p1 = initializeAuth()
    const p2 = initializeAuth()

    resolveRefresh()
    await Promise.all([p1, p2])

    expect(mockPost).toHaveBeenCalledTimes(1)
  })
})
