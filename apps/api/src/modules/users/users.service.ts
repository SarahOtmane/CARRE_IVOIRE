import { Injectable, NotFoundException } from '@nestjs/common'
import { UsersRepository } from './users.repository'
import type { User } from './users.model'
import type { UpdateUserDto } from './dto/update-user.dto'
import type { UserResponseDto } from './dto/user-response.dto'

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findById(id: number): Promise<UserResponseDto> {
    const user = await this.usersRepository.findById(id)
    if (!user) throw new NotFoundException({ code: 'USER_NOT_FOUND', message: 'Utilisateur introuvable' })
    return this.toResponseDto(user)
  }

  async update(id: number, dto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.usersRepository.update(id, {
      ...(dto.firstName !== undefined && { first_name: dto.firstName }),
      ...(dto.lastName !== undefined && { last_name: dto.lastName }),
      ...(dto.phone !== undefined && { phone: dto.phone }),
      ...(dto.addressStreet !== undefined && { address_street: dto.addressStreet }),
      ...(dto.addressCity !== undefined && { address_city: dto.addressCity }),
      ...(dto.addressZip !== undefined && { address_zip: dto.addressZip }),
      ...(dto.addressCountry !== undefined && { address_country: dto.addressCountry }),
    } as Partial<User>)
    return this.toResponseDto(user)
  }

  toResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      addressStreet: user.address_street,
      addressCity: user.address_city,
      addressZip: user.address_zip,
      addressCountry: user.address_country,
      role: user.role,
      customerNumber: user.customer_number,
      isActive: user.is_active === 1,
      createdAt: user.created_at?.toISOString(),
    }
  }
}
