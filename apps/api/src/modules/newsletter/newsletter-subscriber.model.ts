import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Unique,
} from 'sequelize-typescript'

@Table({
  tableName: 'newsletter_subscribers',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
})
export class NewsletterSubscriber extends Model<NewsletterSubscriber> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER.UNSIGNED)
  declare id: number

  @Unique('email')
  @AllowNull(false)
  @Column(DataType.STRING(255))
  declare email: string

  declare created_at: Date
}
