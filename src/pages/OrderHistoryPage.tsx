import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyOrders } from '@/api/orderService'
import { useAuth } from '@/context/AuthContext'
import type { OrderWithDetails } from '@/types'

export function OrderHistoryPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<OrderWithDetails[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    getMyOrders()
      .then(setOrders)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : 'Failed to load orders'),
      )
  }, [user])

  if (!user) {
    return (
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Order history</h1>
        <p className="text-muted-foreground">
          <Link to="/login" className="underline">
            Log in
          </Link>{' '}
          to view your orders.
        </p>
      </div>
    )
  }

  if (error) return <p className="text-destructive">{error}</p>

  if (!orders) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Order history</h1>
        <div className="h-24 animate-pulse rounded-xl bg-muted" />
        <div className="h-24 animate-pulse rounded-xl bg-muted" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Order history</h1>

      {orders.length === 0 ? (
        <div className="flex flex-col gap-3">
          <p className="text-muted-foreground">You haven&apos;t placed any orders yet.</p>
          <Link to="/" className="w-fit underline">
            Browse products
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-6">
          {orders.map((order) => (
            <li key={order.id} className="rounded-xl border border-border p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-3">
                <div>
                  <p className="text-sm font-medium">
                    Order <span className="font-mono">{order.id}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.purchasedAt).toLocaleDateString(undefined, {
                      dateStyle: 'medium',
                    })}
                  </p>
                </div>
                <p className="text-sm font-semibold">
                  {order.totalPrice.toLocaleString()} RWF
                </p>
              </div>

              <ul className="flex flex-col gap-4 pt-3">
                {order.items.map((item) => (
                  <li key={item.variantId} className="flex gap-3">
                    <Link
                      to={item.productId ? `/products/${item.productId}` : '#'}
                      className="size-16 shrink-0 overflow-hidden rounded-lg bg-muted"
                    >
                      {item.productImageUrl && (
                        <img
                          src={item.productImageUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      )}
                    </Link>
                    <div className="flex flex-1 flex-col gap-1">
                      <Link
                        to={item.productId ? `/products/${item.productId}` : '#'}
                        className="text-sm font-medium hover:underline"
                      >
                        {item.productName}
                      </Link>
                      {item.sku && (
                        <span className="text-xs text-muted-foreground">{item.sku}</span>
                      )}
                      <span className="text-sm text-muted-foreground">
                        Qty {item.quantity} &times; {item.unitPrice.toLocaleString()} RWF
                      </span>
                    </div>
                    <span className="self-start text-sm font-medium">
                      {item.totalPrice.toLocaleString()} RWF
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
