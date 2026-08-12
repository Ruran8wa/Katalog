import { Minus, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProductById } from '@/api/productService'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
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
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (!id) return
    getProductById(id)
      .then((result) => {
        setProduct(result)
        const initialVariant =
          result.variants.find((v) => v.status !== 'OUT_OF_STOCK') ?? result.variants[0]
        setSelectedColor(initialVariant?.color ?? null)
        setSelectedSize(initialVariant?.size ?? null)
        setError(null)
      })
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : 'Failed to load product'),
      )
      .finally(() => setLoadedId(id))
  }, [id])

  if (isLoading) {
    return (
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-10 md:grid-cols-2">
        <div className="aspect-[3/4] animate-pulse rounded-xl bg-muted" />
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 border-b border-border pb-6">
            <div className="h-3 w-20 animate-pulse rounded bg-muted" />
            <div className="h-6 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-5 w-1/4 animate-pulse rounded bg-muted" />
            <div className="mt-1 h-16 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-40 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    )
  }
  if (error) return <p className="text-destructive">{error}</p>
  if (!product) return null

  const colors: { name: string; hex: string }[] = []
  const seenColors = new Set<string>()
  for (const v of product.variants) {
    if (seenColors.has(v.color)) continue
    seenColors.add(v.color)
    colors.push({ name: v.color, hex: v.colorHex })
  }
  const sizes = Array.from(new Set(product.variants.map((v) => v.size)))

  const selectedVariant: Variant | undefined = product.variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize,
  )

  function handleSelectColor(color: string) {
    setSelectedColor(color)
    const variantsForColor = product!.variants.filter((v) => v.color === color)
    const nextVariant =
      variantsForColor.find((v) => v.size === selectedSize && v.status !== 'OUT_OF_STOCK') ??
      variantsForColor.find((v) => v.status !== 'OUT_OF_STOCK') ??
      variantsForColor[0]
    setSelectedSize(nextVariant?.size ?? null)
    setQuantity(1)
  }

  function handleSelectSize(size: string) {
    setSelectedSize(size)
    setQuantity(1)
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
        color: selectedVariant.color,
        size: selectedVariant.size,
        price: selectedVariant.price,
        stock: selectedVariant.stock,
        status: selectedVariant.status,
      },
      quantity,
    )
    const toastId = toast.add({
      type: 'success',
      title: 'Added to cart',
      description: quantity > 1 ? `${quantity} × ${product.name}` : product.name,
      actionProps: {
        children: 'View cart',
        onClick: () => {
          toast.close(toastId)
          cartDrawerHandle.open(null)
        },
      },
    })
  }

  const canAddToCart = !!selectedVariant && selectedVariant.status !== 'OUT_OF_STOCK'

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <Link to="/" className="text-sm text-muted-foreground hover:underline">
        &larr; Back to products
      </Link>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="aspect-[3/4] overflow-hidden rounded-xl bg-muted">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 border-b border-border pb-6">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {product.categoryName}
            </span>
            <h1 className="text-2xl font-semibold tracking-tight">{product.name}</h1>
            {selectedVariant && (
              <p className="text-xl font-semibold">
                {selectedVariant.price.toLocaleString()} RWF
              </p>
            )}
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          </div>

          <div className="flex flex-col gap-5 rounded-xl bg-secondary/50 p-5">
            {product.variants.length === 0 ? (
              <p className="text-muted-foreground">No variants available.</p>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium">
                    Color{selectedColor ? ` — ${selectedColor}` : ''}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button
                        key={color.name}
                        type="button"
                        title={color.name}
                        aria-label={color.name}
                        aria-pressed={color.name === selectedColor}
                        onClick={() => handleSelectColor(color.name)}
                        className={cn(
                          'flex size-9 items-center justify-center rounded-full border-2 transition-colors',
                          color.name === selectedColor
                            ? 'border-primary'
                            : 'border-transparent hover:border-border',
                        )}
                      >
                        <span
                          className="size-7 rounded-full border border-black/10"
                          style={{ backgroundColor: color.hex }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium">Size</span>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => {
                      const variant = product.variants.find(
                        (v) => v.color === selectedColor && v.size === size,
                      )
                      const disabled = !variant || variant.status === 'OUT_OF_STOCK'
                      return (
                        <button
                          key={size}
                          type="button"
                          disabled={disabled}
                          onClick={() => handleSelectSize(size)}
                          className={cn(
                            'rounded-lg border px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40',
                            size === selectedSize
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border bg-background hover:bg-muted',
                          )}
                        >
                          {size}
                        </button>
                      )
                    })}
                  </div>
                  {selectedVariant && selectedVariant.status !== 'IN_STOCK' && (
                    <p
                      className={cn(
                        'text-sm font-medium',
                        selectedVariant.status === 'LOW_STOCK'
                          ? 'text-amber-600'
                          : 'text-destructive',
                      )}
                    >
                      {STOCK_LABEL[selectedVariant.status]}
                    </p>
                  )}
                </div>
              </>
            )}

            <div className="flex items-center gap-3 border-t border-border pt-5">
              <div className="flex items-center rounded-lg border border-border bg-background">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  disabled={!canAddToCart || quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 disabled:opacity-40"
                >
                  <Minus className="size-4" />
                </button>
                <span className="w-8 text-center text-sm">{quantity}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  disabled={!canAddToCart || quantity >= (selectedVariant?.stock ?? 0)}
                  onClick={() =>
                    selectedVariant &&
                    setQuantity((q) => Math.min(selectedVariant.stock, q + 1))
                  }
                  className="p-2 disabled:opacity-40"
                >
                  <Plus className="size-4" />
                </button>
              </div>

              <Button
                size="lg"
                className="flex-1"
                disabled={!canAddToCart}
                onClick={handleAddToCart}
              >
                {selectedVariant?.status === 'OUT_OF_STOCK' ? 'Out of stock' : 'Add to cart'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
