import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { TaxRate } from './tax-rate.model'
import { TaxRatesRepository } from './tax-rates.repository'
import { TaxRatesService } from './tax-rates.service'
import { TaxRatesController } from './tax-rates.controller'

@Module({
  imports: [SequelizeModule.forFeature([TaxRate])],
  providers: [TaxRatesRepository, TaxRatesService],
  controllers: [TaxRatesController],
  exports: [TaxRatesRepository, TaxRatesService],
})
export class TaxRatesModule {}
