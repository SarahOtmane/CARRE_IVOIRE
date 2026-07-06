import { Test } from '@nestjs/testing'
import { getConnectionToken } from '@nestjs/sequelize'
import { OrdersService } from './orders.service'
import { OrdersRepository } from './orders.repository'
import { ProductsRepository } from '@/modules/products/products.repository'
import { ProductVariantsRepository } from '@/modules/products/product-variants.repository'
import { StripeService } from './stripe.service'
import { MailService } from '@/modules/mail/mail.service'
import { UsersRepository } from '@/modules/users/users.repository'
import { SettingsService } from '@/modules/settings/settings.service'

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
            findByProductId: jest.fn().mockResolvedValue([]),
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
            findByOrderNumber: jest.fn(),
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
        {
          provide: SettingsService,
          useValue: {
            getAll: jest.fn().mockResolvedValue({ shippingFlat: 0, shippingFreeFrom: 0, bccEmail: '', address: '' }),
          },
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

    it('lève VARIANT_REQUIRED si le produit a des variantes actives et aucun variantId fourni', async () => {
      variantsRepo.findByProductId.mockResolvedValue([{ id: 10, productId: 1, isActive: 1 } as any])
      await expect(service.createOrder(dto as any, 1)).rejects.toMatchObject({
        response: expect.objectContaining({ code: 'VARIANT_REQUIRED' }),
      })
      expect(productsRepo.decrementStock).not.toHaveBeenCalled()
    })

    it("ne déclenche pas VARIANT_REQUIRED pour un produit sans variante", async () => {
      variantsRepo.findByProductId.mockResolvedValue([])
      const result = await service.createOrder(dto as any, 1)
      expect(result.orderId).toBe(1)
    })

    it('libère le stock réservé et annule la commande si Stripe échoue (compensation hors transaction)', async () => {
      stripeService.createPaymentIntent.mockRejectedValue(new Error('stripe down'))
      await expect(service.createOrder(dto as any, 1)).rejects.toThrow('stripe down')
      expect(productsRepo.incrementStock).toHaveBeenCalledWith(1, 2, mockTransaction)
      expect(ordersRepo.update).toHaveBeenCalledWith(1, { status: 'cancelled' }, mockTransaction)
    })

    it('lève PRODUCT_NOT_FOUND si findAllByIds ne retourne pas le produit demandé', async () => {
      productsRepo.findAllByIds.mockResolvedValueOnce([])
      const dtoMissing = { items: [{ productId: 99, quantity: 1 }], shippingAddress: {} }
      await expect(service.createOrder(dtoMissing as any, 1)).rejects.toMatchObject({
        response: expect.objectContaining({ code: 'PRODUCT_NOT_FOUND' }),
      })
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

    it('réincremente le stock de la variante si les items ont un variantId', async () => {
      const orderWithVariant = { ...mockOrder, items: [{ productId: 1, variantId: 10, quantity: 1, unitPrice: 390 }] }
      ordersRepo.findByPaymentIntentId.mockResolvedValue(mockOrder as any)
      ordersRepo.findById.mockResolvedValue(orderWithVariant as any)
      await service.cancelByPaymentIntent('pi_variant')
      expect(variantsRepo.incrementStock).toHaveBeenCalledWith(10, 1, mockTransaction)
    })

    it('ne fait rien si fullOrder introuvable', async () => {
      ordersRepo.findByPaymentIntentId.mockResolvedValue(mockOrder as any)
      ordersRepo.findById.mockResolvedValue(null)
      await expect(service.cancelByPaymentIntent('pi_x')).resolves.toBeUndefined()
    })
  })

  describe('confirmByPaymentIntent', () => {
    it('passe la commande en confirmed', async () => {
      ordersRepo.findByPaymentIntentId.mockResolvedValue(mockOrder as any)
      await service.confirmByPaymentIntent('pi_success')
      expect(ordersRepo.update).toHaveBeenCalledWith(1, { status: 'confirmed' })
    })

    it('ne fait rien si le payment intent est inconnu', async () => {
      ordersRepo.findByPaymentIntentId.mockResolvedValue(null)
      await expect(service.confirmByPaymentIntent('pi_unknown')).resolves.toBeUndefined()
    })
  })

  describe('findUserOrders', () => {
    it('retourne les commandes mappées en DTO', async () => {
      ordersRepo.findByUserId.mockResolvedValue([mockOrder as any])
      const result = await service.findUserOrders(1)
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe(1)
    })
  })

  describe('findById', () => {
    it('retourne la commande si l\'utilisateur en est propriétaire', async () => {
      ordersRepo.findById.mockResolvedValue({ ...mockOrder, userId: 1 } as any)
      const result = await service.findById(1, 1, false)
      expect(result.id).toBe(1)
    })

    it('lève ORDER_NOT_FOUND si la commande n\'existe pas', async () => {
      ordersRepo.findById.mockResolvedValue(null)
      await expect(service.findById(99, 1, false)).rejects.toMatchObject({
        response: expect.objectContaining({ code: 'ORDER_NOT_FOUND' }),
      })
    })

    it('lève FORBIDDEN si l\'utilisateur n\'est pas propriétaire et non admin', async () => {
      ordersRepo.findById.mockResolvedValue({ ...mockOrder, userId: 2 } as any)
      await expect(service.findById(1, 1, false)).rejects.toMatchObject({
        response: expect.objectContaining({ code: 'FORBIDDEN' }),
      })
    })

    it('permet à un admin de voir n\'importe quelle commande', async () => {
      ordersRepo.findById.mockResolvedValue({ ...mockOrder, userId: 2 } as any)
      await expect(service.findById(1, 1, true)).resolves.toBeDefined()
    })
  })

  describe('findAll', () => {
    it('retourne les commandes paginées', async () => {
      ordersRepo.findAll.mockResolvedValue({ rows: [mockOrder as any], count: 1 })
      const result = await service.findAll({})
      expect(result.total).toBe(1)
      expect(result.items).toHaveLength(1)
    })
  })

  describe('updateStatus', () => {
    it('met à jour le statut et retourne la commande mise à jour', async () => {
      ordersRepo.findById
        .mockResolvedValueOnce(mockOrder as any)
        .mockResolvedValueOnce({ ...mockOrder, status: 'shipped' } as any)
      const result = await service.updateStatus(1, { status: 'shipped' } as any)
      expect(result.status).toBe('shipped')
    })

    it('lève ORDER_NOT_FOUND si la commande n\'existe pas', async () => {
      ordersRepo.findById.mockResolvedValue(null)
      await expect(service.updateStatus(99, { status: 'shipped' } as any)).rejects.toMatchObject({
        response: expect.objectContaining({ code: 'ORDER_NOT_FOUND' }),
      })
    })
  })

  describe('findByOrderNumber', () => {
    it('retourne la commande si le numéro correspond à l\'utilisateur', async () => {
      ordersRepo.findByOrderNumber.mockResolvedValue({ ...mockOrder, userId: 1 } as any)
      const result = await service.findByOrderNumber('CI-ORD-0001', 1, false)
      expect(result.id).toBe(1)
    })

    it('lève ORDER_NOT_FOUND si le numéro est inconnu', async () => {
      ordersRepo.findByOrderNumber.mockResolvedValue(null)
      await expect(service.findByOrderNumber('INCONNUE', 1, false)).rejects.toMatchObject({
        response: expect.objectContaining({ code: 'ORDER_NOT_FOUND' }),
      })
    })

    it('lève FORBIDDEN si l\'utilisateur n\'est pas propriétaire', async () => {
      ordersRepo.findByOrderNumber.mockResolvedValue({ ...mockOrder, userId: 2 } as any)
      await expect(service.findByOrderNumber('CI-ORD-0001', 1, false)).rejects.toMatchObject({
        response: expect.objectContaining({ code: 'FORBIDDEN' }),
      })
    })

    it('permet à un admin de voir n\'importe quelle commande par numéro', async () => {
      ordersRepo.findByOrderNumber.mockResolvedValue({ ...mockOrder, userId: 2 } as any)
      await expect(service.findByOrderNumber('CI-ORD-0001', 1, true)).resolves.toBeDefined()
    })
  })

  describe('createOrder - releaseStockAndCancel avec variantId', () => {
    it('libère le stock de la variante si Stripe échoue avec un item variantId', async () => {
      variantsRepo.decrementStock.mockResolvedValue(1)
      variantsRepo.findById.mockResolvedValue({ id: 10, productId: 1, price: 390, label: '70g' } as any)
      stripeService.createPaymentIntent.mockRejectedValue(new Error('stripe down'))
      const dtoWithVariant = { items: [{ productId: 1, variantId: 10, quantity: 1 }], shippingAddress: {} }
      await expect(service.createOrder(dtoWithVariant as any, 1)).rejects.toThrow('stripe down')
      expect(variantsRepo.incrementStock).toHaveBeenCalledWith(10, 1, mockTransaction)
    })
  })

  describe('createOrder - variante', () => {
    it('décrémente le stock de la variante si variantId fourni', async () => {
      variantsRepo.decrementStock.mockResolvedValue(1)
      variantsRepo.findById.mockResolvedValue({ id: 10, productId: 1, price: 390, label: '70g' } as any)
      const dto = { items: [{ productId: 1, variantId: 10, quantity: 1 }], shippingAddress: {} }
      const result = await service.createOrder(dto as any, 1)
      expect(variantsRepo.decrementStock).toHaveBeenCalledWith(10, 1, 1, mockTransaction)
      expect(result.orderId).toBe(1)
    })

    it('lève VARIANT_OUT_OF_STOCK si la variante est en rupture', async () => {
      variantsRepo.decrementStock.mockResolvedValue(0)
      variantsRepo.findByProductId.mockResolvedValue([])
      const dto = { items: [{ productId: 1, variantId: 10, quantity: 1 }], shippingAddress: {} }
      await expect(service.createOrder(dto as any, 1)).rejects.toMatchObject({
        response: expect.objectContaining({ code: 'VARIANT_OUT_OF_STOCK' }),
      })
    })

    it('lève VARIANT_OUT_OF_STOCK si la variante est introuvable après décrémentation réussie', async () => {
      variantsRepo.decrementStock.mockResolvedValue(1)
      variantsRepo.findById.mockResolvedValue(null)
      const dto = { items: [{ productId: 1, variantId: 10, quantity: 1 }], shippingAddress: {} }
      await expect(service.createOrder(dto as any, 1)).rejects.toMatchObject({
        response: expect.objectContaining({ code: 'VARIANT_OUT_OF_STOCK' }),
      })
    })
  })

  describe('toResponseDto - branches', () => {
    it('utilise #id si orderNumber est absent', async () => {
      ordersRepo.findByUserId.mockResolvedValue([{ ...mockOrder, orderNumber: undefined, items: undefined } as any])
      const result = await service.findUserOrders(1)
      expect(result[0].orderNumber).toBe('#1')
    })

    it('gère les items undefined dans toResponseDto', async () => {
      ordersRepo.findByUserId.mockResolvedValue([{ ...mockOrder, items: null } as any])
      const result = await service.findUserOrders(1)
      expect(result[0].items).toEqual([])
    })

    it('couvre toutes les branches ?? des items dans le map callback', async () => {
      const orderWithItems = {
        ...mockOrder,
        shippingAddress: { city: 'Paris' },
        stripePaymentIntentId: 'pi_xxx',
        items: [
          { id: 1, productId: 1, productName: null, variantId: 5, quantity: 1, unitPrice: 100, format: '70g' },
          { id: 2, productId: 2, productName: 'Carré', variantId: null, quantity: 2, unitPrice: 200, format: null },
        ],
      }
      ordersRepo.findByUserId.mockResolvedValue([orderWithItems as any])
      const result = await service.findUserOrders(1)
      const items = result[0].items
      expect(items[0].variantId).toBe(5)
      expect(items[0].format).toBe('70g')
      expect(items[0].productName).toBeUndefined()
      expect(items[1].variantId).toBeUndefined()
      expect(items[1].format).toBeUndefined()
      expect(items[1].productName).toBe('Carré')
    })
  })
})
