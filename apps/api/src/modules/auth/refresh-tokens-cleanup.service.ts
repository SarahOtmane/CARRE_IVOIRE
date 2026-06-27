import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common'
import { RefreshTokensRepository } from './refresh-tokens.repository'

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000

@Injectable()
export class RefreshTokensCleanupService implements OnApplicationBootstrap {
  private readonly logger = new Logger(RefreshTokensCleanupService.name)

  constructor(private readonly refreshTokensRepository: RefreshTokensRepository) {}

  onApplicationBootstrap() {
    this.runCleanup()
    setInterval(() => this.runCleanup(), TWENTY_FOUR_HOURS_MS)
  }

  private async runCleanup(): Promise<void> {
    try {
      await this.refreshTokensRepository.pruneExpired()
      this.logger.debug('Refresh tokens expirés purgés')
    } catch (err) {
      this.logger.error('Erreur lors de la purge des refresh tokens', err)
    }
  }
}
