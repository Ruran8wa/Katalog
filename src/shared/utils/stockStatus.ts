import type { VariantStatus } from '@/shared/types/variant'

export const LOW_STOCK_THRESHOLD = 5

export function deriveStockStatus(stock: number): VariantStatus {
  if (stock <= 0) return 'OUT_OF_STOCK'
  if (stock < LOW_STOCK_THRESHOLD) return 'LOW_STOCK'
  return 'IN_STOCK'
}

export const STOCK_BADGE: Record<VariantStatus, { label: string; className: string }> = {
  IN_STOCK: { label: 'In stock', className: 'text-muted-foreground' },
  LOW_STOCK: { label: 'Low stock', className: 'text-amber-600 dark:text-amber-500' },
  OUT_OF_STOCK: { label: 'Out of stock', className: 'text-destructive' },
}
