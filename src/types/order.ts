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
