import { Module } from '@nestjs/common'
import { SitemapController } from './sitemap.controller'
import { ProductsModule } from '@/modules/products/products.module'
import { CategoriesModule } from '@/modules/categories/categories.module'

@Module({
  imports: [ProductsModule, CategoriesModule],
  controllers: [SitemapController],
})
export class SitemapModule {}
