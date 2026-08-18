import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  getCategories,
  getProducts,
  type ProductListItem,
} from '@/api/productService'
import { Button } from '@/components/ui/button'
import type { Category } from '@/types'
import { getPrimaryImageUrl } from '@/utils/productImage'
import { STOCK_BADGE } from '@/utils/stockStatus'

type StatusFilter = 'all' | 'active' | 'inactive'

export function AdminProductsPage() {
  const [products, setProducts] = useState<ProductListItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('all')
  const [status, setStatus] = useState<StatusFilter>('all')

  useEffect(() => {
    Promise.all([getProducts({ includeInactive: true }), getCategories()])
      .then(([products, categories]) => {
        setProducts(products)
        setCategories(categories)
      })
      .catch((err: unknown) =>
        setError(
          err instanceof Error ? err.message : 'Failed to load products',
        ),
      )
      .finally(() => setIsLoading(false))
  }, [])

  const categoryNameById = useMemo(
    () => new Map(categories.map((c) => [c.id, c.name])),
    [categories],
  )

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    return products.filter((product) => {
      if (keyword && !product.name.toLowerCase().includes(keyword)) return false
      if (categoryId !== 'all' && product.categoryId !== categoryId)
        return false
      if (status === 'active' && !product.isActive) return false
      if (status === 'inactive' && product.isActive) return false
      return true
    })
  }, [products, search, categoryId, status])

  const hasFilters =
    search.trim() !== '' || categoryId !== 'all' || status !== 'all'

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Button render={<Link to="/admin/products/new" />}>New product</Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="min-w-[200px] flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="all">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as StatusFilter)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {error && <p className="text-destructive">{error}</p>}
      {isLoading && <p className="text-muted-foreground">Loading...</p>}

      {!isLoading && !error && filteredProducts.length === 0 && (
        <p className="text-muted-foreground">
          {hasFilters ? 'No products match your filters.' : 'No products yet.'}
        </p>
      )}

      <ul className="flex flex-col gap-2">
        {filteredProducts.map((product) => {
          const badge = product.defaultVariant
            ? STOCK_BADGE[product.defaultVariant.status]
            : null
          return (
            <li key={product.id}>
              <Link
                to={`/admin/products/${product.id}`}
                className="flex items-center gap-3 border border-border p-3 hover:bg-muted"
              >
                <div className="size-12 shrink-0 overflow-hidden bg-muted">
                  <img
                    src={getPrimaryImageUrl(
                      product.images,
                      product.primaryImageIndex,
                    )}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col">
                  <span className="font-medium">{product.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {categoryNameById.get(product.categoryId) ?? ''}
                    {product.defaultVariant !== null &&
                      ` · From ${product.defaultVariant.price.toLocaleString()} RWF`}
                    {product.defaultVariant === null && ' · No active variants'}
                  </span>
                </div>
                {badge && (
                  <span className={`text-xs ${badge.className}`}>
                    {badge.label}
                  </span>
                )}
                {!product.isActive && (
                  <span className="text-xs text-muted-foreground">
                    Inactive
                  </span>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
