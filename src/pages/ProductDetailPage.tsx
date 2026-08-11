import { Drawer } from '@base-ui/react/drawer'
import { Minus, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProductById } from '@/api/productService'
import { Button } from '@/components/ui/button'
import { cartDrawerHandle } from '@/components/CartDrawer'
import { cn } from '@/lib/utils'
import { useCart } from '@/context/CartContext'
import type { ProductWithVariants, Variant } from '@/types'

const STOCK_LABEL: Record<string, string> = {
  IN_STOCK: 'In stock',
  LOW_STOCK: 'Only a few left',
  OUT_OF_STOCK: 'Out of stock',
}

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { addItem } = useCart()
  const [product, setProduct] = useState<ProductWithVariants | null>(null)
  const [loadedId, setLoadedId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const isLoading = loadedId !== id
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [justAdded, setJustAdded] = useState(false)

  useEffect(() => {
    if (!id) return
    getProductById(id)
      .then((result) => {
        setProduct(result)
        setSelectedVariantId(
          result.variants.find((v) => v.status !== 'OUT_OF_STOCK')?.id ??
            result.variants[0]?.id ??
            null,
        )
        setError(null)
      })
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : 'Failed to load product'),
      )
      .finally(() => setLoadedId(id))
  }, [id])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-xl bg-muted" />
        <div className="flex flex-col gap-3">
          <div className="h-6 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
          <div className="h-20 animate-pulse rounded bg-muted" />
        </div>
      </div>
    )
  }
  if (error) return <p className="text-destructive">{error}</p>
  if (!product) return null

  const selectedVariant: Variant | undefined = product.variants.find(
    (v) => v.id === selectedVariantId,
  )

  function handleSelectVariant(variantId: string) {
    setSelectedVariantId(variantId)
    setQuantity(1)
    setJustAdded(false)
  }

  function handleAddToCart() {
    if (!product || !selectedVariant) return
    addItem(
      {
        variantId: selectedVariant.id,
        productId: product.id,
        productName: product.name,
        productImageUrl: product.imageUrl,
        sku: selectedVariant.sku,
        price: selectedVariant.price,
        stock: selectedVariant.stock,
        status: selectedVariant.status,
      },
      quantity,
    )
    setJustAdded(true)
  }

  return (
    <div className="flex flex-col gap-6">
      <Link to="/" className="text-sm text-muted-foreground hover:underline">
        &larr; Back to products
      </Link>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-xl bg-muted">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm text-muted-foreground">{product.categoryName}</p>
            <h1 className="text-2xl font-semibold tracking-tight">{product.name}</h1>
            {selectedVariant && (
              <p className="mt-1 text-xl font-semibold">
                {selectedVariant.price.toLocaleString()} RWF
              </p>
            )}
          </div>

          <p className="text-sm text-muted-foreground">{product.description}</p>

          {product.variants.length === 0 ? (
            <p className="text-muted-foreground">No variants available.</p>
          ) : (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">Select an option</span>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    disabled={variant.status === 'OUT_OF_STOCK'}
                    onClick={() => handleSelectVariant(variant.id)}
                    className={cn(
                      'rounded-lg border px-3 py-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40',
                      variant.id === selectedVariantId
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border hover:bg-muted',
                    )}
                  >
                    {variant.sku}
                  </button>
                ))}
              </div>
              {selectedVariant && (
                <span
                  className={cn(
                    'text-sm',
                    selectedVariant.status === 'LOW_STOCK'
                      ? 'text-amber-600'
                      : 'text-muted-foreground',
                  )}
                >
                  {STOCK_LABEL[selectedVariant.status]}
                </span>
              )}
            </div>
          )}

          {selectedVariant && selectedVariant.status !== 'OUT_OF_STOCK' && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Quantity</span>
              <div className="flex items-center rounded-lg border border-border">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 disabled:opacity-40"
                >
                  <Minus className="size-4" />
                </button>
                <span className="w-8 text-center text-sm">{quantity}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  disabled={quantity >= selectedVariant.stock}
                  onClick={() =>
                    setQuantity((q) => Math.min(selectedVariant.stock, q + 1))
                  }
                  className="p-2 disabled:opacity-40"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>
          )}

          <Button
            size="lg"
            className="w-full sm:w-fit"
            disabled={!selectedVariant || selectedVariant.status === 'OUT_OF_STOCK'}
            onClick={handleAddToCart}
          >
            Add to cart
          </Button>

          {justAdded && (
            <p className="text-sm text-green-600">
              Added to cart.{' '}
              <Drawer.Trigger handle={cartDrawerHandle} className="underline">
                View cart
              </Drawer.Trigger>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
