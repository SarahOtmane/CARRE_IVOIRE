import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { createHash } from 'crypto'
import { Op } from 'sequelize'
import { RefreshToken } from './refresh-token.model'

@Injectable()
export class RefreshTokensRepository {
  constructor(
    @InjectModel(RefreshToken)
    private readonly model: typeof RefreshToken,
  ) {}

  static hash(token: string): string {
    return createHash('sha256').update(token).digest('hex')
  }

  async store(userId: number, token: string, expiresAt: Date): Promise<void> {
    await this.model.create({ userId, tokenHash: RefreshTokensRepository.hash(token), expiresAt, revokedAt: null } as any)
  }

  async findValid(token: string): Promise<RefreshToken | null> {
    return this.model.findOne({
      where: {
        tokenHash: RefreshTokensRepository.hash(token),
        revokedAt: null,
        expiresAt: { [Op.gt]: new Date() },
      },
    })
  }

  async revoke(token: string): Promise<void> {
    await this.model.update(
      { revokedAt: new Date() },
      { where: { tokenHash: RefreshTokensRepository.hash(token) } },
    )
  }

  async revokeAllForUser(userId: number): Promise<void> {
    await this.model.update(
      { revokedAt: new Date() },
      { where: { userId, revokedAt: null } },
    )
  }

  async pruneExpired(): Promise<void> {
    await this.model.destroy({ where: { expiresAt: { [Op.lt]: new Date() } } })
  }
}
