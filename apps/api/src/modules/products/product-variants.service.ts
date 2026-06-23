import { Injectable } from '@nestjs/common'
import { ErrorCodes } from '@/common/constants'
import throwApiError from '@/common/errors/throw-api-error'
import { ProductVariantsRepository } from './product-variants.repository'
import { ProductsRepository } from './products.repository'
import type { CreateVariantDto } from './dto/create-variant.dto'
import type { UpdateVariantDto } from './dto/update-variant.dto'
import type { VariantResponseDto } from './dto/variant-response.dto'
import { toVariantResponseDto } from './mappers/variant.mapper'

@Injectable()
export class ProductVariantsService {
  constructor(
    private readonly variantsRepository: ProductVariantsRepository,
    private readonly productsRepository: ProductsRepository,
  ) { }

  async findByProductId(productId: number): Promise<VariantResponseDto[]> {
    const variants = await this.variantsRepository.findByProductId(productId)
    return variants.map((v) => toVariantResponseDto(v))
  }

  async create(productId: number, dto: CreateVariantDto): Promise<VariantResponseDto> {
    const product = await this.productsRepository.findById(productId)
    if (!product) {
      throwApiError(ErrorCodes.PRODUCT_NOT_FOUND, 'Produit introuvable')
    }
    const variant = await this.variantsRepository.create(productId, dto)
    return toVariantResponseDto(variant)
  }

  async update(productId: number, variantId: number, dto: UpdateVariantDto): Promise<VariantResponseDto> {
    const existing = await this.variantsRepository.findById(variantId)
    if (!existing || existing.productId !== productId) {
      throwApiError(ErrorCodes.VARIANT_NOT_FOUND, 'Variante introuvable')
    }
    const updated = await this.variantsRepository.update(variantId, dto)
    return toVariantResponseDto(updated!)
  }

  async delete(productId: number, variantId: number): Promise<void> {
    const existing = await this.variantsRepository.findById(variantId)
    if (!existing || existing.productId !== productId) {
      throwApiError(ErrorCodes.VARIANT_NOT_FOUND, 'Variante introuvable')
    }
    await this.variantsRepository.delete(variantId)
  }
}
