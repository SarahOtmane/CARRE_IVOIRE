import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Order } from './order.model'
import { OrderItem } from './order-item.model'
import { Product } from '@/modules/products/product.model'
import { OrdersRepository } from './orders.repository'
import { OrdersService } from './orders.service'
import { OrdersController } from './orders.controller'
import { StripeService } from './stripe.service'
import { StripeController } from './stripe.controller'

@Module({
  imports: [SequelizeModule.forFeature([Order, OrderItem, Product])],
  providers: [OrdersRepository, OrdersService, StripeService],
  controllers: [OrdersController, StripeController],
  exports: [OrdersService],
})
export class OrdersModule {}
