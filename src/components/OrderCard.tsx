import { Link } from 'react-router-dom'
import type { OrderItemWithDetails, OrderWithDetails } from '@/types'

function OrderItemRow({ item }: { item: OrderItemWithDetails }) {
  const productHref = item.productId ? `/products/${item.productId}` : '#'

  return (
    <li className="flex gap-3">
      <Link to={productHref} className="size-16 shrink-0 overflow-hidden bg-muted">
        {item.productImageUrl && (
          <img src={item.productImageUrl} alt="" className="h-full w-full object-cover" />
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-1">
        <Link to={productHref} className="text-sm font-medium hover:underline">
          {item.productName}
        </Link>
        {(item.color || item.size) && (
          <span className="text-xs text-muted-foreground">
            {item.color} / {item.size}
          </span>
        )}
        <span className="text-sm text-muted-foreground">
          Qty {item.quantity} &times; {item.unitPrice.toLocaleString()} RWF
        </span>
      </div>
      <span className="self-start text-sm font-medium">{item.totalPrice.toLocaleString()} RWF</span>
    </li>
  )
}

export function OrderCard({ order }: { order: OrderWithDetails }) {
  return (
    <li className="rounded-xl border border-border p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-3">
        <div>
          <p className="text-sm font-medium">
            Order <span className="font-mono">{order.id}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            {new Date(order.purchasedAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
          </p>
        </div>
        <p className="text-sm font-semibold">{order.totalPrice.toLocaleString()} RWF</p>
      </div>

      <ul className="flex flex-col gap-4 pt-3">
        {order.items.map((item) => (
          <OrderItemRow key={item.variantId} item={item} />
        ))}
      </ul>
    </li>
  )
}

export function OrderCardSkeleton() {
  return <div className="h-24 animate-pulse rounded-xl bg-muted" />
}
