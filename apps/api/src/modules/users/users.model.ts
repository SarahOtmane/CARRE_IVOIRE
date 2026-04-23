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
} from 'sequelize-typescript'

@Table({
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER.UNSIGNED)
  declare id: number

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(255))
  declare email: string

  @AllowNull(false)
  @Column(DataType.STRING(255))
  declare password_hash: string

  @AllowNull(false)
  @Column(DataType.STRING(100))
  declare first_name: string

  @AllowNull(false)
  @Column(DataType.STRING(100))
  declare last_name: string

  @AllowNull(true)
  @Column(DataType.STRING(20))
  declare phone: string | null

  @AllowNull(true)
  @Column(DataType.STRING(255))
  declare address_street: string | null

  @AllowNull(true)
  @Column(DataType.STRING(100))
  declare address_city: string | null

  @AllowNull(true)
  @Column(DataType.STRING(20))
  declare address_zip: string | null

  @Default('France')
  @AllowNull(true)
  @Column(DataType.STRING(100))
  declare address_country: string

  @Default('client')
  @AllowNull(false)
  @Column(DataType.ENUM('client', 'admin'))
  declare role: 'client' | 'admin'

  // Format: CI-YYYYMMDD-XXXX — généré à la création, jamais modifiable
  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(20))
  declare customer_number: string

  @Default(1)
  @AllowNull(false)
  @Column(DataType.TINYINT)
  declare is_active: number

  declare created_at: Date
  declare updated_at: Date
}
