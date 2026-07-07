import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'
import { createHash } from 'crypto'
import { ErrorCodes } from '@/common/constants'
import { User } from './users.model'
import throwApiError from '@/common/errors/throw-api-error'
import type { UserQueryDto } from './dto/user-query.dto'

export interface UsersPage {
  items: User[]
  total: number
  page: number
  totalPages: number
}

export interface CreateUserInput {
  email: string
  password_hash: string
  first_name: string
  last_name: string
  role?: 'client' | 'admin'
}

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) { }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ where: { email: email.toLowerCase().trim() } })
  }

  async findById(id: number): Promise<User | null> {
    return this.userModel.findByPk(id)
  }

  async create(data: CreateUserInput): Promise<User> {
    const sequelize = this.userModel.sequelize!
    const t = await sequelize.transaction()
    try {
      // Création initiale avec un customer_number temporaire unique
      const user = await this.userModel.create(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { ...data, email: data.email.toLowerCase().trim(), customer_number: `TEMP-${Date.now()}` } as any,
        { transaction: t },
      )
      // customer_number basé uniquement sur l'ID — pas de collision par date
      const customerNumber = `CI-${String(user.id).padStart(8, '0')}`
      await user.update({ customer_number: customerNumber }, { transaction: t })
      await t.commit()
      return user
    } catch (err) {
      await t.rollback()
      throw err
    }
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    const user = await this.findById(id)
    if (!user) throwApiError(ErrorCodes.USER_NOT_FOUND, 'Utilisateur introuvable')
    return user.update(data)
  }

  async delete(id: number): Promise<void> {
    const user = await this.findById(id)
    if (!user) throwApiError(ErrorCodes.USER_NOT_FOUND, 'Utilisateur introuvable')
    await user.destroy()
  }

  async findAll(query: UserQueryDto): Promise<UsersPage> {
    const page = query.page ?? 1
    const limit = query.limit ?? 25
    const offset = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (query.search) {
      where[Op.or as unknown as string] = [
        { email: { [Op.like]: `%${query.search}%` } },
        { first_name: { [Op.like]: `%${query.search}%` } },
        { last_name: { [Op.like]: `%${query.search}%` } },
      ]
    }

    const { count, rows } = await this.userModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']],
      attributes: { exclude: ['password_hash', 'resetToken', 'resetTokenExpires'] },
    })

    return {
      items: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    }
  }

  async emailExists(email: string): Promise<boolean> {
    const count = await this.userModel.count({ where: { email: email.toLowerCase().trim() } })
    return count > 0
  }

  async findByResetToken(token: string): Promise<User | null> {
    const tokenHash = createHash('sha256').update(token).digest('hex')
    return this.userModel.findOne({
      where: {
        resetToken: tokenHash,
        resetTokenExpires: { [Op.gt]: new Date() },
      },
    })
  }

  async setResetToken(id: number, token: string, expiresAt: Date): Promise<void> {
    const tokenHash = createHash('sha256').update(token).digest('hex')
    await this.userModel.update({ resetToken: tokenHash, resetTokenExpires: expiresAt } as any, { where: { id } })
  }

  async clearResetToken(id: number, newPasswordHash: string): Promise<void> {
    await this.userModel.update(
      { password_hash: newPasswordHash, resetToken: null, resetTokenExpires: null } as any,
      { where: { id } },
    )
  }
}
