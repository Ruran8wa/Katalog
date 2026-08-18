import type { Variant } from './variant'

export interface Product {
  id: string
  name: string
  description: string
  categoryId: string
  isActive: boolean
  isBestSeller: boolean
  images: string[]
  primaryImageIndex: number
}

export interface ProductWithVariants extends Product {
  categoryName: string
  variants: Variant[]
}
