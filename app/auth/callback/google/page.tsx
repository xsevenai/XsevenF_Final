"use client"

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function GoogleCallbackPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    const handleGoogleCallback = async () => {
      if (status === 'loading') return

      if (status === 'authenticated' && session?.user) {
        // Console log Google user data
        console.log('Google User Email:', session.user.email)
        console.log('Google User Name:', session.user.name)
        console.log('Google User Image:', session.user.image)
        console.log('Google User ID:', session.user.googleId)
        console.log('Full session object:', session)
        
        // Get the Google ID - try multiple sources
        const googleId = session.user.googleId || session.user.id || 'google_user_' + Date.now()
        
        // Store Google auth data and proceed directly to signup flow
        sessionStorage.setItem('googleAuthData', JSON.stringify({
          email: session.user.email,
          name: session.user.name,
          googleId: googleId,
          image: session.user.image
        }))
        
        // Restore theme if it was stored
        const pendingTheme = sessionStorage.getItem('pendingTheme')
        if (pendingTheme) {
          localStorage.setItem('themePreference', pendingTheme)
          sessionStorage.removeItem('pendingTheme')
        }
        
        // Directly redirect to auth page at step 2 (category selection)
        router.push('/auth?google=true&step=2')
        
      } else if (status === 'unauthenticated') {
        // Auth failed, redirect to auth page
        router.push('/auth?error=auth_failed')
      }
    }

    handleGoogleCallback()
  }, [session, status, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Processing your Google sign-in...
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Please wait while we set up your account.
        </p>
      </div>
    </div>
  )
}