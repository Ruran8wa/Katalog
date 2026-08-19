import { useState } from 'react'
import { deleteProduct } from '@/api/productService'

export function useDeleteProduct(id: string | undefined) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [isDeleted, setIsDeleted] = useState(false)

  async function handleDelete() {
    if (!id) return
    setDeleteError(null)
    setIsDeleting(true)
    try {
      await deleteProduct(id)
      setIsDeleted(true)
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete product')
    } finally {
      setIsDeleting(false)
    }
  }

  return { isDeleting, deleteError, isDeleted, handleDelete }
}
