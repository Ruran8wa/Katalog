import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCategories, getProducts, type ProductListItem } from '@/api/productService'
import type { Category } from '@/types'

export function HomePage() {
  const [keyword, setKeyword] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([])
  const [minPriceInput, setMinPriceInput] = useState('')
  const [maxPriceInput, setMaxPriceInput] = useState('')
  const [products, setProducts] = useState<ProductListItem[]>([])
  const [loadedKey, setLoadedKey] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const minPrice = minPriceInput ? Number(minPriceInput) : undefined
  const maxPrice = maxPriceInput ? Number(maxPriceInput) : undefined
  const filterKey = JSON.stringify({ keyword, selectedCategoryIds, minPrice, maxPrice })
  const isLoading = loadedKey !== filterKey
  const hasActiveFilters =
    selectedCategoryIds.length > 0 || minPriceInput !== '' || maxPriceInput !== ''

  useEffect(() => {
    getCategories().then(setCategories)
  }, [])

  useEffect(() => {
    let cancelled = false
    getProducts({ keyword, categoryIds: selectedCategoryIds, minPrice, maxPrice })
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
  }, [keyword, selectedCategoryIds, minPrice, maxPrice, filterKey])

  const categoryName = (categoryId: string) =>
    categories.find((c) => c.id === categoryId)?.name ?? ''

  function toggleCategory(categoryId: string) {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    )
  }

  function clearFilters() {
    setSelectedCategoryIds([])
    setMinPriceInput('')
    setMaxPriceInput('')
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Shop the collection</h1>
        <p className="text-sm text-muted-foreground">
          Rwandan-made apparel, from everyday tees to highland-ready coats.
        </p>
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
          <div className="flex flex-col gap-2">
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
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Category</h3>
            <ul className="flex flex-col gap-1.5">
              {categories.map((category) => (
                <li key={category.id}>
                  <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={selectedCategoryIds.includes(category.id)}
                      onChange={() => toggleCategory(category.id)}
                    />
                    {category.name}
                  </label>
                </li>
              ))}
            </ul>
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
                  {item ? (
                    <Link
                      to={`/products/${item.id}`}
                      className="group flex flex-col gap-2 rounded-xl bg-secondary/60 p-3 transition-colors hover:bg-secondary"
                    >
                      <div className="aspect-[3/4] overflow-hidden rounded-lg bg-muted">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      {item.colors.length > 0 && (
                        <div className="flex items-center gap-1.5">
                          {item.colors.slice(0, 6).map((color) => (
                            <span
                              key={color.name}
                              title={color.name}
                              style={{ backgroundColor: color.hex }}
                              className="size-3.5 rounded-full border border-black/10"
                            />
                          ))}
                          {item.colors.length > 6 && (
                            <span className="text-[11px] text-muted-foreground">
                              +{item.colors.length - 6}
                            </span>
                          )}
                        </div>
                      )}
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                          {categoryName(item.categoryId)}
                        </span>
                        <h2 className="text-sm font-semibold leading-snug text-foreground">
                          {item.name}
                        </h2>
                        <span className="text-sm text-muted-foreground">
                          {item.fromPrice !== null
                            ? `From ${item.fromPrice.toLocaleString()} RWF`
                            : 'Unavailable'}
                        </span>
                      </div>
                    </Link>
                  ) : (
                    <div className="flex flex-col gap-2 rounded-xl bg-secondary/60 p-3">
                      <div className="aspect-[3/4] animate-pulse rounded-lg bg-muted" />
                      <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
                      <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}
