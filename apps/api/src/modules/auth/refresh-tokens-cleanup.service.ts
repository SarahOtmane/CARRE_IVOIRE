import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { RefreshTokensRepository } from './refresh-tokens.repository'

@Injectable()
export class RefreshTokensCleanupService {
  private readonly logger = new Logger(RefreshTokensCleanupService.name)

  constructor(private readonly refreshTokensRepository: RefreshTokensRepository) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async runCleanup(): Promise<void> {
    try {
      await this.refreshTokensRepository.pruneExpired()
      this.logger.debug('Refresh tokens expirés purgés')
    } catch (err) {
      this.logger.error('Erreur lors de la purge des refresh tokens', err)
    }
  }
}
