// lib/config.ts
export const config = {
  api: {
    // Backend API URL - fallback to localhost if env var not set
    backendUrl: process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://127.0.0.1:8000/api/v1',
  },
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
} as const

// Validate required environment variables
export const validateEnvVars = () => {
  const required = {
    BACKEND_API_URL: config.api.backendUrl,
    NEXT_PUBLIC_SUPABASE_URL: config.supabase.url,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: config.supabase.anonKey,
  }

  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key]) => key)

  if (missing.length > 0) {
    console.warn('Missing environment variables:', missing.join(', '))
  }

  return missing.length === 0
}