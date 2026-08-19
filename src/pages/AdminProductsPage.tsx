import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCategories, getProducts, type ProductListItem } from '@/api/productService'
import { ProductFilterBar, type StatusFilter } from '@/components/ProductFilterBar'
import { ProductListRow } from '@/components/ProductListRow'
import { Button } from '@/components/ui/button'
import type { Category } from '@/types'

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
        setError(err instanceof Error ? err.message : 'Failed to load products'),
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
      if (categoryId !== 'all' && product.categoryId !== categoryId) return false
      if (status === 'active' && !product.isActive) return false
      if (status === 'inactive' && product.isActive) return false
      return true
    })
  }, [products, search, categoryId, status])

  const hasFilters = search.trim() !== '' || categoryId !== 'all' || status !== 'all'

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Button render={<Link to="/admin/products/new" />}>New product</Button>
      </div>

      <ProductFilterBar
        search={search}
        onSearchChange={setSearch}
        categoryId={categoryId}
        onCategoryChange={setCategoryId}
        categories={categories}
        status={status}
        onStatusChange={setStatus}
      />

      {error && <p className="text-destructive">{error}</p>}
      {isLoading && <p className="text-muted-foreground">Loading...</p>}

      {!isLoading && !error && filteredProducts.length === 0 && (
        <p className="text-muted-foreground">
          {hasFilters ? 'No products match your filters.' : 'No products yet.'}
        </p>
      )}

      <ul className="flex flex-col gap-2">
        {filteredProducts.map((product) => (
          <ProductListRow
            key={product.id}
            product={product}
            categoryName={categoryNameById.get(product.categoryId) ?? ''}
          />
        ))}
      </ul>
    </div>
  )
}
