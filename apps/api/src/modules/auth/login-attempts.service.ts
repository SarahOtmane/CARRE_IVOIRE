import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { LoginAttempt } from './login-attempt.model'

const MAX_ATTEMPTS = 5
const BLOCK_DURATION_MS = 5 * 60 * 1000 // 5 minutes

@Injectable()
export class LoginAttemptsService {
  constructor(
    @InjectModel(LoginAttempt)
    private readonly model: typeof LoginAttempt,
  ) {}

  async check(email: string): Promise<void> {
    const record = await this.model.findOne({ where: { email: email.toLowerCase() } })
    if (!record) return

    const now = new Date()
    if (record.blockedUntil && now < record.blockedUntil) {
      const remainingSeconds = Math.ceil((record.blockedUntil.getTime() - now.getTime()) / 1000)
      throw new HttpException(
        `Trop de tentatives. Réessayez dans ${remainingSeconds} secondes.`,
        HttpStatus.TOO_MANY_REQUESTS,
      )
    }

    if (record.blockedUntil && now >= record.blockedUntil) {
      await record.destroy()
    }
  }

  async recordFailure(email: string): Promise<void> {
    const key = email.toLowerCase()
    const [record] = await this.model.findOrCreate({
      where: { email: key },
      defaults: { email: key, count: 0, blockedUntil: null } as any,
    })
    record.count += 1
    if (record.count >= MAX_ATTEMPTS) {
      record.blockedUntil = new Date(Date.now() + BLOCK_DURATION_MS)
    }
    await record.save()
  }

  async clearAttempts(email: string): Promise<void> {
    await this.model.destroy({ where: { email: email.toLowerCase() } })
  }
}
