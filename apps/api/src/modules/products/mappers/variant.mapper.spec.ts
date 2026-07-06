import { toVariantResponseDto } from './variant.mapper'

const baseVariant = {
  id: 10, productId: 1, label: '70g', price: 390, stock: 50,
  stockStatus: 'in_stock', displayOrder: 1, isActive: 1,
  created_at: new Date('2026-01-01'), updated_at: new Date('2026-01-02'),
}

describe('toVariantResponseDto', () => {
  it('mappe une variante avec weightGrams défini', () => {
    const result = toVariantResponseDto({ ...baseVariant, weightGrams: 70 } as any)
    expect(result.id).toBe(10)
    expect(result.weightGrams).toBe(70)
    expect(result.isActive).toBe(true)
  })

  it('retourne undefined pour weightGrams null (branche ?? undefined)', () => {
    const result = toVariantResponseDto({ ...baseVariant, weightGrams: null } as any)
    expect(result.weightGrams).toBeUndefined()
  })
})
