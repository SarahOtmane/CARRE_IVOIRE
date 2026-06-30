import { stripeConfig } from './stripe.config'

describe('stripeConfig', () => {
  const ORIGINAL_ENV = process.env

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV }
  })

  afterAll(() => {
    process.env = ORIGINAL_ENV
  })

  it('retourne la config si les deux clés sont définies', () => {
    process.env.STRIPE_SECRET_KEY = 'sk_test_abc'
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_xyz'
    const config = stripeConfig()
    expect(config.secretKey).toBe('sk_test_abc')
    expect(config.webhookSecret).toBe('whsec_xyz')
    expect(typeof config.apiVersion).toBe('string')
  })

  it('lève une erreur si STRIPE_SECRET_KEY est absent', () => {
    delete process.env.STRIPE_SECRET_KEY
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_xyz'
    expect(() => stripeConfig()).toThrow('STRIPE_SECRET_KEY')
  })

  it('lève une erreur si STRIPE_WEBHOOK_SECRET est absent', () => {
    process.env.STRIPE_SECRET_KEY = 'sk_test_abc'
    delete process.env.STRIPE_WEBHOOK_SECRET
    expect(() => stripeConfig()).toThrow('STRIPE_WEBHOOK_SECRET')
  })
})
