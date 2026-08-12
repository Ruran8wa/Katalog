const TOKEN_STORAGE_KEY = 'katalog.token'

let token: string | null = localStorage.getItem(TOKEN_STORAGE_KEY)

export function getAuthToken(): string | null {
  return token
}

export function setAuthToken(next: string | null): void {
  token = next
  if (next) {
    localStorage.setItem(TOKEN_STORAGE_KEY, next)
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
  }
}
