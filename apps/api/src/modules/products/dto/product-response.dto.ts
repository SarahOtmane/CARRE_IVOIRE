export interface ProductResponseDto {
  id: number
  name: string
  slug: string
  shortDescription?: string
  description?: string
  price: number
  discountPrice?: number
  imageUrl?: string
  images?: string[]
  categoryId: number
  category?: { id: number; name: string; slug: string }
  stock: number
  stockStatus: string
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
