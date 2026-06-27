import type { ShippingAddress } from '@carre-ivoire/types'

export interface OrderItemResponseDto {
  id: number
  productId: number
  variantId?: number
  quantity: number
  unitPrice: number
  format?: string
}

export interface OrderResponseDto {
  id: number
  orderNumber: string
  userId: number
  status: string
  totalAmount: number
  shippingAddress?: ShippingAddress
  stripePaymentIntentId?: string
  items: OrderItemResponseDto[]
  createdAt: string
  updatedAt: string
}

export interface OrderCreatedResponseDto {
  orderId: number
  orderNumber: string
  status: string
  clientSecret: string | null
  totalAmount: number
}
