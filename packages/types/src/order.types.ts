export enum OrderStatus {
  PAYMENT_PENDING = 'payment_pending',
  PAID = 'paid',
  PREPARING = 'preparing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export interface ShippingAddress {
  firstName: string
  lastName: string
  address: string
  city: string
  postalCode: string
  country: string
}

export interface OrderItem {
  id: number
  orderId: number
  productId: number
  productName: string
  unitPrice: number
  quantity: number
  format?: string
  subtotal: number
}

export interface Order {
  id: number
  userId: number
  status: OrderStatus
  totalAmount: number
  stripePaymentIntentId?: string
  shippingAddress?: ShippingAddress
  items: OrderItem[]
  createdAt: string
  updatedAt: string
}
