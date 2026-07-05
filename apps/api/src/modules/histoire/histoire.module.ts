import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { HistoireSection } from './histoire-section.model'
import { HistoireSectionRepository } from './histoire-section.repository'
import { HistoireService } from './histoire.service'
import { HistoireController } from './histoire.controller'

@Module({
  imports: [SequelizeModule.forFeature([HistoireSection])],
  providers: [HistoireSectionRepository, HistoireService],
  controllers: [HistoireController],
  exports: [HistoireSectionRepository, HistoireService],
})
export class HistoireModule {}
