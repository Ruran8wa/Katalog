export interface OrderItem {
  variantId: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  totalPrice: number
  purchasedAt: string
}

export interface OrderItemWithDetails extends OrderItem {
  productId: string
  productName: string
  productImageUrl: string
  sku: string
  color: string
  size: string
}

export interface OrderWithDetails extends Omit<Order, 'items'> {
  items: OrderItemWithDetails[]
}
