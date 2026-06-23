import { useApi } from './useApi'
import { useLoading } from './useLoading'

export function useImageUpload() {
  const api = useApi()
  const { isLoading: isUploading, withLoading } = useLoading()

  const upload = (file: File): Promise<string> =>
    withLoading(async () => {
      const formData = new FormData()
      formData.append('file', file)
      const res = await api.post('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return res.data.data.url as string
    })

  return { upload, isUploading }
}
