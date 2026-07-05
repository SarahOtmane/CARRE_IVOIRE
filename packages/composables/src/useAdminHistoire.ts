import { ref, onMounted } from 'vue'
import type { HistoireSectionResponse, UpdateHistoireSectionDto } from '@carre-ivoire/types'
import { useApi } from './useApi'
import { useLoading } from './useLoading'
import { useNotification } from './useNotification'

export function useAdminHistoire() {
  const sections = ref<HistoireSectionResponse[]>([])
  const { isLoading, withLoading } = useLoading()
  const api = useApi()
  const { success } = useNotification()

  const fetchAll = () =>
    withLoading(async () => {
      const res = await api.get('/histoire')
      sections.value = res.data.data
    })

  const update = (id: number, dto: UpdateHistoireSectionDto) =>
    withLoading(async () => {
      const res = await api.patch(`/histoire/${id}`, dto)
      const idx = sections.value.findIndex((s) => s.id === id)
      if (idx !== -1) sections.value[idx] = res.data.data
      success('Section mise à jour')
      return res.data.data as HistoireSectionResponse
    })

  onMounted(fetchAll)

  return { sections, isLoading, fetchAll, update }
}
