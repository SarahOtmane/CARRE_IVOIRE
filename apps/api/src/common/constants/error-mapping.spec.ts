import { getHttpStatusFromErrorCode, ErrorCodes } from './index'

describe('getHttpStatusFromErrorCode', () => {
  it('retourne 404 pour NOT_FOUND', () => {
    expect(getHttpStatusFromErrorCode(ErrorCodes.NOT_FOUND)).toBe(404)
  })

  it('retourne 500 pour un code inconnu (branche ?? 500)', () => {
    expect(getHttpStatusFromErrorCode('UNKNOWN_CODE_XYZ' as any)).toBe(500)
  })
})
