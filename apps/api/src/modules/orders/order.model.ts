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
} from 'sequelize-typescript'
import { User } from '@/modules/users/users.model'
import { OrderItem } from './order-item.model'

@Table({
  tableName: 'orders',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
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

  @AllowNull(false)
  @Column({ type: DataType.STRING(30), field: 'order_number' })
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
  declare shippingAddress: object | null

  @AllowNull(true)
  @Column({ type: DataType.STRING(255), field: 'stripe_payment_intent_id' })
  declare stripePaymentIntentId: string | null

  // Legacy address fields kept for DB compatibility
  @AllowNull(false)
  @Default('')
  @Column({ type: DataType.STRING(255), field: 'address_street' })
  declare addressStreet: string

  @AllowNull(false)
  @Default('')
  @Column({ type: DataType.STRING(100), field: 'address_city' })
  declare addressCity: string

  @AllowNull(false)
  @Default('')
  @Column({ type: DataType.STRING(20), field: 'address_zip' })
  declare addressZip: string

  @AllowNull(false)
  @Default('France')
  @Column({ type: DataType.STRING(100), field: 'address_country' })
  declare addressCountry: string

  @HasMany(() => OrderItem)
  declare items: OrderItem[]

  declare created_at: Date
  declare updated_at: Date
}
