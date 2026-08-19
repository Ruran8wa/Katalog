import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ProductWithVariants } from '@/types'
import { STOCK_BADGE } from '@/utils/stockStatus'

type VariantSaveData = {
  price: number
  originalPrice: number | null
  stock: number
  isActive: boolean
}

function VariantRow({
  variant,
  onSave,
}: {
  variant: ProductWithVariants['variants'][number]
  onSave: (variantId: string, data: VariantSaveData) => void
}) {
  const [price, setPrice] = useState(variant.price)
  const [originalPrice, setOriginalPrice] = useState(variant.originalPrice ?? 0)
  const [stock, setStock] = useState(variant.stock)
  const [isActive, setIsActive] = useState(variant.isActive)

  const isDirty =
    price !== variant.price ||
    originalPrice !== (variant.originalPrice ?? 0) ||
    stock !== variant.stock ||
    isActive !== variant.isActive

  const badge = STOCK_BADGE[variant.status]

  return (
    <tr className={cn(!variant.isActive && 'opacity-60')}>
      <td className="px-3 py-2">
        <div className="flex items-center gap-2">
          <span
            className="size-3.5 shrink-0 rounded-full border border-black/10"
            style={{ backgroundColor: variant.colorHex }}
          />
          <span>
            {variant.color} / {variant.size}
          </span>
        </div>
      </td>
      <td className="px-3 py-2 text-xs text-muted-foreground">{variant.sku}</td>
      <td className="px-3 py-2">
        <input
          type="number"
          min={0}
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-24 rounded-lg border border-border bg-background px-2 py-1"
        />
      </td>
      <td className="px-3 py-2">
        <input
          type="number"
          min={0}
          value={originalPrice}
          onChange={(e) => setOriginalPrice(Number(e.target.value))}
          placeholder="0"
          className="w-24 rounded-lg border border-border bg-background px-2 py-1"
        />
      </td>
      <td className="px-3 py-2">
        <input
          type="number"
          min={0}
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          className="w-20 rounded-lg border border-border bg-background px-2 py-1"
        />
      </td>
      <td className="px-3 py-2">
        <span className={cn('text-xs', badge.className)}>{badge.label}</span>
      </td>
      <td className="px-3 py-2">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
      </td>
      <td className="px-3 py-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={!isDirty}
          onClick={() =>
            onSave(variant.id, {
              price,
              originalPrice: originalPrice > 0 ? originalPrice : null,
              stock,
              isActive,
            })
          }
        >
          Save
        </Button>
      </td>
    </tr>
  )
}

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
  const [newSku, setNewSku] = useState('')
  const [newColor, setNewColor] = useState('')
  const [newColorHex, setNewColorHex] = useState('#000000')
  const [newSize, setNewSize] = useState('')

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

      {showAddForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (!newColor.trim() || !newSize.trim() || !newSku.trim()) return
            onCreate({
              sku: newSku.trim(),
              color: newColor.trim(),
              colorHex: newColorHex,
              size: newSize.trim(),
            })
            setNewSku('')
            setNewColor('')
            setNewColorHex('#000000')
            setNewSize('')
          }}
          className="flex flex-wrap items-end gap-2 border border-border p-3"
        >
          <label className="flex flex-col gap-1 text-xs text-muted-foreground">
            Color
            <div className="flex gap-1">
              <input
                type="color"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                className="h-9 w-10 shrink-0 rounded-lg border border-border bg-background p-1"
              />
              <input
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                placeholder="Color name"
                className="w-32 rounded-lg border border-border bg-background px-2 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
          </label>
          <label className="flex flex-col gap-1 text-xs text-muted-foreground">
            Size
            <input
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              placeholder="Size"
              className="w-20 rounded-lg border border-border bg-background px-2 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-muted-foreground">
            SKU
            <input
              value={newSku}
              onChange={(e) => setNewSku(e.target.value)}
              placeholder="SKU"
              className="w-36 rounded-lg border border-border bg-background px-2 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </label>
          <Button type="submit" variant="outline">
            Add variant
          </Button>
        </form>
      )}
    </div>
  )
}
