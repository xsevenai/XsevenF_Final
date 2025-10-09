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
  
  console.log('🔧 API Configured - Backend URL:', OpenAPI.BASE)
  
  // ✅ COMPLETE PATH INTERCEPTION
  const originalRequest = (OpenAPI as any).request
  if (originalRequest && typeof originalRequest === 'function') {
    (OpenAPI as any).request = async (options: any) => {
      if (options.url && typeof options.url === 'string') {
        const originalUrl = options.url
        console.log('🔗 Original API URL:', originalUrl)
        
        // Fix ALL incorrect prefixes
        if (options.url.includes('/food/')) {
          options.url = options.url.replace('/food/', '/')
          console.log('🔄 Fixed /food/ prefix:', originalUrl, '→', options.url)
        }
        
        // Fix double api/v1 issue (if any remain)
        if (options.url.includes('/api/v1/api/v1/')) {
          options.url = options.url.replace('/api/v1/api/v1/', '/api/v1/')
          console.log('🔄 Fixed double api/v1:', originalUrl, '→', options.url)
        }
        
        if (originalUrl !== options.url) {
          console.log('✅ Final URL:', options.url)
        }
      }
      return originalRequest(options)
    }
  }
}