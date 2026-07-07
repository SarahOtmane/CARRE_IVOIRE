import { Test } from '@nestjs/testing'
import { NewsletterController } from './newsletter.controller'
import { NewsletterService } from './newsletter.service'

describe('NewsletterController', () => {
  let controller: NewsletterController
  let service: jest.Mocked<NewsletterService>

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [NewsletterController],
      providers: [
        {
          provide: NewsletterService,
          useValue: {
            subscribe: jest.fn().mockResolvedValue({ id: 1, email: 'sub@test.com' }),
          },
        },
      ],
    }).compile()

    controller = module.get(NewsletterController)
    service = module.get(NewsletterService)
  })

  it('subscribe délègue à newsletterService.subscribe', async () => {
    const result = await controller.subscribe({ email: 'sub@test.com' })
    expect(service.subscribe).toHaveBeenCalledWith('sub@test.com')
    expect(result).toHaveProperty('id', 1)
  })
})
