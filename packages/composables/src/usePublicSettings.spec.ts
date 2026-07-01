import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('usePublicSettings', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('expose settings=null et les valeurs par défaut si pas encore chargé', async () => {
    vi.doMock('./useApi', () => ({
      useApi: () => ({ get: vi.fn() }),
    }))
    const { usePublicSettings } = await import('./usePublicSettings')
    const { settings, shippingFlatEuros, shippingFreeFromEuros } = usePublicSettings()

    expect(settings.value).toBeNull()
    expect(shippingFlatEuros()).toBe(8)
    expect(shippingFreeFromEuros()).toBe(70)
  })

  it('fetch() charge les paramètres depuis l\'API et met à jour settings', async () => {
    const mockGet = vi.fn().mockResolvedValue({
      data: { data: { shippingFlat: 500, shippingFreeFrom: 5000 } },
    })
    vi.doMock('./useApi', () => ({ useApi: () => ({ get: mockGet }) }))

    const { usePublicSettings } = await import('./usePublicSettings')
    const { settings, fetch } = usePublicSettings()

    await fetch()

    expect(mockGet).toHaveBeenCalledWith('/settings/public')
    expect(settings.value?.shippingFlat).toBe(500)
    expect(settings.value?.shippingFreeFrom).toBe(5000)
  })

  it('shippingFlatEuros() retourne le bon montant en euros après fetch', async () => {
    const mockGet = vi.fn().mockResolvedValue({
      data: { data: { shippingFlat: 500, shippingFreeFrom: 5000 } },
    })
    vi.doMock('./useApi', () => ({ useApi: () => ({ get: mockGet }) }))

    const { usePublicSettings } = await import('./usePublicSettings')
    const { fetch, shippingFlatEuros, shippingFreeFromEuros } = usePublicSettings()

    await fetch()

    expect(shippingFlatEuros()).toBe(5)
    expect(shippingFreeFromEuros()).toBe(50)
  })

  it('fetch() utilise le cache si _cache est déjà renseigné', async () => {
    const mockGet = vi.fn().mockResolvedValue({
      data: { data: { shippingFlat: 300, shippingFreeFrom: 3000 } },
    })
    vi.doMock('./useApi', () => ({ useApi: () => ({ get: mockGet }) }))

    const { usePublicSettings } = await import('./usePublicSettings')
    const composable = usePublicSettings()

    await composable.fetch()
    expect(mockGet).toHaveBeenCalledTimes(1)

    await composable.fetch()
    expect(mockGet).toHaveBeenCalledTimes(1)
  })

  it('deux instances partagent le même cache', async () => {
    const mockGet = vi.fn().mockResolvedValue({
      data: { data: { shippingFlat: 400, shippingFreeFrom: 4000 } },
    })
    vi.doMock('./useApi', () => ({ useApi: () => ({ get: mockGet }) }))

    const { usePublicSettings } = await import('./usePublicSettings')

    const a = usePublicSettings()
    await a.fetch()

    const b = usePublicSettings()
    expect(b.settings.value?.shippingFlat).toBe(400)
    await b.fetch()

    expect(mockGet).toHaveBeenCalledTimes(1)
  })
})
