export interface CategoryResponse {
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

export interface CreateCategoryDto {
  name: string
  slug: string
  description?: string
  imageUrl?: string
  displayOrder?: number
  isActive?: boolean
}

export type UpdateCategoryDto = Partial<CreateCategoryDto>
