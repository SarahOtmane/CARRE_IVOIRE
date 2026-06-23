export enum UserRole {
  CLIENT = 'client',
  ADMIN = 'admin',
}

export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  role: UserRole
  phone?: string
  createdAt: string
  updatedAt: string
}

export type UserResponse = User

export interface UserProfile extends User {
  ordersCount: number
  favoritesCount: number
}

export interface UpdateUserDto {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  password?: string
}
