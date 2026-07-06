import { Test } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'
import Stripe from 'stripe'
import { InternalServerErrorException } from '@nestjs/common'
import { StripeService } from './stripe.service'

const WEBHOOK_SECRET = 'whsec_test_secret_used_only_in_unit_tests'

function buildSignedPayload(payload: object) {
  const body = JSON.stringify(payload)
  const header = Stripe.webhooks.generateTestHeaderString({
    payload: body,
    secret: WEBHOOK_SECRET,
  })
  return { body, header }
}

describe('StripeService', () => {
  async function createService(config: Record<string, string | undefined>): Promise<StripeService> {
    const module = await Test.createTestingModule({
      providers: [
        StripeService,
        {
          provide: ConfigService,
          useValue: { get: (key: string) => config[key] },
        },
      ],
    }).compile()
    return module.get(StripeService)
  }

  it("lève une InternalServerErrorException si STRIPE_SECRET_KEY n'est pas définie", async () => {
    await expect(
      createService({ STRIPE_WEBHOOK_SECRET: WEBHOOK_SECRET }),
    ).rejects.toThrow(InternalServerErrorException)
  })

  it('démarre sans STRIPE_WEBHOOK_SECRET (webhookSecret vaut chaîne vide)', async () => {
    const service = await createService({ STRIPE_SECRET_KEY: 'sk_test_xxx' })
    expect(service).toBeDefined()
  })

  describe('createPaymentIntent', () => {
    it('crée un PaymentIntent via la SDK Stripe (mock interne)', async () => {
      const service = await createService({
        STRIPE_SECRET_KEY: 'sk_test_xxx',
        STRIPE_WEBHOOK_SECRET: WEBHOOK_SECRET,
      })
      const mockCreate = jest.fn().mockResolvedValue({ id: 'pi_test', client_secret: 'cs_test' })
      ;(service as any).stripe.paymentIntents = { create: mockCreate }
      const result = await service.createPaymentIntent(500, 42)
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ amount: 500, currency: 'eur', metadata: { orderId: '42' } }),
      )
      expect(result.id).toBe('pi_test')
    })
  })

  describe('constructEvent', () => {
    it('accepte un événement avec une signature webhook valide', async () => {
      const service = await createService({
        STRIPE_SECRET_KEY: 'sk_test_xxx',
        STRIPE_WEBHOOK_SECRET: WEBHOOK_SECRET,
      })
      const { body, header } = buildSignedPayload({
        id: 'evt_test_1',
        type: 'payment_intent.succeeded',
        data: { object: { id: 'pi_test_1' } },
      })

      const event = service.constructEvent(Buffer.from(body), header)
      expect(event.id).toBe('evt_test_1')
      expect(event.type).toBe('payment_intent.succeeded')
    })

    it('rejette un événement avec une signature invalide', async () => {
      const service = await createService({
        STRIPE_SECRET_KEY: 'sk_test_xxx',
        STRIPE_WEBHOOK_SECRET: WEBHOOK_SECRET,
      })
      const body = JSON.stringify({ id: 'evt_test_2', type: 'payment_intent.succeeded' })

      expect(() => service.constructEvent(Buffer.from(body), 'invalid-signature')).toThrowError(
        expect.objectContaining({
          response: expect.objectContaining({ code: 'INVALID_WEBHOOK_SIGNATURE' }),
        }),
      )
    })

    it('rejette un événement signé avec un secret webhook différent', async () => {
      const service = await createService({
        STRIPE_SECRET_KEY: 'sk_test_xxx',
        STRIPE_WEBHOOK_SECRET: WEBHOOK_SECRET,
      })
      const body = JSON.stringify({ id: 'evt_test_3', type: 'payment_intent.succeeded' })
      const header = Stripe.webhooks.generateTestHeaderString({
        payload: body,
        secret: 'whsec_un_autre_secret',
      })

      expect(() => service.constructEvent(Buffer.from(body), header)).toThrowError(
        expect.objectContaining({
          response: expect.objectContaining({ code: 'INVALID_WEBHOOK_SIGNATURE' }),
        }),
      )
    })
  })
})
