import type { ProductVariant } from '../product-variant.model'
import type { VariantResponseDto } from '../dto/variant-response.dto'

export function toVariantResponseDto(v: ProductVariant): VariantResponseDto {
  return {
    id: v.id,
    productId: v.productId,
    label: v.label,
    weightGrams: v.weightGrams ?? undefined,
    price: v.price,
    stock: v.stock,
    stockStatus: v.stockStatus,
    displayOrder: v.displayOrder,
    isActive: v.isActive === 1,
    createdAt: v.created_at?.toISOString(),
    updatedAt: v.updated_at?.toISOString(),
  }
}
