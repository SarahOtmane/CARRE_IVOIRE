import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/sequelize'
import { Sequelize } from 'sequelize-typescript'
import { Op } from 'sequelize'
import { Product } from '@/modules/products/product.model'
import { OrdersRepository } from './orders.repository'
import { StripeService } from './stripe.service'
import type { Order } from './order.model'
import type { OrderItem } from './order-item.model'
import type { CreateOrderDto } from './dto/create-order.dto'
import type { UpdateOrderStatusDto } from './dto/update-order-status.dto'
import type { OrderResponseDto, OrderCreatedResponseDto } from './dto/order-response.dto'

@Injectable()
export class OrdersService {
  constructor(
    @InjectConnection() private readonly sequelize: Sequelize,
    @InjectModel(Product) private readonly productModel: typeof Product,
    private readonly ordersRepository: OrdersRepository,
    private readonly stripeService: StripeService,
  ) {}

  async createOrder(dto: CreateOrderDto, userId: number): Promise<OrderCreatedResponseDto> {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException({ code: 'CART_EMPTY', message: 'Le panier est vide' })
    }

    return this.sequelize.transaction(async (t) => {
      // 1. Décrémenter le stock atomiquement — rowsAffected === 0 → rollback
      for (const item of dto.items) {
        const [rowsAffected] = await this.productModel.update(
          { stock: Sequelize.literal(`stock - ${item.quantity}`) } as any,
          {
            where: {
              id: item.productId,
              stock: { [Op.gte]: item.quantity },
              isActive: 1,
            },
            transaction: t,
          },
        )

        if (rowsAffected === 0) {
          throw new ConflictException({
            code: 'OUT_OF_STOCK',
            message: `Stock insuffisant pour le produit ${item.productId}`,
          })
        }
      }

      // 2. Relire les prix depuis la BDD — jamais depuis le client
      const products = await this.productModel.findAll({
        where: { id: dto.items.map((i) => i.productId) },
        transaction: t,
      })

      for (const item of dto.items) {
        if (!products.find((p) => p.id === item.productId)) {
          throw new NotFoundException({
            code: 'PRODUCT_NOT_FOUND',
            message: `Produit ${item.productId} introuvable`,
          })
        }
      }

      const totalAmount = dto.items.reduce((acc, item) => {
        const product = products.find((p) => p.id === item.productId)!
        return acc + product.price * item.quantity
      }, 0)

      // 3. Créer la commande
      const order = await this.ordersRepository.create(
        { userId, totalAmount, shippingAddress: dto.shippingAddress },
        t,
      )

      // 4. Créer les order_items (snapshot du prix et du nom)
      await this.ordersRepository.createItems(
        dto.items.map((item) => {
          const product = products.find((p) => p.id === item.productId)!
          return {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: product.price,
            format: item.format ?? null,
            productName: product.name,
          }
        }),
        t,
      )

      // 5. PaymentIntent Stripe — si Stripe échoue, la transaction rollback
      const paymentIntent = await this.stripeService.createPaymentIntent(totalAmount, order.id)
      await this.ordersRepository.update(order.id, { stripePaymentIntentId: paymentIntent.id }, t)

      return {
        orderId: order.id,
        status: 'payment_pending',
        clientSecret: paymentIntent.client_secret,
        totalAmount,
      }
    })
  }

  async findUserOrders(userId: number): Promise<OrderResponseDto[]> {
    const orders = await this.ordersRepository.findByUserId(userId)
    return orders.map((o) => this.toResponseDto(o))
  }

  async findById(id: number, userId: number, isAdmin: boolean): Promise<OrderResponseDto> {
    const order = await this.ordersRepository.findById(id)
    if (!order) throw new NotFoundException({ code: 'ORDER_NOT_FOUND', message: 'Commande introuvable' })
    if (!isAdmin && order.userId !== userId) {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Accès refusé' })
    }
    return this.toResponseDto(order)
  }

  async findAll(query: { status?: string; page?: number; limit?: number }): Promise<{ items: OrderResponseDto[]; total: number }> {
    const { rows, count } = await this.ordersRepository.findAll(query)
    return { items: rows.map((o) => this.toResponseDto(o)), total: count }
  }

  async updateStatus(id: number, dto: UpdateOrderStatusDto): Promise<OrderResponseDto> {
    const order = await this.ordersRepository.findById(id)
    if (!order) throw new NotFoundException({ code: 'ORDER_NOT_FOUND', message: 'Commande introuvable' })
    await this.ordersRepository.update(id, { status: dto.status })
    const updated = await this.ordersRepository.findById(id)
    return this.toResponseDto(updated!)
  }

  async confirmByPaymentIntent(paymentIntentId: string): Promise<void> {
    const order = await this.ordersRepository.findByPaymentIntentId(paymentIntentId)
    if (order) {
      await this.ordersRepository.update(order.id, { status: 'confirmed' })
    }
  }

  private toResponseDto(order: Order): OrderResponseDto {
    return {
      id: order.id,
      userId: order.userId,
      status: order.status,
      totalAmount: order.totalAmount,
      shippingAddress: order.shippingAddress ?? undefined,
      stripePaymentIntentId: order.stripePaymentIntentId ?? undefined,
      items: ((order.items ?? []) as OrderItem[]).map((item) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        format: item.format ?? undefined,
      })),
      createdAt: order.created_at?.toISOString(),
      updatedAt: order.updated_at?.toISOString(),
    }
  }
}
