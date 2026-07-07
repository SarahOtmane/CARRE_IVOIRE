import type { TaxRate } from '@carre-ivoire/types'

export interface VariantResponseDto {
  id: number
  productId: number
  label: string
  weightGrams?: number
  price: number
  priceTtc?: number
  taxRateId?: number
  taxRate?: TaxRate
  stock: number
  stockStatus: string
  displayOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}
