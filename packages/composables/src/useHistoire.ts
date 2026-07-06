import { ref, onMounted } from 'vue'
import type { HistoireSectionResponse } from '@carre-ivoire/types'
import { useApi } from './useApi'
import { useLoading } from './useLoading'

export function useHistoire() {
  const sections = ref<HistoireSectionResponse[]>([])
  const { isLoading, withLoading } = useLoading()
  const api = useApi()

  const fetchAll = () =>
    withLoading(async () => {
      const res = await api.get('/histoire')
      sections.value = res.data.data
    })

  onMounted(fetchAll)

  return { sections, isLoading, fetchAll }
}
