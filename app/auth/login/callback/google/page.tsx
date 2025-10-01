import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../[...nextauth]/route'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(
  supabaseUrl!,
  supabaseServiceKey || supabaseAnonKey!
)

export async function GET(request: NextRequest) {
  try {
    console.log('Direct Google login callback triggered')
    
    // Get the session from NextAuth
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      console.log('No session found, redirecting to login')
      return NextResponse.redirect(new URL('/login?error=no_session', request.url))
    }

    console.log('Processing Google user:', session.user.email)

    // Get Google ID from session
    const googleId = (session.user as any).googleId || session.user.id

    // Check if user exists in database
    const { data: existingBusiness, error: checkError } = await supabase
      .from('businesses')
      .select('*')
      .eq('email', session.user.email)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Database check error:', checkError)
      return NextResponse.redirect(new URL('/login?error=db_error', request.url))
    }

    if (existingBusiness) {
      // User exists - prepare data for dashboard
      console.log('Existing user found, preparing dashboard redirect')
      
      const authData = {
        user_email: session.user.email || '',
        user_name: session.user.name || existingBusiness.owner_name,
        auth_provider: 'google',
        google_id: existingBusiness.google_id || googleId,
        business_id: existingBusiness.id,
        user_id: existingBusiness.owner_id,
        user_role: 'owner'
      }

      // Create a URL with the auth data as query parameters (temporarily)
      const dashboardUrl = new URL('/dashboard', request.url)
      dashboardUrl.searchParams.set('auth_data', btoa(JSON.stringify(authData)))
      
      return NextResponse.redirect(dashboardUrl)
      
    } else {
      // User doesn't exist - redirect to signup
      console.log('New user, redirecting to signup')
      
      const signupData = {
        email: session.user.email,
        name: session.user.name,
        googleId: googleId,
        image: session.user.image
      }
      
      const authUrl = new URL('/auth', request.url)
      authUrl.searchParams.set('google', 'true')
      authUrl.searchParams.set('step', '2')
      authUrl.searchParams.set('user_data', btoa(JSON.stringify(signupData)))
      
      return NextResponse.redirect(authUrl)
    }

  } catch (error) {
    console.error('Google login callback error:', error)
    return NextResponse.redirect(new URL('/login?error=callback_error', request.url))
  }
}