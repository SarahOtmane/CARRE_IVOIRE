import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Default,
  AllowNull,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript'
import { Product } from './product.model'
import { TaxRate } from '@/modules/tax-rates/tax-rate.model'

@Table({
  tableName: 'product_variants',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class ProductVariant extends Model<ProductVariant> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER.UNSIGNED)
  declare id: number

  @ForeignKey(() => Product)
  @AllowNull(false)
  @Column({ type: DataType.INTEGER.UNSIGNED, field: 'product_id' })
  declare productId: number

  @BelongsTo(() => Product)
  declare product: Product

  @AllowNull(false)
  @Column(DataType.STRING(100))
  declare label: string

  @AllowNull(true)
  @Column({ type: DataType.INTEGER.UNSIGNED, field: 'weight_grams' })
  declare weightGrams: number | null

  @AllowNull(false)
  @Column(DataType.INTEGER.UNSIGNED)
  declare price: number

  @ForeignKey(() => TaxRate)
  @AllowNull(true)
  @Column({ type: DataType.INTEGER.UNSIGNED, field: 'tax_rate_id' })
  declare taxRateId: number | null

  @BelongsTo(() => TaxRate)
  declare taxRate: TaxRate | null

  @Default(0)
  @AllowNull(false)
  @Column(DataType.INTEGER.UNSIGNED)
  declare stock: number

  @Default('in_stock')
  @AllowNull(false)
  @Column({ type: DataType.ENUM('in_stock', 'low_stock', 'out_of_stock'), field: 'stock_status' })
  declare stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock'

  @Default(0)
  @AllowNull(false)
  @Column({ type: DataType.INTEGER, field: 'display_order' })
  declare displayOrder: number

  @Default(1)
  @AllowNull(false)
  @Column({ type: DataType.TINYINT, field: 'is_active' })
  declare isActive: number

  declare created_at: Date
  declare updated_at: Date
}
