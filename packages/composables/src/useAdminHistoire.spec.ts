import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('./useApi', () => ({ useApi: vi.fn() }))

import { useApi } from './useApi'
import { useAdminHistoire } from './useAdminHistoire'

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

describe('useAdminHistoire', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    ;(useApi as ReturnType<typeof vi.fn>).mockReturnValue(mockApi)
  })

  it('expose des sections vides et isLoading=false par défaut', () => {
    const { sections, isLoading } = useAdminHistoire()
    expect(sections.value).toEqual([])
    expect(isLoading.value).toBe(false)
  })

  it('fetchAll() charge les sections depuis l\'API', async () => {
    const data = [makeSection(1), makeSection(2)]
    mockApi.get.mockResolvedValue({ data: { data } })

    const { sections, fetchAll } = useAdminHistoire()
    await fetchAll()

    expect(mockApi.get).toHaveBeenCalledWith('/histoire')
    expect(sections.value).toEqual(data)
  })

  it('update() envoie un PATCH et met à jour la section dans la liste', async () => {
    const initial = [makeSection(1)]
    const updated = { ...makeSection(1), imageAlt: 'Nouveau texte alt' }
    mockApi.get.mockResolvedValue({ data: { data: initial } })
    mockApi.patch.mockResolvedValue({ data: { data: updated } })

    const { sections, fetchAll, update } = useAdminHistoire()
    await fetchAll()
    await update(1, { imageAlt: 'Nouveau texte alt' })

    expect(mockApi.patch).toHaveBeenCalledWith('/histoire/1', { imageAlt: 'Nouveau texte alt' })
    expect(sections.value[0].imageAlt).toBe('Nouveau texte alt')
  })

  it('update() ne plante pas si l\'id n\'est pas trouvé dans la liste', async () => {
    mockApi.get.mockResolvedValue({ data: { data: [] } })
    mockApi.patch.mockResolvedValue({ data: { data: makeSection(99) } })

    const { fetchAll, update } = useAdminHistoire()
    await fetchAll()
    await expect(update(99, { imageAlt: 'Ghost' })).resolves.toBeDefined()
  })
})
