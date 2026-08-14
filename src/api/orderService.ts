import { orders, products, variants } from '@/mocks/db'
import type { Order, OrderItem, OrderWithDetails } from '@/types'
import { deriveStockStatus } from '@/utils/stockStatus'
import { requireAuthenticatedUser } from './authService'
import { delay } from './delay'

export interface CartItemInput {
  variantId: string
  quantity: number
}

export async function checkout(items: CartItemInput[]): Promise<Order> {
  await delay()

  if (items.length === 0) {
    throw new Error('Cart is empty')
  }

  const user = requireAuthenticatedUser()
  if (user.role === 'ADMIN') {
    throw new Error('Admins cannot place orders')
  }

  const quantityByVariantId = new Map<string, number>()
  for (const item of items) {
    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new Error('Quantity must be a positive integer')
    }
    quantityByVariantId.set(
      item.variantId,
      (quantityByVariantId.get(item.variantId) ?? 0) + item.quantity,
    )
  }

  const resolved = Array.from(quantityByVariantId, ([variantId, quantity]) => {
    const index = variants.findIndex((v) => v.id === variantId)
    if (index === -1) {
      throw new Error(`Variant with id "${variantId}" not found`)
    }

    const variant = variants[index]
    if (!variant.isActive || variant.status === 'OUT_OF_STOCK') {
      throw new Error(`Variant "${variant.sku}" is out of stock`)
    }
    if (quantity > variant.stock) {
      throw new Error(`Insufficient stock for variant "${variant.sku}"`)
    }

    return { index, quantity }
  })

  const orderItems: OrderItem[] = resolved.map(({ index, quantity }) => {
    const variant = variants[index]
    return {
      variantId: variant.id,
      quantity,
      unitPrice: variant.price,
      totalPrice: variant.price * quantity,
    }
  })

  for (const { index, quantity } of resolved) {
    const variant = variants[index]
    const newStock = variant.stock - quantity
    variants[index] = {
      ...variant,
      stock: newStock,
      status: deriveStockStatus(newStock),
    }
  }

  const order: Order = {
    id: crypto.randomUUID(),
    userId: user.id,
    items: orderItems,
    totalPrice: orderItems.reduce((sum, item) => sum + item.totalPrice, 0),
    purchasedAt: new Date().toISOString(),
  }
  orders.push(order)
  return order
}

export async function buyVariant(
  variantId: string,
  quantity: number,
): Promise<Order> {
  return checkout([{ variantId, quantity }])
}

export async function getMyOrders(): Promise<OrderWithDetails[]> {
  await delay()
  const user = requireAuthenticatedUser()
  return orders
    .filter((order) => order.userId === user.id)
    .sort((a, b) => b.purchasedAt.localeCompare(a.purchasedAt))
    .map((order) => ({
      ...order,
      items: order.items.map((item) => {
        const variant = variants.find((v) => v.id === item.variantId)
        const product = variant
          ? products.find((p) => p.id === variant.productId)
          : undefined
        return {
          ...item,
          productId: product?.id ?? '',
          productName: product?.name ?? 'Unknown product',
          productImageUrl: product?.imageUrl ?? '',
          sku: variant?.sku ?? '',
          color: variant?.color ?? '',
          size: variant?.size ?? '',
        }
      }),
    }))
}
