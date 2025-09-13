'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation' // or 'next/router' for pages router
import { supabase } from '@/lib/supabase'

export default function AuthCallback(): JSX.Element {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async (): Promise<void> => {
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Auth callback error:', error)
        router.push('/signup?error=auth-failed')
      } else if (data.session) {
        router.push('/dashboard')
      } else {
        router.push('/signup')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p>Completing sign up...</p>
      </div>
    </div>
  )
}