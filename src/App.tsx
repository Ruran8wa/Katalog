import { Route, Routes } from 'react-router-dom'
import { AdminLayout } from '@/features/admin/components/AdminLayout'
import { Layout } from '@/shared/components/Layout'
import { RequireAdmin } from '@/features/auth/components/RequireAdmin'
import { RequireNonAdmin } from '@/features/auth/components/RequireNonAdmin'
import { AdminDashboardPage } from '@/features/admin/pages/AdminDashboardPage'
import { AdminProductPage } from '@/features/admin/pages/AdminProductPage'
import { AdminProductsPage } from '@/features/admin/pages/AdminProductsPage'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { CategoryPage } from '@/features/catalog/pages/CategoryPage'
import { HomePage } from '@/features/catalog/pages/HomePage'
import { ProductDetailPage } from '@/features/catalog/pages/ProductDetailPage'
import { OrderHistoryPage } from '@/features/orders/pages/OrderHistoryPage'
import { NotFoundPage } from '@/shared/pages/NotFoundPage'

function App() {
  return (
    <Routes>
      <Route element={<RequireAdmin />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/products/:id" element={<AdminProductPage />} />
        </Route>
      </Route>
      <Route element={<Layout />}>
        <Route element={<RequireNonAdmin />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/orders" element={<OrderHistoryPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
