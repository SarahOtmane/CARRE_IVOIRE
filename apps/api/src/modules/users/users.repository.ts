import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { User } from './users.model'

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
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ where: { email } })
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
        { ...data, customer_number: `TEMP-${Date.now()}` } as any,
        { transaction: t },
      )
      // customer_number définitif basé sur l'ID auto-incrémenté
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
      const customerNumber = `CI-${dateStr}-${String(user.id).padStart(4, '0')}`
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
    if (!user) throw new NotFoundException({ code: 'USER_NOT_FOUND', message: 'Utilisateur introuvable' })
    return user.update(data)
  }

  async emailExists(email: string): Promise<boolean> {
    const count = await this.userModel.count({ where: { email } })
    return count > 0
  }
}
