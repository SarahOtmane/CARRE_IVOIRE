import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { NewsletterSubscriber } from './newsletter-subscriber.model'

@Injectable()
export class NewsletterRepository {
  constructor(
    @InjectModel(NewsletterSubscriber)
    private readonly db: typeof NewsletterSubscriber,
  ) {}

  async findByEmail(email: string): Promise<NewsletterSubscriber | null> {
    return this.db.findOne({ where: { email } })
  }

  async create(email: string): Promise<NewsletterSubscriber> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Sequelize v6 partial creation attributes not inferred
    return this.db.create({ email } as any)
  }
}
