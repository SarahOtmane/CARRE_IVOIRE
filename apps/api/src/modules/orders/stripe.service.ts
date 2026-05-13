import { Injectable, BadRequestException } from '@nestjs/common'
import Stripe from 'stripe'

@Injectable()
export class StripeService {
  private readonly stripe: Stripe
  private readonly webhookSecret: string

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
      apiVersion: '2024-06-20',
    })
    this.webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? ''
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
