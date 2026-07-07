import { Test } from '@nestjs/testing'
import type { RawBodyRequest } from '@nestjs/common'
import type { Request } from 'express'
import { StripeController } from './stripe.controller'
import { StripeService } from './stripe.service'
import { OrdersService } from './orders.service'
import { StripeWebhookEventsRepository } from './stripe-webhook-events.repository'

function buildRequest(): RawBodyRequest<Request> {
  return { rawBody: Buffer.from('{}') } as unknown as RawBodyRequest<Request>
}

describe('StripeController', () => {
  let controller: StripeController
  let stripeService: jest.Mocked<StripeService>
  let ordersService: jest.Mocked<OrdersService>
  let webhookEventsRepository: jest.Mocked<StripeWebhookEventsRepository>

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        StripeController,
        {
          provide: StripeService,
          useValue: { constructEvent: jest.fn() },
        },
        {
          provide: OrdersService,
          useValue: {
            confirmByPaymentIntent: jest.fn().mockResolvedValue(undefined),
            cancelByPaymentIntent: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: StripeWebhookEventsRepository,
          useValue: { recordEvent: jest.fn() },
        },
      ],
    }).compile()

    controller = module.get(StripeController)
    stripeService = module.get(StripeService)
    ordersService = module.get(OrdersService)
    webhookEventsRepository = module.get(StripeWebhookEventsRepository)
  })

  it('confirme la commande pour un événement payment_intent.succeeded jamais traité', async () => {
    stripeService.constructEvent.mockReturnValue({
      id: 'evt_1',
      type: 'payment_intent.succeeded',
      data: { object: { id: 'pi_1' } },
    } as any)
    webhookEventsRepository.recordEvent.mockResolvedValue(true)

    const result = await controller.handleWebhook(buildRequest(), 'sig')

    expect(ordersService.confirmByPaymentIntent).toHaveBeenCalledWith('pi_1')
    expect(ordersService.cancelByPaymentIntent).not.toHaveBeenCalled()
    expect(result).toEqual({ received: true })
  })

  it('annule la commande pour un événement payment_intent.payment_failed jamais traité', async () => {
    stripeService.constructEvent.mockReturnValue({
      id: 'evt_2',
      type: 'payment_intent.payment_failed',
      data: { object: { id: 'pi_2' } },
    } as any)
    webhookEventsRepository.recordEvent.mockResolvedValue(true)

    await controller.handleWebhook(buildRequest(), 'sig')

    expect(ordersService.cancelByPaymentIntent).toHaveBeenCalledWith('pi_2')
    expect(ordersService.confirmByPaymentIntent).not.toHaveBeenCalled()
  })

  it("ne traite l'événement qu'une seule fois en cas de replay (idempotence)", async () => {
    stripeService.constructEvent.mockReturnValue({
      id: 'evt_3',
      type: 'payment_intent.succeeded',
      data: { object: { id: 'pi_3' } },
    } as any)
    // Premier appel : nouvel événement
    webhookEventsRepository.recordEvent.mockResolvedValueOnce(true)
    // Replay : déjà enregistré
    webhookEventsRepository.recordEvent.mockResolvedValueOnce(false)

    await controller.handleWebhook(buildRequest(), 'sig')
    const secondResult = await controller.handleWebhook(buildRequest(), 'sig')

    expect(ordersService.confirmByPaymentIntent).toHaveBeenCalledTimes(1)
    expect(secondResult).toEqual({ received: true })
  })

  it("ignore les types d'événements non gérés sans erreur", async () => {
    stripeService.constructEvent.mockReturnValue({
      id: 'evt_4',
      type: 'charge.refunded',
      data: { object: { id: 'pi_4' } },
    } as any)
    webhookEventsRepository.recordEvent.mockResolvedValue(true)

    const result = await controller.handleWebhook(buildRequest(), 'sig')

    expect(ordersService.confirmByPaymentIntent).not.toHaveBeenCalled()
    expect(ordersService.cancelByPaymentIntent).not.toHaveBeenCalled()
    expect(result).toEqual({ received: true })
  })
})
