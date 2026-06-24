import { Injectable } from '@nestjs/common'
import { NewsletterRepository } from './newsletter.repository'

@Injectable()
export class NewsletterService {
  constructor(private readonly repo: NewsletterRepository) {}

  // Idempotent : un email déjà inscrit ne lève pas d'erreur (anti-énumération,
  // cohérent avec le comportement de auth.service.forgotPassword)
  async subscribe(email: string): Promise<{ email: string }> {
    const normalized = email.trim().toLowerCase()
    const existing = await this.repo.findByEmail(normalized)
    if (!existing) {
      await this.repo.create(normalized)
    }
    return { email: normalized }
  }
}
