import { createVariant, getProductById, updateVariant } from '@/shared/api/productService'
import type { ProductWithVariants } from '@/shared/types/product'

export function useVariantActions(
  id: string | undefined,
  isNew: boolean,
  setProduct: (product: ProductWithVariants) => void,
  setError: (error: string | null) => void,
) {
  async function handleVariantSave(
    variantId: string,
    data: { price: number; originalPrice: number | null; stock: number; isActive: boolean },
  ) {
    setError(null)
    try {
      await updateVariant(variantId, data)
      if (id) setProduct(await getProductById(id, { includeInactiveVariants: true }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save variant')
    }
  }

  async function handleVariantCreate(data: {
    sku: string
    color: string
    colorHex: string
    size: string
  }) {
    if (!id || isNew) return
    setError(null)
    try {
      await createVariant({ productId: id, ...data, price: 0, stock: 0, isActive: true })
      setProduct(await getProductById(id, { includeInactiveVariants: true }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add variant')
    }
  }

  return { handleVariantSave, handleVariantCreate }
}
