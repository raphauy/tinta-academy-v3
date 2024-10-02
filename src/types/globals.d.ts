export {}

// Create a type for the roles
export type Roles = 'admin' | 'student' | 'educator' | 'colaborator'

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles,
      studentId?: string
    }
  }
}