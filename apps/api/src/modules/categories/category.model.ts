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
  HasMany,
} from 'sequelize-typescript'

@Table({
  tableName: 'categories',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Category extends Model<Category> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER.UNSIGNED)
  declare id: number

  @AllowNull(false)
  @Column(DataType.STRING(100))
  declare name: string

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(100))
  declare slug: string

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare description: string | null

  @AllowNull(true)
  @Column({ type: DataType.STRING(500), field: 'image_url' })
  declare imageUrl: string | null

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
