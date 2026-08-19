import {
  createContext,
  use,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { getCurrentUser, login as loginRequest } from '@/features/auth/api/authService'
import { getAuthToken, setAuthToken } from '@/features/auth/api/session'
import type { User } from '@/features/auth/types/user'

interface AuthContextValue {
  token: string | null
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<User>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(() => getAuthToken())
  const [isLoading, setIsLoading] = useState(() => !!getAuthToken())

  useEffect(() => {
    if (!getAuthToken()) return

    getCurrentUser()
      .then(setUser)
      .catch(() => {
        setAuthToken(null)
        setToken(null)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isLoading,
      async login(email, password) {
        const { token: newToken, user: loggedInUser } = await loginRequest(
          email,
          password,
        )
        setAuthToken(newToken)
        setToken(newToken)
        setUser(loggedInUser)
        return loggedInUser
      },
      logout() {
        setAuthToken(null)
        setToken(null)
        setUser(null)
      },
    }),
    [token, user, isLoading],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}

export function useAuth(): AuthContextValue {
  const context = use(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
