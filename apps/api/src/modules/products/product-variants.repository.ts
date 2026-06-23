import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Sequelize } from 'sequelize-typescript'
import type { Transaction } from 'sequelize'
import { ProductVariant } from './product-variant.model'
import type { CreateVariantDto } from './dto/create-variant.dto'
import type { UpdateVariantDto } from './dto/update-variant.dto'

@Injectable()
export class ProductVariantsRepository {
  constructor(
    @InjectModel(ProductVariant)
    private readonly db: typeof ProductVariant,
  ) { }

  async findByProductId(productId: number): Promise<ProductVariant[]> {
    return this.db.findAll({
      where: { productId, isActive: 1 },
      order: [['displayOrder', 'ASC']],
    })
  }

  async findById(id: number): Promise<ProductVariant | null> {
    return this.db.findByPk(id)
  }

  async create(productId: number, dto: CreateVariantDto): Promise<ProductVariant> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Sequelize v6 Model<M> requires all fields incl. id/timestamps; partial creation attributes not inferred
    return this.db.create({
      productId,
      label: dto.label,
      weightGrams: dto.weightGrams ?? null,
      price: dto.price,
      stock: dto.stock ?? 0,
      stockStatus: dto.stockStatus ?? 'in_stock',
      displayOrder: dto.displayOrder ?? 0,
      isActive: dto.isActive !== false ? 1 : 0,
    } as any)
  }

  async update(id: number, dto: UpdateVariantDto): Promise<ProductVariant | null> {
    const data: Record<string, unknown> = {}
    if (dto.label !== undefined) data.label = dto.label
    if (dto.weightGrams !== undefined) data.weightGrams = dto.weightGrams
    if (dto.price !== undefined) data.price = dto.price
    if (dto.stock !== undefined) data.stock = dto.stock
    if (dto.stockStatus !== undefined) data.stockStatus = dto.stockStatus
    if (dto.displayOrder !== undefined) data.displayOrder = dto.displayOrder
    if (dto.isActive !== undefined) data.isActive = dto.isActive ? 1 : 0

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Record<string,unknown> incompatible with Sequelize update attributes type
    await this.db.update(data as any, { where: { id } })
    return this.db.findByPk(id)
  }

  async delete(id: number): Promise<void> {
    await this.db.destroy({ where: { id } })
  }

  async incrementStock(variantId: number, quantity: number, t?: Transaction): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Sequelize.literal Literal type incompatible with model field type
    await this.db.update(
      { stock: Sequelize.literal(`stock + ${Math.floor(Math.abs(quantity))}`) } as any,
      { where: { id: variantId }, transaction: t },
    )
  }
}
