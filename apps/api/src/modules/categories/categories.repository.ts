import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Category } from './category.model'
import type { CreateCategoryDto } from './dto/create-category.dto'
import type { UpdateCategoryDto } from './dto/update-category.dto'

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectModel(Category)
    private readonly db: typeof Category,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.db.findAll({
      where: { isActive: 1 },
      order: [['displayOrder', 'ASC']],
    })
  }

  async findById(id: number): Promise<Category | null> {
    return this.db.findByPk(id)
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return this.db.findOne({ where: { slug } })
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    return this.db.create({
      name: dto.name,
      slug: dto.slug,
      description: dto.description ?? null,
      imageUrl: dto.imageUrl ?? null,
      displayOrder: dto.displayOrder ?? 0,
      isActive: dto.isActive !== false ? 1 : 0,
    } as any)
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<Category | null> {
    const data: Record<string, unknown> = {}
    if (dto.name !== undefined) data.name = dto.name
    if (dto.slug !== undefined) data.slug = dto.slug
    if (dto.description !== undefined) data.description = dto.description
    if (dto.imageUrl !== undefined) data.imageUrl = dto.imageUrl
    if (dto.displayOrder !== undefined) data.displayOrder = dto.displayOrder
    if (dto.isActive !== undefined) data.isActive = dto.isActive ? 1 : 0

    await this.db.update(data as any, { where: { id } })
    return this.db.findByPk(id)
  }

  async delete(id: number): Promise<void> {
    await this.db.destroy({ where: { id } })
  }
}
