import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ImageThumbnailList({
  images,
  primaryImageIndex,
  onSelectPrimary,
  onRemove,
  onMove,
}: {
  images: string[]
  primaryImageIndex: number
  onSelectPrimary: (index: number) => void
  onRemove: (index: number) => void
  onMove: (index: number, direction: -1 | 1) => void
}) {
  return (
    <ul className="flex max-w-md flex-wrap gap-2">
      {images.map((url, index) => (
        <li key={`${index}-${url}`} className="flex flex-col items-center gap-1">
          <button
            type="button"
            title={index === primaryImageIndex ? 'Primary image' : 'Set as primary'}
            onClick={() => onSelectPrimary(index)}
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
              onClick={() => onMove(index, -1)}
              className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
            >
              <ChevronLeft className="size-3.5" />
            </button>
            <button
              type="button"
              title="Remove"
              onClick={() => onRemove(index)}
              className="p-0.5 text-muted-foreground hover:text-destructive"
            >
              <X className="size-3.5" />
            </button>
            <button
              type="button"
              title="Move right"
              disabled={index === images.length - 1}
              onClick={() => onMove(index, 1)}
              className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
            >
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
