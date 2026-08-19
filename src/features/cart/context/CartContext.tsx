import {
  createContext,
  use,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useAuth } from '@/features/auth/context/AuthContext'
import type { VariantStatus } from '@/shared/types/variant'

function cartStorageKey(userId: string | null): string {
  return `katalog.cart.${userId ?? 'guest'}`
}

export interface CartLine {
  variantId: string
  productId: string
  productName: string
  productImageUrl: string
  sku: string
  color: string
  size: string
  price: number
  quantity: number
  stock: number
  status: VariantStatus
}

interface CartContextValue {
  items: CartLine[]
  itemCount: number
  total: number
  addItem: (line: Omit<CartLine, 'quantity'>, quantity: number) => void
  updateQuantity: (variantId: string, quantity: number) => void
  removeItem: (variantId: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

function readStoredCart(userId: string | null): CartLine[] {
  try {
    const raw = localStorage.getItem(cartStorageKey(userId))
    return raw ? (JSON.parse(raw) as CartLine[]) : []
  } catch {
    return []
  }
}

function mergeCartItems(base: CartLine[], incoming: CartLine[]): CartLine[] {
  const merged = [...base]
  for (const line of incoming) {
    const index = merged.findIndex((l) => l.variantId === line.variantId)
    if (index === -1) {
      merged.push(line)
    } else {
      merged[index] = {
        ...line,
        quantity: Math.min(merged[index].quantity + line.quantity, line.stock),
      }
    }
  }
  return merged
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const userId = user?.id ?? null
  const [items, setItems] = useState<CartLine[]>(() => readStoredCart(userId))
  const [loadedUserId, setLoadedUserId] = useState(userId)

  useEffect(() => {
    if (userId === loadedUserId) return

    setItems((currentItems) => {
      const guestCart = loadedUserId === null ? currentItems : null
      if (guestCart && guestCart.length > 0 && userId !== null) {
        // Guest -> logged in: carry the guest cart forward into the account's cart.
        localStorage.removeItem(cartStorageKey(null))
        return mergeCartItems(readStoredCart(userId), guestCart)
      }
      // Logging out (or switching accounts) never copies a cart into another bucket.
      return readStoredCart(userId)
    })

    setLoadedUserId(userId)
  }, [userId, loadedUserId])

  useEffect(() => {
    localStorage.setItem(cartStorageKey(userId), JSON.stringify(items))
  }, [items, userId])

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount: items.reduce((sum, line) => sum + line.quantity, 0),
      total: items.reduce((sum, line) => sum + line.price * line.quantity, 0),
      addItem(line, quantity) {
        setItems((prev) => {
          const existing = prev.find((l) => l.variantId === line.variantId)
          if (existing) {
            const nextQuantity = Math.min(
              existing.quantity + quantity,
              line.stock,
            )
            return prev.map((l) =>
              l.variantId === line.variantId
                ? { ...l, quantity: nextQuantity, price: line.price, stock: line.stock }
                : l,
            )
          }
          return [...prev, { ...line, quantity: Math.min(quantity, line.stock) }]
        })
      },
      updateQuantity(variantId, quantity) {
        setItems((prev) =>
          prev
            .map((l) =>
              l.variantId === variantId
                ? { ...l, quantity: Math.max(1, Math.min(quantity, l.stock)) }
                : l,
            )
            .filter((l) => l.quantity > 0),
        )
      },
      removeItem(variantId) {
        setItems((prev) => prev.filter((l) => l.variantId !== variantId))
      },
      clear() {
        setItems([])
      },
    }),
    [items],
  )

  return <CartContext value={value}>{children}</CartContext>
}

export function useCart(): CartContextValue {
  const context = use(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
