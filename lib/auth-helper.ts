// lib/auth-helper.ts

/**
 * Helper functions for authentication and business context
 */

export interface AuthUser {
  id: string
  email: string
  businessId: string
  role?: string
}

/**
 * Get the current user's business ID from localStorage
 */
export function getBusinessId(): string {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem('businessId') || ''
}

/**
 * Set the business ID in localStorage
 */
export function setBusinessId(businessId: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('businessId', businessId)
}

/**
 * Get the access token from localStorage
 */
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('accessToken')
}

/**
 * Set the access token in localStorage
 */
export function setAccessToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('accessToken', token)
}

/**
 * Get current user info from localStorage
 */
export function getCurrentUser(): AuthUser | null {
  if (typeof window === 'undefined') return null
  
  const userStr = localStorage.getItem('currentUser')
  if (!userStr) return null
  
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

/**
 * Set current user info in localStorage
 */
export function setCurrentUser(user: AuthUser): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('currentUser', JSON.stringify(user))
  // Also set businessId separately for easy access
  if (user.businessId) {
    setBusinessId(user.businessId)
  }
}

/**
 * Clear all auth data from localStorage
 */
export function clearAuthData(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('accessToken')
  localStorage.removeItem('businessId')
  localStorage.removeItem('currentUser')
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getAccessToken()
}