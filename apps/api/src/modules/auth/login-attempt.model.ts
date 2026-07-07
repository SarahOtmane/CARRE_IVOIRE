import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Default,
  Index,
} from 'sequelize-typescript'

@Table({
  tableName: 'login_attempts',
  timestamps: false,
})
export class LoginAttempt extends Model<LoginAttempt> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER.UNSIGNED)
  declare id: number

  @AllowNull(false)
  @Index
  @Column(DataType.STRING(255))
  declare email: string

  @Default(0)
  @Column(DataType.INTEGER.UNSIGNED)
  declare count: number

  @AllowNull(true)
  @Column({ type: DataType.DATE, field: 'blocked_until' })
  declare blockedUntil: Date | null
}
