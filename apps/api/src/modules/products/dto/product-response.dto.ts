import type { TaxRate, CategorySummary } from '@carre-ivoire/types'
import type { VariantResponseDto } from './variant-response.dto'

export type TaxRateDto = TaxRate

export interface ProductResponseDto {
  id: number
  name: string
  slug: string
  shortDescription?: string
  description?: string
  price: number
  priceTtc?: number
  discountPrice?: number
  imageUrl?: string
  images?: string[]
  categoryId: number
  category?: CategorySummary
  stock: number
  stockStatus: string
  taxRateId?: number
  taxRate?: TaxRateDto
  isActive: boolean
  isSeasonal: boolean
  displayOrder: number
  badge?: string
  ingredients?: string
  degustation?: string
  conservation?: string
  allergens?: string
  weightGrams?: number
  variants: VariantResponseDto[]
  createdAt: string
  updatedAt: string
}
