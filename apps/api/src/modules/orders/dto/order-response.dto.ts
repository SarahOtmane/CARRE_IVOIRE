import type { ShippingAddress } from '@carre-ivoire/types'

export interface OrderItemResponseDto {
  id: number
  productId: number
  productName?: string
  variantId?: number
  quantity: number
  unitPrice: number
  format?: string
  taxRateLabel?: string
  taxRatePercent?: number
  unitPriceHt?: number
  vatAmount?: number
}

export interface OrderResponseDto {
  id: number
  orderNumber: string
  userId: number
  status: string
  totalAmount: number
  totalHt?: number
  totalVat?: number
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
