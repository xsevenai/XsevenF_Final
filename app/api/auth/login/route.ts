import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
}

// Use service role key for admin operations if available
const supabase = createClient(
  supabaseUrl!,
  supabaseServiceKey || supabaseAnonKey!
)

interface LoginRequest {
  email: string
  password: string
}

export async function POST(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ 
        error: 'Server configuration error' 
      }, { status: 500 })
    }

    const { email, password }: LoginRequest = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ 
        error: 'Email and password are required' 
      }, { status: 400 })
    }

    console.log('Login attempt for:', email)

    // Authenticate with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (authError) {
      console.error('Authentication error:', authError.message)
      
      // Return user-friendly error messages
      if (authError.message.includes('Invalid login credentials')) {
        return NextResponse.json({ 
          error: 'Invalid email or password' 
        }, { status: 401 })
      } else if (authError.message.includes('Email not confirmed')) {
        return NextResponse.json({ 
          error: 'Please verify your email before signing in' 
        }, { status: 401 })
      } else {
        return NextResponse.json({ 
          error: 'Authentication failed' 
        }, { status: 401 })
      }
    }

    if (!authData.user) {
      return NextResponse.json({ 
        error: 'Authentication failed' 
      }, { status: 401 })
    }

    const userId = authData.user.id
    console.log('User authenticated:', userId)

    // Get business data for the user
    const { data: businessData, error: businessError } = await supabase
      .from('businesses')
      .select('*')
      .eq('owner_id', userId)
      .single()

    if (businessError) {
      console.error('Business lookup error:', businessError)
      
      if (businessError.code === 'PGRST116') {
        // No business found for this user
        return NextResponse.json({ 
          error: 'No business account found for this user' 
        }, { status: 404 })
      } else {
        return NextResponse.json({ 
          error: 'Failed to retrieve business data' 
        }, { status: 500 })
      }
    }

    console.log('Business found:', businessData.id)

    // Prepare response data
    const responseData = {
      success: true,
      message: 'Login successful',
      user: {
        id: userId,
        email: authData.user.email,
        name: authData.user.user_metadata?.full_name || businessData.owner_name,
        auth_provider: businessData.auth_provider || 'email'
      },
      business: {
        id: businessData.id,
        name: businessData.name,
        slug: businessData.slug,
        category: businessData.category,
        isActive: businessData.is_active
      },
      // Include access token for API calls
      accessToken: authData.session?.access_token,
      refreshToken: authData.session?.refresh_token,
      expiresAt: authData.session?.expires_at,
      expiresIn: authData.session?.expires_in,
      // Backwards compatibility fields
      userId: userId,
      businessId: businessData.id,
      email: authData.user.email,
      role: 'owner' // You might want to add a role field to your businesses table
    }

    return NextResponse.json(responseData, { status: 200 })

  } catch (error) {
    console.error('Login API error:', error)
    
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Login endpoint - POST only' 
  }, { status: 405 })
}