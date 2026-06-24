import { Sequelize } from 'sequelize-typescript'
import { createTestApp } from './setup-app'

// Crée le schéma de la base de test UNE SEULE FOIS (lancé seul, avant la suite e2e via
// le script npm `pretest:e2e`). Les autres specs bootent ensuite avec synchronize:false —
// voir le commentaire dans database.config.ts pour le pourquoi.
describe('Provisioning du schéma de test', () => {
  it('synchronise le schéma sur la base de test', async () => {
    const app = await createTestApp()
    const sequelize = app.get(Sequelize)
    await sequelize.sync()
    await app.close()
  })
})
