// Sous-ensemble renvoyé par l'API lorsqu'une catégorie est imbriquée dans une réponse produit
export interface CategorySummary {
  id: number
  name: string
  slug: string
}

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
