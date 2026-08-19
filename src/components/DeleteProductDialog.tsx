import { AlertDialog } from '@base-ui/react/alert-dialog'
import { Button } from '@/components/ui/button'

export function DeleteProductDialog({
  productName,
  variantCount,
  isDeleting,
  error,
  onDelete,
}: {
  productName: string
  variantCount: number
  isDeleting: boolean
  error: string | null
  onDelete: () => void
}) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger render={<Button variant="destructive" />}>
        Delete product
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className="fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <AlertDialog.Viewport className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <AlertDialog.Popup className="w-full max-w-sm border border-border bg-background p-6 outline-none transition-all duration-200 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
            <AlertDialog.Title className="text-lg font-semibold">
              Delete product?
            </AlertDialog.Title>
            <AlertDialog.Description className="mt-2 text-sm text-muted-foreground">
              This will permanently delete &ldquo;{productName}&rdquo; and all{' '}
              {variantCount} of its variants. This can&apos;t be undone.
            </AlertDialog.Description>
            {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
            <div className="mt-6 flex justify-end gap-2">
              <AlertDialog.Close render={<Button type="button" variant="outline" />}>
                Cancel
              </AlertDialog.Close>
              <Button
                type="button"
                variant="destructive"
                disabled={isDeleting}
                onClick={onDelete}
              >
                {isDeleting ? 'Deleting...' : 'Delete product'}
              </Button>
            </div>
          </AlertDialog.Popup>
        </AlertDialog.Viewport>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}
