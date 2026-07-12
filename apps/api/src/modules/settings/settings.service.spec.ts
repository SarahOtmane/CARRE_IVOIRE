import { Test } from '@nestjs/testing'
import { SettingsService } from './settings.service'
import { SettingsRepository } from './settings.repository'

describe('SettingsService', () => {
  let service: SettingsService
  let repo: jest.Mocked<SettingsRepository>

  const rawSettings = {
    shipping_flat: '800',
    shipping_free_from: '7000',
    bcc_email: 'bcc@test.com',
    address: '29 rue de Vauparfonds',
    logo_url: 'https://example.com/logo.webp',
  }

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SettingsService,
        {
          provide: SettingsRepository,
          useValue: {
            getAll: jest.fn().mockResolvedValue(rawSettings),
            setMany: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile()

    service = module.get(SettingsService)
    repo = module.get(SettingsRepository)
  })

  describe('getAll', () => {
    it('parse les valeurs brutes en nombres', async () => {
      const result = await service.getAll()
      expect(result.shippingFlat).toBe(800)
      expect(result.shippingFreeFrom).toBe(7000)
      expect(result.bccEmail).toBe('bcc@test.com')
      expect(result.address).toBe('29 rue de Vauparfonds')
      expect(result.logoUrl).toBe('https://example.com/logo.webp')
    })

    it('utilise les valeurs par défaut si les clés sont absentes', async () => {
      repo.getAll.mockResolvedValue({ shipping_flat: undefined as any, shipping_free_from: undefined as any })
      const result = await service.getAll()
      expect(result.shippingFlat).toBe(800)
      expect(result.shippingFreeFrom).toBe(7000)
    })
  })

  describe('update', () => {
    it('convertit les champs en string et appelle setMany', async () => {
      await service.update({ shippingFlat: 500, bccEmail: 'new@test.com' })
      expect(repo.setMany).toHaveBeenCalledWith(
        expect.objectContaining({ shipping_flat: '500', bcc_email: 'new@test.com' }),
      )
    })

    it('inclut shippingFreeFrom et address dans les entrées', async () => {
      await service.update({ shippingFreeFrom: 5000, address: '29 rue de Vauparfonds' })
      expect(repo.setMany).toHaveBeenCalledWith(
        expect.objectContaining({ shipping_free_from: '5000', address: '29 rue de Vauparfonds' }),
      )
    })

    it('inclut logoUrl dans les entrées', async () => {
      await service.update({ logoUrl: 'https://example.com/new-logo.webp' })
      expect(repo.setMany).toHaveBeenCalledWith(
        expect.objectContaining({ logo_url: 'https://example.com/new-logo.webp' }),
      )
    })

    it('n\'appelle pas setMany si le DTO est vide', async () => {
      await service.update({})
      expect(repo.setMany).not.toHaveBeenCalled()
    })

    it('retourne les settings mis à jour', async () => {
      const result = await service.update({ shippingFlat: 500 })
      expect(result.shippingFlat).toBe(800) // valeur mockée par getAll
    })
  })
})
