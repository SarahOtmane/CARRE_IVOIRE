import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Sequelize } from 'sequelize-typescript'
import type { Transaction } from 'sequelize'
import { Product } from './product.model'
import { ProductVariant } from './product-variant.model'
import { Category } from '@/modules/categories/category.model'
import { TaxRate } from '@/modules/tax-rates/tax-rate.model'
import type { CreateProductDto } from './dto/create-product.dto'
import type { UpdateProductDto } from './dto/update-product.dto'
import type { ProductQueryDto } from './dto/product-query.dto'

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectModel(Product)
    private readonly db: typeof Product,
  ) { }

  async findAll(query: ProductQueryDto): Promise<{ rows: Product[]; count: number }> {
    const where: Record<string, unknown> = { isActive: 1 }
    if (query.categoryId) where.categoryId = query.categoryId
    if (query.isSeasonal !== undefined) where.isSeasonal = query.isSeasonal ? 1 : 0

    const limit = Math.min(query.limit ?? 12, 50)
    const page = query.page ?? 1

    return this.db.findAndCountAll({
      where,
      include: [
        { model: Category, attributes: ['id', 'name', 'slug'] },
        { model: TaxRate, attributes: ['id', 'label', 'rate', 'is_default'] },
        { model: ProductVariant, where: { isActive: 1 }, required: false, separate: true, order: [['displayOrder', 'ASC']] },
      ],
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
      include: [
        Category,
        TaxRate,
        { model: ProductVariant, where: { isActive: 1 }, required: false, separate: true, order: [['displayOrder', 'ASC']] },
      ],
    })
  }

  async findById(id: number): Promise<Product | null> {
    return this.db.findByPk(id, {
      include: [
        Category,
        TaxRate,
        { model: ProductVariant, where: { isActive: 1 }, required: false, separate: true, order: [['displayOrder', 'ASC']] },
      ],
    })
  }

  async findAllByIds(ids: number[], t?: Transaction): Promise<Product[]> {
    if (ids.length === 0) return []
    return this.db.findAll({
      where: { id: ids },
      raw: true,
      transaction: t,
    })
  }

  async create(dto: CreateProductDto): Promise<Product> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Sequelize v6 Model<M> requires all fields incl. id/timestamps; partial creation attributes not inferred
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
      stockStatus: dto.stockStatus ?? 'in_stock',
      taxRateId: dto.taxRateId ?? null,
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
    const data = this.buildUpdateData(dto)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Record<string,unknown> incompatible with Sequelize update attributes type
    await this.db.update(data as any, { where: { id } })
    return this.db.findByPk(id, { include: [Category] })
  }

  private buildUpdateData(dto: UpdateProductDto): Record<string, unknown> {
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
    if (dto.stockStatus !== undefined) data.stockStatus = dto.stockStatus
    if (dto.taxRateId !== undefined) data.taxRateId = dto.taxRateId ?? null
    if (dto.isActive !== undefined) data.isActive = dto.isActive ? 1 : 0
    if (dto.isSeasonal !== undefined) data.isSeasonal = dto.isSeasonal ? 1 : 0
    if (dto.displayOrder !== undefined) data.displayOrder = dto.displayOrder
    if (dto.badge !== undefined) data.badge = dto.badge
    if (dto.ingredients !== undefined) data.ingredients = dto.ingredients
    if (dto.allergens !== undefined) data.allergens = dto.allergens
    if (dto.weightGrams !== undefined) data.weightGrams = dto.weightGrams
    return data
  }

  async findAllActive(): Promise<Product[]> {
    return this.db.findAll({ where: { isActive: 1 }, attributes: ['slug', 'updated_at'] })
  }

  async incrementStock(productId: number, quantity: number, t?: Transaction): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Sequelize.literal Literal type incompatible with model field type
    await this.db.update(
      { stock: Sequelize.literal(`stock + ${Math.floor(Math.abs(quantity))}`) } as any,
      { where: { id: productId }, transaction: t },
    )
  }

  async delete(id: number): Promise<void> {
    await this.db.destroy({ where: { id } })
  }
}
