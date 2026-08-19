import { useState } from 'react'
import { AddVariantForm } from '@/components/AddVariantForm'
import { Button } from '@/components/ui/button'
import { VariantRow, type VariantSaveData } from '@/components/VariantRow'
import type { ProductWithVariants } from '@/types'

export function VariantsEditor({
  variants,
  onSave,
  onCreate,
}: {
  variants: ProductWithVariants['variants']
  onSave: (variantId: string, data: VariantSaveData) => void
  onCreate: (data: { sku: string; color: string; colorHex: string; size: string }) => void
}) {
  const [showAddForm, setShowAddForm] = useState(false)
  const sortedVariants = [...variants].sort((a, b) => a.color.localeCompare(b.color))

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="font-medium">Variants ({variants.length})</h2>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => setShowAddForm((v) => !v)}
        >
          {showAddForm ? 'Cancel' : '+ Add variant'}
        </Button>
      </div>

      {variants.length === 0 && (
        <p className="text-sm text-muted-foreground">No variants yet.</p>
      )}

      {variants.length > 0 && (
        <div className="overflow-x-auto border border-border">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left text-xs text-muted-foreground">
                <th className="px-3 py-2 font-medium">Variant</th>
                <th className="px-3 py-2 font-medium">SKU</th>
                <th className="px-3 py-2 font-medium">Price</th>
                <th className="px-3 py-2 font-medium">Was</th>
                <th className="px-3 py-2 font-medium">Stock</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Active</th>
                <th className="px-3 py-2 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sortedVariants.map((variant) => (
                <VariantRow key={variant.id} variant={variant} onSave={onSave} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAddForm && <AddVariantForm onCreate={onCreate} />}
    </div>
  )
}
