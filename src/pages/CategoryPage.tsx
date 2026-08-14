import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getCategories } from '@/api/productService'
import { ProductCollection } from '@/components/ProductCollection'
import type { Category } from '@/types'

export function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>()
  const [category, setCategory] = useState<Category | null>(null)

  useEffect(() => {
    getCategories().then((categories) => {
      setCategory(categories.find((c) => c.id === categoryId) ?? null)
    })
  }, [categoryId])

  if (!categoryId) return null

  return (
    <div className="flex flex-col gap-6">
      <Link to="/" className="text-sm text-muted-foreground hover:underline">
        &larr; Back to home
      </Link>
      <ProductCollection
        categoryId={categoryId}
        title={category?.name ?? 'Category'}
        description={category ? `Shop our ${category.name} collection.` : undefined}
      />
    </div>
  )
}
