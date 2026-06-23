import { ref } from 'vue'
import type { ProductVariant, CreateVariantDto, UpdateVariantDto } from '@carre-ivoire/types'
import { useApi } from './useApi'
import { useLoading } from './useLoading'
import { useNotification } from './useNotification'

export function useAdminProductVariants() {
  const variants = ref<ProductVariant[]>([])
  const { isLoading, withLoading } = useLoading()
  const api = useApi()
  const { success } = useNotification()

  const fetchAll = (productId: number) =>
    withLoading(async () => {
      const res = await api.get(`/products/${productId}/variants`)
      variants.value = res.data.data
    })

  const create = (productId: number, dto: CreateVariantDto) =>
    withLoading(async () => {
      const res = await api.post(`/products/${productId}/variants`, dto)
      variants.value.push(res.data.data)
      success('Variante créée')
      return res.data.data as ProductVariant
    })

  const update = (productId: number, variantId: number, dto: UpdateVariantDto) =>
    withLoading(async () => {
      const res = await api.patch(`/products/${productId}/variants/${variantId}`, dto)
      const idx = variants.value.findIndex((v) => v.id === variantId)
      if (idx !== -1) variants.value[idx] = res.data.data
      success('Variante mise à jour')
    })

  const remove = (productId: number, variantId: number) =>
    withLoading(async () => {
      await api.delete(`/products/${productId}/variants/${variantId}`)
      variants.value = variants.value.filter((v) => v.id !== variantId)
      success('Variante supprimée')
    })

  return { variants, isLoading, fetchAll, create, update, remove }
}
