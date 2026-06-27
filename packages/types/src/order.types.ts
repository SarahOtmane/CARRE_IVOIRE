export enum OrderStatus {
  PENDING = 'pending',
  PAYMENT_PENDING = 'payment_pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export interface ShippingAddress {
  firstName: string
  lastName: string
  line1: string
  line2?: string
  postalCode: string
  city: string
  country: string
}

// Reflète OrderItemResponseDto côté API — pas de orderId/product imbriqué (jamais renvoyés)
export interface OrderItem {
  id: number
  productId: number
  variantId?: number
  quantity: number
  unitPrice: number
  format?: string
}

export interface Order {
  id: number
  orderNumber: string
  userId: number
  status: OrderStatus
  totalAmount: number
  stripePaymentIntentId?: string
  shippingAddress?: ShippingAddress
  items: OrderItem[]
  createdAt: string
  updatedAt: string
}

export type OrderResponse = Order

export interface CartItem {
  productId: number
  variantId?: number
  name: string
  imageUrl: string
  price: number
  quantity: number
  format?: string
}

export interface CreateOrderDto {
  items: Array<{
    productId: number
    variantId?: number
    quantity: number
    format?: string
  }>
  shippingAddress: ShippingAddress
  deliveryType?: 'pickup' | 'delivery'
}
