import { Test } from '@nestjs/testing'
import { getConnectionToken } from '@nestjs/sequelize'
import { TaxRatesService } from './tax-rates.service'
import { TaxRatesRepository } from './tax-rates.repository'

const mockTransaction = { commit: jest.fn(), rollback: jest.fn() }
const mockSequelize = { transaction: jest.fn((cb) => cb(mockTransaction)) }

const mockRow = { id: 1, label: 'Standard', rate: 20, isDefault: 1 }

describe('TaxRatesService', () => {
  let service: TaxRatesService
  let repo: jest.Mocked<TaxRatesRepository>

  beforeEach(async () => {
    mockSequelize.transaction.mockImplementation((cb) => cb(mockTransaction))

    const module = await Test.createTestingModule({
      providers: [
        TaxRatesService,
        { provide: getConnectionToken(), useValue: mockSequelize },
        {
          provide: TaxRatesRepository,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn().mockResolvedValue(mockRow),
            create: jest.fn().mockResolvedValue(mockRow),
            update: jest.fn().mockResolvedValue(mockRow),
            clearDefault: jest.fn().mockResolvedValue([0]),
            delete: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get(TaxRatesService)
    repo = module.get(TaxRatesRepository)
  })

  describe('create', () => {
    it('englobe clearDefault + create dans la même transaction quand isDefault=true', async () => {
      await service.create({ label: 'Réduit', rate: 5.5, isDefault: true })
      expect(repo.clearDefault).toHaveBeenCalledWith(mockTransaction)
      expect(repo.create).toHaveBeenCalledWith(
        { label: 'Réduit', rate: 5.5, isDefault: true },
        mockTransaction,
      )
    })

    it("n'appelle pas clearDefault quand isDefault n'est pas demandé", async () => {
      await service.create({ label: 'Réduit', rate: 5.5 })
      expect(repo.clearDefault).not.toHaveBeenCalled()
      expect(repo.create).toHaveBeenCalledWith({ label: 'Réduit', rate: 5.5 }, mockTransaction)
    })
  })

  describe('update', () => {
    it('englobe clearDefault + update dans la même transaction quand isDefault=true', async () => {
      await service.update(1, { isDefault: true })
      expect(repo.clearDefault).toHaveBeenCalledWith(mockTransaction)
      expect(repo.update).toHaveBeenCalledWith(1, { isDefault: true }, mockTransaction)
    })

    it('lève TAX_RATE_NOT_FOUND si le taux est introuvable', async () => {
      repo.findById.mockResolvedValue(null)
      await expect(service.update(99, { isDefault: true })).rejects.toMatchObject({
        response: expect.objectContaining({ code: 'TAX_RATE_NOT_FOUND' }),
      })
      expect(repo.clearDefault).not.toHaveBeenCalled()
    })
  })
})
