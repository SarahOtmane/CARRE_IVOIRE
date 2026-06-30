import { HttpException } from '@nestjs/common'
import throwApiError from './throw-api-error'
import { ErrorCodes } from '@/common/constants'

describe('throwApiError', () => {
  it('lance une HttpException avec le message fourni', () => {
    expect(() => throwApiError(ErrorCodes.NOT_FOUND, 'Introuvable')).toThrow(HttpException)
    try {
      throwApiError(ErrorCodes.NOT_FOUND, 'Introuvable')
    } catch (e: any) {
      expect(e.response.message).toBe('Introuvable')
    }
  })

  it('utilise le code comme message si aucun message fourni (branche ?? code)', () => {
    try {
      throwApiError(ErrorCodes.NOT_FOUND)
    } catch (e: any) {
      expect(e.response.message).toBe(ErrorCodes.NOT_FOUND)
    }
  })
})
