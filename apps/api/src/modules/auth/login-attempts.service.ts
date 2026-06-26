import { Injectable, TooManyRequestsException } from '@nestjs/common'

interface AttemptRecord {
  count: number
  blockedUntil: number | null
}

const MAX_ATTEMPTS = 5
const BLOCK_DURATION_MS = 5 * 60 * 1000 // 5 minutes

@Injectable()
export class LoginAttemptsService {
  private readonly store = new Map<string, AttemptRecord>()

  check(email: string): void {
    const key = email.toLowerCase()
    const record = this.store.get(key)
    if (!record) return

    const now = Date.now()
    if (record.blockedUntil && now < record.blockedUntil) {
      const remainingSeconds = Math.ceil((record.blockedUntil - now) / 1000)
      throw new TooManyRequestsException(
        `Trop de tentatives. Réessayez dans ${remainingSeconds} secondes.`,
      )
    }

    if (record.blockedUntil && now >= record.blockedUntil) {
      this.store.delete(key)
    }
  }

  recordFailure(email: string): void {
    const key = email.toLowerCase()
    const record = this.store.get(key) ?? { count: 0, blockedUntil: null }
    record.count += 1

    if (record.count >= MAX_ATTEMPTS) {
      record.blockedUntil = Date.now() + BLOCK_DURATION_MS
    }

    this.store.set(key, record)
  }

  clearAttempts(email: string): void {
    this.store.delete(email.toLowerCase())
  }
}
