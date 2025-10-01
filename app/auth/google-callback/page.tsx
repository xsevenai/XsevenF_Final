"use client"

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function GoogleCallbackPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [processing, setProcessing] = useState(true)
  const [message, setMessage] = useState('Processing Google Sign-in...')

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated') {
      router.push('/auth?error=authentication_failed')
      return
    }

    if (session?.user) {
      handleGoogleSigninComplete()
    }
  }, [session, status])

  const handleGoogleSigninComplete = async () => {
    try {
      setMessage('Checking your account...')

      // Check if user exists and get their data
      const response = await fetch('/api/auth/google-signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: session?.user?.email,
          name: session?.user?.name,
          googleId: session?.user?.googleId || session?.user?.id,
          image: session?.user?.image
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to process sign-in')
      }

      if (result.exists) {
        // Existing user - redirect to dashboard
        setMessage('Welcome back! Redirecting to dashboard...')
        
        // Store user session data
        if (typeof window !== 'undefined') {
          localStorage.setItem('user_email', result.user.email || '')
          localStorage.setItem('user_id', result.userId || '')
          localStorage.setItem('business_id', result.businessId || '')
          localStorage.setItem('user_role', result.role || 'owner')
          localStorage.setItem('accessToken', 'google_oauth_token') // You might want to store actual token
        }
        
        setTimeout(() => {
          router.push('/dashboard')
        }, 1500)
        
      } else {
        // New user - redirect to complete signup
        setMessage('Setting up your account...')
        
        // Store Google user data for signup flow
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('googleUserData', JSON.stringify({
            email: session?.user?.email,
            name: session?.user?.name,
            image: session?.user?.image,
            googleId: result.googleId,
            fromGoogle: true
          }))
        }
        
        setTimeout(() => {
          router.push('/auth?step=2&google=true')
        }, 1500)
      }

    } catch (error) {
      console.error('Error processing Google sign-in:', error)
      setMessage('Something went wrong. Redirecting...')
      
      setTimeout(() => {
        router.push('/auth?error=google_signin_failed')
      }, 2000)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4">
            <svg width="64" height="64" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <mask id="mask0" style={{maskType:"alpha"}} maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
                <rect width="100" height="100" fill="#D9D9D9"/>
              </mask>
              <g mask="url(#mask0)">
                <path d="M199.939 7.77539C199.979 8.80162 200 9.83244 200 10.8672C200 60.0925 155.228 99.998 99.9998 99.998C76.1256 99.998 54.2058 92.54 37.0116 80.0967L56.3123 65.6543C68.6382 73.4766 83.7162 78.0771 99.9998 78.0771C141.645 78.0771 175.406 47.9874 175.407 10.8691H199.939V7.77539ZM24.6014 11.8418C24.7614 21.8758 27.389 31.3777 31.9666 39.8877L12.6707 54.3232C4.60097 41.4676 0.000196561 26.6472 -0.000152588 10.8691V0H24.5936V10.8691L24.6014 11.8418Z" fill="#E3D7D7"/>
                <path d="M99.9998 0.00012207V25.1818L-0.000183105 100L-15.6848 83.3468L66.6639 21.7394H-0.000183105V21.7384H32.1727C31.4657 18.2104 31.0975 14.5775 31.0975 10.8683V0.00012207H99.9998Z" fill="#C1FD3A"/>
              </g>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">XSevenAI</h1>
        </div>
        
        <Loader2 className="h-8 w-8 animate-spin text-yellow-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {processing ? 'Processing...' : 'Almost done!'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {message}
        </p>
      </div>
    </div>
  )
}