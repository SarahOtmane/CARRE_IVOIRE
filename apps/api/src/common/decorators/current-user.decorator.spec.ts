import { ExecutionContext } from '@nestjs/common'
import { CurrentUser } from './current-user.decorator'
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants'

function getFactory() {
  class Test {
    test(@CurrentUser() _user: any) {}
  }
  const meta = Reflect.getMetadata(ROUTE_ARGS_METADATA, Test, 'test')
  const key = Object.keys(meta)[0]
  return meta[key].factory as (data: unknown, ctx: ExecutionContext) => any
}

describe('CurrentUser decorator', () => {
  it('retourne request.user depuis le contexte HTTP', () => {
    const mockUser = { id: 1, email: 'test@example.com', role: 'client' as const }
    const ctx = {
      switchToHttp: () => ({
        getRequest: () => ({ user: mockUser }),
      }),
    } as unknown as ExecutionContext

    const factory = getFactory()
    const result = factory(undefined, ctx)
    expect(result).toEqual(mockUser)
  })

  it('retourne undefined si request.user est absent', () => {
    const ctx = {
      switchToHttp: () => ({ getRequest: () => ({}) }),
    } as unknown as ExecutionContext

    const factory = getFactory()
    expect(factory(undefined, ctx)).toBeUndefined()
  })
})
