import { Test } from '@nestjs/testing'
import { getConnectionToken } from '@nestjs/sequelize'
import { OrdersService } from './orders.service'
import { OrdersRepository } from './orders.repository'
import { ProductsRepository } from '@/modules/products/products.repository'
import { ProductVariantsRepository } from '@/modules/products/product-variants.repository'
import { StripeService } from './stripe.service'
import { MailService } from '@/modules/mail/mail.service'
import { UsersRepository } from '@/modules/users/users.repository'

const mockTransaction = { commit: jest.fn(), rollback: jest.fn() }
const mockSequelize = { transaction: jest.fn((cb) => cb(mockTransaction)) }

const mockProduct = { id: 1, name: 'Carré Noir', price: 390, stock: 100, isActive: 1 }
const mockOrder = { id: 1, userId: 1, totalAmount: 390, status: 'payment_pending', items: [] }
const mockUser = { id: 1, email: 'test@example.com', first_name: 'Jean' }

describe('OrdersService', () => {
  let service: OrdersService
  let ordersRepo: jest.Mocked<OrdersRepository>
  let productsRepo: jest.Mocked<ProductsRepository>
  let variantsRepo: jest.Mocked<ProductVariantsRepository>
  let stripeService: jest.Mocked<StripeService>

  beforeEach(async () => {
    mockTransaction.commit.mockClear()
    mockTransaction.rollback.mockClear()
    mockSequelize.transaction.mockImplementation((cb) => cb(mockTransaction))

    const module = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getConnectionToken(),
          useValue: mockSequelize,
        },
        {
          provide: ProductsRepository,
          useValue: {
            findAllByIds: jest.fn().mockResolvedValue([mockProduct]),
            decrementStock: jest.fn().mockResolvedValue(1),
            incrementStock: jest.fn().mockResolvedValue(undefined),
            findAllActive: jest.fn(),
          },
        },
        {
          provide: ProductVariantsRepository,
          useValue: {
            decrementStock: jest.fn().mockResolvedValue(1),
            incrementStock: jest.fn().mockResolvedValue(undefined),
            findById: jest.fn(),
          },
        },
        {
          provide: OrdersRepository,
          useValue: {
            create: jest.fn().mockResolvedValue(mockOrder),
            createItems: jest.fn().mockResolvedValue(undefined),
            update: jest.fn().mockResolvedValue(undefined),
            findById: jest.fn().mockResolvedValue({ ...mockOrder, items: [{ productId: 1, quantity: 2, unitPrice: 390, productName: 'Carré Noir' }] }),
            findByUserId: jest.fn(),
            findByPaymentIntentId: jest.fn(),
            findAll: jest.fn(),
          },
        },
        {
          provide: StripeService,
          useValue: {
            createPaymentIntent: jest.fn().mockResolvedValue({ id: 'pi_test', client_secret: 'cs_test' }),
          },
        },
        {
          provide: MailService,
          useValue: { sendOrderConfirmation: jest.fn().mockResolvedValue(undefined) },
        },
        {
          provide: UsersRepository,
          useValue: { findById: jest.fn().mockResolvedValue(mockUser) },
        },
      ],
    }).compile()

    service = module.get(OrdersService)
    ordersRepo = module.get(OrdersRepository)
    productsRepo = module.get(ProductsRepository)
    variantsRepo = module.get(ProductVariantsRepository)
    stripeService = module.get(StripeService)
  })

  describe('createOrder', () => {
    const dto = { items: [{ productId: 1, quantity: 2 }], shippingAddress: { city: 'Paris' } }

    it('crée la commande si le stock est suffisant', async () => {
      const result = await service.createOrder(dto as any, 1)
      expect(result.orderId).toBe(1)
      expect(result.totalAmount).toBe(390 * 2)
      expect(result.clientSecret).toBe('cs_test')
      expect(productsRepo.decrementStock).toHaveBeenCalledWith(1, 2, mockTransaction)
    })

    it('lève OUT_OF_STOCK si rowsAffected === 0', async () => {
      productsRepo.decrementStock.mockResolvedValue(0)
      await expect(service.createOrder(dto as any, 1)).rejects.toMatchObject({
        response: expect.objectContaining({ code: 'OUT_OF_STOCK' }),
      })
    })

    it('lève CART_EMPTY si le panier est vide', async () => {
      await expect(service.createOrder({ items: [], shippingAddress: {} } as any, 1)).rejects.toMatchObject({
        response: expect.objectContaining({ code: 'CART_EMPTY' }),
      })
    })

    it('calcule le prix depuis la BDD et non depuis le client', async () => {
      const dtoWithFakePrice = { items: [{ productId: 1, quantity: 1, unitPrice: 1 }], shippingAddress: {} }
      const result = await service.createOrder(dtoWithFakePrice as any, 1)
      expect(result.totalAmount).toBe(390) // prix BDD, pas 1
    })

    it('libère le stock réservé et annule la commande si Stripe échoue (compensation hors transaction)', async () => {
      stripeService.createPaymentIntent.mockRejectedValue(new Error('stripe down'))
      await expect(service.createOrder(dto as any, 1)).rejects.toThrow('stripe down')
      expect(productsRepo.incrementStock).toHaveBeenCalledWith(1, 2, mockTransaction)
      expect(ordersRepo.update).toHaveBeenCalledWith(1, { status: 'cancelled' }, mockTransaction)
    })
  })

  describe('cancelByPaymentIntent', () => {
    it('réincremente le stock et passe en cancelled', async () => {
      ordersRepo.findByPaymentIntentId.mockResolvedValue(mockOrder as any)
      await service.cancelByPaymentIntent('pi_failed')
      expect(productsRepo.incrementStock).toHaveBeenCalledWith(1, 2, mockTransaction)
      expect(ordersRepo.update).toHaveBeenCalledWith(1, { status: 'cancelled' }, mockTransaction)
    })

    it('ne fait rien si le payment intent est inconnu', async () => {
      ordersRepo.findByPaymentIntentId.mockResolvedValue(null)
      await expect(service.cancelByPaymentIntent('pi_unknown')).resolves.toBeUndefined()
      expect(productsRepo.incrementStock).not.toHaveBeenCalled()
    })
  })

  describe('confirmByPaymentIntent', () => {
    it('passe la commande en confirmed', async () => {
      ordersRepo.findByPaymentIntentId.mockResolvedValue(mockOrder as any)
      await service.confirmByPaymentIntent('pi_success')
      expect(ordersRepo.update).toHaveBeenCalledWith(1, { status: 'confirmed' })
    })
  })
})
