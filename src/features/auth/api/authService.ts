import { users } from '@/shared/mocks/db'
import { delay } from '@/shared/api/delay'
import type { AuthResponse } from '@/features/auth/types/auth'
import type { User } from '@/features/auth/types/user'
import { createMockToken, decodeMockToken } from './mockJwt'
import { getAuthToken } from './session'

export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  await delay()
  const match = users.find(
    (user) =>
      user.email.toLowerCase() === email.toLowerCase() &&
      user.password === password,
  )
  if (!match) {
    throw new Error('Invalid email or password')
  }

  const user: User = { id: match.id, email: match.email, role: match.role }
  return { token: createMockToken(user), user }
}

export function requireAuthenticatedUser(): User {
  const token = getAuthToken()
  if (!token) {
    throw new Error('Not authenticated')
  }

  const payload = decodeMockToken(token)
  if (payload.exp * 1000 < Date.now()) {
    throw new Error('Token expired')
  }

  const match = users.find((user) => user.id === payload.sub)
  if (!match) {
    throw new Error('User not found')
  }

  return { id: match.id, email: match.email, role: match.role }
}

export async function getCurrentUser(): Promise<User> {
  await delay()
  return requireAuthenticatedUser()
}
