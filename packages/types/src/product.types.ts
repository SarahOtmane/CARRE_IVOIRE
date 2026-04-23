export enum StockStatus {
  IN_STOCK = 'in_stock',
  LOW_STOCK = 'low_stock',
  OUT_OF_STOCK = 'out_of_stock',
}

export enum ProductFormat {
  INDIVIDUAL = 'individual',
  BOX_6 = 'box_6',
  BOX_12 = 'box_12',
  BOX_25 = 'box_25',
  BOX_50 = 'box_50',
  TABLET = 'tablet',
}

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  imageUrl?: string
  displayOrder: number
}

export interface Product {
  id: number
  name: string
  slug: string
  shortDesc?: string
  description?: string
  price: number
  stock: number
  stockStatus: StockStatus
  imageUrl?: string
  images?: string[]
  categoryId: number
  category?: Category
  isActive: boolean
  isSeasonal: boolean
  displayOrder: number
  formats?: ProductFormat[]
  ingredients?: string
  allergens?: string
  weightGrams?: number
  createdAt: string
  updatedAt: string
}
