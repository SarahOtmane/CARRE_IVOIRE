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

export interface UserProfile extends User {
  ordersCount: number
  favoritesCount: number
}
