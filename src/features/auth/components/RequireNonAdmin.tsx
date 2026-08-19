import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'

export function RequireNonAdmin() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return null
  }

  if (user?.role === 'ADMIN') {
    return <Navigate to="/admin" replace />
  }

  return <Outlet />
}
