import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AllowNull,
  Unique,
} from 'sequelize-typescript'

@Table({
  tableName: 'settings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Setting extends Model<Setting> {
  @PrimaryKey
  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(100))
  declare key: string

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare value: string | null
}
