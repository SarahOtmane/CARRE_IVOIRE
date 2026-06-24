import type { INestApplication } from '@nestjs/common'
import { getModelToken } from '@nestjs/sequelize'
import request from 'supertest'
import { createTestApp } from './setup-app'
import { User } from '@/modules/users/users.model'

describe('Accès admin (e2e)', () => {
  let app: INestApplication
  const runId = Date.now()
  const clientEmail = `client-${runId}@example.com`
  const adminEmail = `admin-${runId}@example.com`
  const password = 'MotDePasse123!'

  beforeAll(async () => {
    app = await createTestApp()
  })

  afterAll(async () => {
    const userModel = app.get<typeof User>(getModelToken(User))
    await userModel.destroy({ where: { email: [clientEmail, adminEmail] } })
    await app.close()
  })

  async function registerAndLogin(email: string): Promise<string> {
    await request(app.getHttpServer()).post('/api/v1/auth/register').send({
      email,
      password,
      firstName: 'Test',
      lastName: 'E2E',
    })
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email, password })
    return res.body.data.accessToken
  }

  it('refuse l’accès à la liste des commandes pour un client (FORBIDDEN)', async () => {
    const token = await registerAndLogin(clientEmail)

    const res = await request(app.getHttpServer())
      .get('/api/v1/orders')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(403)
    expect(res.body).toMatchObject({
      success: false,
      error: { code: 'FORBIDDEN' },
    })
  })

  it('autorise l’accès à la liste des commandes pour un administrateur', async () => {
    await registerAndLogin(adminEmail)
    const userModel = app.get<typeof User>(getModelToken(User))
    await userModel.update({ role: 'admin' }, { where: { email: adminEmail } })

    // Le rôle est encodé dans le JWT au moment de la connexion — il faut se reconnecter
    // après la promotion pour obtenir un token reflétant le nouveau rôle.
    const loginRes = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: adminEmail, password })
    const adminToken = loginRes.body.data.accessToken

    const res = await request(app.getHttpServer())
      .get('/api/v1/orders')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
  })

  it('refuse toute requête sans token (UNAUTHORIZED)', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/orders')
    expect(res.status).toBe(401)
    expect(res.body).toMatchObject({
      success: false,
      error: { code: 'UNAUTHORIZED' },
    })
  })
})
