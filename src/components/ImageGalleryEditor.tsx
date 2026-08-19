import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function ImageGalleryEditor({
  images,
  primaryImageIndex,
  onChange,
}: {
  images: string[]
  primaryImageIndex: number
  onChange: (images: string[], primaryImageIndex: number) => void
}) {
  const [newUrl, setNewUrl] = useState('')

  function addImage() {
    const url = newUrl.trim()
    if (!url) return
    onChange([...images, url], images.length === 0 ? 0 : primaryImageIndex)
    setNewUrl('')
  }

  function removeImage(index: number) {
    const next = images.filter((_, i) => i !== index)
    let nextPrimary = primaryImageIndex
    if (index === primaryImageIndex) nextPrimary = 0
    else if (index < primaryImageIndex) nextPrimary = primaryImageIndex - 1
    onChange(next, Math.min(nextPrimary, Math.max(next.length - 1, 0)))
  }

  function moveImage(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= images.length) return
    const next = [...images]
    ;[next[index], next[target]] = [next[target], next[index]]

    let nextPrimary = primaryImageIndex
    if (primaryImageIndex === index) nextPrimary = target
    else if (primaryImageIndex === target) nextPrimary = index
    onChange(next, nextPrimary)
  }

  const heroUrl = images[primaryImageIndex] ?? images[0]

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm">Images</span>

      <div className="aspect-[3/4] w-full max-w-md overflow-hidden border border-border bg-muted">
        {heroUrl ? (
          <img src={heroUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No image yet
          </div>
        )}
      </div>

      {images.length > 0 && (
        <ul className="flex max-w-md flex-wrap gap-2">
          {images.map((url, index) => (
            <li key={`${index}-${url}`} className="flex flex-col items-center gap-1">
              <button
                type="button"
                title={index === primaryImageIndex ? 'Primary image' : 'Set as primary'}
                onClick={() => onChange(images, index)}
                className={cn(
                  'size-16 overflow-hidden border-2 bg-muted transition-colors',
                  index === primaryImageIndex
                    ? 'border-primary'
                    : 'border-transparent hover:border-border',
                )}
              >
                <img src={url} alt="" className="h-full w-full object-cover" />
              </button>
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  title="Move left"
                  disabled={index === 0}
                  onClick={() => moveImage(index, -1)}
                  className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
                >
                  <ChevronLeft className="size-3.5" />
                </button>
                <button
                  type="button"
                  title="Remove"
                  onClick={() => removeImage(index)}
                  className="p-0.5 text-muted-foreground hover:text-destructive"
                >
                  <X className="size-3.5" />
                </button>
                <button
                  type="button"
                  title="Move right"
                  disabled={index === images.length - 1}
                  onClick={() => moveImage(index, 1)}
                  className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
                >
                  <ChevronRight className="size-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex max-w-md gap-2">
        <input
          type="url"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== 'Enter') return
            e.preventDefault()
            addImage()
          }}
          placeholder="https://..."
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
        <Button type="button" variant="outline" onClick={addImage}>
          Add image
        </Button>
      </div>
    </div>
  )
}
