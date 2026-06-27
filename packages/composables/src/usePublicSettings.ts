import { ref, onMounted } from 'vue'
import { useApi } from './useApi'

interface PublicSettings {
  shippingFlat: number
  shippingFreeFrom: number
}

// Cached settings — un seul fetch par session
let _cache: PublicSettings | null = null

export function usePublicSettings() {
  const settings = ref<PublicSettings | null>(_cache)
  const api = useApi()

  const fetch = async () => {
    if (_cache) {
      settings.value = _cache
      return
    }
    const res = await api.get<{ data: PublicSettings }>('/settings/public')
    _cache = res.data.data
    settings.value = _cache
  }

  onMounted(fetch)

  const shippingFlatEuros = () => (_cache?.shippingFlat ?? 800) / 100
  const shippingFreeFromEuros = () => (_cache?.shippingFreeFrom ?? 7000) / 100

  return { settings, fetch, shippingFlatEuros, shippingFreeFromEuros }
}
