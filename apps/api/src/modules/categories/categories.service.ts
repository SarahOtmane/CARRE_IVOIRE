import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { CategoriesRepository } from './categories.repository'
import type { Category } from './category.model'
import type { CreateCategoryDto } from './dto/create-category.dto'
import type { UpdateCategoryDto } from './dto/update-category.dto'
import type { CategoryResponseDto } from './dto/category-response.dto'

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async findAll(): Promise<CategoryResponseDto[]> {
    const categories = await this.categoriesRepository.findAll()
    return categories.map((c) => this.toResponseDto(c))
  }

  async create(dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    const existing = await this.categoriesRepository.findBySlug(dto.slug)
    if (existing) {
      throw new ConflictException({ code: 'CATEGORY_SLUG_EXISTS', message: 'Ce slug est déjà utilisé' })
    }
    const category = await this.categoriesRepository.create(dto)
    return this.toResponseDto(category)
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<CategoryResponseDto> {
    const existing = await this.categoriesRepository.findById(id)
    if (!existing) {
      throw new NotFoundException({ code: 'CATEGORY_NOT_FOUND', message: 'Catégorie introuvable' })
    }
    const updated = await this.categoriesRepository.update(id, dto)
    return this.toResponseDto(updated!)
  }

  async delete(id: number): Promise<void> {
    const existing = await this.categoriesRepository.findById(id)
    if (!existing) {
      throw new NotFoundException({ code: 'CATEGORY_NOT_FOUND', message: 'Catégorie introuvable' })
    }
    await this.categoriesRepository.delete(id)
  }

  private toResponseDto(c: Category): CategoryResponseDto {
    return {
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description ?? undefined,
      imageUrl: c.imageUrl ?? undefined,
      displayOrder: c.displayOrder,
      isActive: c.isActive === 1,
      createdAt: c.created_at?.toISOString(),
      updatedAt: c.updated_at?.toISOString(),
    }
  }
}
