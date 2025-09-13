// app/api/auth/reset-password/route.ts

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

    const { password, accessToken, refreshToken } = await request.json()
    console.log('Received password reset request')

    // Validate required fields
    if (!password) {
      return NextResponse.json({ 
        error: 'Password is required' 
      }, { status: 400 })
    }

    if (!accessToken) {
      return NextResponse.json({ 
        error: 'Invalid reset session. Please request a new reset link.' 
      }, { status: 400 })
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json({ 
        error: 'Password must be at least 8 characters long' 
      }, { status: 400 })
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return NextResponse.json({ 
        error: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' 
      }, { status: 400 })
    }

    // Set the session using the tokens from the reset link
    const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken || ''
    })

    if (sessionError) {
      console.error('Session error:', sessionError)
      return NextResponse.json({ 
        error: 'Invalid or expired reset link. Please request a new one.' 
      }, { status: 401 })
    }

    if (!sessionData.user) {
      return NextResponse.json({ 
        error: 'Invalid reset session' 
      }, { status: 401 })
    }

    console.log('Session established for user:', sessionData.user.id)

    // Update the user's password
    const { data: updateData, error: updateError } = await supabase.auth.updateUser({
      password: password
    })

    if (updateError) {
      console.error('Password update error:', updateError)
      
      if (updateError.message.includes('same as the old password')) {
        return NextResponse.json({ 
          error: 'New password must be different from your current password' 
        }, { status: 400 })
      }
      
      return NextResponse.json({ 
        error: 'Failed to update password. Please try again.' 
      }, { status: 500 })
    }

    if (!updateData.user) {
      return NextResponse.json({ 
        error: 'Failed to update password' 
      }, { status: 500 })
    }

    console.log('Password updated successfully for user:', updateData.user.id)

    // Update the last_updated timestamp in businesses table (optional)
    try {
      await supabase
        .from('businesses')
        .update({ 
          updated_at: new Date().toISOString()
        })
        .eq('email', updateData.user.email)
    } catch (error) {
      console.warn('Failed to update business timestamp:', error)
    }

    // Sign out the user to force them to login with the new password
    await supabase.auth.signOut()

    return NextResponse.json({ 
      success: true,
      message: 'Password updated successfully. Please sign in with your new password.'
    }, { status: 200 })

  } catch (error) {
    console.error('Reset password API error:', error)
    
    let errorMessage = 'Internal server error'
    
    if (error instanceof Error) {
      if (error.message.includes('fetch failed') || error.message.includes('ENOTFOUND')) {
        errorMessage = 'Unable to connect to authentication service. Please try again later.'
      } else if (error.message.includes('JWT expired')) {
        errorMessage = 'Reset link has expired. Please request a new one.'
      } else {
        errorMessage = error.message
      }
    }
    
    return NextResponse.json({ 
      error: errorMessage 
    }, { status: 500 })
  }
}