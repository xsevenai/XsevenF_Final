"use client"

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function ProcessGoogleLoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    const processGoogleLogin = async () => {
      if (status === 'loading') return

      if (status === 'authenticated' && session?.user) {
        console.log('Processing Google login for:', session.user.email)
        
        try {
          // Call your auth endpoint to check if user exists
          const response = await fetch('/api/auth/google', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: session.user.email,
              name: session.user.name,
              googleId: (session.user as any).googleId || session.user.id,
              image: session.user.image
            })
          })

          const result = await response.json()

          if (result.exists) {
            console.log('Existing user found, logging in...')
            
            // Store auth data in localStorage including access token
            const authData = {
              user_email: session.user.email || '',
              user_name: session.user.name || '',
              auth_provider: 'google',
              google_id: result.user?.google_id || result.user?.googleId || '',
              business_id: result.businessId || result.user?.business_id || '',
              user_id: result.userId || result.user?.user_id || '',
              user_role: result.role || result.user?.role || 'owner',
              accessToken: (session.user as any).accessToken || '', // Add access token
            }

            Object.entries(authData).forEach(([key, value]) => {
              localStorage.setItem(key, value as string)
            })

            // Clear NextAuth session since we're managing our own auth
            const { signOut } = await import('next-auth/react')
            await signOut({ redirect: false })

            // Redirect to dashboard
            window.location.href = '/dashboard'
          } else {
            console.log('New user, redirecting to signup...')
            
            // Clear NextAuth session
            const { signOut } = await import('next-auth/react')
            await signOut({ redirect: false })
            
            // Store user data for signup
            sessionStorage.setItem('googleAuthData', JSON.stringify({
              email: session.user.email,
              name: session.user.name,
              googleId: (session.user as any).googleId || session.user.id,
              image: session.user.image
            }))
            
            window.location.href = '/auth?google=true&step=2'
          }
        } catch (error) {
          console.error('Google login processing error:', error)
          router.push('/auth/login?error=google_auth_failed')
        }
      } else if (status === 'unauthenticated') {
        console.log('No session found, redirecting to login')
        router.push('/auth/login?error=no_session')
      }
    }

    processGoogleLogin()
  }, [session, status, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Processing your Google sign-in...
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Please wait while we complete your authentication.
        </p>
      </div>
    </div>
  )
}