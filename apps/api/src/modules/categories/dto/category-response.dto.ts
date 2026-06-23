export interface CategoryResponseDto {
  id: number
  name: string
  slug: string
  description?: string
  imageUrl?: string
  displayOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}
