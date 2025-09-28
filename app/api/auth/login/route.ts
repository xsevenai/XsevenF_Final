// app/api/auth/login/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl!, supabaseAnonKey!)

interface LoginData {
  email: string
  password: string
}

class AuthService {
  static async signIn(loginData: LoginData) {
    try {
      console.log('Starting login process for:', loginData.email)
      
      // 1. Authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      })

      console.log('Auth response:', { authData: !!authData, authError })

      if (authError) {
        console.error('Auth error details:', authError)
        
        // Handle specific authentication errors
        if (authError.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password')
        } else if (authError.message.includes('Email not confirmed')) {
          throw new Error('Please verify your email address before signing in')
        } else if (authError.message.includes('Too many requests')) {
          throw new Error('Too many login attempts. Please try again later')
        } else {
          throw new Error(`Authentication error: ${authError.message}`)
        }
      }

      if (!authData.user) {
        throw new Error('Failed to authenticate user')
      }

      const userId = authData.user.id
      console.log('User authenticated with ID:', userId)

      // 2. Get user's business information - Try multiple query approaches
      // First attempt: direct query with both email and owner_id
      const { data: businessResults, error: businessError } = await supabase
        .from('businesses')
        .select('*')
        .or(`email.ilike.${loginData.email},owner_id.eq.${userId}`)
      
      console.log('Business query results:', { 
        found: businessResults?.length || 0
      })

      // If the first query fails, try querying separately
      if (!businessResults || businessResults.length === 0) {
        // Try by email (case insensitive)
        const { data: emailResults } = await supabase
          .from('businesses')
          .select('*')
          .ilike('email', loginData.email)
        
        console.log('Email query results:', { 
          found: emailResults?.length || 0 
        })
        
        // Try by owner_id
        const { data: ownerResults } = await supabase
          .from('businesses')
          .select('*')
          .eq('owner_id', userId)
        
        console.log('Owner ID query results:', { 
          found: ownerResults?.length || 0 
        })
        
        // Use results from either query
        if (emailResults && emailResults.length > 0) {
          var businessData = emailResults[0]
        } else if (ownerResults && ownerResults.length > 0) {
          var businessData = ownerResults[0]
        } else {
          // Last resort: fetch all businesses and manually filter
          const { data: allBusinesses } = await supabase
            .from('businesses')
            .select('*')
          
          console.log('All businesses count:', allBusinesses?.length || 0)
          
          if (allBusinesses && allBusinesses.length > 0) {
            // Print first few businesses for debugging
            console.log('Sample businesses:', allBusinesses.slice(0, 2))
            
            // Check for exact matches
            const businessMatch = allBusinesses.find(b => 
              (b.email && b.email.toLowerCase() === loginData.email.toLowerCase()) ||
              (b.owner_id && b.owner_id === userId)
            )
            
            if (businessMatch) {
              var businessData = businessMatch
            } else {
              throw new Error('Business profile not found. Please complete your registration')
            }
          } else {
            throw new Error('Business profile not found. Please complete your registration')
          }
        }
      } else {
        var businessData = businessResults[0]
      }
      
      console.log('Business found:', {
        id: businessData.id,
        name: businessData.name,
        email: businessData.email
      })

      if (!businessData.is_active) {
        throw new Error('Your account has been deactivated. Please contact support')
      }

      // 3. Get subscription information (optional - may not exist for all users)
      let subscriptionData = null
      try {
        const { data: subData, error: subError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('business_id', businessData.id)
          .maybeSingle()
        
        if (!subError && subData) {
          subscriptionData = subData
        }
      } catch (error) {
        console.warn('Subscription lookup failed (may not exist):', error)
      }

      // 4. Update last login timestamp
      try {
        await supabase
          .from('businesses')
          .update({ 
            updated_at: new Date().toISOString(),
          })
          .eq('id', businessData.id)
      } catch (error) {
        console.warn('Failed to update last login:', error)
      }

      return {
        success: true,
        user: {
          id: userId,
          email: authData.user.email,
          emailVerified: authData.user.email_confirmed_at !== null
        },
        business: businessData,
        subscription: subscriptionData,
        session: {
          access_token: authData.session?.access_token,
          refresh_token: authData.session?.refresh_token,
          expires_at: authData.session?.expires_at
        },
        message: 'Login successful'
      }

    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  static async refreshSession(refreshToken: string) {
    try {
      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: refreshToken
      })

      if (error) {
        throw new Error('Session refresh failed')
      }

      return {
        success: true,
        session: data.session
      }
    } catch (error) {
      console.error('Session refresh error:', error)
      throw error
    }
  }

  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        throw new Error('Sign out failed')
      }

      return {
        success: true,
        message: 'Signed out successfully'
      }
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ 
        error: 'Supabase is not properly configured. Please check your environment variables.' 
      }, { status: 500 })
    }

    const loginData = await request.json()
    console.log('Received login request for:', loginData.email)

    // Validate required fields
    if (!loginData.email || !loginData.password) {
      return NextResponse.json({ 
        error: 'Email and password are required' 
      }, { status: 400 })
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
      return NextResponse.json({ 
        error: 'Please enter a valid email address' 
      }, { status: 400 })
    }

    // Normalize email - trim spaces and convert to lowercase
    loginData.email = loginData.email.trim().toLowerCase()
    console.log('Normalized login email:', loginData.email)

    // Perform login
    const result = await AuthService.signIn(loginData)

    // Return the auth data in the response body for client-side storage
    return NextResponse.json({
      success: true,
      user: result.user,
      business: result.business,
      subscription: result.subscription,
      auth: {
        access_token: result.session.access_token,
        refresh_token: result.session.refresh_token,
        expires_at: result.session.expires_at
      },
      user_info: {
        id: result.user.id,
        email: result.user.email,
        business_id: result.business.id,
        business_name: result.business.name
      }
    }, { status: 200 })

  } catch (error) {
    console.error('Login API error:', error)
    
    let errorMessage = 'Internal server error'
    let statusCode = 500
    
    if (error instanceof Error) {
      if (error.message.includes('Invalid email or password')) {
        errorMessage = 'Invalid email or password'
        statusCode = 401
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Please verify your email address before signing in'
        statusCode = 401
      } else if (error.message.includes('Too many requests')) {
        errorMessage = 'Too many login attempts. Please try again later'
        statusCode = 429
      } else if (error.message.includes('Business profile not found')) {
        errorMessage = 'Business profile not found. Please complete your registration'
        statusCode = 404
      } else if (error.message.includes('account has been deactivated')) {
        errorMessage = 'Your account has been deactivated. Please contact support'
        statusCode = 403
      } else if (error.message.includes('fetch failed') || error.message.includes('ENOTFOUND')) {
        errorMessage = 'Unable to connect to database. Please try again later'
        statusCode = 503
      } else {
        errorMessage = error.message
        statusCode = 400
      }
    }
    
    return NextResponse.json({ 
      error: errorMessage 
    }, { status: statusCode })
  }
}

// Handle logout
export async function DELETE(request: NextRequest) {
  try {
    const result = await AuthService.signOut()
    
    // Just return success - client will clear localStorage
    return NextResponse.json({
      success: true,
      message: 'Signed out successfully'
    }, { status: 200 })
  } catch (error) {
    console.error('Logout API error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Logout failed' 
    }, { status: 500 })
  }
}