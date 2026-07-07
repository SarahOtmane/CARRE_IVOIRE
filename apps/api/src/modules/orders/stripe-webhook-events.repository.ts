import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { UniqueConstraintError } from 'sequelize'
import { StripeWebhookEvent } from './stripe-webhook-event.model'

@Injectable()
export class StripeWebhookEventsRepository {
  constructor(
    @InjectModel(StripeWebhookEvent)
    private readonly model: typeof StripeWebhookEvent,
  ) {}

  /**
   * Tente d'enregistrer l'événement. Retourne false si déjà traité (contrainte UNIQUE),
   * true si c'est la première occurrence — sans race condition grâce à la contrainte DB.
   */
  async recordEvent(eventId: string, type: string): Promise<boolean> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Sequelize v6 Model<M> requires all fields incl. id
      await this.model.create({ eventId, type, processedAt: new Date() } as any)
      return true
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        return false
      }
      throw error
    }
  }
}
