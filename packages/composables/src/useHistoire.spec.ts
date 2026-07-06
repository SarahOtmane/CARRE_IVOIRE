import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('./useApi', () => ({ useApi: vi.fn() }))

import { useApi } from './useApi'
import { useHistoire } from './useHistoire'

const mockApi = {
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
}

const makeSection = (id: number) => ({
  id,
  key: `section-${id}`,
  displayOrder: id,
  imageSide: id % 2 === 0 ? 'left' : 'right',
  image: `https://example.com/${id}.webp`,
  imageAlt: `Alt ${id}`,
  paragraphs: [`Paragraphe ${id}`],
})

describe('useHistoire', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useApi as ReturnType<typeof vi.fn>).mockReturnValue(mockApi)
  })

  it('expose des sections vides et isLoading=false par défaut', () => {
    const { sections, isLoading } = useHistoire()
    expect(sections.value).toEqual([])
    expect(isLoading.value).toBe(false)
  })

  describe('fetchAll()', () => {
    it('charge les sections depuis l\'API', async () => {
      const data = [makeSection(1), makeSection(2)]
      mockApi.get.mockResolvedValue({ data: { data } })

      const { sections, fetchAll } = useHistoire()
      await fetchAll()

      expect(mockApi.get).toHaveBeenCalledWith('/histoire')
      expect(sections.value).toEqual(data)
    })
  })
})
