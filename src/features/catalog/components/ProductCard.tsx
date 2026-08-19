import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cartDrawerHandle } from '@/features/cart/components/CartDrawer'
import { useCart } from '@/features/cart/context/CartContext'
import type { ProductListItem } from '@/shared/api/productService'
import { toast } from '@/shared/components/ui/toast'
import { getPrimaryImageUrl } from '@/shared/utils/productImage'

const MAX_VISIBLE_SWATCHES = 5

export function ProductCard({ product }: { product: ProductListItem }) {
  const { addItem } = useCart()
  const variant = product.defaultVariant
  const imageUrl = getPrimaryImageUrl(product.images, product.primaryImageIndex)
  const canQuickAdd = !!variant && variant.status !== 'OUT_OF_STOCK'
  const isOnSale =
    !!variant?.originalPrice && variant.originalPrice > variant.price
  const discountPercent =
    isOnSale && variant
      ? Math.round(
          ((variant.originalPrice! - variant.price) / variant.originalPrice!) *
            100,
        )
      : 0

  function handleQuickAdd() {
    if (!variant) return
    addItem(
      {
        variantId: variant.id,
        productId: product.id,
        productName: product.name,
        productImageUrl: imageUrl,
        sku: variant.sku,
        color: variant.color,
        size: variant.size,
        price: variant.price,
        stock: variant.stock,
        status: variant.status,
      },
      1,
    )
    const toastId = toast.add({
      type: 'success',
      title: 'Added to cart',
      description: product.name,
      actionProps: {
        children: 'View cart',
        onClick: () => {
          toast.close(toastId)
          cartDrawerHandle.open(null)
        },
      },
    })
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="group relative aspect-[3/4] overflow-hidden bg-muted">
        <Link to={`/products/${product.id}`} className="block h-full w-full">
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {(product.isBestSeller || isOnSale) && (
          <span className="absolute right-2 bottom-2 bg-background/90 px-2 py-1 text-[11px] font-medium uppercase tracking-wide">
            {product.isBestSeller ? 'Best Seller' : 'Sale'}
          </span>
        )}

        <button
          type="button"
          aria-label="Quick add to cart"
          disabled={!canQuickAdd}
          onClick={handleQuickAdd}
          className="absolute top-2 right-2 flex size-8 items-center justify-center border border-border bg-background/90 transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus className="size-4" />
        </button>
      </div>

      {product.colors.length > 0 && (
        <div className="flex items-center gap-1.5">
          {product.colors.slice(0, MAX_VISIBLE_SWATCHES).map((color) => (
            <span
              key={color.name}
              title={color.name}
              style={{ backgroundColor: color.hex }}
              className="size-3.5 border border-black/10"
            />
          ))}
          {product.colors.length > MAX_VISIBLE_SWATCHES && (
            <span className="text-[11px] text-muted-foreground">
              +{product.colors.length - MAX_VISIBLE_SWATCHES}
            </span>
          )}
        </div>
      )}

      <Link to={`/products/${product.id}`} className="flex flex-col gap-0.5">
        <h3 className="text-sm font-medium leading-snug">{product.name}</h3>
        {variant ? (
          <span className="flex flex-wrap items-baseline gap-1.5 text-sm">
            <span className="font-semibold">
              {variant.price.toLocaleString()} RWF
            </span>
            {isOnSale && (
              <>
                <span className="text-muted-foreground line-through">
                  {variant.originalPrice!.toLocaleString()} RWF
                </span>
                <span className="font-semibold text-destructive">
                  -{discountPercent}% Off
                </span>
              </>
            )}
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">Unavailable</span>
        )}
      </Link>
    </div>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <div className="aspect-[3/4] animate-pulse bg-muted" />
      <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
      <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
    </div>
  )
}
