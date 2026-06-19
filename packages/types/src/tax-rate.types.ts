export interface TaxRate {
  id: number
  label: string
  rate: number
  isDefault: boolean
}

export type TaxRateResponse = TaxRate

export interface CreateTaxRateDto {
  label: string
  rate: number
  isDefault?: boolean
}

export type UpdateTaxRateDto = Partial<CreateTaxRateDto>
