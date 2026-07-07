import { Test } from '@nestjs/testing'
import { HealthController } from './health.controller'

describe('HealthController', () => {
  let controller: HealthController

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile()
    controller = module.get(HealthController)
  })

  it('check retourne status "ok" avec un timestamp ISO', () => {
    const result = controller.check()
    expect(result.status).toBe('ok')
    expect(typeof result.timestamp).toBe('string')
    expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp)
  })
})
