import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('./useApi', () => ({ useApi: vi.fn() }))

import { useApi } from './useApi'
import { useAdminUsers } from './useAdminUsers'

const mockApi = {
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
}

const makeUser = (id = 1) => ({
  id,
  email: `user${id}@example.com`,
  firstName: 'Jean',
  lastName: 'Dupont',
  role: 'client' as const,
  customerNumber: `CI-00${id}`,
  createdAt: '2024-01-01',
})

describe('useAdminUsers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useApi as ReturnType<typeof vi.fn>).mockReturnValue(mockApi)
  })

  it('expose les valeurs initiales par défaut', () => {
    const { users, isLoading, total, page, totalPages } = useAdminUsers()
    expect(users.value).toEqual([])
    expect(isLoading.value).toBe(false)
    expect(total.value).toBe(0)
    expect(page.value).toBe(1)
    expect(totalPages.value).toBe(1)
  })

  describe('fetchUsers()', () => {
    it('charge les utilisateurs depuis l\'API', async () => {
      const items = [makeUser(1), makeUser(2)]
      mockApi.get.mockResolvedValue({
        data: { data: { items, total: 2, page: 1, totalPages: 1 } },
      })

      const { users, total, page, totalPages, fetchUsers } = useAdminUsers()
      await fetchUsers()

      expect(mockApi.get).toHaveBeenCalledWith('/users', { params: {} })
      expect(users.value).toEqual(items)
      expect(total.value).toBe(2)
      expect(page.value).toBe(1)
      expect(totalPages.value).toBe(1)
    })

    it('transmet les paramètres de recherche et pagination', async () => {
      mockApi.get.mockResolvedValue({
        data: { data: { items: [], total: 0, page: 2, totalPages: 3 } },
      })

      const { fetchUsers } = useAdminUsers()
      await fetchUsers({ search: 'jean', page: 2, limit: 10 })

      expect(mockApi.get).toHaveBeenCalledWith('/users', {
        params: { search: 'jean', page: 2, limit: 10 },
      })
    })

    it('active et désactive isLoading autour de l\'appel', async () => {
      let loadingDuring = false
      mockApi.get.mockImplementation(async () => {
        loadingDuring = true
        return { data: { data: { items: [], total: 0, page: 1, totalPages: 1 } } }
      })

      const { isLoading, fetchUsers } = useAdminUsers()
      await fetchUsers()

      expect(loadingDuring).toBe(true)
      expect(isLoading.value).toBe(false)
    })

    it('désactive isLoading même si l\'API échoue', async () => {
      mockApi.get.mockRejectedValue(new Error('Network'))
      const { isLoading, fetchUsers } = useAdminUsers()

      await expect(fetchUsers()).rejects.toThrow()
      expect(isLoading.value).toBe(false)
    })
  })
})
