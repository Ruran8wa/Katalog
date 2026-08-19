import { useState } from 'react'
import { NumberCell } from '@/features/admin/components/NumberCell'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'
import type { ProductWithVariants } from '@/shared/types/product'
import { STOCK_BADGE } from '@/shared/utils/stockStatus'

export type VariantSaveData = {
  price: number
  originalPrice: number | null
  stock: number
  isActive: boolean
}

export function VariantRow({
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
      <NumberCell value={price} onChange={setPrice} width="w-24" />
      <NumberCell value={originalPrice} onChange={setOriginalPrice} width="w-24" placeholder="0" />
      <NumberCell value={stock} onChange={setStock} width="w-20" />
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
