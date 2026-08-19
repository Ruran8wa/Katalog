import type { FormEvent } from 'react'
import type { ProductInput } from '@/shared/api/productService'
import { Button } from '@/shared/components/ui/button'
import type { Category } from '@/shared/types/category'

export function ProductForm({
  form,
  onChange,
  categories,
  isNew,
  isSaving,
  onSubmit,
}: {
  form: ProductInput
  onChange: (form: ProductInput) => void
  categories: Category[]
  isNew: boolean
  isSaving: boolean
  onSubmit: (e: FormEvent) => void
}) {
  return (
    <form onSubmit={onSubmit} className="flex max-w-md flex-col gap-3">
      <label className="flex flex-col gap-1 text-sm">
        Name
        <input
          required
          value={form.name}
          onChange={(e) => onChange({ ...form, name: e.target.value })}
          className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Description
        <textarea
          required
          value={form.description}
          onChange={(e) => onChange({ ...form, description: e.target.value })}
          className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Category
        <select
          required
          value={form.categoryId}
          onChange={(e) => onChange({ ...form, categoryId: e.target.value })}
          className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="" disabled>
            Select a category
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(e) => onChange({ ...form, isActive: e.target.checked })}
        />
        Active
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.isBestSeller}
          onChange={(e) => onChange({ ...form, isBestSeller: e.target.checked })}
        />
        Best seller
      </label>
      <Button type="submit" disabled={isSaving}>
        {isSaving ? 'Saving...' : isNew ? 'Create product' : 'Save changes'}
      </Button>
    </form>
  )
}
