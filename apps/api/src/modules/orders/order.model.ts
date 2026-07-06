import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Default,
  ForeignKey,
  BelongsTo,
  HasMany,
  Unique,
} from 'sequelize-typescript'
import type { ShippingAddress } from '@carre-ivoire/types'
import { User } from '@/modules/users/users.model'
import { OrderItem } from './order-item.model'

@Table({
  tableName: 'orders',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { name: 'orders_stripe_payment_intent_id', fields: ['stripe_payment_intent_id'] },
    { name: 'idx_orders_user_created', fields: ['user_id', 'created_at'] },
  ],
})
export class Order extends Model<Order> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER.UNSIGNED)
  declare id: number

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({ type: DataType.INTEGER.UNSIGNED, field: 'user_id' })
  declare userId: number

  @BelongsTo(() => User)
  declare user: User

  @Unique('order_number')
  @AllowNull(false)
  @Column({ type: DataType.STRING(50), field: 'order_number' })
  declare orderNumber: string

  @AllowNull(false)
  @Default('payment_pending')
  @Column(
    DataType.ENUM(
      'pending',
      'payment_pending',
      'confirmed',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'refunded',
    ),
  )
  declare status: string

  @AllowNull(false)
  @Column({ type: DataType.INTEGER.UNSIGNED, field: 'total_amount' })
  declare totalAmount: number

  @AllowNull(true)
  @Column({ type: DataType.JSON, field: 'shipping_address' })
  declare shippingAddress: ShippingAddress | null

  @AllowNull(true)
  @Column({ type: DataType.STRING(255), field: 'stripe_payment_intent_id' })
  declare stripePaymentIntentId: string | null

  @HasMany(() => OrderItem)
  declare items: OrderItem[]

  declare created_at: Date
  declare updated_at: Date
}
