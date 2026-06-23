import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Favorite } from './favorite.model'
import { Product } from '@/modules/products/product.model'
import { Category } from '@/modules/categories/category.model'

@Injectable()
export class FavoritesRepository {
  constructor(@InjectModel(Favorite) private readonly db: typeof Favorite) {}

  async findByUserId(userId: number): Promise<Favorite[]> {
    return this.db.findAll({
      where: { userId },
      include: [{ model: Product, include: [Category] }],
      order: [['created_at', 'DESC']],
    })
  }

  async findOne(userId: number, productId: number): Promise<Favorite | null> {
    return this.db.findOne({ where: { userId, productId } })
  }

  async create(userId: number, productId: number): Promise<Favorite> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Sequelize v6 partial creation attributes not inferred
    return this.db.create({ userId, productId } as any)
  }

  async delete(userId: number, productId: number): Promise<void> {
    await this.db.destroy({ where: { userId, productId } })
  }
}
