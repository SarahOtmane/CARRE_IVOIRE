import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('./useApi', () => ({ useApi: vi.fn() }))

import { useApi } from './useApi'
import { useImageUpload } from './useImageUpload'

const mockApi = {
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
}

describe('useImageUpload', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useApi as ReturnType<typeof vi.fn>).mockReturnValue(mockApi)
  })

  it('expose isUploading=false par défaut', () => {
    const { isUploading } = useImageUpload()
    expect(isUploading.value).toBe(false)
  })

  it('upload() envoie le fichier en multipart/form-data et retourne l\'URL', async () => {
    const url = 'https://cdn.example.com/image.jpg'
    mockApi.post.mockResolvedValue({ data: { data: { url } } })

    const file = new File(['content'], 'image.jpg', { type: 'image/jpeg' })
    const { upload } = useImageUpload()
    const result = await upload(file)

    expect(mockApi.post).toHaveBeenCalledWith(
      '/uploads',
      expect.any(FormData),
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )
    expect(result).toBe(url)
  })

  it('upload() inclut le fichier dans FormData sous la clé "file"', async () => {
    mockApi.post.mockResolvedValue({ data: { data: { url: 'https://cdn.example.com/x.jpg' } } })

    const file = new File(['data'], 'photo.png', { type: 'image/png' })
    const { upload } = useImageUpload()
    await upload(file)

    const formData = mockApi.post.mock.calls[0][1] as FormData
    expect(formData.get('file')).toBe(file)
  })

  it('upload() active isUploading pendant l\'envoi puis le remet à false', async () => {
    let wasUploading = false
    mockApi.post.mockImplementation(async () => {
      wasUploading = true
      return { data: { data: { url: '' } } }
    })

    const file = new File(['x'], 'x.jpg')
    const { isUploading, upload } = useImageUpload()
    await upload(file)

    expect(wasUploading).toBe(true)
    expect(isUploading.value).toBe(false)
  })

  it('upload() propage l\'erreur et remet isUploading à false', async () => {
    mockApi.post.mockRejectedValue(new Error('Upload failed'))
    const file = new File(['x'], 'x.jpg')
    const { isUploading, upload } = useImageUpload()

    await expect(upload(file)).rejects.toThrow('Upload failed')
    expect(isUploading.value).toBe(false)
  })
})
