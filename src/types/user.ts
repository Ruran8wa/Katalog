export type UserRole = 'PUBLIC' | 'USER' | 'ADMIN'

export interface User {
  id: string
  email: string
  role: UserRole
}
