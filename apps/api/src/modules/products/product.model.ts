import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Unique,
  Default,
  AllowNull,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript'
import { Category } from '@/modules/categories/category.model'

@Table({
  tableName: 'products',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Product extends Model<Product> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER.UNSIGNED)
  declare id: number

  @AllowNull(false)
  @Column(DataType.STRING(255))
  declare name: string

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(255))
  declare slug: string

  @AllowNull(true)
  @Column({ type: DataType.STRING(500), field: 'short_description' })
  declare shortDescription: string | null

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare description: string | null

  @AllowNull(false)
  @Column(DataType.INTEGER.UNSIGNED)
  declare price: number

  @AllowNull(true)
  @Column({ type: DataType.INTEGER.UNSIGNED, field: 'discount_price' })
  declare discountPrice: number | null

  @AllowNull(true)
  @Column({ type: DataType.STRING(500), field: 'image_url' })
  declare imageUrl: string | null

  @AllowNull(true)
  @Column(DataType.JSON)
  declare images: string[] | null

  @ForeignKey(() => Category)
  @AllowNull(false)
  @Column({ type: DataType.INTEGER.UNSIGNED, field: 'category_id' })
  declare categoryId: number

  @BelongsTo(() => Category)
  declare category: Category

  @Default(0)
  @AllowNull(false)
  @Column(DataType.INTEGER.UNSIGNED)
  declare stock: number

  @Default('in_stock')
  @AllowNull(false)
  @Column({ type: DataType.ENUM('in_stock', 'low_stock', 'out_of_stock'), field: 'stock_status' })
  declare stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock'

  @Default(1)
  @AllowNull(false)
  @Column({ type: DataType.TINYINT, field: 'is_active' })
  declare isActive: number

  @Default(0)
  @AllowNull(false)
  @Column({ type: DataType.TINYINT, field: 'is_seasonal' })
  declare isSeasonal: number

  @Default(0)
  @AllowNull(false)
  @Column({ type: DataType.INTEGER, field: 'display_order' })
  declare displayOrder: number

  @AllowNull(true)
  @Column(DataType.STRING(100))
  declare badge: string | null

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare ingredients: string | null

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare allergens: string | null

  @AllowNull(true)
  @Column({ type: DataType.INTEGER.UNSIGNED, field: 'weight_grams' })
  declare weightGrams: number | null

  declare created_at: Date
  declare updated_at: Date
}
