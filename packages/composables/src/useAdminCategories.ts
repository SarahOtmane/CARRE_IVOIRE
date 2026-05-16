import { ref, onMounted } from 'vue'
import type { CategoryResponse, CreateCategoryDto, UpdateCategoryDto } from '@carre-ivoire/types'
import { useApi } from './useApi'
import { useLoading } from './useLoading'
import { useNotification } from './useNotification'

export function useAdminCategories() {
  const categories = ref<CategoryResponse[]>([])
  const { isLoading, withLoading } = useLoading()
  const api = useApi()
  const { success } = useNotification()

  const fetchAll = () =>
    withLoading(async () => {
      const res = await api.get('/categories')
      categories.value = res.data.data
    })

  const create = (dto: CreateCategoryDto) =>
    withLoading(async () => {
      const res = await api.post('/categories', dto)
      categories.value.push(res.data.data)
      success('Catégorie créée')
    })

  const update = (id: number, dto: UpdateCategoryDto) =>
    withLoading(async () => {
      const res = await api.patch(`/categories/${id}`, dto)
      const idx = categories.value.findIndex((c) => c.id === id)
      if (idx !== -1) categories.value[idx] = res.data.data
      success('Catégorie mise à jour')
    })

  const remove = (id: number) =>
    withLoading(async () => {
      await api.delete(`/categories/${id}`)
      categories.value = categories.value.filter((c) => c.id !== id)
      success('Catégorie supprimée')
    })

  onMounted(fetchAll)

  return { categories, isLoading, fetchAll, create, update, remove }
}
