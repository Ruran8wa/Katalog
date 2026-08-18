import { AlertDialog } from '@base-ui/react/alert-dialog'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
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
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Category, ProductWithVariants } from '@/types'
import { STOCK_BADGE } from '@/utils/stockStatus'

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
      setDeleteError(
        err instanceof Error ? err.message : 'Failed to delete product',
      )
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
      if (id)
        setProduct(await getProductById(id, { includeInactiveVariants: true }))
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
      <Link
        to="/admin/products"
        className="text-sm text-muted-foreground hover:underline"
      >
        &larr; Back to products
      </Link>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {isNew ? 'New product' : product?.name}
        </h1>
        {!isNew && product && (
          <AlertDialog.Root>
            <AlertDialog.Trigger render={<Button variant="destructive" />}>
              Delete product
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
              <AlertDialog.Backdrop className="fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 data-ending-style:opacity-0 data-starting-style:opacity-0" />
              <AlertDialog.Viewport className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <AlertDialog.Popup className="w-full max-w-sm border border-border bg-background p-6 outline-none transition-all duration-200 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
                  <AlertDialog.Title className="text-lg font-semibold">
                    Delete product?
                  </AlertDialog.Title>
                  <AlertDialog.Description className="mt-2 text-sm text-muted-foreground">
                    This will permanently delete &ldquo;{product.name}&rdquo;
                    and all {product.variants.length} of its variants. This
                    can&apos;t be undone.
                  </AlertDialog.Description>
                  {deleteError && (
                    <p className="mt-2 text-sm text-destructive">
                      {deleteError}
                    </p>
                  )}
                  <div className="mt-6 flex justify-end gap-2">
                    <AlertDialog.Close
                      render={<Button type="button" variant="outline" />}
                    >
                      Cancel
                    </AlertDialog.Close>
                    <Button
                      type="button"
                      variant="destructive"
                      disabled={isDeleting}
                      onClick={handleDelete}
                    >
                      {isDeleting ? 'Deleting...' : 'Delete product'}
                    </Button>
                  </div>
                </AlertDialog.Popup>
              </AlertDialog.Viewport>
            </AlertDialog.Portal>
          </AlertDialog.Root>
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

        <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm">
            Name
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Description
            <textarea
              required
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Category
            <select
              required
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            />
            Active
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isBestSeller}
              onChange={(e) =>
                setForm({ ...form, isBestSeller: e.target.checked })
              }
            />
            Best seller
          </label>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : isNew ? 'Create product' : 'Save changes'}
          </Button>
        </form>
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

function ImageGalleryEditor({
  images,
  primaryImageIndex,
  onChange,
}: {
  images: string[]
  primaryImageIndex: number
  onChange: (images: string[], primaryImageIndex: number) => void
}) {
  const [newUrl, setNewUrl] = useState('')

  function addImage() {
    const url = newUrl.trim()
    if (!url) return
    onChange([...images, url], images.length === 0 ? 0 : primaryImageIndex)
    setNewUrl('')
  }

  function removeImage(index: number) {
    const next = images.filter((_, i) => i !== index)
    let nextPrimary = primaryImageIndex
    if (index === primaryImageIndex) nextPrimary = 0
    else if (index < primaryImageIndex) nextPrimary = primaryImageIndex - 1
    onChange(next, Math.min(nextPrimary, Math.max(next.length - 1, 0)))
  }

  function moveImage(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= images.length) return
    const next = [...images]
    ;[next[index], next[target]] = [next[target], next[index]]

    let nextPrimary = primaryImageIndex
    if (primaryImageIndex === index) nextPrimary = target
    else if (primaryImageIndex === target) nextPrimary = index
    onChange(next, nextPrimary)
  }

  const heroUrl = images[primaryImageIndex] ?? images[0]

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm">Images</span>

      <div className="aspect-[3/4] w-full max-w-md overflow-hidden border border-border bg-muted">
        {heroUrl ? (
          <img src={heroUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No image yet
          </div>
        )}
      </div>

      {images.length > 0 && (
        <ul className="flex max-w-md flex-wrap gap-2">
          {images.map((url, index) => (
            <li
              key={`${index}-${url}`}
              className="flex flex-col items-center gap-1"
            >
              <button
                type="button"
                title={
                  index === primaryImageIndex
                    ? 'Primary image'
                    : 'Set as primary'
                }
                onClick={() => onChange(images, index)}
                className={cn(
                  'size-16 overflow-hidden border-2 bg-muted transition-colors',
                  index === primaryImageIndex
                    ? 'border-primary'
                    : 'border-transparent hover:border-border',
                )}
              >
                <img src={url} alt="" className="h-full w-full object-cover" />
              </button>
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  title="Move left"
                  disabled={index === 0}
                  onClick={() => moveImage(index, -1)}
                  className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
                >
                  <ChevronLeft className="size-3.5" />
                </button>
                <button
                  type="button"
                  title="Remove"
                  onClick={() => removeImage(index)}
                  className="p-0.5 text-muted-foreground hover:text-destructive"
                >
                  <X className="size-3.5" />
                </button>
                <button
                  type="button"
                  title="Move right"
                  disabled={index === images.length - 1}
                  onClick={() => moveImage(index, 1)}
                  className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
                >
                  <ChevronRight className="size-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex max-w-md gap-2">
        <input
          type="url"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== 'Enter') return
            e.preventDefault()
            addImage()
          }}
          placeholder="https://..."
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
        <Button type="button" variant="outline" onClick={addImage}>
          Add image
        </Button>
      </div>
    </div>
  )
}

function VariantsEditor({
  variants,
  onSave,
  onCreate,
}: {
  variants: ProductWithVariants['variants']
  onSave: (
    variantId: string,
    data: {
      price: number
      originalPrice: number | null
      stock: number
      isActive: boolean
    },
  ) => void
  onCreate: (data: {
    sku: string
    color: string
    colorHex: string
    size: string
  }) => void
}) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newSku, setNewSku] = useState('')
  const [newColor, setNewColor] = useState('')
  const [newColorHex, setNewColorHex] = useState('#000000')
  const [newSize, setNewSize] = useState('')

  const sortedVariants = [...variants].sort((a, b) =>
    a.color.localeCompare(b.color),
  )

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="font-medium">Variants ({variants.length})</h2>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => setShowAddForm((v) => !v)}
        >
          {showAddForm ? 'Cancel' : '+ Add variant'}
        </Button>
      </div>

      {variants.length === 0 && (
        <p className="text-sm text-muted-foreground">No variants yet.</p>
      )}

      {variants.length > 0 && (
        <div className="overflow-x-auto border border-border">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left text-xs text-muted-foreground">
                <th className="px-3 py-2 font-medium">Variant</th>
                <th className="px-3 py-2 font-medium">SKU</th>
                <th className="px-3 py-2 font-medium">Price</th>
                <th className="px-3 py-2 font-medium">Was</th>
                <th className="px-3 py-2 font-medium">Stock</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Active</th>
                <th className="px-3 py-2 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sortedVariants.map((variant) => (
                <VariantRow
                  key={variant.id}
                  variant={variant}
                  onSave={onSave}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAddForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (!newColor.trim() || !newSize.trim() || !newSku.trim()) return
            onCreate({
              sku: newSku.trim(),
              color: newColor.trim(),
              colorHex: newColorHex,
              size: newSize.trim(),
            })
            setNewSku('')
            setNewColor('')
            setNewColorHex('#000000')
            setNewSize('')
          }}
          className="flex flex-wrap items-end gap-2 border border-border p-3"
        >
          <label className="flex flex-col gap-1 text-xs text-muted-foreground">
            Color
            <div className="flex gap-1">
              <input
                type="color"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                className="h-9 w-10 shrink-0 rounded-lg border border-border bg-background p-1"
              />
              <input
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                placeholder="Color name"
                className="w-32 rounded-lg border border-border bg-background px-2 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
          </label>
          <label className="flex flex-col gap-1 text-xs text-muted-foreground">
            Size
            <input
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              placeholder="Size"
              className="w-20 rounded-lg border border-border bg-background px-2 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-muted-foreground">
            SKU
            <input
              value={newSku}
              onChange={(e) => setNewSku(e.target.value)}
              placeholder="SKU"
              className="w-36 rounded-lg border border-border bg-background px-2 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </label>
          <Button type="submit" variant="outline">
            Add variant
          </Button>
        </form>
      )}
    </div>
  )
}

function VariantRow({
  variant,
  onSave,
}: {
  variant: ProductWithVariants['variants'][number]
  onSave: (
    variantId: string,
    data: {
      price: number
      originalPrice: number | null
      stock: number
      isActive: boolean
    },
  ) => void
}) {
  const [price, setPrice] = useState(variant.price)
  const [originalPrice, setOriginalPrice] = useState(variant.originalPrice ?? 0)
  const [stock, setStock] = useState(variant.stock)
  const [isActive, setIsActive] = useState(variant.isActive)

  const isDirty =
    price !== variant.price ||
    originalPrice !== (variant.originalPrice ?? 0) ||
    stock !== variant.stock ||
    isActive !== variant.isActive

  const badge = STOCK_BADGE[variant.status]

  return (
    <tr className={cn(!variant.isActive && 'opacity-60')}>
      <td className="px-3 py-2">
        <div className="flex items-center gap-2">
          <span
            className="size-3.5 shrink-0 rounded-full border border-black/10"
            style={{ backgroundColor: variant.colorHex }}
          />
          <span>
            {variant.color} / {variant.size}
          </span>
        </div>
      </td>
      <td className="px-3 py-2 text-xs text-muted-foreground">{variant.sku}</td>
      <td className="px-3 py-2">
        <input
          type="number"
          min={0}
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-24 rounded-lg border border-border bg-background px-2 py-1"
        />
      </td>
      <td className="px-3 py-2">
        <input
          type="number"
          min={0}
          value={originalPrice}
          onChange={(e) => setOriginalPrice(Number(e.target.value))}
          placeholder="0"
          className="w-24 rounded-lg border border-border bg-background px-2 py-1"
        />
      </td>
      <td className="px-3 py-2">
        <input
          type="number"
          min={0}
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          className="w-20 rounded-lg border border-border bg-background px-2 py-1"
        />
      </td>
      <td className="px-3 py-2">
        <span className={cn('text-xs', badge.className)}>{badge.label}</span>
      </td>
      <td className="px-3 py-2">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
      </td>
      <td className="px-3 py-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={!isDirty}
          onClick={() =>
            onSave(variant.id, {
              price,
              originalPrice: originalPrice > 0 ? originalPrice : null,
              stock,
              isActive,
            })
          }
        >
          Save
        </Button>
      </td>
    </tr>
  )
}
