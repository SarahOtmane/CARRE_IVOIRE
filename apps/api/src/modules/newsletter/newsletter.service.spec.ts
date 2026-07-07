import { Test } from '@nestjs/testing'
import { NewsletterService } from './newsletter.service'
import { NewsletterRepository } from './newsletter.repository'

describe('NewsletterService', () => {
  let service: NewsletterService
  let repo: jest.Mocked<NewsletterRepository>

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        NewsletterService,
        {
          provide: NewsletterRepository,
          useValue: {
            findByEmail: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockResolvedValue({ id: 1, email: 'jean@example.com' }),
          },
        },
      ],
    }).compile()

    service = module.get(NewsletterService)
    repo = module.get(NewsletterRepository)
  })

  it('crée un nouvel abonné et normalise l’email (trim + lowercase)', async () => {
    const result = await service.subscribe('  Jean@Example.com  ')
    expect(repo.create).toHaveBeenCalledWith('jean@example.com')
    expect(result).toEqual({ email: 'jean@example.com' })
  })

  it('reste idempotent si l’email est déjà inscrit (pas de doublon, pas d’erreur)', async () => {
    repo.findByEmail.mockResolvedValue({ id: 1, email: 'jean@example.com' } as any)
    const result = await service.subscribe('jean@example.com')
    expect(repo.create).not.toHaveBeenCalled()
    expect(result).toEqual({ email: 'jean@example.com' })
  })
})
