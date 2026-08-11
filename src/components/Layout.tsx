import { Link, Outlet } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { CartDrawer, CartDrawerTrigger } from '@/components/CartDrawer'
import { useAuth } from '@/context/AuthContext'

export function Layout() {
  const { user, logout } = useAuth()
  const isAdmin = user?.role === 'ADMIN'

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <header className="border-b border-border">
        <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <Link to={isAdmin ? '/admin' : '/'} className="text-lg font-semibold">
            Katalog{isAdmin && ' Admin'}
          </Link>
          <div className="flex items-center gap-3 text-sm">
            {!isAdmin && <CartDrawerTrigger />}
            {user ? (
              <>
                <span className="text-muted-foreground">{user.email}</span>
                <Button variant="outline" size="sm" onClick={logout}>
                  Log out
                </Button>
              </>
            ) : (
              <Link to="/login" className="hover:underline">
                Log in
              </Link>
            )}
          </div>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        <Outlet />
      </main>
      {!isAdmin && <CartDrawer />}
    </div>
  )
}
