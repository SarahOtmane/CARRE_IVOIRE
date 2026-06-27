import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Order } from './order.model'
import { OrderItem } from './order-item.model'
import { StripeWebhookEvent } from './stripe-webhook-event.model'
import { ProductsModule } from '@/modules/products/products.module'
import { Product } from '@/modules/products/product.model'
import { ProductVariant } from '@/modules/products/product-variant.model'
import { OrdersRepository } from './orders.repository'
import { OrdersService } from './orders.service'
import { OrdersController } from './orders.controller'
import { StripeService } from './stripe.service'
import { StripeController } from './stripe.controller'
import { StripeWebhookEventsRepository } from './stripe-webhook-events.repository'
import { UsersModule } from '@/modules/users/users.module'
import { SettingsModule } from '@/modules/settings/settings.module'

@Module({
  imports: [SequelizeModule.forFeature([Order, OrderItem, StripeWebhookEvent, Product, ProductVariant]), ProductsModule, UsersModule, SettingsModule],
  providers: [OrdersRepository, OrdersService, StripeService, StripeWebhookEventsRepository],
  controllers: [OrdersController, StripeController],
  exports: [OrdersService],
})
export class OrdersModule { }
