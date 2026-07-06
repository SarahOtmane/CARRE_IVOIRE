import { Test } from '@nestjs/testing'
import { getModelToken } from '@nestjs/sequelize'
import { TaxRatesRepository } from './tax-rates.repository'
import { TaxRate } from './tax-rate.model'

describe('TaxRatesRepository', () => {
  let repo: TaxRatesRepository
  let model: {
    findAll: jest.Mock
    findByPk: jest.Mock
    create: jest.Mock
    update: jest.Mock
    destroy: jest.Mock
  }

  const mockRow = { id: 1, label: 'Standard', rate: 20, isDefault: 1 }

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TaxRatesRepository,
        {
          provide: getModelToken(TaxRate),
          useValue: {
            findAll: jest.fn().mockResolvedValue([mockRow]),
            findByPk: jest.fn().mockResolvedValue(mockRow),
            create: jest.fn().mockResolvedValue(mockRow),
            update: jest.fn().mockResolvedValue([1]),
            destroy: jest.fn().mockResolvedValue(1),
          },
        },
      ],
    }).compile()

    repo = module.get(TaxRatesRepository)
    model = module.get(getModelToken(TaxRate))
  })

  it('findAll retourne les taux triés par rate', async () => {
    const result = await repo.findAll()
    expect(model.findAll).toHaveBeenCalledWith({ order: [['rate', 'ASC']] })
    expect(result).toHaveLength(1)
  })

  it('findById retourne le taux par PK', async () => {
    const result = await repo.findById(1)
    expect(model.findByPk).toHaveBeenCalledWith(1, expect.objectContaining({ transaction: undefined }))
    expect(result).toEqual(mockRow)
  })

  it('create crée un taux avec isDefault converti en 0/1', async () => {
    await repo.create({ label: 'Réduit', rate: 5.5, isDefault: true })
    expect(model.create).toHaveBeenCalledWith(
      expect.objectContaining({ label: 'Réduit', rate: 5.5, isDefault: 1 }),
      expect.anything(),
    )
  })

  it('create avec isDefault=false → 0', async () => {
    await repo.create({ label: 'Réduit', rate: 5.5, isDefault: false })
    expect(model.create).toHaveBeenCalledWith(
      expect.objectContaining({ isDefault: 0 }),
      expect.anything(),
    )
  })

  it('update ne modifie que les champs définis', async () => {
    await repo.update(1, { label: 'Nouveau label' })
    const call = model.update.mock.calls[0]
    expect(call[0]).toEqual({ label: 'Nouveau label' })
  })

  it('update convertit isDefault=false en 0', async () => {
    await repo.update(1, { rate: 10, isDefault: false })
    const call = model.update.mock.calls[0]
    expect(call[0]).toEqual({ rate: 10, isDefault: 0 })
  })

  it('update retourne null si le taux n\'existe plus', async () => {
    model.findByPk.mockResolvedValue(null)
    const result = await repo.update(99, { label: 'X' })
    expect(result).toBeNull()
  })

  it('clearDefault met isDefault à 0 sur tous', async () => {
    await repo.clearDefault()
    expect(model.update).toHaveBeenCalledWith({ isDefault: 0 }, expect.objectContaining({ where: {} }))
  })

  it('delete supprime par id', async () => {
    await repo.delete(1)
    expect(model.destroy).toHaveBeenCalledWith({ where: { id: 1 } })
  })
})
