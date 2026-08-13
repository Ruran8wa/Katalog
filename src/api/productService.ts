import { categories, products, variants } from '@/mocks/db'
import type { Category, Product, ProductWithVariants, Variant } from '@/types'
import { deriveStockStatus } from '@/utils/stockStatus'
import { delay } from './delay'

export async function getCategories(): Promise<Category[]> {
  await delay()
  return categories
}

export interface GetProductsParams {
  keyword?: string
  categoryIds?: string[]
  minPrice?: number
  maxPrice?: number
  includeInactive?: boolean
}

export interface ProductInput {
  name: string
  description: string
  categoryId: string
  isActive: boolean
  isBestSeller: boolean
  imageUrl: string
}

export interface ProductListItem extends Product {
  colors: { name: string; hex: string }[]
  defaultVariant: Variant | null
}

export interface VariantInput {
  productId: string
  sku: string
  color: string
  colorHex: string
  size: string
  price: number
  originalPrice?: number | null
  stock: number
  isActive: boolean
}

function cheapestActiveVariant(productId: string): Variant | null {
  const active = variants.filter((v) => v.productId === productId && v.isActive)
  if (active.length === 0) return null
  return active.reduce((cheapest, v) => (v.price < cheapest.price ? v : cheapest))
}

function productColors(productId: string): { name: string; hex: string }[] {
  const seen = new Set<string>()
  const colors: { name: string; hex: string }[] = []
  for (const v of variants) {
    if (v.productId !== productId || !v.isActive || seen.has(v.color)) continue
    seen.add(v.color)
    colors.push({ name: v.color, hex: v.colorHex })
  }
  return colors
}

export async function getProducts(
  params: GetProductsParams = {},
): Promise<ProductListItem[]> {
  await delay()
  const keyword = params.keyword?.trim().toLowerCase()

  return products
    .filter((product) => {
      if (!product.isActive && !params.includeInactive) return false
      if (keyword && !product.name.toLowerCase().includes(keyword)) return false
      if (params.categoryIds?.length && !params.categoryIds.includes(product.categoryId)) {
        return false
      }
      if (params.minPrice !== undefined || params.maxPrice !== undefined) {
        const price = cheapestActiveVariant(product.id)?.price ?? null
        if (price === null) return false
        if (params.minPrice !== undefined && price < params.minPrice) return false
        if (params.maxPrice !== undefined && price > params.maxPrice) return false
      }
      return true
    })
    .map((product) => ({
      ...product,
      colors: productColors(product.id),
      defaultVariant: cheapestActiveVariant(product.id),
    }))
}

export async function getProductById(
  id: string,
  options: { includeInactiveVariants?: boolean } = {},
): Promise<ProductWithVariants> {
  await delay()
  const product = products.find((p) => p.id === id)
  if (!product) {
    throw new Error(`Product with id "${id}" not found`)
  }

  const category = categories.find((c) => c.id === product.categoryId)
  const productVariants = variants.filter(
    (variant) =>
      variant.productId === id &&
      (variant.isActive || options.includeInactiveVariants),
  )

  return {
    ...product,
    categoryName: category?.name ?? '',
    variants: productVariants,
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
    originalPrice: data.originalPrice ?? null,
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
