import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ImageThumbnailList } from '@/components/ImageThumbnailList'

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
        <ImageThumbnailList
          images={images}
          primaryImageIndex={primaryImageIndex}
          onSelectPrimary={(index) => onChange(images, index)}
          onRemove={removeImage}
          onMove={moveImage}
        />
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
