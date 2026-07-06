import { Test } from '@nestjs/testing'
import { getModelToken } from '@nestjs/sequelize'
import { UniqueConstraintError } from 'sequelize'
import { StripeWebhookEventsRepository } from './stripe-webhook-events.repository'
import { StripeWebhookEvent } from './stripe-webhook-event.model'

describe('StripeWebhookEventsRepository', () => {
  let repo: StripeWebhookEventsRepository
  let model: { create: jest.Mock }

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        StripeWebhookEventsRepository,
        {
          provide: getModelToken(StripeWebhookEvent),
          useValue: { create: jest.fn().mockResolvedValue({}) },
        },
      ],
    }).compile()

    repo = module.get(StripeWebhookEventsRepository)
    model = module.get(getModelToken(StripeWebhookEvent))
  })

  it('retourne true pour un événement nouveau', async () => {
    expect(await repo.recordEvent('evt_new', 'payment_intent.succeeded')).toBe(true)
    expect(model.create).toHaveBeenCalledWith(
      expect.objectContaining({ eventId: 'evt_new', type: 'payment_intent.succeeded' }),
    )
  })

  it('retourne false si l\'événement est déjà traité (UniqueConstraintError)', async () => {
    model.create.mockRejectedValue(new UniqueConstraintError({}))
    expect(await repo.recordEvent('evt_dup', 'payment_intent.succeeded')).toBe(false)
  })

  it('relance les autres erreurs', async () => {
    model.create.mockRejectedValue(new Error('DB down'))
    await expect(repo.recordEvent('evt_err', 'payment_intent.succeeded')).rejects.toThrow('DB down')
  })
})
