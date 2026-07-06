import { describe, it, expect, vi } from 'vitest'
import { useLoading } from './useLoading'

describe('useLoading', () => {
  it('initialise isLoading à false par défaut', () => {
    const { isLoading } = useLoading()
    expect(isLoading.value).toBe(false)
  })

  it('accepte une valeur initiale à true', () => {
    const { isLoading } = useLoading(true)
    expect(isLoading.value).toBe(true)
  })

  it('setLoading(true) passe isLoading à true', () => {
    const { isLoading, setLoading } = useLoading()
    setLoading(true)
    expect(isLoading.value).toBe(true)
  })

  it('setLoading(false) passe isLoading à false', () => {
    const { isLoading, setLoading } = useLoading(true)
    setLoading(false)
    expect(isLoading.value).toBe(false)
  })

  it('withLoading active isLoading pendant l\'exécution puis le remet à false', async () => {
    const { isLoading, withLoading } = useLoading()
    let wasLoading = false
    await withLoading(async () => {
      wasLoading = isLoading.value
    })
    expect(wasLoading).toBe(true)
    expect(isLoading.value).toBe(false)
  })

  it('withLoading remet isLoading à false même après une erreur', async () => {
    const { isLoading, withLoading } = useLoading()
    await expect(withLoading(async () => { throw new Error('boom') })).rejects.toThrow('boom')
    expect(isLoading.value).toBe(false)
  })

  it('withLoading retourne la valeur de la fonction', async () => {
    const { withLoading } = useLoading()
    const result = await withLoading(async () => 42)
    expect(result).toBe(42)
  })
})
