import { Injectable } from '@nestjs/common'
import { ErrorCodes } from '@/common/constants'
import throwApiError from '@/common/errors/throw-api-error'
import { FavoritesRepository } from './favorites.repository'
import { ProductsRepository } from '@/modules/products/products.repository'

@Injectable()
export class FavoritesService {
  constructor(
    private readonly favoritesRepository: FavoritesRepository,
    private readonly productsRepository: ProductsRepository,
  ) {}

  async findByUser(userId: number) {
    const favorites = await this.favoritesRepository.findByUserId(userId)
    return favorites.map((f) => ({
      id: f.id,
      product: f.product,
      addedAt: f.created_at,
    }))
  }

  async add(userId: number, productId: number) {
    const product = await this.productsRepository.findById(productId)
    if (!product) throwApiError(ErrorCodes.PRODUCT_NOT_FOUND, 'Produit introuvable')

    const existing = await this.favoritesRepository.findOne(userId, productId)
    if (existing) throwApiError(ErrorCodes.FAVORITE_ALREADY_EXISTS, 'Déjà dans vos favoris')

    const favorite = await this.favoritesRepository.create(userId, productId)
    return { id: favorite.id, product, addedAt: favorite.created_at }
  }

  async remove(userId: number, productId: number) {
    const favorite = await this.favoritesRepository.findOne(userId, productId)
    if (!favorite) throwApiError(ErrorCodes.NOT_FOUND, 'Favori introuvable')
    await this.favoritesRepository.delete(userId, productId)
  }
}
