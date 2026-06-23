export interface VariantResponseDto {
  id: number
  productId: number
  label: string
  weightGrams?: number
  price: number
  stock: number
  stockStatus: string
  displayOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}
