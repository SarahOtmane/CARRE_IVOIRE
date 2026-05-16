import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Category } from './category.model'
import { CategoriesRepository } from './categories.repository'
import { CategoriesService } from './categories.service'
import { CategoriesController } from './categories.controller'

@Module({
  imports: [SequelizeModule.forFeature([Category])],
  providers: [CategoriesRepository, CategoriesService],
  controllers: [CategoriesController],
  exports: [CategoriesRepository, CategoriesService],
})
export class CategoriesModule {}
