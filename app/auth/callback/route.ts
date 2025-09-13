import { createServerClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createServerClient()
    
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Auth callback error:', error)
        return NextResponse.redirect(`${requestUrl.origin}/auth?error=auth_error`)
      }

      if (data.user) {
        // Check if profile exists, if not create it
        const { data: existingProfile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', data.user.id)
          .single()

        if (profileError && profileError.code === 'PGRST116') {
          // Profile doesn't exist, create it
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([
              {
                id: data.user.id,
                user_id: data.user.id,
                email: data.user.email,
                full_name: data.user.user_metadata?.full_name || null,
                role: 'user',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }
            ])

          if (insertError) {
            console.error('Profile creation error:', insertError)
          }
        }

        // Redirect to dashboard on successful auth
        return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
      }
    } catch (error) {
      console.error('Unexpected auth callback error:', error)
      return NextResponse.redirect(`${requestUrl.origin}/auth?error=unexpected_error`)
    }
  }

  // If no code or auth failed, redirect to auth page
  return NextResponse.redirect(`${requestUrl.origin}/auth`)
}