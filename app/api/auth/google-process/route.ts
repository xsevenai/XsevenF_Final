import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { createClient } from '@supabase/supabase-js'

// Import authOptions - adjust path as needed
const authOptions = {
  // You'll need to copy your authOptions here or import them
  // For now, we'll work without getServerSession if import is problematic
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(
  supabaseUrl!,
  supabaseServiceKey || supabaseAnonKey!
)

export async function GET(request: NextRequest) {
  try {
    console.log('Processing Google authentication in single flow')
    
    const url = new URL(request.url)
    
    // Get NextAuth session from cookies instead of getServerSession to avoid import issues
    const cookies = request.headers.get('cookie') || ''
    
    // Extract session token from cookies (this is a simplified approach)
    const sessionMatch = cookies.match(/next-auth\.session-token=([^;]+)/)
    const secureSessionMatch = cookies.match(/__Secure-next-auth\.session-token=([^;]+)/)
    
    if (!sessionMatch && !secureSessionMatch) {
      console.log('No session found, redirecting to login with error')
      return NextResponse.redirect(new URL('/login?error=no_session', request.url))
    }

    // For now, we'll get session data from the frontend via query params
    // This is passed from the frontend after successful OAuth
    const email = url.searchParams.get('email')
    const name = url.searchParams.get('name')
    const googleId = url.searchParams.get('googleId')
    
    if (!email) {
      // Redirect back to login page which will handle the session processing
      return NextResponse.redirect(new URL('/login?process=true', request.url))
    }

    console.log('Processing Google user:', email)

    // Check if user exists in database
    const { data: existingBusiness, error: checkError } = await supabase
      .from('businesses')
      .select('*')
      .eq('email', email)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Database check error:', checkError)
      return NextResponse.redirect(new URL('/login?error=db_error', request.url))
    }

    if (existingBusiness) {
      // User exists - create dashboard URL with auth data
      console.log('Existing user found, redirecting to dashboard')
      
      const authData = {
        user_email: email,
        user_name: name || existingBusiness.owner_name,
        auth_provider: 'google',
        google_id: existingBusiness.google_id || googleId,
        business_id: existingBusiness.id,
        user_id: existingBusiness.owner_id,
        user_role: 'owner'
      }

      // Encode auth data in URL
      const dashboardUrl = new URL('/dashboard', request.url)
      dashboardUrl.searchParams.set('auth_data', btoa(JSON.stringify(authData)))
      
      return NextResponse.redirect(dashboardUrl)
      
    } else {
      // User doesn't exist - redirect to signup
      console.log('New user, redirecting to signup')
      
      const authUrl = new URL('/auth', request.url)
      authUrl.searchParams.set('google', 'true')
      authUrl.searchParams.set('step', '2')
      authUrl.searchParams.set('email', email)
      authUrl.searchParams.set('name', name || '')
      authUrl.searchParams.set('googleId', googleId || '')
      
      return NextResponse.redirect(authUrl)
    }

  } catch (error) {
    console.error('Google process error:', error)
    return NextResponse.redirect(new URL('/login?error=process_error', request.url))
  }
}