import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAdminStats, type AdminStats } from '@/api/productService'
import { Button } from '@/components/ui/button'

export function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getAdminStats()
      .then(setStats)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : 'Failed to load stats'),
      )
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Button render={<Link to="/admin/products/new" />}>New product</Button>
      </div>

      {error && <p className="text-destructive">{error}</p>}
      {!stats && !error && <p className="text-muted-foreground">Loading...</p>}

      {stats && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard
              label="Products"
              value={stats.activeProducts}
              hint={`${stats.inactiveProducts} inactive`}
            />
            <StatCard label="Variants" value={stats.totalVariants} />
            <StatCard
              label="Low stock"
              value={stats.lowStockVariants}
              tone={stats.lowStockVariants > 0 ? 'warn' : 'default'}
            />
            <StatCard
              label="Out of stock"
              value={stats.outOfStockVariants}
              tone={stats.outOfStockVariants > 0 ? 'bad' : 'default'}
            />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">Products by category</h2>
              <Link
                to="/admin/products"
                className="text-sm text-muted-foreground hover:underline"
              >
                View all products &rarr;
              </Link>
            </div>
            <ul className="flex flex-col divide-y divide-border border border-border">
              {stats.categoryBreakdown.map((category) => (
                <li
                  key={category.categoryId}
                  className="flex items-center justify-between px-4 py-2.5 text-sm"
                >
                  <span>{category.categoryName}</span>
                  <span className="text-muted-foreground">
                    {category.productCount}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}

function StatCard({
  label,
  value,
  hint,
  tone = 'default',
}: {
  label: string
  value: number
  hint?: string
  tone?: 'default' | 'warn' | 'bad'
}) {
  return (
    <div className="flex flex-col gap-1 border border-border p-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span
        className={
          tone === 'bad'
            ? 'text-2xl font-semibold text-destructive'
            : tone === 'warn'
              ? 'text-2xl font-semibold text-amber-600 dark:text-amber-500'
              : 'text-2xl font-semibold'
        }
      >
        {value}
      </span>
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </div>
  )
}
