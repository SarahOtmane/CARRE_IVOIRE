import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Product } from './product.model'
import { Category } from '@/modules/categories/category.model'
import type { CreateProductDto } from './dto/create-product.dto'
import type { UpdateProductDto } from './dto/update-product.dto'
import type { ProductQueryDto } from './dto/product-query.dto'

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectModel(Product)
    private readonly db: typeof Product,
  ) {}

  async findAll(query: ProductQueryDto): Promise<{ rows: Product[]; count: number }> {
    const where: Record<string, unknown> = { isActive: 1 }
    if (query.categoryId) where.categoryId = query.categoryId
    if (query.isSeasonal !== undefined) where.isSeasonal = query.isSeasonal ? 1 : 0

    const limit = Math.min(query.limit ?? 12, 50)
    const page = query.page ?? 1

    return this.db.findAndCountAll({
      where,
      include: [{ model: Category, attributes: ['id', 'name', 'slug'] }],
      limit,
      offset: (page - 1) * limit,
      order: [
        ['displayOrder', 'ASC'],
        ['created_at', 'DESC'],
      ],
      distinct: true,
    })
  }

  async findBySlug(slug: string): Promise<Product | null> {
    return this.db.findOne({
      where: { slug, isActive: 1 },
      include: [Category],
    })
  }

  async findById(id: number): Promise<Product | null> {
    return this.db.findByPk(id)
  }

  async create(dto: CreateProductDto): Promise<Product> {
    return this.db.create({
      name: dto.name,
      slug: dto.slug,
      shortDescription: dto.shortDescription ?? null,
      description: dto.description ?? null,
      price: dto.price,
      discountPrice: dto.discountPrice ?? null,
      imageUrl: dto.imageUrl ?? null,
      categoryId: dto.categoryId,
      stock: dto.stock ?? 0,
      isActive: dto.isActive !== false ? 1 : 0,
      isSeasonal: dto.isSeasonal ? 1 : 0,
      displayOrder: dto.displayOrder ?? 0,
      badge: dto.badge ?? null,
      ingredients: dto.ingredients ?? null,
      allergens: dto.allergens ?? null,
      weightGrams: dto.weightGrams ?? null,
    } as any)
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product | null> {
    const data: Record<string, unknown> = {}
    if (dto.name !== undefined) data.name = dto.name
    if (dto.slug !== undefined) data.slug = dto.slug
    if (dto.shortDescription !== undefined) data.shortDescription = dto.shortDescription
    if (dto.description !== undefined) data.description = dto.description
    if (dto.price !== undefined) data.price = dto.price
    if (dto.discountPrice !== undefined) data.discountPrice = dto.discountPrice
    if (dto.imageUrl !== undefined) data.imageUrl = dto.imageUrl
    if (dto.categoryId !== undefined) data.categoryId = dto.categoryId
    if (dto.stock !== undefined) data.stock = dto.stock
    if (dto.isActive !== undefined) data.isActive = dto.isActive ? 1 : 0
    if (dto.isSeasonal !== undefined) data.isSeasonal = dto.isSeasonal ? 1 : 0
    if (dto.displayOrder !== undefined) data.displayOrder = dto.displayOrder
    if (dto.badge !== undefined) data.badge = dto.badge
    if (dto.ingredients !== undefined) data.ingredients = dto.ingredients
    if (dto.allergens !== undefined) data.allergens = dto.allergens
    if (dto.weightGrams !== undefined) data.weightGrams = dto.weightGrams

    await this.db.update(data as any, { where: { id } })
    return this.db.findByPk(id, { include: [Category] })
  }

  async delete(id: number): Promise<void> {
    await this.db.destroy({ where: { id } })
  }
}
