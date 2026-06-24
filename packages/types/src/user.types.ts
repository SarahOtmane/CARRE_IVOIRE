export type UserRole = 'client' | 'admin'

export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  phone: string | null
  addressStreet: string | null
  addressCity: string | null
  addressZip: string | null
  addressCountry: string
  role: UserRole
  customerNumber: string
  isActive: boolean
  createdAt: string
}

export type UserResponse = User

export interface AuthUser {
  id: number
  email: string
  firstName: string
  lastName: string
  customerNumber: string
  role: UserRole
}

export interface UserProfile extends User {
  ordersCount: number
  favoritesCount: number
}

// email, customerNumber et role ne sont pas modifiables via cet endpoint (cf. apps/api UpdateUserDto)
export interface UpdateUserDto {
  firstName?: string
  lastName?: string
  phone?: string
  addressStreet?: string
  addressCity?: string
  addressZip?: string
  addressCountry?: string
}
