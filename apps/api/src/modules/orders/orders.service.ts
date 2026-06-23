import { Injectable } from '@nestjs/common'
import { InjectConnection } from '@nestjs/sequelize'
import { Sequelize } from 'sequelize-typescript'
import { ErrorCodes } from '@/common/constants'
import throwApiError from '@/common/errors/throw-api-error'
import type { ProductVariant } from '@/modules/products/product-variant.model'
import { ProductsRepository } from '@/modules/products/products.repository'
import { ProductVariantsRepository } from '@/modules/products/product-variants.repository'
import { OrdersRepository } from './orders.repository'
import { StripeService } from './stripe.service'
import { MailService } from '@/modules/mail/mail.service'
import { UsersRepository } from '@/modules/users/users.repository'
import type { Order } from './order.model'
import type { OrderItem } from './order-item.model'
import type { CreateOrderDto } from './dto/create-order.dto'
import type { UpdateOrderStatusDto } from './dto/update-order-status.dto'
import type { OrderResponseDto, OrderCreatedResponseDto } from './dto/order-response.dto'

@Injectable()
export class OrdersService {
  constructor(
    @InjectConnection() private readonly sequelize: Sequelize,
    private readonly productsRepository: ProductsRepository,
    private readonly productVariantsRepository: ProductVariantsRepository,
    private readonly ordersRepository: OrdersRepository,
    private readonly stripeService: StripeService,
    private readonly mailService: MailService,
    private readonly usersRepository: UsersRepository,
  ) { }

  async createOrder(dto: CreateOrderDto, userId: number): Promise<OrderCreatedResponseDto> {
    if (!dto.items || dto.items.length === 0) {
      throwApiError(ErrorCodes.CART_EMPTY, 'Le panier est vide')
    }

    // 1. Réservation atomique du stock + création de la commande (statut payment_pending),
    //    dans une transaction courte qui ne contient aucun appel réseau externe.
    const { order, totalAmount } = await this.sequelize.transaction(async (t) => {
      const variantsById = new Map<number, ProductVariant>()

      for (const item of dto.items) {
        if (item.variantId) {
          const rowsAffected = await this.productVariantsRepository.decrementStock(
            item.variantId,
            item.productId,
            item.quantity,
            t,
          )
          if (rowsAffected === 0) {
            throwApiError(ErrorCodes.VARIANT_OUT_OF_STOCK, `Stock insuffisant pour la variante ${item.variantId}`)
          }

          const variant = await this.productVariantsRepository.findById(item.variantId, t)
          if (!variant) {
            throwApiError(ErrorCodes.VARIANT_OUT_OF_STOCK, `Variante ${item.variantId} introuvable`)
          }
          variantsById.set(item.variantId, variant)
          continue
        }

        const rowsAffected = await this.productsRepository.decrementStock(item.productId, item.quantity, t)
        if (rowsAffected === 0) {
          throwApiError(ErrorCodes.OUT_OF_STOCK, `Stock insuffisant pour le produit ${item.productId}`)
        }
      }

      // Relire les prix depuis la BDD — jamais depuis le client
      const products = await this.productsRepository.findAllByIds(
        dto.items.map((i) => i.productId),
        t,
      )

      for (const item of dto.items) {
        if (!products.find((p) => p.id === item.productId)) {
          throwApiError(ErrorCodes.PRODUCT_NOT_FOUND, `Produit ${item.productId} introuvable`)
        }
      }

      const totalAmount = dto.items.reduce((acc, item) => {
        const variant = item.variantId ? variantsById.get(item.variantId) : undefined
        if (variant) return acc + variant.price * item.quantity
        const product = products.find((p) => p.id === item.productId)
        if (!product) return acc
        return acc + product.price * item.quantity
      }, 0)

      const order = await this.ordersRepository.create(
        { userId, totalAmount, shippingAddress: dto.shippingAddress },
        t,
      )

      await this.ordersRepository.createItems(
        dto.items.map((item) => {
          const product = products.find((p) => p.id === item.productId)
          if (!product) {
            throwApiError(ErrorCodes.PRODUCT_NOT_FOUND, `Produit ${item.productId} introuvable`)
          }
          const variant = item.variantId ? variantsById.get(item.variantId) : undefined
          return {
            orderId: order.id,
            productId: item.productId,
            variantId: item.variantId ?? null,
            quantity: item.quantity,
            unitPrice: variant ? variant.price : product.price,
            format: variant ? variant.label : item.format ?? null,
            productName: product.name,
          }
        }),
        t,
      )

      return { order, totalAmount }
    })

    // 2. PaymentIntent Stripe — hors transaction DB. En cas d'échec, on compense
    //    en libérant le stock réservé plutôt que de tenir les verrous DB pendant l'appel réseau.
    try {
      const paymentIntent = await this.stripeService.createPaymentIntent(totalAmount, order.id)
      await this.ordersRepository.update(order.id, { stripePaymentIntentId: paymentIntent.id })

      return {
        orderId: order.id,
        status: 'payment_pending',
        clientSecret: paymentIntent.client_secret,
        totalAmount,
      }
    } catch (error) {
      await this.releaseStockAndCancel(order.id, dto.items)
      throw error
    }
  }

  private async releaseStockAndCancel(
    orderId: number,
    items: CreateOrderDto['items'],
  ): Promise<void> {
    await this.sequelize.transaction(async (t) => {
      for (const item of items) {
        if (item.variantId) {
          await this.productVariantsRepository.incrementStock(item.variantId, item.quantity, t)
        } else {
          await this.productsRepository.incrementStock(item.productId, item.quantity, t)
        }
      }
      await this.ordersRepository.update(orderId, { status: 'cancelled' }, t)
    })
  }

  async findUserOrders(userId: number): Promise<OrderResponseDto[]> {
    const orders = await this.ordersRepository.findByUserId(userId)
    return orders.map((o) => this.toResponseDto(o))
  }

  async findById(id: number, userId: number, isAdmin: boolean): Promise<OrderResponseDto> {
    const order = await this.ordersRepository.findById(id)
    if (!order) throwApiError(ErrorCodes.ORDER_NOT_FOUND, 'Commande introuvable')
    if (!isAdmin && order.userId !== userId) {
      throwApiError(ErrorCodes.FORBIDDEN, 'Accès refusé')
    }
    return this.toResponseDto(order)
  }

  async findAll(query: { status?: string; page?: number; limit?: number }): Promise<{ items: OrderResponseDto[]; total: number }> {
    const { rows, count } = await this.ordersRepository.findAll(query)
    return { items: rows.map((o) => this.toResponseDto(o)), total: count }
  }

  async updateStatus(id: number, dto: UpdateOrderStatusDto): Promise<OrderResponseDto> {
    const order = await this.ordersRepository.findById(id)
    if (!order) throwApiError(ErrorCodes.ORDER_NOT_FOUND, 'Commande introuvable')
    await this.ordersRepository.update(id, { status: dto.status })
    const updated = await this.ordersRepository.findById(id)
    return this.toResponseDto(updated!)
  }

  async confirmByPaymentIntent(paymentIntentId: string): Promise<void> {
    const order = await this.ordersRepository.findByPaymentIntentId(paymentIntentId)
    if (!order) return

    await this.ordersRepository.update(order.id, { status: 'confirmed' })

    const fullOrder = await this.ordersRepository.findById(order.id)
    const user = await this.usersRepository.findById(order.userId)
    if (fullOrder && user) {
      this.mailService.sendOrderConfirmation({
        to: user.email,
        firstName: user.first_name,
        orderNumber: (fullOrder as any).orderNumber ?? `#${fullOrder.id}`,
        totalAmount: fullOrder.totalAmount,
        items: ((fullOrder.items ?? []) as OrderItem[]).map((item) => ({
          productName: (item as any).productName ?? `Produit ${item.productId}`,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      }).catch(() => { /* ne jamais bloquer sur un échec email */ })
    }
  }

  async cancelByPaymentIntent(paymentIntentId: string): Promise<void> {
    const order = await this.ordersRepository.findByPaymentIntentId(paymentIntentId)
    if (!order) return

    const fullOrder = await this.ordersRepository.findById(order.id)
    if (!fullOrder) return

    await this.sequelize.transaction(async (t) => {
      for (const item of (fullOrder.items ?? []) as OrderItem[]) {
        if (item.variantId) {
          await this.productVariantsRepository.incrementStock(item.variantId, item.quantity, t)
        } else {
          await this.productsRepository.incrementStock(item.productId, item.quantity, t)
        }
      }
      await this.ordersRepository.update(order.id, { status: 'cancelled' }, t)
    })
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
        variantId: item.variantId ?? undefined,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        format: item.format ?? undefined,
      })),
      createdAt: order.created_at?.toISOString(),
      updatedAt: order.updated_at?.toISOString(),
    }
  }
}
