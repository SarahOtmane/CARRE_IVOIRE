import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Unique,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript'
import { User } from '@/modules/users/users.model'

@Table({
  tableName: 'refresh_tokens',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  indexes: [{ name: 'refresh_tokens_user_id', fields: ['user_id'] }],
})
export class RefreshToken extends Model<RefreshToken> {
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

  @Unique
  @AllowNull(false)
  @Column({ type: DataType.STRING(64), field: 'token_hash' })
  declare tokenHash: string

  @AllowNull(false)
  @Column({ type: DataType.DATE, field: 'expires_at' })
  declare expiresAt: Date

  @AllowNull(true)
  @Column({ type: DataType.DATE, field: 'revoked_at' })
  declare revokedAt: Date | null
}
