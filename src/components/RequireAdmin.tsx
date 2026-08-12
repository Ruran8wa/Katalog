import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export function RequireAdmin() {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return null
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (user.role !== 'ADMIN') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
