import type { VariantStatus } from '@/types'

export const LOW_STOCK_THRESHOLD = 5

export function deriveStockStatus(stock: number): VariantStatus {
  if (stock <= 0) return 'OUT_OF_STOCK'
  if (stock < LOW_STOCK_THRESHOLD) return 'LOW_STOCK'
  return 'IN_STOCK'
}
