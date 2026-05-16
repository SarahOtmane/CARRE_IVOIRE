import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Product } from './product.model'
import { Category } from '@/modules/categories/category.model'
import { ProductsRepository } from './products.repository'
import { ProductsService } from './products.service'
import { ProductsController } from './products.controller'

@Module({
  imports: [SequelizeModule.forFeature([Product, Category])],
  providers: [ProductsRepository, ProductsService],
  controllers: [ProductsController],
  exports: [ProductsRepository, ProductsService],
})
export class ProductsModule {}
