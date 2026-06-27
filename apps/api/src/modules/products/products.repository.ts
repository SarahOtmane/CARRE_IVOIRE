import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Sequelize } from 'sequelize-typescript'
import { Op } from 'sequelize'
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
    const search = query.search?.trim()

    const matchClause =
      'MATCH(`Product`.`name`, `Product`.`short_description`, `Product`.`description`) AGAINST (:search IN NATURAL LANGUAGE MODE)'

    if (search) {
      where[Op.and as never] = Sequelize.literal(matchClause) as never
    }

    return this.db.findAndCountAll({
      where,
      attributes: search ? { include: [[Sequelize.literal(matchClause), 'relevance']] } : undefined,
      include: [
        { model: Category, attributes: ['id', 'name', 'slug'] },
        { model: TaxRate, attributes: ['id', 'label', 'rate', 'is_default'] },
        { model: ProductVariant, where: { isActive: 1 }, required: false, separate: true, order: [['displayOrder', 'ASC']] },
      ],
      limit,
      offset: (page - 1) * limit,
      order: search
        ? [[Sequelize.literal('relevance'), 'DESC']]
        : query.sort === 'price_asc'
          ? [['price', 'ASC'], ['displayOrder', 'ASC']]
          : query.sort === 'price_desc'
            ? [['price', 'DESC'], ['displayOrder', 'ASC']]
            : query.sort === 'newest'
              ? [['created_at', 'DESC']]
              : [['displayOrder', 'ASC'], ['created_at', 'DESC']],
      replacements: search ? { search } : undefined,
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
    const safeQty = Math.floor(Math.abs(quantity))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Sequelize.literal incompatible with model field type
    await this.db.update(
      {
        stock: Sequelize.literal(`stock + ${safeQty}`),
        stockStatus: Sequelize.literal(`CASE WHEN stock + ${safeQty} <= 0 THEN 'out_of_stock' WHEN stock + ${safeQty} <= 5 THEN 'low_stock' ELSE 'in_stock' END`),
      } as any,
      { where: { id: productId }, transaction: t },
    )
  }

  async decrementStock(productId: number, quantity: number, t?: Transaction): Promise<number> {
    const safeQuantity = Math.floor(Math.abs(quantity))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Sequelize.literal incompatible with model field type
    const [rowsAffected] = await this.db.update(
      {
        stock: Sequelize.literal(`stock - ${safeQuantity}`),
        stockStatus: Sequelize.literal(`CASE WHEN stock - ${safeQuantity} <= 0 THEN 'out_of_stock' WHEN stock - ${safeQuantity} <= 5 THEN 'low_stock' ELSE 'in_stock' END`),
      } as any,
      {
        where: {
          id: productId,
          stock: { [Op.gte]: quantity },
          isActive: 1,
        },
        transaction: t,
      },
    )
    return rowsAffected
  }

  async delete(id: number): Promise<void> {
    await this.db.destroy({ where: { id } })
  }
}
