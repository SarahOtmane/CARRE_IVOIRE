import { Injectable, BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Stripe from 'stripe'

@Injectable()
export class StripeService {
  private readonly stripe: Stripe
  private readonly webhookSecret: string

  constructor(private readonly configService: ConfigService) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY')
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not set')
    }

    this.stripe = new Stripe(secretKey, {
      apiVersion: '2023-10-16',
    })

    this.webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET') ?? ''
  }

  async createPaymentIntent(amount: number, orderId: number): Promise<Stripe.PaymentIntent> {
    return this.stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      metadata: { orderId: String(orderId) },
    })
  }

  constructEvent(rawBody: Buffer, signature: string): Stripe.Event {
    try {
      return this.stripe.webhooks.constructEvent(rawBody, signature, this.webhookSecret)
    } catch {
      throw new BadRequestException({
        code: 'INVALID_WEBHOOK_SIGNATURE',
        message: 'Signature webhook invalide',
      })
    }
  }
}
