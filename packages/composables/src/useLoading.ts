import { ref } from 'vue'

export function useLoading(initialState = false) {
  const isLoading = ref(initialState)

  const setLoading = (value: boolean) => {
    isLoading.value = value
  }

  const withLoading = async <T>(fn: () => Promise<T>): Promise<T> => {
    try {
      setLoading(true)
      return await fn()
    } finally {
      setLoading(false)
    }
  }

  return { isLoading, setLoading, withLoading }
}
