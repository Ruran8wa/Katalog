import { useEffect, useState, type FormEvent } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import {
  createProduct,
  createVariant,
  deleteProduct,
  getCategories,
  getProductById,
  updateProduct,
  updateVariant,
  type ProductInput,
} from '@/api/productService'
import { DeleteProductDialog } from '@/components/DeleteProductDialog'
import { ImageGalleryEditor } from '@/components/ImageGalleryEditor'
import { ProductForm } from '@/components/ProductForm'
import { VariantsEditor } from '@/components/VariantsEditor'
import type { Category, ProductWithVariants } from '@/types'

const emptyProduct: ProductInput = {
  name: '',
  description: '',
  categoryId: '',
  isActive: true,
  isBestSeller: false,
  images: [],
  primaryImageIndex: 0,
}

export function AdminProductPage() {
  const { id } = useParams<{ id: string }>()
  const isNew = id === 'new'

  const [categories, setCategories] = useState<Category[]>([])
  const [product, setProduct] = useState<ProductWithVariants | null>(null)
  const [form, setForm] = useState<ProductInput>(emptyProduct)
  const [loadedId, setLoadedId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [createdId, setCreatedId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [isDeleted, setIsDeleted] = useState(false)
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

  if (createdId) {
    return <Navigate to={`/admin/products/${createdId}`} replace />
  }

  if (isDeleted) {
    return <Navigate to="/admin/products" replace />
  }

  async function handleDelete() {
    if (!id) return
    setDeleteError(null)
    setIsDeleting(true)
    try {
      await deleteProduct(id)
      setIsDeleted(true)
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete product')
    } finally {
      setIsDeleting(false)
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
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

  async function handleVariantSave(
    variantId: string,
    data: {
      price: number
      originalPrice: number | null
      stock: number
      isActive: boolean
    },
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
      await createVariant({
        productId: id,
        ...data,
        price: 0,
        stock: 0,
        isActive: true,
      })
      setProduct(await getProductById(id, { includeInactiveVariants: true }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add variant')
    }
  }

  if (isLoading) return <p className="text-muted-foreground">Loading...</p>

  return (
    <div className="flex flex-col gap-6">
      <Link to="/admin/products" className="text-sm text-muted-foreground hover:underline">
        &larr; Back to products
      </Link>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{isNew ? 'New product' : product?.name}</h1>
        {!isNew && product && (
          <DeleteProductDialog
            productName={product.name}
            variantCount={product.variants.length}
            isDeleting={isDeleting}
            error={deleteError}
            onDelete={handleDelete}
          />
        )}
      </div>

      {error && <p className="text-destructive">{error}</p>}

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          <ImageGalleryEditor
            images={form.images}
            primaryImageIndex={form.primaryImageIndex}
            onChange={(images, primaryImageIndex) =>
              setForm({ ...form, images, primaryImageIndex })
            }
          />
        </div>

        <ProductForm
          form={form}
          onChange={setForm}
          categories={categories}
          isNew={isNew}
          isSaving={isSaving}
          onSubmit={handleSubmit}
        />
      </div>

      {!isNew && product && (
        <VariantsEditor
          variants={product.variants}
          onSave={handleVariantSave}
          onCreate={handleVariantCreate}
        />
      )}
    </div>
  )
}
