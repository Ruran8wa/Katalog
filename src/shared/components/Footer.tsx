import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCategories } from '@/shared/api/productService'
import type { Category } from '@/shared/types/category'

const HELP_LINKS = [
  'Order status',
  'Returns & refunds',
  'Contact us',
  'Terms & conditions',
  'Privacy policy',
]

const ABOUT_LINKS = ['About us', 'Careers', 'Sustainability', 'FAQ']

const CONNECT_LINKS = ['Instagram', 'TikTok', 'Facebook']

export function Footer() {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    getCategories().then(setCategories)
  }, [])

  return (
    <footer className="mt-16 bg-foreground text-background">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-8 gap-y-10 px-4 py-12 sm:grid-cols-4">
        <div className="flex flex-col gap-3">
          <h3 className="font-heading text-sm font-bold tracking-widest uppercase">Katalog</h3>
          <ul className="flex flex-col gap-2 text-sm text-background/70">
            {ABOUT_LINKS.map((label) => (
              <li key={label}>{label}</li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-heading text-sm font-bold tracking-widest uppercase">Shop</h3>
          <ul className="flex flex-col gap-2 text-sm text-background/70">
            {categories.map((category) => (
              <li key={category.id}>
                <Link to={`/category/${category.id}`} className="hover:text-background">
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-heading text-sm font-bold tracking-widest uppercase">Help</h3>
          <ul className="flex flex-col gap-2 text-sm text-background/70">
            {HELP_LINKS.map((label) => (
              <li key={label}>{label}</li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-heading text-sm font-bold tracking-widest uppercase">Connect</h3>
          <p className="text-sm text-background/70">Designed and shipped from Kigali, Rwanda.</p>
          <ul className="flex flex-col gap-2 text-sm text-background/70">
            {CONNECT_LINKS.map((label) => (
              <li key={label}>{label}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-background/20">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-background/60 sm:flex-row sm:items-center sm:justify-between">
          <span>&copy; {new Date().getFullYear()} Katalog. All rights reserved.</span>
          <span>Rwandan-made apparel.</span>
        </div>
      </div>
    </footer>
  )
}
