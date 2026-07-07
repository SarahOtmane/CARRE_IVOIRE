import type { ProductVariant } from '../product-variant.model'
import type { VariantResponseDto } from '../dto/variant-response.dto'
import type { TaxRate } from '@/modules/tax-rates/tax-rate.model'

export function toVariantResponseDto(v: ProductVariant): VariantResponseDto {
  const tax = v.taxRate as TaxRate | undefined | null
  return {
    id: v.id,
    productId: v.productId,
    label: v.label,
    weightGrams: v.weightGrams ?? undefined,
    price: v.price,
    priceTtc: tax ? Math.round(v.price * (1 + Number(tax.rate) / 100)) : undefined,
    taxRateId: v.taxRateId ?? undefined,
    taxRate: tax ? { id: tax.id, label: tax.label, rate: Number(tax.rate), isDefault: tax.isDefault === 1 } : undefined,
    stock: v.stock,
    stockStatus: v.stockStatus,
    displayOrder: v.displayOrder,
    isActive: v.isActive === 1,
    createdAt: v.created_at?.toISOString(),
    updatedAt: v.updated_at?.toISOString(),
  }
}
