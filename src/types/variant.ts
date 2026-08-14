export type VariantStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'

export interface Variant {
  id: string
  productId: string
  sku: string
  color: string
  colorHex: string
  size: string
  price: number
  originalPrice: number | null
  stock: number
  status: VariantStatus
  isActive: boolean
}
