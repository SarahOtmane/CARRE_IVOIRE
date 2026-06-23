import type { CategoryResponse } from './category.types'
import type { TaxRate } from './tax-rate.types'

export enum StockStatus {
  IN_STOCK = 'in_stock',
  LOW_STOCK = 'low_stock',
  OUT_OF_STOCK = 'out_of_stock',
}

export interface Product {
  id: number
  name: string
  slug: string
  shortDescription?: string
  description?: string
  price: number
  discountPrice?: number
  stock: number
  stockStatus: StockStatus
  taxRateId?: number
  taxRate?: TaxRate
  imageUrl?: string
  images?: string[]
  categoryId: number
  category?: CategoryResponse
  isActive: boolean
  isSeasonal: boolean
  displayOrder: number
  badge?: string
  ingredients?: string
  allergens?: string
  weightGrams?: number
  variants: ProductVariant[]
  createdAt: string
  updatedAt: string
}

export type ProductResponse = Product

export interface ProductVariant {
  id: number
  productId: number
  label: string
  weightGrams?: number
  price: number
  stock: number
  stockStatus: StockStatus
  displayOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateVariantDto {
  label: string
  weightGrams?: number
  price: number
  stock?: number
  stockStatus?: 'in_stock' | 'out_of_stock'
  displayOrder?: number
  isActive?: boolean
}

export type UpdateVariantDto = Partial<CreateVariantDto>

export interface CreateProductDto {
  name: string
  slug: string
  shortDescription?: string
  description?: string
  price: number
  discountPrice?: number
  imageUrl?: string
  images?: string[]
  categoryId: number
  stock?: number
  stockStatus?: 'in_stock' | 'out_of_stock'
  taxRateId?: number | null
  isActive?: boolean
  isSeasonal?: boolean
  displayOrder?: number
  ingredients?: string
  allergens?: string
  weightGrams?: number
}

export type UpdateProductDto = Partial<CreateProductDto>

/**
 * Format option for product detail sheet
 * Represents different available formats (size/variant) of a product
 */
export interface FormatOption {
  id: string
  label: string
  detail: string
  extraPrice: number
}

/**
 * Product detail sheet — metadata for rendering product detail page
 * Contains narrative content, composition, tasting notes, and format variants
 */
export interface ProductSheet {
  eyebrow: string
  intro: string
  storyTitle: string
  story: string
  composition: string[]
  tasting: string
  conservation: string
  formats: FormatOption[]
}
