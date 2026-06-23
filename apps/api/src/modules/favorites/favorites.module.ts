import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Favorite } from './favorite.model'
import { FavoritesRepository } from './favorites.repository'
import { FavoritesService } from './favorites.service'
import { FavoritesController } from './favorites.controller'
import { ProductsModule } from '@/modules/products/products.module'

@Module({
  imports: [SequelizeModule.forFeature([Favorite]), ProductsModule],
  providers: [FavoritesRepository, FavoritesService],
  controllers: [FavoritesController],
})
export class FavoritesModule {}
