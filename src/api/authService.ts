import { users } from '@/mocks/db'
import type { AuthResponse, User } from '@/types'
import { delay } from './delay'
import { createMockToken, decodeMockToken } from './mockJwt'

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

export async function getCurrentUser(token: string): Promise<User> {
  await delay()
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
