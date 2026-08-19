import { useState } from 'react'
import { Button } from '@/shared/components/ui/button'

export function AddVariantForm({
  onCreate,
}: {
  onCreate: (data: { sku: string; color: string; colorHex: string; size: string }) => void
}) {
  const [sku, setSku] = useState('')
  const [color, setColor] = useState('')
  const [colorHex, setColorHex] = useState('#000000')
  const [size, setSize] = useState('')

  function handleSubmit() {
    if (!color.trim() || !size.trim() || !sku.trim()) return
    onCreate({ sku: sku.trim(), color: color.trim(), colorHex, size: size.trim() })
    setSku('')
    setColor('')
    setColorHex('#000000')
    setSize('')
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }}
      className="flex flex-wrap items-end gap-2 border border-border p-3"
    >
      <label className="flex flex-col gap-1 text-xs text-muted-foreground">
        Color
        <div className="flex gap-1">
          <input
            type="color"
            value={colorHex}
            onChange={(e) => setColorHex(e.target.value)}
            className="h-9 w-10 shrink-0 rounded-lg border border-border bg-background p-1"
          />
          <input
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="Color name"
            className="w-32 rounded-lg border border-border bg-background px-2 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
      </label>
      <label className="flex flex-col gap-1 text-xs text-muted-foreground">
        Size
        <input
          value={size}
          onChange={(e) => setSize(e.target.value)}
          placeholder="Size"
          className="w-20 rounded-lg border border-border bg-background px-2 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </label>
      <label className="flex flex-col gap-1 text-xs text-muted-foreground">
        SKU
        <input
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          placeholder="SKU"
          className="w-36 rounded-lg border border-border bg-background px-2 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </label>
      <Button type="submit" variant="outline">
        Add variant
      </Button>
    </form>
  )
}
