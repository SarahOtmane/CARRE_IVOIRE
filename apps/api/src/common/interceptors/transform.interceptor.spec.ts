import { of } from 'rxjs'
import { TransformInterceptor } from './transform.interceptor'

describe('TransformInterceptor', () => {
  let interceptor: TransformInterceptor

  beforeEach(() => {
    interceptor = new TransformInterceptor()
  })

  it('enveloppe les données dans { success, data, timestamp }', (done) => {
    const next = { handle: () => of({ id: 1 }) } as any
    const result$ = interceptor.intercept({} as any, next)
    result$.subscribe((value: any) => {
      expect(value.success).toBe(true)
      expect(value.data).toEqual({ id: 1 })
      expect(typeof value.timestamp).toBe('string')
      done()
    })
  })

  it('passe null correctement', (done) => {
    const next = { handle: () => of(null) } as any
    interceptor.intercept({} as any, next).subscribe((value: any) => {
      expect(value.success).toBe(true)
      expect(value.data).toBeNull()
      done()
    })
  })

  it('passe un tableau correctement', (done) => {
    const next = { handle: () => of([1, 2, 3]) } as any
    interceptor.intercept({} as any, next).subscribe((value: any) => {
      expect(value.data).toEqual([1, 2, 3])
      done()
    })
  })
})
