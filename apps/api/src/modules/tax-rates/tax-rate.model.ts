import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Default,
} from 'sequelize-typescript'

@Table({
  tableName: 'tax_rates',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class TaxRate extends Model<TaxRate> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER.UNSIGNED)
  declare id: number

  @AllowNull(false)
  @Column(DataType.STRING(100))
  declare label: string

  @AllowNull(false)
  @Column(DataType.DECIMAL(5, 2))
  declare rate: number

  @Default(0)
  @AllowNull(false)
  @Column({ type: DataType.TINYINT, field: 'is_default' })
  declare isDefault: number

  declare created_at: Date
  declare updated_at: Date
}
