import { Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { RequireAdmin } from '@/components/RequireAdmin'
import { RequireNonAdmin } from '@/components/RequireNonAdmin'
import { AdminPage } from '@/pages/AdminPage'
import { AdminProductPage } from '@/pages/AdminProductPage'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ProductDetailPage } from '@/pages/ProductDetailPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route element={<RequireNonAdmin />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<RequireAdmin />}>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/products/:id" element={<AdminProductPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
