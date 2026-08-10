import type { Variant } from './variant'

export interface Product {
  id: string
  name: string
  description: string
  categoryId: string
  isActive: boolean
}

export interface ProductWithVariants extends Product {
  categoryName: string
  variants: Variant[]
}
