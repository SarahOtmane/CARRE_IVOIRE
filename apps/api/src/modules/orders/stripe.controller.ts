import { Controller, Post, Req, Headers, HttpCode } from '@nestjs/common'
import type { RawBodyRequest } from '@nestjs/common'
import type { Request } from 'express'
import type Stripe from 'stripe'
import { StripeService } from './stripe.service'
import { OrdersService } from './orders.service'
import { StripeWebhookEventsRepository } from './stripe-webhook-events.repository'

@Controller('stripe')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly ordersService: OrdersService,
    private readonly webhookEventsRepository: StripeWebhookEventsRepository,
  ) {}

  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') sig: string,
  ) {
    const event = this.stripeService.constructEvent(req.rawBody!, sig)

    const isNew = await this.webhookEventsRepository.recordEvent(event.id, event.type)
    if (!isNew) {
      return { received: true }
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      await this.ordersService.confirmByPaymentIntent(paymentIntent.id)
    }

    if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      await this.ordersService.cancelByPaymentIntent(paymentIntent.id)
    }

    return { received: true }
  }
}
