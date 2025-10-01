import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
}

const supabase = createClient(
  supabaseUrl!,
  supabaseServiceKey || supabaseAnonKey!
)

export async function POST(request: NextRequest) {
  try {
    const { email, name, googleId, image } = await request.json()

    // Console log the received Google user data
    console.log('Received Google User Data:')
    console.log('Email:', email)
    console.log('Name:', name)
    console.log('Google ID:', googleId)
    console.log('Image:', image)

    // Check if user exists in your businesses table by email
    try {
      const { data: existingBusiness, error: checkError } = await supabase
        .from('businesses')
        .select('*')
        .eq('email', email)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        // Error other than "no rows returned"
        console.error('Database check error:', checkError)
        throw checkError
      }

      if (existingBusiness) {
        // User exists
        console.log('Existing user found:', existingBusiness.id)
        
        return NextResponse.json({
          exists: true,
          user: {
            id: existingBusiness.owner_id,
            email: existingBusiness.email,
            name: existingBusiness.owner_name,
            google_id: existingBusiness.google_id,
            business_id: existingBusiness.id
          },
          businessId: existingBusiness.id,
          userId: existingBusiness.owner_id,
          role: 'owner'
        })
      } else {
        // User doesn't exist
        console.log('New user needs onboarding')
        
        return NextResponse.json({
          exists: false,
          needsOnboarding: true,
          email,
          name,
          googleId,
          image,
          redirectTo: '/auth?step=2&google=true'
        })
      }

    } catch (dbError) {
      console.error('Database error:', dbError)
      
      // If there's a database error, default to signup flow
      return NextResponse.json({
        exists: false,
        needsOnboarding: true,
        email,
        name,
        googleId,
        image,
        redirectTo: '/auth?step=2&google=true'
      })
    }

  } catch (error) {
    console.error('Google sign-in error:', error)
    return NextResponse.json(
      { error: 'Failed to process Google sign-in' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Google sign-in endpoint' })
}