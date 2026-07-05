import { Test } from '@nestjs/testing'
import { getModelToken } from '@nestjs/sequelize'
import { SettingsRepository } from './settings.repository'
import { Setting } from './setting.model'

describe('SettingsRepository', () => {
  let repo: SettingsRepository
  let model: { findAll: jest.Mock; upsert: jest.Mock }

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SettingsRepository,
        {
          provide: getModelToken(Setting),
          useValue: {
            findAll: jest.fn().mockResolvedValue([
              { key: 'shipping_flat', value: '900' },
              { key: 'bcc_email', value: 'bcc@test.com' },
            ]),
            upsert: jest.fn().mockResolvedValue([{}, true]),
          },
        },
      ],
    }).compile()

    repo = module.get(SettingsRepository)
    model = module.get(getModelToken(Setting))
  })

  describe('getAll', () => {
    it('fusionne les valeurs DB sur les défauts', async () => {
      const result = await repo.getAll()
      expect(result.shipping_flat).toBe('900')
      expect(result.shipping_free_from).toBe('7000')
      expect(result.bcc_email).toBe('bcc@test.com')
    })

    it('retourne les défauts si la table est vide', async () => {
      model.findAll.mockResolvedValue([])
      const result = await repo.getAll()
      expect(result.shipping_flat).toBe('800')
    })

    it('utilise chaîne vide si value est null', async () => {
      model.findAll.mockResolvedValue([{ key: 'bcc_email', value: null }])
      const result = await repo.getAll()
      expect(result.bcc_email).toBe('')
    })

    it('retourne logo_url vide par défaut', async () => {
      model.findAll.mockResolvedValue([])
      const result = await repo.getAll()
      expect(result.logo_url).toBe('')
    })

    it('fusionne logo_url depuis la DB', async () => {
      model.findAll.mockResolvedValue([{ key: 'logo_url', value: 'https://example.com/logo.webp' }])
      const result = await repo.getAll()
      expect(result.logo_url).toBe('https://example.com/logo.webp')
    })
  })

  describe('set', () => {
    it('upsert la clé-valeur', async () => {
      await repo.set('shipping_flat', '1200')
      expect(model.upsert).toHaveBeenCalledWith(expect.objectContaining({ key: 'shipping_flat', value: '1200' }))
    })
  })

  describe('setMany', () => {
    it('appelle set pour chaque entrée', async () => {
      await repo.setMany({ shipping_flat: '500', bcc_email: 'new@test.com' })
      expect(model.upsert).toHaveBeenCalledTimes(2)
    })
  })
})
