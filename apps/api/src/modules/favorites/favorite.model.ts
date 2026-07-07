import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript'
import { User } from '@/modules/users/users.model'
import { Product } from '@/modules/products/product.model'

@Table({
  tableName: 'favorites',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  indexes: [{ unique: true, fields: ['user_id', 'product_id'] }],
})
export class Favorite extends Model<Favorite> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER.UNSIGNED)
  declare id: number

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({ type: DataType.INTEGER.UNSIGNED, field: 'user_id' })
  declare userId: number

  @ForeignKey(() => Product)
  @AllowNull(false)
  @Column({ type: DataType.INTEGER.UNSIGNED, field: 'product_id' })
  declare productId: number

  @BelongsTo(() => Product)
  declare product: Product

  declare created_at: Date
}
