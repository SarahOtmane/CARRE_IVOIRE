import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import type { Transaction } from 'sequelize'
import { Order } from './order.model'
import { OrderItem } from './order-item.model'

interface CreateOrderData {
  userId: number
  totalAmount: number
  shippingAddress: object
}

interface CreateOrderItemData {
  orderId: number
  productId: number
  quantity: number
  unitPrice: number
  format: string | null
  productName: string
}

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectModel(Order) private readonly orderDb: typeof Order,
    @InjectModel(OrderItem) private readonly orderItemDb: typeof OrderItem,
  ) {}

  async create(data: CreateOrderData, t?: Transaction): Promise<Order> {
    const address = data.shippingAddress as Record<string, string>
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Sequelize v6 Model<M> requires all fields incl. id/timestamps
    const order = await this.orderDb.create(
      {
        userId: data.userId,
        status: 'payment_pending',
        totalAmount: data.totalAmount,
        shippingAddress: data.shippingAddress,
        orderNumber: `TEMP-${Date.now()}`,
        addressStreet: address.line1 ?? '',
        addressCity: address.city ?? '',
        addressZip: address.postalCode ?? '',
        addressCountry: address.country ?? 'France',
      } as any,
      { transaction: t },
    )

    const orderNumber = `CI-ORD-${dateStr}-${String(order.id).padStart(4, '0')}`
    await order.update({ orderNumber }, { transaction: t })
    return order
  }

  async createItems(items: CreateOrderItemData[], t?: Transaction): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Sequelize v6 bulkCreate accepts InferCreationAttributes; plain object array needs cast
    await this.orderItemDb.bulkCreate(items as any, { transaction: t })
  }

  async update(id: number, data: Partial<{ status: string; stripePaymentIntentId: string }>, t?: Transaction): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Record<string,unknown> incompatible with Sequelize update attributes type
    await this.orderDb.update(data as any, { where: { id }, transaction: t })
  }

  async findById(id: number): Promise<Order | null> {
    return this.orderDb.findByPk(id, { include: [OrderItem] })
  }

  async findByUserId(userId: number): Promise<Order[]> {
    return this.orderDb.findAll({
      where: { userId },
      include: [OrderItem],
      order: [['created_at', 'DESC']],
    })
  }

  async findByPaymentIntentId(paymentIntentId: string): Promise<Order | null> {
    return this.orderDb.findOne({ where: { stripePaymentIntentId: paymentIntentId } })
  }

  async findAll(query: { status?: string; page?: number; limit?: number }): Promise<{ rows: Order[]; count: number }> {
    const where: Record<string, unknown> = {}
    if (query.status) where.status = query.status

    const limit = Math.min(query.limit ?? 20, 100)
    const page = query.page ?? 1

    return this.orderDb.findAndCountAll({
      where,
      include: [OrderItem],
      limit,
      offset: (page - 1) * limit,
      order: [['created_at', 'DESC']],
      distinct: true,
    })
  }
}
