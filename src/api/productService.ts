import { categories, products, variants } from '@/mocks/db'
import type { Product, ProductWithVariants, Variant } from '@/types'
import { deriveStockStatus } from '@/utils/stockStatus'
import { delay } from './delay'

export interface GetProductsParams {
  keyword?: string
  maxPrice?: number
}

export interface ProductInput {
  name: string
  description: string
  categoryId: string
  isActive: boolean
}

export interface VariantInput {
  productId: string
  sku: string
  price: number
  stock: number
  isActive: boolean
}

function minActivePrice(productId: string): number | null {
  const activePrices = variants
    .filter((variant) => variant.productId === productId && variant.isActive)
    .map((variant) => variant.price)
  return activePrices.length > 0 ? Math.min(...activePrices) : null
}

export async function getProducts(
  params: GetProductsParams = {},
): Promise<Product[]> {
  await delay()
  const keyword = params.keyword?.trim().toLowerCase()

  return products.filter((product) => {
    if (!product.isActive) return false
    if (keyword && !product.name.toLowerCase().includes(keyword)) return false
    if (params.maxPrice !== undefined) {
      const price = minActivePrice(product.id)
      if (price === null || price > params.maxPrice) return false
    }
    return true
  })
}

export async function getProductById(id: string): Promise<ProductWithVariants> {
  await delay()
  const product = products.find((p) => p.id === id)
  if (!product) {
    throw new Error(`Product with id "${id}" not found`)
  }

  const category = categories.find((c) => c.id === product.categoryId)
  const activeVariants = variants.filter(
    (variant) => variant.productId === id && variant.isActive,
  )

  return {
    ...product,
    categoryName: category?.name ?? '',
    variants: activeVariants,
  }
}

export async function createProduct(data: ProductInput): Promise<Product> {
  await delay()
  const product: Product = {
    id: crypto.randomUUID(),
    ...data,
  }
  products.push(product)
  return product
}

export async function updateProduct(
  id: string,
  data: Partial<ProductInput>,
): Promise<Product> {
  await delay()
  const index = products.findIndex((p) => p.id === id)
  if (index === -1) {
    throw new Error(`Product with id "${id}" not found`)
  }

  const updated: Product = { ...products[index], ...data }
  products[index] = updated
  return updated
}

export async function createVariant(data: VariantInput): Promise<Variant> {
  await delay()
  const variant: Variant = {
    id: crypto.randomUUID(),
    ...data,
    status: deriveStockStatus(data.stock),
  }
  variants.push(variant)
  return variant
}

export async function updateVariant(
  id: string,
  data: Partial<VariantInput>,
): Promise<Variant> {
  await delay()
  const index = variants.findIndex((v) => v.id === id)
  if (index === -1) {
    throw new Error(`Variant with id "${id}" not found`)
  }

  const merged = { ...variants[index], ...data }
  const updated: Variant = {
    ...merged,
    status: deriveStockStatus(merged.stock),
  }
  variants[index] = updated
  return updated
}
