import { ref, onMounted } from 'vue'
import type { TaxRateResponse, CreateTaxRateDto, UpdateTaxRateDto } from '@carre-ivoire/types'
import { useApi } from './useApi'
import { useLoading } from './useLoading'
import { useNotification } from './useNotification'

export function useAdminTaxRates() {
  const taxRates = ref<TaxRateResponse[]>([])
  const { isLoading, withLoading } = useLoading()
  const api = useApi()
  const { success } = useNotification()

  const fetchAll = () =>
    withLoading(async () => {
      const res = await api.get('/tax-rates')
      taxRates.value = res.data.data
    })

  const create = (dto: CreateTaxRateDto) =>
    withLoading(async () => {
      const res = await api.post('/tax-rates', dto)
      taxRates.value.push(res.data.data)
      success('Taux de TVA créé')
      return res.data.data as TaxRateResponse
    })

  const update = (id: number, dto: UpdateTaxRateDto) =>
    withLoading(async () => {
      const res = await api.patch(`/tax-rates/${id}`, dto)
      const idx = taxRates.value.findIndex((t) => t.id === id)
      if (idx !== -1) taxRates.value[idx] = res.data.data
      success('Taux de TVA mis à jour')
    })

  const remove = (id: number) =>
    withLoading(async () => {
      await api.delete(`/tax-rates/${id}`)
      taxRates.value = taxRates.value.filter((t) => t.id !== id)
      success('Taux de TVA supprimé')
    })

  onMounted(fetchAll)

  return { taxRates, isLoading, fetchAll, create, update, remove }
}
