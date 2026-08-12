import { Drawer } from '@base-ui/react/drawer'
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { checkout } from '@/api/orderService'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import type { Order } from '@/types'

export const cartDrawerHandle = Drawer.createHandle()

export function CartDrawerTrigger() {
  const { itemCount } = useCart()

  return (
    <Drawer.Trigger
      handle={cartDrawerHandle}
      className="relative p-1"
      aria-label="Cart"
    >
      <ShoppingBag className="size-5" />
      {itemCount > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
          {itemCount}
        </span>
      )}
    </Drawer.Trigger>
  )
}

export function CartDrawer() {
  const { user } = useAuth()
  const { items, total, updateQuantity, removeItem, clear } = useCart()
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null)

  async function handleCheckout() {
    setError(null)
    setIsPlacingOrder(true)
    try {
      const order = await checkout(
        items.map((line) => ({ variantId: line.variantId, quantity: line.quantity })),
      )
      setPlacedOrder(order)
      clear()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed')
    } finally {
      setIsPlacingOrder(false)
    }
  }

  return (
    <Drawer.Root
      handle={cartDrawerHandle}
      swipeDirection="right"
      onOpenChangeComplete={(open) => {
        if (!open) {
          setPlacedOrder(null)
          setError(null)
        }
      }}
    >
      <Drawer.Portal>
        <Drawer.Backdrop className="fixed inset-0 bg-black/40 transition-opacity duration-300 data-starting-style:opacity-0 data-ending-style:opacity-0" />
        <Drawer.Viewport className="fixed inset-0 flex items-stretch justify-end">
          <Drawer.Popup className="flex h-full w-full flex-col border-l border-border bg-background outline-none sm:w-1/4 sm:min-w-80 sm:max-w-md [transform:translateX(var(--drawer-swipe-movement-x))] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] data-starting-style:translate-x-full data-ending-style:translate-x-full">
            <div className="flex items-center justify-between border-b border-border p-4">
              <Drawer.Title className="text-lg font-semibold">Your cart</Drawer.Title>
              <Drawer.Close aria-label="Close cart" className="p-1 text-muted-foreground hover:text-foreground">
                <X className="size-5" />
              </Drawer.Close>
            </div>

            <div className="flex flex-1 flex-col overflow-y-auto p-4">
              {placedOrder ? (
                <div className="flex flex-col gap-3">
                  <p className="font-medium">Order placed</p>
                  <p className="text-sm text-muted-foreground">
                    Order <span className="font-mono">{placedOrder.id}</span> for{' '}
                    {placedOrder.totalPrice.toLocaleString()} RWF is confirmed.
                  </p>
                  <Button
                    className="w-fit"
                    render={<Drawer.Close render={<Link to="/" />} />}
                  >
                    Continue shopping
                  </Button>
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col gap-3">
                  <p className="text-muted-foreground">Your cart is empty.</p>
                  <Button
                    className="w-fit"
                    render={<Drawer.Close render={<Link to="/" />} />}
                  >
                    Browse products
                  </Button>
                </div>
              ) : (
                <ul className="flex flex-col gap-4">
                  {items.map((line) => (
                    <li
                      key={line.variantId}
                      className="flex gap-3 border-b border-border pb-4 last:border-b-0"
                    >
                      <Link
                        to={`/products/${line.productId}`}
                        className="size-16 shrink-0 overflow-hidden rounded-lg bg-muted"
                      >
                        <img
                          src={line.productImageUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </Link>
                      <div className="flex flex-1 flex-col gap-1">
                        <Link
                          to={`/products/${line.productId}`}
                          className="text-sm font-medium hover:underline"
                        >
                          {line.productName}
                        </Link>
                        <span className="text-xs text-muted-foreground">
                          {line.color} / {line.size}
                        </span>
                        <span className="text-sm">{line.price.toLocaleString()} RWF</span>
                        <div className="mt-1 flex items-center gap-2">
                          <div className="flex items-center rounded-lg border border-border">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              disabled={line.quantity <= 1}
                              onClick={() => updateQuantity(line.variantId, line.quantity - 1)}
                              className="p-1 disabled:opacity-40"
                            >
                              <Minus className="size-3" />
                            </button>
                            <span className="w-6 text-center text-xs">{line.quantity}</span>
                            <button
                              type="button"
                              aria-label="Increase quantity"
                              disabled={line.quantity >= line.stock}
                              onClick={() => updateQuantity(line.variantId, line.quantity + 1)}
                              className="p-1 disabled:opacity-40"
                            >
                              <Plus className="size-3" />
                            </button>
                          </div>
                          <button
                            type="button"
                            aria-label="Remove item"
                            onClick={() => removeItem(line.variantId)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {!placedOrder && items.length > 0 && (
              <div className="flex flex-col gap-3 border-t border-border p-4">
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>{total.toLocaleString()} RWF</span>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                {user ? (
                  <Button disabled={isPlacingOrder} onClick={handleCheckout}>
                    {isPlacingOrder ? 'Placing order...' : 'Checkout'}
                  </Button>
                ) : (
                  <Button render={<Drawer.Close render={<Link to="/login" />} />}>
                    Log in to checkout
                  </Button>
                )}
              </div>
            )}
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
