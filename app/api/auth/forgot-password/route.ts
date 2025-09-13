// app/api/auth/forgot-password/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl!, supabaseAnonKey!)

export async function POST(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ 
        error: 'Supabase is not properly configured. Please check your environment variables.' 
      }, { status: 500 })
    }

    const { email } = await request.json()
    console.log('Received password reset request for:', email)

    // Validate email
    if (!email) {
      return NextResponse.json({ 
        error: 'Email is required' 
      }, { status: 400 })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ 
        error: 'Please enter a valid email address' 
      }, { status: 400 })
    }

    // Check if user exists in businesses table
    const { data: businessData, error: businessError } = await supabase
      .from('businesses')
      .select('email, name, is_active')
      .eq('email', email)
      .single()

    if (businessError) {
      if (businessError.code === 'PGRST116') { // No rows returned
        // For security, we'll return success even if email doesn't exist
        return NextResponse.json({ 
          success: true,
          message: 'If an account with this email exists, we\'ve sent a password reset link to ' + email
        }, { status: 200 })
      }
      
      console.error('Business lookup error:', businessError)
      return NextResponse.json({ 
        error: 'Failed to process request' 
      }, { status: 500 })
    }

    if (!businessData.is_active) {
      return NextResponse.json({ 
        error: 'Account is deactivated. Please contact support.' 
      }, { status: 403 })
    }

    // Send password reset email using Supabase Auth
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`
    })

    if (resetError) {
      console.error('Password reset error:', resetError)
      
      // Handle specific errors
      if (resetError.message.includes('rate limit')) {
        return NextResponse.json({ 
          error: 'Too many reset attempts. Please try again later.' 
        }, { status: 429 })
      }
      
      return NextResponse.json({ 
        error: 'Failed to send password reset email' 
      }, { status: 500 })
    }

    console.log('Password reset email sent successfully to:', email)

    return NextResponse.json({ 
      success: true,
      message: `Password reset link has been sent to ${email}`
    }, { status: 200 })

  } catch (error) {
    console.error('Forgot password API error:', error)
    
    let errorMessage = 'Internal server error'
    
    if (error instanceof Error) {
      if (error.message.includes('fetch failed') || error.message.includes('ENOTFOUND')) {
        errorMessage = 'Unable to connect to email service. Please try again later.'
      } else {
        errorMessage = error.message
      }
    }
    
    return NextResponse.json({ 
      error: errorMessage 
    }, { status: 500 })
  }
}