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
  tableName: 'histoire_sections',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class HistoireSection extends Model<HistoireSection> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER.UNSIGNED)
  declare id: number

  @Unique('key')
  @AllowNull(false)
  @Column(DataType.STRING(50))
  declare key: string

  @Default(0)
  @AllowNull(false)
  @Column({ type: DataType.INTEGER, field: 'display_order' })
  declare displayOrder: number

  @AllowNull(false)
  @Column({ type: DataType.STRING(500) })
  declare image: string

  @AllowNull(false)
  @Column({ type: DataType.STRING(255), field: 'image_alt' })
  declare imageAlt: string

  @AllowNull(false)
  @Column(DataType.JSON)
  declare paragraphs: string[]

  declare created_at: Date
  declare updated_at: Date
}
