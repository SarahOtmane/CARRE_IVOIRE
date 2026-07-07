import { JwtStrategy } from './jwt.strategy'

describe('JwtStrategy', () => {
  let strategy: JwtStrategy

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret'
    strategy = new JwtStrategy()
  })

  it('retourne un JwtUser depuis le payload', () => {
    const payload = { sub: 42, email: 'admin@test.com', role: 'admin' as const }
    const result = strategy.validate(payload)
    expect(result).toEqual({ id: 42, email: 'admin@test.com', role: 'admin' })
  })

  it('mappe sub → id correctement', () => {
    const payload = { sub: 7, email: 'user@test.com', role: 'client' as const }
    expect(strategy.validate(payload).id).toBe(7)
  })

})
