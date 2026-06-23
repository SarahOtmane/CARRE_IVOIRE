import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Product } from './product.model'
import { ProductVariant } from './product-variant.model'
import { Category } from '@/modules/categories/category.model'
import { TaxRate } from '@/modules/tax-rates/tax-rate.model'
import { ProductsRepository } from './products.repository'
import { ProductsService } from './products.service'
import { ProductVariantsRepository } from './product-variants.repository'
import { ProductVariantsService } from './product-variants.service'
import { ProductsController } from './products.controller'

@Module({
  imports: [SequelizeModule.forFeature([Product, ProductVariant, Category, TaxRate])],
  providers: [ProductsRepository, ProductsService, ProductVariantsRepository, ProductVariantsService],
  controllers: [ProductsController],
  exports: [ProductsRepository, ProductsService, ProductVariantsRepository],
})
export class ProductsModule {}
