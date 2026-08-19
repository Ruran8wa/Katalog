import { useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/toast'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

const ADMIN_NAV_LINKS = [
  { label: 'Dashboard', to: '/admin', end: true },
  { label: 'Products', to: '/admin/products', end: false },
] as const

export function AdminLayout() {
  const { logout } = useAuth()
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background">
        <nav className="mx-auto flex w-full max-w-7xl items-center gap-6 px-4 py-3">
          <Link
            to="/admin"
            className="font-heading text-xl font-bold tracking-tight uppercase"
          >
            Katalog <span className="text-muted-foreground">Admin</span>
          </Link>

          <div className="flex items-center gap-4 text-sm">
            {ADMIN_NAV_LINKS.map((link) => {
              const isActive = link.end
                ? pathname === link.to
                : pathname === link.to || pathname.startsWith(`${link.to}/`)
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    'font-medium transition-colors hover:text-foreground',
                    isActive ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          <Button variant="outline" size="sm" className="ml-auto" onClick={logout}>
            Log out
          </Button>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <Outlet />
      </main>
      <Toaster />
    </div>
  )
}
