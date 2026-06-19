import { Injectable } from '@nestjs/common'
import { ErrorCodes } from '@/common/constants'
import throwApiError from '@/common/errors/throw-api-error'
import { ProductVariantsRepository } from './product-variants.repository'
import { ProductsRepository } from './products.repository'
import type { ProductVariant } from './product-variant.model'
import type { CreateVariantDto } from './dto/create-variant.dto'
import type { UpdateVariantDto } from './dto/update-variant.dto'
import type { VariantResponseDto } from './dto/variant-response.dto'

@Injectable()
export class ProductVariantsService {
  constructor(
    private readonly variantsRepository: ProductVariantsRepository,
    private readonly productsRepository: ProductsRepository,
  ) { }

  async findByProductId(productId: number): Promise<VariantResponseDto[]> {
    const variants = await this.variantsRepository.findByProductId(productId)
    return variants.map((v) => this.toResponseDto(v))
  }

  async create(productId: number, dto: CreateVariantDto): Promise<VariantResponseDto> {
    const product = await this.productsRepository.findById(productId)
    if (!product) {
      throwApiError(ErrorCodes.PRODUCT_NOT_FOUND, 'Produit introuvable')
    }
    const variant = await this.variantsRepository.create(productId, dto)
    return this.toResponseDto(variant)
  }

  async update(productId: number, variantId: number, dto: UpdateVariantDto): Promise<VariantResponseDto> {
    const existing = await this.variantsRepository.findById(variantId)
    if (!existing || existing.productId !== productId) {
      throwApiError(ErrorCodes.VARIANT_NOT_FOUND, 'Variante introuvable')
    }
    const updated = await this.variantsRepository.update(variantId, dto)
    return this.toResponseDto(updated!)
  }

  async delete(productId: number, variantId: number): Promise<void> {
    const existing = await this.variantsRepository.findById(variantId)
    if (!existing || existing.productId !== productId) {
      throwApiError(ErrorCodes.VARIANT_NOT_FOUND, 'Variante introuvable')
    }
    await this.variantsRepository.delete(variantId)
  }

  private toResponseDto(v: ProductVariant): VariantResponseDto {
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
}
