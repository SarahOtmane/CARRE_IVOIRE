export class UserResponseDto {
  id: number
  email: string
  firstName: string
  lastName: string
  phone: string | null
  addressStreet: string | null
  addressCity: string | null
  addressZip: string | null
  addressCountry: string
  role: string
  customerNumber: string
  isActive: boolean
  createdAt: string
}
