import { Drawer } from '@base-ui/react/drawer'
import { Menu, Receipt, User, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button'
import { Toaster } from '@/shared/components/ui/toast'
import { CartDrawer, CartDrawerTrigger } from '@/features/cart/components/CartDrawer'
import { Footer } from '@/shared/components/Footer'
import { useAuth } from '@/features/auth/context/AuthContext'
import { cn } from '@/shared/lib/utils'

const NAV_LINKS = ['MEN', 'WOMEN', 'KIDS'] as const

const mobileNavHandle = Drawer.createHandle()

export function Layout() {
  const { user, logout } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const [selectedNavLink, setSelectedNavLink] = useState<(typeof NAV_LINKS)[number]>('MEN')
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background">
        <nav className="mx-auto grid w-full max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 py-3">
          <div className="flex items-center">
            <Drawer.Trigger
              handle={mobileNavHandle}
              aria-label="Open menu"
              className="p-1 sm:hidden"
            >
              <Menu className="size-5" />
            </Drawer.Trigger>

            <div className="hidden items-center gap-6 text-xs tracking-widest sm:flex">
              {NAV_LINKS.map((link) => (
                <button
                  key={link}
                  type="button"
                  onClick={() => setSelectedNavLink(link)}
                  className={cn(
                    'transition-colors hover:text-foreground',
                    link === selectedNavLink
                      ? 'font-bold text-foreground'
                      : 'font-medium text-muted-foreground',
                  )}
                >
                  {link}
                </button>
              ))}
            </div>
          </div>

          <Link
            to={isAdmin ? '/admin' : '/'}
            className="font-heading justify-self-center text-3xl font-bold tracking-tight uppercase sm:text-4xl"
          >
            Katalog{isAdmin && <span className="ml-2 align-middle text-base">Admin</span>}
          </Link>

          <div className="flex items-center justify-end gap-3 text-sm">
            {!isAdmin && <CartDrawerTrigger />}
            {user ? (
              <>
                {!isAdmin && (
                  <Link
                    to="/orders"
                    aria-label="Order history"
                    className="p-1 text-foreground hover:text-muted-foreground"
                  >
                    <Receipt className="size-5" />
                  </Link>
                )}
                <Button variant="outline" size="sm" onClick={logout}>
                  Log out
                </Button>
              </>
            ) : (
              <Link
                to="/login"
                aria-label="Log in"
                className="p-1 text-foreground hover:text-muted-foreground"
              >
                <User className="size-5" />
              </Link>
            )}
          </div>
        </nav>
      </header>

      <Drawer.Root handle={mobileNavHandle} swipeDirection="left">
        <Drawer.Portal>
          <Drawer.Backdrop className="fixed inset-0 bg-black/40 transition-opacity duration-300 data-starting-style:opacity-0 data-ending-style:opacity-0" />
          <Drawer.Viewport className="fixed inset-0 flex items-stretch justify-start sm:hidden">
            <Drawer.Popup className="flex h-full w-64 flex-col border-r border-border bg-background outline-none [transform:translateX(var(--drawer-swipe-movement-x))] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] data-starting-style:-translate-x-full data-ending-style:-translate-x-full">
              <div className="flex items-center justify-between border-b border-border p-4">
                <Drawer.Title className="font-heading text-lg font-bold tracking-tight uppercase">
                  Menu
                </Drawer.Title>
                <Drawer.Close
                  aria-label="Close menu"
                  className="p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-5" />
                </Drawer.Close>
              </div>
              <nav className="flex flex-col p-2">
                {NAV_LINKS.map((link) => (
                  <Drawer.Close
                    key={link}
                    onClick={() => setSelectedNavLink(link)}
                    className={cn(
                      'px-2 py-3 text-left text-sm tracking-widest transition-colors',
                      link === selectedNavLink
                        ? 'font-bold text-foreground'
                        : 'font-medium text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {link}
                  </Drawer.Close>
                ))}
              </nav>
            </Drawer.Popup>
          </Drawer.Viewport>
        </Drawer.Portal>
      </Drawer.Root>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <Outlet />
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <CartDrawer />}
      <Toaster />
    </div>
  )
}
