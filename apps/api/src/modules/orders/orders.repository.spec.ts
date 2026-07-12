import { Test } from '@nestjs/testing'
import { getModelToken } from '@nestjs/sequelize'
import { OrdersRepository } from './orders.repository'
import { Order } from './order.model'
import { OrderItem } from './order-item.model'

const mockTransaction = { commit: jest.fn(), rollback: jest.fn() } as any

const mockOrder = {
  id: 1, userId: 1, status: 'payment_pending', totalAmount: 780,
  orderNumber: 'CI-ORD-20260101-0001',
  update: jest.fn().mockResolvedValue({}),
}

describe('OrdersRepository', () => {
  let repo: OrdersRepository
  let orderModel: {
    findAndCountAll: jest.Mock
    findByPk: jest.Mock
    findAll: jest.Mock
    findOne: jest.Mock
    create: jest.Mock
    update: jest.Mock
  }
  let itemModel: { bulkCreate: jest.Mock }

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        OrdersRepository,
        {
          provide: getModelToken(Order),
          useValue: {
            findAndCountAll: jest.fn().mockResolvedValue({ rows: [], count: 0 }),
            findByPk: jest.fn().mockResolvedValue(mockOrder),
            findAll: jest.fn().mockResolvedValue([mockOrder]),
            findOne: jest.fn().mockResolvedValue(mockOrder),
            create: jest.fn().mockResolvedValue({ ...mockOrder }),
            update: jest.fn().mockResolvedValue([1]),
          },
        },
        {
          provide: getModelToken(OrderItem),
          useValue: { bulkCreate: jest.fn().mockResolvedValue([]) },
        },
      ],
    }).compile()

    repo = module.get(OrdersRepository)
    orderModel = module.get(getModelToken(Order))
    itemModel = module.get(getModelToken(OrderItem))
  })

  describe('findAll', () => {
    it('retombe sur les valeurs par défaut si page/limit sont NaN (query param absent)', async () => {
      await repo.findAll({ page: NaN, limit: NaN })
      expect(orderModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 20, offset: 0 }),
      )
    })

    it('utilise page/limit quand ils sont fournis', async () => {
      await repo.findAll({ page: 2, limit: 10 })
      expect(orderModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 10, offset: 10 }),
      )
    })

    it('plafonne limit à 100', async () => {
      await repo.findAll({ limit: 500 })
      expect(orderModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 100 }),
      )
    })

    it('filtre par statut uniquement si fourni', async () => {
      await repo.findAll({ status: 'confirmed' })
      expect(orderModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: { status: 'confirmed' } }),
      )
    })

    it('pas de filtre de statut si non fourni', async () => {
      await repo.findAll({})
      expect(orderModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: {} }),
      )
    })
  })

  describe('findById', () => {
    it('retourne la commande avec ses items', async () => {
      const result = await repo.findById(1)
      expect(orderModel.findByPk).toHaveBeenCalledWith(1, expect.objectContaining({ include: [OrderItem] }))
      expect(result).toBeDefined()
    })

    it('retourne null si introuvable', async () => {
      orderModel.findByPk.mockResolvedValue(null)
      expect(await repo.findById(99)).toBeNull()
    })
  })

  describe('findByUserId', () => {
    it('retourne les commandes de l\'utilisateur', async () => {
      const result = await repo.findByUserId(1)
      expect(orderModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId: 1 } }),
      )
      expect(result).toHaveLength(1)
    })
  })

  describe('findByOrderNumber', () => {
    it('retourne la commande par numéro', async () => {
      const result = await repo.findByOrderNumber('CI-ORD-20260101-0001')
      expect(orderModel.findOne).toHaveBeenCalledWith(
        expect.objectContaining({ where: { orderNumber: 'CI-ORD-20260101-0001' } }),
      )
      expect(result).toBeDefined()
    })
  })

  describe('findByPaymentIntentId', () => {
    it('recherche par stripePaymentIntentId', async () => {
      await repo.findByPaymentIntentId('pi_test')
      expect(orderModel.findOne).toHaveBeenCalledWith(
        expect.objectContaining({ where: { stripePaymentIntentId: 'pi_test' } }),
      )
    })
  })

  describe('update', () => {
    it('met à jour la commande par id', async () => {
      await repo.update(1, { status: 'confirmed' }, mockTransaction)
      expect(orderModel.update).toHaveBeenCalledWith(
        { status: 'confirmed' },
        expect.objectContaining({ where: { id: 1 }, transaction: mockTransaction }),
      )
    })
  })

  describe('create', () => {
    it('crée une commande et met à jour le numéro CI-ORD-...', async () => {
      await repo.create({ userId: 1, totalAmount: 390, shippingAddress: { city: 'LUISANT' } } as any, mockTransaction)
      expect(orderModel.create).toHaveBeenCalledWith(
        expect.objectContaining({ userId: 1, totalAmount: 390, status: 'payment_pending' }),
        { transaction: mockTransaction },
      )
      expect(mockOrder.update).toHaveBeenCalledWith(
        expect.objectContaining({ orderNumber: expect.stringMatching(/^CI-ORD-/) }),
        { transaction: mockTransaction },
      )
    })
  })

  describe('createItems', () => {
    it('insère les items en bulk', async () => {
      const items = [{ orderId: 1, productId: 1, variantId: null, quantity: 2, unitPrice: 390, format: null, productName: 'X' }]
      await repo.createItems(items as any, mockTransaction)
      expect(itemModel.bulkCreate).toHaveBeenCalledWith(items, { transaction: mockTransaction })
    })
  })
})
