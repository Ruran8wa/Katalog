import { Route, Routes } from 'react-router-dom'
import { AdminLayout } from '@/components/AdminLayout'
import { Layout } from '@/components/Layout'
import { RequireAdmin } from '@/components/RequireAdmin'
import { RequireNonAdmin } from '@/components/RequireNonAdmin'
import { AdminDashboardPage } from '@/pages/AdminDashboardPage'
import { AdminProductPage } from '@/pages/AdminProductPage'
import { AdminProductsPage } from '@/pages/AdminProductsPage'
import { CategoryPage } from '@/pages/CategoryPage'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { OrderHistoryPage } from '@/pages/OrderHistoryPage'
import { ProductDetailPage } from '@/pages/ProductDetailPage'

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
