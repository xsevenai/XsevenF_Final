// middleware.ts (place in root of project)

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Protected routes that require authentication
const protectedRoutes = ['/dashboard']

// Auth routes that should redirect if user is already authenticated
const authRoutes = ['/auth/login', '/auth', '/auth/forgot-password']

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Check if the route needs authentication
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
  const isAuthRoute = authRoutes.some(route => path === route)
  
  // Skip middleware for API routes, static files, and other non-protected routes
  if (
    path.startsWith('/api') ||
    path.startsWith('/_next') ||
    path.startsWith('/static') ||
    path.includes('.') ||
    (!isProtectedRoute && !isAuthRoute)
  ) {
    return NextResponse.next()
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    // Get session token from cookie or Authorization header
    let accessToken = null
    
    // First try to get from cookie
    const sessionCookie = request.cookies.get('session')
    if (sessionCookie) {
      accessToken = sessionCookie.value
    }
    
    // Then try Authorization header
    if (!accessToken) {
      const authHeader = request.headers.get('authorization')
      if (authHeader && authHeader.startsWith('Bearer ')) {
        accessToken = authHeader.substring(7)
      }
    }

    if (accessToken) {
      // Verify the token with Supabase
      const { data: { user }, error } = await supabase.auth.getUser(accessToken)
      
      if (!error && user) {
        // User is authenticated
        if (isAuthRoute) {
          // Redirect authenticated users away from auth pages
          return NextResponse.redirect(new URL('/dashboard', request.url))
        }
        
        // Allow access to protected routes
        if (isProtectedRoute) {
          return NextResponse.next()
        }
      }
    }

    // User is not authenticated
    if (isProtectedRoute) {
      // Redirect to login for protected routes
      const loginUrl = new URL('/auth/login', request.url)
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirect', path)
      return NextResponse.redirect(loginUrl)
    }
    
    // Allow access to auth routes when not authenticated
    if (isAuthRoute) {
      return NextResponse.next()
    }
    
  } catch (error) {
    console.error('Middleware error:', error)
    
    // On error, redirect to login for protected routes
    if (isProtectedRoute) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirect', path)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}