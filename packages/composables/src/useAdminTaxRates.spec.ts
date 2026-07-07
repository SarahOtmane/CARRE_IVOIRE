import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('./useApi', () => ({ useApi: vi.fn() }))

import { useApi } from './useApi'
import { useAdminTaxRates } from './useAdminTaxRates'

const mockApi = {
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
}

const makeTaxRate = (id = 1) => ({ id, name: `TVA ${id}`, rate: 20 })

describe('useAdminTaxRates', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    ;(useApi as ReturnType<typeof vi.fn>).mockReturnValue(mockApi)
  })

  it('expose des taux vides et isLoading=false par défaut', () => {
    const { taxRates, isLoading } = useAdminTaxRates()
    expect(taxRates.value).toEqual([])
    expect(isLoading.value).toBe(false)
  })

  describe('fetchAll()', () => {
    it('charge les taux de TVA depuis l\'API', async () => {
      const data = [makeTaxRate(1), makeTaxRate(2)]
      mockApi.get.mockResolvedValue({ data: { data } })

      const { taxRates, fetchAll } = useAdminTaxRates()
      await fetchAll()

      expect(mockApi.get).toHaveBeenCalledWith('/tax-rates')
      expect(taxRates.value).toEqual(data)
    })
  })

  describe('create()', () => {
    it('envoie un POST, ajoute le taux et retourne l\'objet créé', async () => {
      const newRate = makeTaxRate(3)
      mockApi.post.mockResolvedValue({ data: { data: newRate } })

      const { taxRates, create } = useAdminTaxRates()
      const result = await create({ name: 'TVA 3', rate: 5.5 } as any)

      expect(mockApi.post).toHaveBeenCalledWith('/tax-rates', { name: 'TVA 3', rate: 5.5 })
      expect(taxRates.value).toContainEqual(newRate)
      expect(result).toEqual(newRate)
    })
  })

  describe('update()', () => {
    it('envoie un PATCH et met à jour le taux dans la liste', async () => {
      const initial = makeTaxRate(1)
      const updated = { ...initial, rate: 5.5 }
      mockApi.get.mockResolvedValue({ data: { data: [initial] } })
      mockApi.patch.mockResolvedValue({ data: { data: updated } })

      const { taxRates, fetchAll, update } = useAdminTaxRates()
      await fetchAll()
      await update(1, { rate: 5.5 } as any)

      expect(mockApi.patch).toHaveBeenCalledWith('/tax-rates/1', { rate: 5.5 })
      expect(taxRates.value[0].rate).toBe(5.5)
    })

    it('ne plante pas si le taux n\'est pas dans la liste', async () => {
      mockApi.patch.mockResolvedValue({ data: { data: makeTaxRate(99) } })
      const { update } = useAdminTaxRates()
      await expect(update(99, {} as any)).resolves.toBeUndefined()
    })
  })

  describe('remove()', () => {
    it('envoie un DELETE et retire le taux de la liste', async () => {
      const data = [makeTaxRate(1), makeTaxRate(2)]
      mockApi.get.mockResolvedValue({ data: { data } })
      mockApi.delete.mockResolvedValue({})

      const { taxRates, fetchAll, remove } = useAdminTaxRates()
      await fetchAll()
      await remove(1)

      expect(mockApi.delete).toHaveBeenCalledWith('/tax-rates/1')
      expect(taxRates.value).toHaveLength(1)
      expect(taxRates.value[0].id).toBe(2)
    })
  })
})
