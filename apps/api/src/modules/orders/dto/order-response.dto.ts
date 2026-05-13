export interface OrderItemResponseDto {
  id: number
  productId: number
  quantity: number
  unitPrice: number
  format?: string
}

export interface OrderResponseDto {
  id: number
  userId: number
  status: string
  totalAmount: number
  shippingAddress?: object
  stripePaymentIntentId?: string
  items: OrderItemResponseDto[]
  createdAt: string
  updatedAt: string
}

export interface OrderCreatedResponseDto {
  orderId: number
  status: string
  clientSecret: string | null
  totalAmount: number
}
