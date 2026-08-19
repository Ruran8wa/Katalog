import { useEffect, useState } from 'react'
import {
  createProduct,
  getCategories,
  getProductById,
  updateProduct,
  type ProductInput,
} from '@/shared/api/productService'
import type { Category } from '@/shared/types/category'
import type { ProductWithVariants } from '@/shared/types/product'

const emptyProduct: ProductInput = {
  name: '',
  description: '',
  categoryId: '',
  isActive: true,
  isBestSeller: false,
  images: [],
  primaryImageIndex: 0,
}

export function useAdminProduct(id: string | undefined, isNew: boolean) {
  const [categories, setCategories] = useState<Category[]>([])
  const [product, setProduct] = useState<ProductWithVariants | null>(null)
  const [form, setForm] = useState<ProductInput>(emptyProduct)
  const [loadedId, setLoadedId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [createdId, setCreatedId] = useState<string | null>(null)
  const isLoading = !isNew && loadedId !== id

  useEffect(() => {
    getCategories().then(setCategories)
  }, [])

  useEffect(() => {
    if (isNew || !id) return
    getProductById(id, { includeInactiveVariants: true })
      .then((result) => {
        setProduct(result)
        setForm({
          name: result.name,
          description: result.description,
          categoryId: result.categoryId,
          isActive: result.isActive,
          isBestSeller: result.isBestSeller,
          images: result.images,
          primaryImageIndex: result.primaryImageIndex,
        })
        setError(null)
      })
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : 'Failed to load product'),
      )
      .finally(() => setLoadedId(id))
  }, [id, isNew])

  async function handleSubmit() {
    if (form.images.length === 0) {
      setError('Add at least one image')
      return
    }
    setError(null)
    setIsSaving(true)
    try {
      if (isNew) {
        const created = await createProduct(form)
        setCreatedId(created.id)
      } else if (id) {
        const updated = await updateProduct(id, form)
        setProduct((prev) => (prev ? { ...prev, ...updated } : prev))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product')
    } finally {
      setIsSaving(false)
    }
  }

  return {
    categories,
    product,
    setProduct,
    form,
    setForm,
    isLoading,
    error,
    setError,
    isSaving,
    createdId,
    handleSubmit,
  }
}
