import { useEffect, useState } from 'react'
import { getProducts, type ProductListItem } from '@/api/productService'
import { ProductCard, ProductCardSkeleton } from '@/components/ProductCard'

export function ProductCollection({
  categoryId,
  title,
  description,
}: {
  categoryId?: string
  title: string
  description?: string
}) {
  const [keyword, setKeyword] = useState('')
  const [minPriceInput, setMinPriceInput] = useState('')
  const [maxPriceInput, setMaxPriceInput] = useState('')
  const [products, setProducts] = useState<ProductListItem[]>([])
  const [loadedKey, setLoadedKey] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const minPrice = minPriceInput ? Number(minPriceInput) : undefined
  const maxPrice = maxPriceInput ? Number(maxPriceInput) : undefined
  const filterKey = JSON.stringify({ categoryId, keyword, minPrice, maxPrice })
  const isLoading = loadedKey !== filterKey
  const hasActiveFilters = minPriceInput !== '' || maxPriceInput !== ''

  useEffect(() => {
    let cancelled = false
    getProducts({
      keyword,
      categoryIds: categoryId ? [categoryId] : undefined,
      minPrice,
      maxPrice,
    })
      .then((result) => {
        if (!cancelled) {
          setProducts(result)
          setError(null)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load products')
      })
      .finally(() => {
        if (!cancelled) setLoadedKey(filterKey)
      })
    return () => {
      cancelled = true
    }
  }, [categoryId, keyword, minPrice, maxPrice, filterKey])

  function clearFilters() {
    setMinPriceInput('')
    setMaxPriceInput('')
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>

      <input
        type="search"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search products..."
        className="w-full max-w-sm rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      />

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <aside className="flex w-full shrink-0 flex-col gap-6 lg:w-56">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">Filters</h2>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs text-muted-foreground hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Price (RWF)</h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                inputMode="numeric"
                value={minPriceInput}
                onChange={(e) => setMinPriceInput(e.target.value)}
                placeholder="Min"
                className="w-full min-w-0 rounded-lg border border-border bg-background px-2 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
              <span className="text-muted-foreground">–</span>
              <input
                type="number"
                min={0}
                inputMode="numeric"
                value={maxPriceInput}
                onChange={(e) => setMaxPriceInput(e.target.value)}
                placeholder="Max"
                className="w-full min-w-0 rounded-lg border border-border bg-background px-2 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
          </div>
        </aside>

        <div className="flex-1">
          {error && <p className="text-destructive">{error}</p>}

          {!isLoading && products.length === 0 && !error && (
            <p className="text-muted-foreground">No products found.</p>
          )}

          <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {(isLoading ? Array.from({ length: 8 }) : products).map((product, i) => {
              const item = product as ProductListItem | undefined
              return (
                <li key={item?.id ?? i}>
                  {item ? <ProductCard product={item} /> : <ProductCardSkeleton />}
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}
