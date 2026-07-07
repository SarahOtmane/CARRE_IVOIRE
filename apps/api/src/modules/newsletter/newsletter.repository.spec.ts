import { Test } from '@nestjs/testing'
import { getModelToken } from '@nestjs/sequelize'
import { NewsletterRepository } from './newsletter.repository'
import { NewsletterSubscriber } from './newsletter-subscriber.model'

describe('NewsletterRepository', () => {
  let repo: NewsletterRepository
  let model: { findOne: jest.Mock; create: jest.Mock }

  const mockSubscriber = { id: 1, email: 'sub@test.com' }

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        NewsletterRepository,
        {
          provide: getModelToken(NewsletterSubscriber),
          useValue: {
            findOne: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockResolvedValue(mockSubscriber),
          },
        },
      ],
    }).compile()

    repo = module.get(NewsletterRepository)
    model = module.get(getModelToken(NewsletterSubscriber))
  })

  it('findByEmail retourne null si non trouvé', async () => {
    expect(await repo.findByEmail('new@test.com')).toBeNull()
  })

  it('findByEmail retourne le subscriber s\'il existe', async () => {
    model.findOne.mockResolvedValue(mockSubscriber)
    expect(await repo.findByEmail('sub@test.com')).toEqual(mockSubscriber)
  })

  it('create insère un nouvel abonné', async () => {
    const result = await repo.create('new@test.com')
    expect(model.create).toHaveBeenCalledWith(expect.objectContaining({ email: 'new@test.com' }))
    expect(result).toEqual(mockSubscriber)
  })
})
