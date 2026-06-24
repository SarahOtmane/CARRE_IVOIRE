import { Test } from '@nestjs/testing'
import { getModelToken } from '@nestjs/sequelize'
import { OrdersRepository } from './orders.repository'
import { Order } from './order.model'
import { OrderItem } from './order-item.model'

describe('OrdersRepository', () => {
  let repo: OrdersRepository
  let model: { findAndCountAll: jest.Mock }

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        OrdersRepository,
        {
          provide: getModelToken(Order),
          useValue: { findAndCountAll: jest.fn().mockResolvedValue({ rows: [], count: 0 }) },
        },
        {
          provide: getModelToken(OrderItem),
          useValue: {},
        },
      ],
    }).compile()

    repo = module.get(OrdersRepository)
    model = module.get(getModelToken(Order))
  })

  describe('findAll', () => {
    // Régression : NestJS convertit un @Query() numérique absent en NaN (Number(undefined)),
    // pas en undefined — `?? valeur` ne rattrape pas NaN, ce qui produisait un
    // `LIMIT NaN, NaN` (500) sur GET /orders sans page/limit (détecté par TEST-003 e2e).
    it('retombe sur les valeurs par défaut si page/limit sont NaN (query param absent)', async () => {
      await repo.findAll({ page: NaN, limit: NaN })
      expect(model.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 20, offset: 0 }),
      )
    })

    it('utilise page/limit quand ils sont fournis', async () => {
      await repo.findAll({ page: 2, limit: 10 })
      expect(model.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 10, offset: 10 }),
      )
    })

    it('plafonne limit à 100', async () => {
      await repo.findAll({ limit: 500 })
      expect(model.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 100 }),
      )
    })

    it('filtre par statut uniquement si fourni', async () => {
      await repo.findAll({ status: 'confirmed' })
      expect(model.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: { status: 'confirmed' } }),
      )
    })
  })
})
