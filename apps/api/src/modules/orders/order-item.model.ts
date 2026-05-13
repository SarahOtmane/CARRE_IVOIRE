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
import { Order } from './order.model'
import { Product } from '@/modules/products/product.model'

@Table({ tableName: 'order_items', timestamps: false })
export class OrderItem extends Model<OrderItem> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER.UNSIGNED)
  declare id: number

  @ForeignKey(() => Order)
  @AllowNull(false)
  @Column({ type: DataType.INTEGER.UNSIGNED, field: 'order_id' })
  declare orderId: number

  @BelongsTo(() => Order)
  declare order: Order

  @ForeignKey(() => Product)
  @AllowNull(false)
  @Column({ type: DataType.INTEGER.UNSIGNED, field: 'product_id' })
  declare productId: number

  @BelongsTo(() => Product)
  declare product: Product

  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare quantity: number

  @AllowNull(false)
  @Column({ type: DataType.INTEGER.UNSIGNED, field: 'unit_price' })
  declare unitPrice: number

  @AllowNull(true)
  @Column(DataType.STRING(100))
  declare format: string | null

  @AllowNull(false)
  @Column({ type: DataType.STRING(255), field: 'product_name' })
  declare productName: string
}
