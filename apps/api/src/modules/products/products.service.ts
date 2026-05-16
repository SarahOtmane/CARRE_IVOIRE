import { Injectable, NotFoundException } from '@nestjs/common'
import { ErrorCodes } from '@/common/constants'
import { ProductsRepository } from './products.repository'
import type { Product } from './product.model'
import type { Category } from '@/modules/categories/category.model'
import type { CreateProductDto } from './dto/create-product.dto'
import type { UpdateProductDto } from './dto/update-product.dto'
import type { ProductQueryDto } from './dto/product-query.dto'
import type { ProductResponseDto } from './dto/product-response.dto'

export interface PaginatedProducts {
  items: ProductResponseDto[]
  total: number
  page: number
  limit: number
  totalPages: number
}

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) { }

  async findAll(query: ProductQueryDto): Promise<PaginatedProducts> {
    const { rows, count } = await this.productsRepository.findAll(query)
    const limit = Math.min(query.limit ?? 12, 50)
    const page = query.page ?? 1
    return {
      items: rows.map((p) => this.toResponseDto(p)),
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    }
  }

  async findBySlug(slug: string): Promise<ProductResponseDto> {
    const product = await this.productsRepository.findBySlug(slug)
    if (!product) {
      throw new NotFoundException({ code: ErrorCodes.PRODUCT_NOT_FOUND, message: 'Produit introuvable' })
    }
    return this.toResponseDto(product)
  }

  async create(dto: CreateProductDto): Promise<ProductResponseDto> {
    const product = await this.productsRepository.create(dto)
    return this.toResponseDto(product)
  }

  async update(id: number, dto: UpdateProductDto): Promise<ProductResponseDto> {
    const existing = await this.productsRepository.findById(id)
    if (!existing) {
      throw new NotFoundException({ code: ErrorCodes.PRODUCT_NOT_FOUND, message: 'Produit introuvable' })
    }
    const updated = await this.productsRepository.update(id, dto)
    return this.toResponseDto(updated!)
  }

  async delete(id: number): Promise<void> {
    const existing = await this.productsRepository.findById(id)
    if (!existing) {
      throw new NotFoundException({ code: ErrorCodes.PRODUCT_NOT_FOUND, message: 'Produit introuvable' })
    }
    await this.productsRepository.delete(id)
  }

  private toResponseDto(p: Product): ProductResponseDto {
    const cat = p.category as Category | undefined
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      shortDescription: p.shortDescription ?? undefined,
      description: p.description ?? undefined,
      price: p.price,
      discountPrice: p.discountPrice ?? undefined,
      imageUrl: p.imageUrl ?? undefined,
      images: p.images ?? undefined,
      categoryId: p.categoryId,
      category: cat ? { id: cat.id, name: cat.name, slug: cat.slug } : undefined,
      stock: p.stock,
      stockStatus: p.stockStatus,
      isActive: p.isActive === 1,
      isSeasonal: p.isSeasonal === 1,
      displayOrder: p.displayOrder,
      badge: p.badge ?? undefined,
      ingredients: p.ingredients ?? undefined,
      allergens: p.allergens ?? undefined,
      weightGrams: p.weightGrams ?? undefined,
      createdAt: p.created_at?.toISOString(),
      updatedAt: p.updated_at?.toISOString(),
    }
  }
}
