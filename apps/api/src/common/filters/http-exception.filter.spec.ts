import { HttpException, HttpStatus, Logger } from '@nestjs/common'
import { HttpExceptionFilter } from './http-exception.filter'

function buildHost(jsonMock: jest.Mock) {
  const res = { status: jest.fn().mockReturnThis(), json: jsonMock }
  return {
    switchToHttp: () => ({ getResponse: () => res, getRequest: () => ({}) }),
  } as any
}

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter
  const jsonMock = jest.fn()

  beforeEach(() => {
    filter = new HttpExceptionFilter()
    jsonMock.mockClear()
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {})
  })

  it('formate une HttpException avec code métier', () => {
    const exc = new HttpException({ code: 'PRODUCT_NOT_FOUND', message: 'Produit introuvable' }, HttpStatus.NOT_FOUND)
    filter.catch(exc, buildHost(jsonMock))
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({ code: 'PRODUCT_NOT_FOUND', message: 'Produit introuvable' }),
      }),
    )
  })

  it('formate une HttpException sans code métier (utilise le statut HTTP)', () => {
    const exc = new HttpException('Not found', HttpStatus.NOT_FOUND)
    filter.catch(exc, buildHost(jsonMock))
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({ statusCode: 404 }),
      }),
    )
  })

  it('retourne 500 pour une erreur non-HttpException et masque le message', () => {
    filter.catch(new Error('crash inattendu'), buildHost(jsonMock))
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({ code: 'INTERNAL_SERVER_ERROR', statusCode: 500 }),
      }),
    )
  })

  it('gère une exception non-Error (string, objet)', () => {
    filter.catch('raw string error', buildHost(jsonMock))
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({ success: false }),
    )
  })

  it('inclut un timestamp dans chaque réponse', () => {
    const exc = new HttpException('Forbidden', HttpStatus.FORBIDDEN)
    filter.catch(exc, buildHost(jsonMock))
    const call = jsonMock.mock.calls[0][0]
    expect(typeof call.timestamp).toBe('string')
  })
})
