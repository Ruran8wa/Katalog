import { useEffect, useState, type FormEvent } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import {
  createProduct,
  createVariant,
  getCategories,
  getProductById,
  updateProduct,
  updateVariant,
  type ProductInput,
} from '@/api/productService'
import { Button } from '@/components/ui/button'
import type { Category, ProductWithVariants } from '@/types'

const emptyProduct: ProductInput = {
  name: '',
  description: '',
  categoryId: '',
  isActive: true,
  isBestSeller: false,
  imageUrl: '',
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
          imageUrl: result.imageUrl,
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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
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

  if (isLoading) return <p className="text-muted-foreground">Loading...</p>

  return (
    <div className="flex flex-col gap-6">
      <Link to="/admin" className="text-sm text-muted-foreground hover:underline">
        &larr; Back to admin
      </Link>
      <h1 className="text-2xl font-semibold">
        {isNew ? 'New product' : product?.name}
      </h1>

      {error && <p className="text-destructive">{error}</p>}

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
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Image URL
          <input
            required
            type="url"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            placeholder="https://..."
            className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </label>
        {form.imageUrl && (
          <div className="size-32 overflow-hidden bg-muted">
            <img
              src={form.imageUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        )}
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
            onChange={(e) => setForm({ ...form, isBestSeller: e.target.checked })}
          />
          Best seller
        </label>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : isNew ? 'Create product' : 'Save changes'}
        </Button>
      </form>

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

function VariantsEditor({
  variants,
  onSave,
  onCreate,
}: {
  variants: ProductWithVariants['variants']
  onSave: (
    variantId: string,
    data: { price: number; originalPrice: number | null; stock: number; isActive: boolean },
  ) => void
  onCreate: (data: { sku: string; color: string; colorHex: string; size: string }) => void
}) {
  const [newSku, setNewSku] = useState('')
  const [newColor, setNewColor] = useState('')
  const [newColorHex, setNewColorHex] = useState('#000000')
  const [newSize, setNewSize] = useState('')

  return (
    <div className="flex max-w-md flex-col gap-3">
      <h2 className="font-medium">Variants</h2>
      <ul className="flex flex-col gap-2">
        {variants.map((variant) => (
          <VariantRow key={variant.id} variant={variant} onSave={onSave} />
        ))}
      </ul>
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
        className="flex flex-col gap-2"
      >
        <div className="flex gap-2">
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
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          <input
            value={newSize}
            onChange={(e) => setNewSize(e.target.value)}
            placeholder="Size"
            className="w-24 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
        <div className="flex gap-2">
          <input
            value={newSku}
            onChange={(e) => setNewSku(e.target.value)}
            placeholder="SKU"
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          <Button type="submit" variant="outline">
            Add variant
          </Button>
        </div>
      </form>
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
    data: { price: number; originalPrice: number | null; stock: number; isActive: boolean },
  ) => void
}) {
  const [price, setPrice] = useState(variant.price)
  const [originalPrice, setOriginalPrice] = useState(variant.originalPrice ?? 0)
  const [stock, setStock] = useState(variant.stock)
  const [isActive, setIsActive] = useState(variant.isActive)

  return (
    <li className="flex flex-col gap-2 border border-border p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="size-4 shrink-0 border border-black/10"
            style={{ backgroundColor: variant.colorHex }}
          />
          <span className="font-medium">
            {variant.color} / {variant.size}
          </span>
          <span className="text-xs text-muted-foreground">{variant.sku}</span>
        </div>
        <span className="text-xs text-muted-foreground">{variant.status}</span>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <label className="flex items-center gap-1">
          Price
          <input
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-24 rounded-lg border border-border bg-background px-2 py-1"
          />
        </label>
        <label className="flex items-center gap-1">
          Was (sale)
          <input
            type="number"
            min={0}
            value={originalPrice}
            onChange={(e) => setOriginalPrice(Number(e.target.value))}
            placeholder="0"
            className="w-24 rounded-lg border border-border bg-background px-2 py-1"
          />
        </label>
        <label className="flex items-center gap-1">
          Stock
          <input
            type="number"
            min={0}
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            className="w-20 rounded-lg border border-border bg-background px-2 py-1"
          />
        </label>
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Active
        </label>
        <Button
          type="button"
          size="sm"
          variant="outline"
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
      </div>
    </li>
  )
}
