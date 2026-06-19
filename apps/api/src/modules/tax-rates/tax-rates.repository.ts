import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { TaxRate } from './tax-rate.model'
import type { CreateTaxRateDto } from './dto/create-tax-rate.dto'
import type { UpdateTaxRateDto } from './dto/update-tax-rate.dto'

@Injectable()
export class TaxRatesRepository {
  constructor(
    @InjectModel(TaxRate)
    private readonly db: typeof TaxRate,
  ) {}

  findAll(): Promise<TaxRate[]> {
    return this.db.findAll({ order: [['rate', 'ASC']] })
  }

  findById(id: number): Promise<TaxRate | null> {
    return this.db.findByPk(id)
  }

  async create(dto: CreateTaxRateDto): Promise<TaxRate> {
    return this.db.create({
      label: dto.label,
      rate: dto.rate,
      isDefault: dto.isDefault ? 1 : 0,
    } as any)
  }

  async update(id: number, dto: UpdateTaxRateDto): Promise<TaxRate | null> {
    const data: Record<string, unknown> = {}
    if (dto.label !== undefined) data.label = dto.label
    if (dto.rate !== undefined) data.rate = dto.rate
    if (dto.isDefault !== undefined) data.isDefault = dto.isDefault ? 1 : 0
    await this.db.update(data, { where: { id } })
    return this.findById(id)
  }

  clearDefault(): Promise<[number]> {
    return this.db.update({ isDefault: 0 }, { where: {} })
  }

  delete(id: number): Promise<number> {
    return this.db.destroy({ where: { id } })
  }
}
