import { JwtAuthGuard } from './jwt-auth.guard'

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard

  beforeEach(() => {
    guard = new JwtAuthGuard()
  })

  describe('handleRequest', () => {
    it('lève UNAUTHORIZED si aucun utilisateur (token absent ou rejeté par la stratégie)', () => {
      expect(() => guard.handleRequest(null, false)).toThrowError(
        expect.objectContaining({
          response: expect.objectContaining({ code: 'UNAUTHORIZED' }),
        }),
      )
    })

    it('relance l’erreur de la stratégie passport (ex. token invalide)', () => {
      const strategyError = new Error('invalid signature')
      expect(() => guard.handleRequest(strategyError, false)).toThrow(strategyError)
    })

    it('relance l’erreur de la stratégie passport pour un token expiré', () => {
      const expiredError = Object.assign(new Error('jwt expired'), { name: 'TokenExpiredError' })
      expect(() => guard.handleRequest(expiredError, false)).toThrow(expiredError)
    })

    it('retourne l’utilisateur si le token est valide', () => {
      const user = { id: 1, email: 'jean@example.com', role: 'client' }
      expect(guard.handleRequest(null, user)).toBe(user)
    })
  })
})
