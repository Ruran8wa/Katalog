import { Link } from 'react-router-dom'
import type { ProductListItem } from '@/shared/api/productService'
import { getPrimaryImageUrl } from '@/shared/utils/productImage'
import { STOCK_BADGE } from '@/shared/utils/stockStatus'

export function ProductListRow({
  product,
  categoryName,
}: {
  product: ProductListItem
  categoryName: string
}) {
  const badge = product.defaultVariant ? STOCK_BADGE[product.defaultVariant.status] : null

  return (
    <li>
      <Link
        to={`/admin/products/${product.id}`}
        className="flex items-center gap-3 border border-border p-3 hover:bg-muted"
      >
        <div className="size-12 shrink-0 overflow-hidden bg-muted">
          <img
            src={getPrimaryImageUrl(product.images, product.primaryImageIndex)}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col">
          <span className="font-medium">{product.name}</span>
          <span className="text-sm text-muted-foreground">
            {categoryName}
            {product.defaultVariant !== null &&
              ` · From ${product.defaultVariant.price.toLocaleString()} RWF`}
            {product.defaultVariant === null && ' · No active variants'}
          </span>
        </div>
        {badge && <span className={`text-xs ${badge.className}`}>{badge.label}</span>}
        {!product.isActive && (
          <span className="text-xs text-muted-foreground">Inactive</span>
        )}
      </Link>
    </li>
  )
}
