import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ProductCard, ProductCardSkeleton } from '@/features/catalog/components/ProductCard'
import { pickRandom } from '@/features/catalog/utils/pickRandom'
import {
  getCategories,
  getProducts,
  type ProductListItem,
} from '@/shared/api/productService'
import type { Category } from '@/shared/types/category'

const CATEGORY_IMAGES: Record<string, string> = {
  'T-Shirts': 'https://images.unsplash.com/photo-1778671394516-8270eac13c42?auto=format&fit=crop&w=400&q=80',
  Shirts: 'https://images.unsplash.com/photo-1671438118097-479e63198629?auto=format&fit=crop&w=400&q=80',
  Pants: 'https://images.unsplash.com/photo-1718252540617-6ecda2b56b57?auto=format&fit=crop&w=400&q=80',
  Caps: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=400&q=80',
  'Coats & Jackets':
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=400&q=80',
}

const RECOMMENDED_COUNT = 5

export function HomePage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [recommended, setRecommended] = useState<ProductListItem[] | null>(null)

  useEffect(() => {
    getCategories().then(setCategories)
  }, [])

  useEffect(() => {
    getProducts({}).then((products) => setRecommended(pickRandom(products, RECOMMENDED_COUNT)))
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <section className="relative left-1/2 -mt-6 h-dvh w-screen -mx-[50vw]">
        <img
          src="https://images.unsplash.com/photo-1760337741510-1a4661e036fa?auto=format&fit=crop&w=1920&q=80"
          alt="Models wearing Katalog apparel"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-4 text-center">
          <h1 className="font-heading max-w-4xl text-4xl font-bold tracking-tight text-white uppercase sm:text-6xl md:text-7xl">
            Wear Your Roots
          </h1>
          <a
            href="#collection"
            className="rounded-lg border border-white px-6 py-2.5 text-sm font-bold tracking-wide text-white uppercase transition-colors hover:bg-white hover:text-black"
          >
            Shop now
          </a>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-tight">Search by category</h2>
        <div className="grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-5">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="group flex flex-col items-center gap-2 text-center"
            >
              <div className="flex aspect-square w-full items-center justify-center overflow-hidden bg-secondary/60 p-5 transition-colors group-hover:bg-secondary">
                <img
                  src={CATEGORY_IMAGES[category.name]}
                  alt=""
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="text-xs font-medium sm:text-sm">{category.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section id="collection" className="flex scroll-mt-20 flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold tracking-tight">Recommended for you</h2>
          <p className="text-sm text-muted-foreground">A few picks from across the collection.</p>
        </div>

        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
          {(recommended ?? Array.from({ length: RECOMMENDED_COUNT })).map((product, i) => {
            const item = product as ProductListItem | undefined
            return (
              <li key={item?.id ?? i}>
                {item ? <ProductCard product={item} /> : <ProductCardSkeleton />}
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
