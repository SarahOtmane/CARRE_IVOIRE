import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Unique,
  AllowNull,
} from 'sequelize-typescript'

@Table({
  tableName: 'stripe_webhook_events',
  timestamps: false,
})
export class StripeWebhookEvent extends Model<StripeWebhookEvent> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER.UNSIGNED)
  declare id: number

  @Unique
  @AllowNull(false)
  @Column({ type: DataType.STRING(255), field: 'event_id' })
  declare eventId: string

  @AllowNull(false)
  @Column(DataType.STRING(100))
  declare type: string

  @AllowNull(false)
  @Column({ type: DataType.DATE, field: 'processed_at' })
  declare processedAt: Date
}
