import { Test } from '@nestjs/testing'
import { UnauthorizedException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { UsersService } from './users.service'
import { UsersRepository } from './users.repository'

const mockUser = {
  id: 1,
  email: 'user@test.com',
  first_name: 'Jean',
  last_name: 'Dupont',
  phone: null,
  address_street: null,
  address_city: null,
  address_zip: null,
  address_country: null,
  role: 'client' as const,
  customer_number: 'CI-00000001',
  is_active: 1,
  password_hash: '',
  created_at: new Date(),
}

describe('UsersService', () => {
  let service: UsersService
  let repo: jest.Mocked<UsersRepository>

  beforeEach(async () => {
    mockUser.password_hash = await bcrypt.hash('current123', 10)

    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn().mockResolvedValue(mockUser),
            update: jest.fn().mockResolvedValue(mockUser),
            emailExists: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get(UsersService)
    repo = module.get(UsersRepository)
  })

  describe('findAll', () => {
    it('retourne une liste paginée', async () => {
      repo.findAll.mockResolvedValue({ items: [mockUser as any], total: 1, page: 1, totalPages: 1 })
      const result = await service.findAll({})
      expect(result.total).toBe(1)
      expect(result.items[0].email).toBe('user@test.com')
    })
  })

  describe('findById', () => {
    it('retourne le DTO si l\'utilisateur existe', async () => {
      const result = await service.findById(1)
      expect(result.id).toBe(1)
      expect(result.email).toBe('user@test.com')
    })

    it('lève USER_NOT_FOUND si l\'utilisateur n\'existe pas', async () => {
      repo.findById.mockResolvedValue(null)
      await expect(service.findById(999)).rejects.toMatchObject({
        response: expect.objectContaining({ code: 'USER_NOT_FOUND' }),
      })
    })
  })

  describe('update', () => {
    it('met à jour les champs fournis et retourne le DTO', async () => {
      const updated = { ...mockUser, first_name: 'Pierre' }
      repo.update.mockResolvedValue(updated as any)
      const result = await service.update(1, { firstName: 'Pierre' })
      expect(result.firstName).toBe('Pierre')
    })

    it('transmet tous les champs définis en snake_case', async () => {
      repo.update.mockResolvedValue(mockUser as any)
      await service.update(1, {
        firstName: 'A', lastName: 'B', phone: '0600',
        addressStreet: '1 rue', addressCity: 'LUISANT',
        addressZip: '75001', addressCountry: 'FR',
      })
      expect(repo.update).toHaveBeenCalledWith(1, expect.objectContaining({
        first_name: 'A', last_name: 'B', phone: '0600',
        address_street: '1 rue', address_city: 'LUISANT',
        address_zip: '75001', address_country: 'FR',
      }))
    })
  })

  describe('changePassword', () => {
    it('change le mot de passe si le mot de passe actuel est correct', async () => {
      await expect(
        service.changePassword(1, { currentPassword: 'current123', newPassword: 'newpass456' }),
      ).resolves.toBeUndefined()
      expect(repo.update).toHaveBeenCalledWith(1, expect.objectContaining({ password_hash: expect.any(String) }))
    })

    it('lève UnauthorizedException si le mot de passe actuel est incorrect', async () => {
      await expect(
        service.changePassword(1, { currentPassword: 'wrong', newPassword: 'newpass456' }),
      ).rejects.toThrow(UnauthorizedException)
    })

    it('lève USER_NOT_FOUND si l\'utilisateur n\'existe pas', async () => {
      repo.findById.mockResolvedValue(null)
      await expect(
        service.changePassword(999, { currentPassword: 'any', newPassword: 'any' }),
      ).rejects.toMatchObject({ response: expect.objectContaining({ code: 'USER_NOT_FOUND' }) })
    })
  })

  describe('toResponseDto', () => {
    it('mappe is_active 1 → true', () => {
      const dto = service.toResponseDto({ ...mockUser, is_active: 1 } as any)
      expect(dto.isActive).toBe(true)
    })

    it('mappe is_active 0 → false', () => {
      const dto = service.toResponseDto({ ...mockUser, is_active: 0 } as any)
      expect(dto.isActive).toBe(false)
    })
  })
})
