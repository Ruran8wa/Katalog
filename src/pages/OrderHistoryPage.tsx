import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyOrders } from '@/api/orderService'
import { OrderCard, OrderCardSkeleton } from '@/components/OrderCard'
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

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Order history</h1>

      {!orders ? (
        <div className="flex flex-col gap-4">
          <OrderCardSkeleton />
          <OrderCardSkeleton />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col gap-3">
          <p className="text-muted-foreground">You haven&apos;t placed any orders yet.</p>
          <Link to="/" className="w-fit underline">
            Browse products
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-6">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </ul>
      )}
    </div>
  )
}
