import type { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { createTestApp } from './setup-app'

describe('App (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    app = await createTestApp()
  })

  afterAll(async () => {
    await app.close()
  })

  it('GET /api/health répond en dehors du préfixe api/v1', async () => {
    const res = await request(app.getHttpServer()).get('/api/health')
    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({ success: true, data: { status: 'ok' } })
  })

  it('une route inconnue renvoie le format d’erreur standard via le filtre global', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/route-inexistante')
    expect(res.status).toBe(404)
    expect(res.body).toMatchObject({
      success: false,
      error: { code: expect.any(String), message: expect.any(String) },
    })
  })

  it('rejette un body avec un champ non whitelisté (ValidationPipe global)', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'jean@example.com', password: 'whatever123', extraField: 'should-be-rejected' })
    expect(res.status).toBe(400)
  })
})
