import { Test } from '@nestjs/testing'
import { OrdersController } from './orders.controller'
import { OrdersService } from './orders.service'

const mockOrder = {
  id: 1, orderNumber: 'CI-ORD-20260101-0001', userId: 1,
  status: 'confirmed', totalAmount: 780, items: [],
}
const mockUser = { id: 1, email: 'user@test.com', role: 'client' as const }
const mockAdmin = { id: 2, email: 'admin@test.com', role: 'admin' as const }

describe('OrdersController', () => {
  let controller: OrdersController
  let service: jest.Mocked<OrdersService>

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: {
            createOrder: jest.fn().mockResolvedValue({ orderId: 1, orderNumber: 'CI-ORD-0001', status: 'payment_pending', clientSecret: 'cs_test', totalAmount: 780 }),
            findUserOrders: jest.fn().mockResolvedValue([mockOrder]),
            findByOrderNumber: jest.fn().mockResolvedValue(mockOrder),
            findAll: jest.fn().mockResolvedValue({ items: [mockOrder], total: 1 }),
            findById: jest.fn().mockResolvedValue(mockOrder),
            updateStatus: jest.fn().mockResolvedValue({ ...mockOrder, status: 'shipped' }),
          },
        },
      ],
    }).compile()

    controller = module.get(OrdersController)
    service = module.get(OrdersService)
  })

  it('create délègue à ordersService.createOrder avec l\'id du user JWT', async () => {
    const dto = { items: [{ productId: 1, quantity: 2 }], shippingAddress: {} } as any
    const result = await controller.create(dto, mockUser)
    expect(service.createOrder).toHaveBeenCalledWith(dto, 1)
    expect(result).toHaveProperty('orderId', 1)
  })

  it('findMyOrders délègue à ordersService.findUserOrders', async () => {
    const result = await controller.findMyOrders(mockUser)
    expect(service.findUserOrders).toHaveBeenCalledWith(1)
    expect(result).toHaveLength(1)
  })

  it('findByOrderNumber passe isAdmin=false pour un client', async () => {
    await controller.findByOrderNumber('CI-ORD-0001', mockUser)
    expect(service.findByOrderNumber).toHaveBeenCalledWith('CI-ORD-0001', 1, false)
  })

  it('findByOrderNumber passe isAdmin=true pour un admin', async () => {
    await controller.findByOrderNumber('CI-ORD-0001', mockAdmin)
    expect(service.findByOrderNumber).toHaveBeenCalledWith('CI-ORD-0001', 2, true)
  })

  it('findAll délègue à ordersService.findAll avec les filtres', async () => {
    const result = await controller.findAll('confirmed', 1, 10)
    expect(service.findAll).toHaveBeenCalledWith({ status: 'confirmed', page: 1, limit: 10 })
    expect(result.total).toBe(1)
  })

  it('findOne délègue à ordersService.findById en passant isAdmin', async () => {
    await controller.findOne(1, mockUser)
    expect(service.findById).toHaveBeenCalledWith(1, 1, false)
  })

  it('updateStatus délègue à ordersService.updateStatus', async () => {
    const dto = { status: 'shipped' } as any
    const result = await controller.updateStatus(1, dto)
    expect(service.updateStatus).toHaveBeenCalledWith(1, dto)
    expect(result.status).toBe('shipped')
  })
})
