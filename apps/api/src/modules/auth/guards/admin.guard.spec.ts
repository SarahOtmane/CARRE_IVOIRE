import type { ExecutionContext } from '@nestjs/common'
import { AdminGuard } from './admin.guard'

function makeContext(user: unknown): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  } as unknown as ExecutionContext
}

describe('AdminGuard', () => {
  let guard: AdminGuard

  beforeEach(() => {
    guard = new AdminGuard()
  })

  it('lève FORBIDDEN si aucun utilisateur sur la requête', () => {
    expect(() => guard.canActivate(makeContext(undefined))).toThrowError(
      expect.objectContaining({
        response: expect.objectContaining({ code: 'FORBIDDEN' }),
      }),
    )
  })

  it('lève FORBIDDEN pour un utilisateur authentifié avec le rôle client', () => {
    expect(() =>
      guard.canActivate(makeContext({ id: 1, email: 'jean@example.com', role: 'client' })),
    ).toThrowError(
      expect.objectContaining({
        response: expect.objectContaining({ code: 'FORBIDDEN' }),
      }),
    )
  })

  it('autorise un utilisateur authentifié avec le rôle admin', () => {
    expect(
      guard.canActivate(makeContext({ id: 1, email: 'admin@example.com', role: 'admin' })),
    ).toBe(true)
  })
})
