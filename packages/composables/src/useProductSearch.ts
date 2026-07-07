import { ref, onUnmounted } from 'vue'
import type { ProductResponse } from '@carre-ivoire/types'
import { useApi } from './useApi'

const DEBOUNCE_MS = 300

export function useProductSearch() {
  const results = ref<ProductResponse[]>([])
  const isSearching = ref(false)
  const api = useApi()

  let timer: ReturnType<typeof setTimeout> | undefined
  let latestQuery = ''

  function search(query: string, limit = 8) {
    const trimmed = query.trim()
    latestQuery = trimmed
    if (timer) clearTimeout(timer)

    if (!trimmed) {
      results.value = []
      isSearching.value = false
      return
    }

    isSearching.value = true
    timer = setTimeout(async () => {
      try {
        const res = await api.get(`/products?search=${encodeURIComponent(trimmed)}&limit=${limit}`)
        if (latestQuery === trimmed) {
          results.value = res.data.data.items
        }
      } finally {
        if (latestQuery === trimmed) isSearching.value = false
      }
    }, DEBOUNCE_MS)
  }

  function clear() {
    if (timer) clearTimeout(timer)
    latestQuery = ''
    results.value = []
    isSearching.value = false
  }

  onUnmounted(() => {
    if (timer) clearTimeout(timer)
  })

  return { results, isSearching, search, clear }
}
