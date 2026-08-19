import { Link, Navigate, useParams } from 'react-router-dom'
import { DeleteProductDialog } from '@/components/DeleteProductDialog'
import { ImageGalleryEditor } from '@/components/ImageGalleryEditor'
import { ProductForm } from '@/components/ProductForm'
import { VariantsEditor } from '@/components/VariantsEditor'
import { useAdminProduct } from '@/hooks/useAdminProduct'
import { useDeleteProduct } from '@/hooks/useDeleteProduct'
import { useVariantActions } from '@/hooks/useVariantActions'

export function AdminProductPage() {
  const { id } = useParams<{ id: string }>()
  const isNew = id === 'new'
  const {
    categories,
    product,
    setProduct,
    form,
    setForm,
    isLoading,
    error,
    setError,
    isSaving,
    createdId,
    handleSubmit,
  } = useAdminProduct(id, isNew)
  const { isDeleting, deleteError, isDeleted, handleDelete } = useDeleteProduct(id)
  const { handleVariantSave, handleVariantCreate } = useVariantActions(
    id,
    isNew,
    setProduct,
    setError,
  )

  if (createdId) return <Navigate to={`/admin/products/${createdId}`} replace />
  if (isDeleted) return <Navigate to="/admin/products" replace />
  if (isLoading) return <p className="text-muted-foreground">Loading...</p>

  return (
    <div className="flex flex-col gap-6">
      <Link to="/admin/products" className="text-sm text-muted-foreground hover:underline">
        &larr; Back to products
      </Link>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{isNew ? 'New product' : product?.name}</h1>
        {!isNew && product && (
          <DeleteProductDialog
            productName={product.name}
            variantCount={product.variants.length}
            isDeleting={isDeleting}
            error={deleteError}
            onDelete={handleDelete}
          />
        )}
      </div>

      {error && <p className="text-destructive">{error}</p>}

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          <ImageGalleryEditor
            images={form.images}
            primaryImageIndex={form.primaryImageIndex}
            onChange={(images, primaryImageIndex) =>
              setForm({ ...form, images, primaryImageIndex })
            }
          />
        </div>

        <ProductForm
          form={form}
          onChange={setForm}
          categories={categories}
          isNew={isNew}
          isSaving={isSaving}
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
        />
      </div>

      {!isNew && product && (
        <VariantsEditor
          variants={product.variants}
          onSave={handleVariantSave}
          onCreate={handleVariantCreate}
        />
      )}
    </div>
  )
}
