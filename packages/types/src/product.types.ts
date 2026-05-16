import type { CategoryResponse } from './category.types'

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
  createdAt: string
  updatedAt: string
}

export type ProductResponse = Product

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
