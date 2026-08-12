import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProducts, type ProductListItem } from '@/api/productService'
import { Button } from '@/components/ui/button'

export function AdminPage() {
  const [products, setProducts] = useState<ProductListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getProducts({ includeInactive: true })
      .then(setProducts)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : 'Failed to load products'),
      )
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Button render={<Link to="/admin/products/new" />}>New product</Button>
      </div>

      {error && <p className="text-destructive">{error}</p>}
      {isLoading && <p className="text-muted-foreground">Loading...</p>}

      <ul className="flex flex-col gap-2">
        {products.map((product) => (
          <li key={product.id}>
            <Link
              to={`/admin/products/${product.id}`}
              className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted"
            >
              <div className="size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                <img
                  src={product.imageUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col">
                <span className="font-medium">{product.name}</span>
                <span className="text-sm text-muted-foreground">
                  {product.fromPrice !== null
                    ? `From ${product.fromPrice.toLocaleString()} RWF`
                    : 'No active variants'}
                </span>
              </div>
              {!product.isActive && (
                <span className="text-xs text-muted-foreground">Inactive</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
