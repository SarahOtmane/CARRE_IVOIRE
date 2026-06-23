import { Injectable } from '@nestjs/common'
import { InjectConnection } from '@nestjs/sequelize'
import { Sequelize } from 'sequelize-typescript'
import type { TaxRate } from '@carre-ivoire/types'
import { ErrorCodes } from '@/common/constants'
import throwApiError from '@/common/errors/throw-api-error'
import { TaxRatesRepository } from './tax-rates.repository'
import type { CreateTaxRateDto } from './dto/create-tax-rate.dto'
import type { UpdateTaxRateDto } from './dto/update-tax-rate.dto'

export type TaxRateResponse = TaxRate

@Injectable()
export class TaxRatesService {
  constructor(
    private readonly repo: TaxRatesRepository,
    @InjectConnection() private readonly sequelize: Sequelize,
  ) {}

  async findAll(): Promise<TaxRateResponse[]> {
    const rows = await this.repo.findAll()
    return rows.map(this.toDto)
  }

  async create(dto: CreateTaxRateDto): Promise<TaxRateResponse> {
    const row = await this.sequelize.transaction(async (t) => {
      if (dto.isDefault) {
        await this.repo.clearDefault(t)
      }
      return this.repo.create(dto, t)
    })
    return this.toDto(row)
  }

  async update(id: number, dto: UpdateTaxRateDto): Promise<TaxRateResponse> {
    const existing = await this.repo.findById(id)
    if (!existing) throwApiError(ErrorCodes.TAX_RATE_NOT_FOUND, 'Taux de TVA introuvable')
    const updated = await this.sequelize.transaction(async (t) => {
      if (dto.isDefault) {
        await this.repo.clearDefault(t)
      }
      return this.repo.update(id, dto, t)
    })
    return this.toDto(updated!)
  }

  async delete(id: number): Promise<void> {
    const existing = await this.repo.findById(id)
    if (!existing) throwApiError(ErrorCodes.TAX_RATE_NOT_FOUND, 'Taux de TVA introuvable')
    await this.repo.delete(id)
  }

  private toDto(row: { id: number; label: string; rate: number; isDefault: number }): TaxRateResponse {
    return {
      id: row.id,
      label: row.label,
      rate: Number(row.rate),
      isDefault: row.isDefault === 1,
    }
  }
}
