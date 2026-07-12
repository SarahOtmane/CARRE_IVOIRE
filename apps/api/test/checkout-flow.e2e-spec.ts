import type { INestApplication } from '@nestjs/common'
import { getModelToken } from '@nestjs/sequelize'
import request from 'supertest'
import { createTestApp } from './setup-app'
import { StripeService } from '@/modules/orders/stripe.service'
import { User } from '@/modules/users/users.model'
import { Category } from '@/modules/categories/category.model'
import { Product } from '@/modules/products/product.model'
import { Order } from '@/modules/orders/order.model'
import { OrderItem } from '@/modules/orders/order-item.model'

describe('Tunnel de commande (e2e)', () => {
  let app: INestApplication
  const runId = Date.now()
  const email = `checkout-${runId}@example.com`
  const password = 'MotDePasse123!'
  const categorySlug = `categorie-e2e-${runId}`
  const productSlug = `produit-e2e-${runId}`
  const initialStock = 10
  const orderQuantity = 3

  let categoryId: number
  let productId: number

  // Le paiement réel n'est jamais exercé en e2e — on mocke uniquement la sortie réseau
  // vers Stripe, tout le reste (stock, transaction, format de réponse) passe par le vrai code.
  const fakeStripeService = {
    createPaymentIntent: jest.fn().mockResolvedValue({
      id: 'pi_e2e_test',
      client_secret: 'cs_e2e_test',
    }),
  }

  beforeAll(async () => {
    app = await createTestApp((builder) => {
      builder.overrideProvider(StripeService).useValue(fakeStripeService)
    })

    const categoryModel = app.get<typeof Category>(getModelToken(Category))
    const productModel = app.get<typeof Product>(getModelToken(Product))

    const category = await categoryModel.create({
      name: 'Catégorie E2E',
      slug: categorySlug,
      displayOrder: 0,
      isActive: 1,
    } as any)
    categoryId = category.id

    const product = await productModel.create({
      name: 'Produit E2E',
      slug: productSlug,
      price: 390,
      categoryId,
      stock: initialStock,
      stockStatus: 'in_stock',
      isActive: 1,
      isSeasonal: 0,
      displayOrder: 0,
    } as any)
    productId = product.id
  })

  afterAll(async () => {
    // Respecter l'ordre des contraintes FK : order_items → orders → user/product → category
    const userModel = app.get<typeof User>(getModelToken(User))
    const productModel = app.get<typeof Product>(getModelToken(Product))
    const categoryModel = app.get<typeof Category>(getModelToken(Category))
    const orderModel = app.get<typeof Order>(getModelToken(Order))
    const orderItemModel = app.get<typeof OrderItem>(getModelToken(OrderItem))

    const user = await userModel.findOne({ where: { email } })
    if (user) {
      const orders = await orderModel.findAll({ where: { userId: user.id } })
      const orderIds = orders.map((o) => o.id)
      if (orderIds.length > 0) {
        await orderItemModel.destroy({ where: { orderId: orderIds } })
        await orderModel.destroy({ where: { id: orderIds } })
      }
      await userModel.destroy({ where: { email } })
    }
    await productModel.destroy({ where: { id: productId } })
    await categoryModel.destroy({ where: { id: categoryId } })
    await app.close()
  })

  async function registerAndLogin(): Promise<string> {
    await request(app.getHttpServer()).post('/api/v1/auth/register').send({
      email,
      password,
      firstName: 'Test',
      lastName: 'E2E',
    })
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email, password })
    return res.body.data.accessToken
  }

  it('inscription → connexion → commande → décrément réel du stock en base', async () => {
    const token = await registerAndLogin()

    const res = await request(app.getHttpServer())
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        items: [{ productId, quantity: orderQuantity }],
        shippingAddress: {
          firstName: 'Test',
          lastName: 'E2E',
          line1: '1 rue du Cacao',
          postalCode: '75001',
          city: 'LUISANT',
          country: 'France',
        },
      })

    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({
      success: true,
      data: {
        status: 'payment_pending',
        clientSecret: 'cs_e2e_test',
        totalAmount: 390 * orderQuantity,
      },
    })
    expect(fakeStripeService.createPaymentIntent).toHaveBeenCalledWith(390 * orderQuantity, res.body.data.orderId)

    const productModel = app.get<typeof Product>(getModelToken(Product))
    const updatedProduct = await productModel.findByPk(productId)
    expect(updatedProduct!.stock).toBe(initialStock - orderQuantity)
  })

  it('rejette la commande avec OUT_OF_STOCK si la quantité dépasse le stock disponible', async () => {
    const token = await registerAndLogin()

    const res = await request(app.getHttpServer())
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        items: [{ productId, quantity: 1000 }],
        shippingAddress: {
          firstName: 'Test',
          lastName: 'E2E',
          line1: '1 rue du Cacao',
          postalCode: '75001',
          city: 'LUISANT',
          country: 'France',
        },
      })

    expect(res.status).toBe(409)
    expect(res.body).toMatchObject({ success: false, error: { code: 'OUT_OF_STOCK' } })
  })
})
