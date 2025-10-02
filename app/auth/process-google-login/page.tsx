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
          // Prepare Google user data
          const googleUserData = {
            email: session.user.email,
            name: session.user.name || 'Google User',
            google_id: (session.user as any).googleId || (session.user as any).id || session.user.email,
            image: session.user.image
          }

          console.log('Sending Google user data to FastAPI backend:', googleUserData)

          // CRITICAL: Call your FastAPI backend to get the proper session token
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/google/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(googleUserData)
          })

          console.log('FastAPI response status:', response.status)
          const result = await response.json()
          console.log('FastAPI response data:', result)

          if (!response.ok) {
            throw new Error(result.detail || 'Google login failed')
          }

          // Store auth data from FastAPI response (including the google_session_ token)
          localStorage.setItem('accessToken', result.access_token) // This will be google_session_xxxxx
          localStorage.setItem('user_id', result.user_id)
          localStorage.setItem('user_email', result.email)
          localStorage.setItem('business_id', result.business_id)
          localStorage.setItem('user_role', result.role || 'owner')
          
          // Calculate and store token expiry
          const expiresAt = new Date().getTime() + (result.expires_in * 1000)
          localStorage.setItem('token_expires_at', expiresAt.toString())

          console.log('FastAPI token stored:', result.access_token)

          // Clear NextAuth session since we're managing our own auth
          const { signOut } = await import('next-auth/react')
          await signOut({ redirect: false })
          
          console.log('Google login successful, redirecting to dashboard')

          // Redirect to dashboard
          window.location.href = '/dashboard'

        } catch (error) {
          console.error('Google login processing error:', error)
          
          // Clear NextAuth session
          try {
            const { signOut } = await import('next-auth/react')
            await signOut({ redirect: false })
          } catch (signOutError) {
            console.log('No session to clear')
          }
          
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