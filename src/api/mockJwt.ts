import type { User, UserRole } from '@/types'

export interface MockJwtPayload {
  sub: string
  email: string
  role: UserRole
  iat: number
  exp: number
}

function base64UrlEncode(input: string): string {
  const bytes = new TextEncoder().encode(input)
  let binary = ''
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64UrlDecode(input: string): string {
  let padded = input.replace(/-/g, '+').replace(/_/g, '/')
  while (padded.length % 4 !== 0) padded += '='
  const binary = atob(padded)
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

export function createMockToken(user: User, expiresInSeconds = 3600): string {
  const header = base64UrlEncode(JSON.stringify({ alg: 'none', typ: 'JWT' }))
  const now = Math.floor(Date.now() / 1000)
  const payload: MockJwtPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    iat: now,
    exp: now + expiresInSeconds,
  }
  return `${header}.${base64UrlEncode(JSON.stringify(payload))}.`
}

export function decodeMockToken(token: string): MockJwtPayload {
  const [, payloadSegment] = token.split('.')
  if (!payloadSegment) {
    throw new Error('Malformed token')
  }

  try {
    return JSON.parse(base64UrlDecode(payloadSegment)) as MockJwtPayload
  } catch {
    throw new Error('Malformed token')
  }
}
