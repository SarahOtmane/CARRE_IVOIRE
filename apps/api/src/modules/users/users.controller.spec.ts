import { Test } from '@nestjs/testing'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

const mockUser = {
  id: 1, email: 'user@test.com', firstName: 'Jean', lastName: 'Dupont',
  phone: null, addressStreet: null, addressCity: null, addressZip: null, addressCountry: null,
  role: 'client', customerNumber: 'CI-00000001', isActive: true,
}

const mockJwtUser = { id: 1, email: 'user@test.com', role: 'client' as const }

describe('UsersController', () => {
  let controller: UsersController
  let service: jest.Mocked<UsersService>

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn().mockResolvedValue({ items: [mockUser], total: 1, page: 1, totalPages: 1 }),
            findById: jest.fn().mockResolvedValue(mockUser),
            update: jest.fn().mockResolvedValue(mockUser),
            changePassword: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile()

    controller = module.get(UsersController)
    service = module.get(UsersService)
  })

  it('findAll délègue à usersService.findAll', async () => {
    const result = await controller.findAll({} as any)
    expect(service.findAll).toHaveBeenCalled()
    expect(result.total).toBe(1)
  })

  it('getMe délègue à usersService.findById avec l\'id du JWT user', async () => {
    const result = await controller.getMe(mockJwtUser)
    expect(service.findById).toHaveBeenCalledWith(1)
    expect(result).toEqual(mockUser)
  })

  it('updateMe délègue à usersService.update', async () => {
    const dto = { firstName: 'Pierre' } as any
    await controller.updateMe(mockJwtUser, dto)
    expect(service.update).toHaveBeenCalledWith(1, dto)
  })

  it('changePassword délègue à usersService.changePassword', async () => {
    const dto = { currentPassword: 'old', newPassword: 'new' } as any
    await controller.changePassword(mockJwtUser, dto)
    expect(service.changePassword).toHaveBeenCalledWith(1, dto)
  })
})
