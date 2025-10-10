// lib/api-config.ts - COMPLETE FIX
import { OpenAPI } from '@/src/api/generated/core/OpenAPI'

export function configureAPI() {
  // ✅ CORRECT: Base URL without /api/v1
  OpenAPI.BASE = 'http://127.0.0.1:8060'
  
  OpenAPI.TOKEN = async () => {
    const token = localStorage.getItem('accessToken')
    if (!token) throw new Error('No authentication token found')
    return token
  }
  
  OpenAPI.HEADERS = {
    'Content-Type': 'application/json',
  }
  
  OpenAPI.WITH_CREDENTIALS = false
  
  // ✅ COMPLETE PATH INTERCEPTION
  const originalRequest = (OpenAPI as any).request
  if (originalRequest && typeof originalRequest === 'function') {
    (OpenAPI as any).request = async (options: any) => {
      if (options.url && typeof options.url === 'string') {
        // Note: /food/ prefix is actually correct for food hospitality endpoints
        // Don't remove it - the server expects /api/v1/food/inventory/...
        
        // Fix double api/v1 issue (if any remain)
        if (options.url.includes('/api/v1/api/v1/')) {
          options.url = options.url.replace('/api/v1/api/v1/', '/api/v1/')
        }
      }
      return originalRequest(options)
    }
  }
}