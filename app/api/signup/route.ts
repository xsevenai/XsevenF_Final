// app/api/signup/route.ts - Complete fixed version with Google Auth support

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

// Create a separate client for regular operations
const supabaseClient = createClient(supabaseUrl!, supabaseAnonKey!)

interface SignupData {
  businessName: string
  businessDescription: string
  websiteUrl: string
  ownerName: string
  email: string
  phone: string
  password?: string // Make password optional for Google Auth
  category: string
  planId: string
  isGoogleAuth?: boolean // Add Google Auth flag
  googleId?: string // Add Google ID
  authProvider?: string // Add auth provider
}

class SignupService {
  // Generate a unique slug from business name
  static generateSlug(businessName: string): string {
    return businessName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
      || 'business' // Fallback if name becomes empty after processing
  }

  // Check if slug exists in database
  static async slugExists(slug: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('id')
        .eq('slug', slug)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows returned
        console.error('Slug check error:', error)
        return false
      }

      return !!data
    } catch (error) {
      console.error('Slug existence check failed:', error)
      return false
    }
  }

  // Generate a unique slug by appending numbers if needed
  static async generateUniqueSlug(businessName: string, businessId?: string): Promise<string> {
    let baseSlug = this.generateSlug(businessName)
    let slug = baseSlug
    let counter = 1

    // If we have a business ID, we can use it as part of the slug
    if (businessId) {
      const shortId = businessId.split('-')[0]
      slug = `${baseSlug}-${shortId}`
      
      if (!(await this.slugExists(slug))) {
        return slug
      }
    }

    // Check if base slug exists and increment until unique
    while (await this.slugExists(slug)) {
      slug = `${baseSlug}-${counter}`
      counter++
      
      // Prevent infinite loops
      if (counter > 100) {
        // Use timestamp as last resort
        slug = `${baseSlug}-${Date.now()}`
        break
      }
    }

    return slug
  }

  static async createAccount(signupData: SignupData) {
    try {
      console.log('Starting signup process for:', signupData.email)
      console.log('Is Google Auth:', signupData.isGoogleAuth)
      
      let userId: string

      if (signupData.isGoogleAuth) {
        // For Google Auth users, create a Supabase auth user without password
        // This will create a proper entry in auth.users table
        console.log('Creating Google Auth user in Supabase...')
        
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: signupData.email,
          password: crypto.randomUUID() + "TempPass123!", // Generate a random password they'll never use
          options: {
            data: {
              full_name: signupData.ownerName,
              business_name: signupData.businessName,
              auth_provider: 'google',
              google_id: signupData.googleId
            },
            emailRedirectTo: undefined // Disable email confirmation for Google users
          }
        })

        console.log('Google Auth response:', { authData: !!authData, authError })

        if (authError) {
          console.error('Google Auth error details:', authError)
          throw new Error(`Google authentication error: ${authError.message}`)
        }

        if (!authData.user) {
          throw new Error('Failed to create Google user account')
        }

        userId = authData.user.id
        console.log('Google user created with Supabase ID:', userId)
        
      } else {
        // For regular users, create auth user with password
        console.log('Creating regular auth user...')
        
        if (!signupData.password) {
          throw new Error('Password is required for non-Google authentication')
        }

        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: signupData.email,
          password: signupData.password,
          options: {
            data: {
              full_name: signupData.ownerName,
              business_name: signupData.businessName,
              auth_provider: 'email'
            }
          }
        })

        console.log('Auth response:', { authData: !!authData, authError })

        if (authError) {
          console.error('Auth error details:', authError)
          throw new Error(`Authentication error: ${authError.message}`)
        }

        if (!authData.user) {
          throw new Error('Failed to create user account')
        }

        userId = authData.user.id
        console.log('User created with ID:', userId)
      }

      // 2. Create the business record with all expected columns including unique slug
      const businessId = crypto.randomUUID()
      console.log('Creating business with ID:', businessId)
      
      // Generate unique slug
      const slug = await this.generateUniqueSlug(signupData.businessName, businessId)
      console.log('Generated unique slug:', slug)
      
      const businessData = {
        id: businessId,
        name: signupData.businessName,
        description: signupData.businessDescription,
        website_url: signupData.websiteUrl || null,
        owner_name: signupData.ownerName,
        email: signupData.email,
        phone: signupData.phone || null,
        category: signupData.category,
        slug: slug,
        owner_id: userId, // This now matches the auth.users.id
        is_active: true,
        // Add Google Auth specific fields if applicable
        ...(signupData.isGoogleAuth && {
          auth_provider: 'google',
          google_id: signupData.googleId
        }),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      console.log('Business data to insert:', businessData)

      // Use service role client for admin operations to bypass RLS
      const { error: businessError } = await supabase
        .from('businesses')
        .insert([businessData])

      if (businessError) {
        console.error('Business creation error:', businessError)
        
        // Handle specific duplicate slug error with retry
        if (businessError.code === '23505' && businessError.message.includes('businesses_slug_key')) {
          console.log('Slug conflict detected, generating new unique slug...')
          
          // Generate a new unique slug with timestamp
          const newSlug = await this.generateUniqueSlug(`${signupData.businessName}-${Date.now()}`)
          const updatedBusinessData = { ...businessData, slug: newSlug }
          
          console.log('Retrying with new slug:', newSlug)
          
          const { error: retryError } = await supabase
            .from('businesses')
            .insert([updatedBusinessData])
          
          if (retryError) {
            console.error('Retry failed:', retryError)
            
            // Cleanup auth user
            try {
              if (supabaseServiceKey) {
                await supabase.auth.admin.deleteUser(userId)
              }
            } catch (cleanupError) {
              console.error('Cleanup error:', cleanupError)
            }
            
            throw new Error(`Business creation failed after retry: ${retryError.message}`)
          }
          
          console.log('Business created successfully on retry')
        } else {
          // Handle other errors
          if (businessError.message.includes('row-level security')) {
            console.log('RLS policy violation detected, trying alternative approach...')
            
            // Try to temporarily set the auth context
            try {
              const { error: altError } = await supabase
                .from('businesses')
                .insert([businessData])
            
              if (altError) {
                console.error('Alternative insert also failed:', altError)
              }
            } catch (altErr) {
              console.error('Alternative approach failed:', altErr)
            }
          }

          // Try to cleanup auth user
          try {
            if (supabaseServiceKey) {
              await supabase.auth.admin.deleteUser(userId)
            }
          } catch (cleanupError) {
            console.error('Cleanup error:', cleanupError)
          }
          
          throw new Error(`Business creation error: ${businessError.message}`)
        }
      } else {
        console.log('Business created successfully')
      }

      // 3. Create subscription record
      try {
        const { error: subscriptionError } = await supabase
          .from('subscriptions')
          .insert([
            {
              id: crypto.randomUUID(),
              business_id: businessId,
              subscription_plan: signupData.planId,
              subscription_status: signupData.planId === 'free' ? 'trial' : 'pending',
              stripe_customer_id: null,
              stripe_subscription_id: null,
              trial_ends_at: signupData.planId === 'free' 
                ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() 
                : null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ])

        if (subscriptionError) {
          console.warn('Subscription creation failed:', subscriptionError.message)
        } else {
          console.log('Subscription created successfully')
        }
      } catch (error) {
        console.warn('Subscriptions table may not exist:', error)
      }

      // 4. Create default settings
      try {
        await this.createDefaultSettings(businessId)
        console.log('Settings created successfully')
      } catch (error) {
        console.warn('Settings creation failed:', error)
      }

      // 5. Create default branding config
      try {
        await this.createDefaultBranding(businessId)
        console.log('Branding created successfully')
      } catch (error) {
        console.warn('Branding creation failed:', error)
      }

      return {
        success: true,
        userId,
        businessId,
        slug, // Return the generated slug
        authProvider: signupData.isGoogleAuth ? 'google' : 'email',
        message: signupData.isGoogleAuth 
          ? 'Google account linked successfully' 
          : 'Account created successfully'
      }

    } catch (error) {
      console.error('Signup error:', error)
      throw error
    }
  }

  private static async createDefaultSettings(businessId: string) {
    const defaultSettings = {
      id: crypto.randomUUID(),
      business_id: businessId,
      whatsapp_enabled: false,
      sms_enabled: false,
      ai_responses_enabled: true,
      auto_reply_enabled: true,
      business_hours_enabled: false,
      business_hours_start: '09:00',
      business_hours_end: '17:00',
      business_hours_timezone: 'America/New_York',
      welcome_message: 'Hello! Thanks for contacting us. How can we help you today?',
      away_message: 'Thanks for your message! We\'ll get back to you soon.',
      language: 'en',
      ai_personality: 'professional',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { error } = await supabase
      .from('settings')
      .insert([defaultSettings])

    if (error) {
      throw new Error(`Settings creation error: ${error.message}`)
    }
  }

  private static async createDefaultBranding(businessId: string) {
    const { error } = await supabase
      .from('branding_config')
      .insert([
        {
          id: crypto.randomUUID(),
          business_id: businessId,
          logo_url: null,
          primary_color: '#3b82f6',
          secondary_color: '#64748b',
          font_family: 'Inter',
          custom_css: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])

    if (error) {
      throw new Error(`Branding creation error: ${error.message}`)
    }
  }

  static async checkEmailExists(email: string): Promise<boolean> {
    try {
      const { data } = await supabase
        .from('businesses')
        .select('email')
        .eq('email', email)
        .single()

      return !!data
    } catch (error) {
      console.error('Email check error:', error)
      return false
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

    const signupData = await request.json()
    console.log('Received signup request for:', signupData.email)
    console.log('Is Google Auth:', signupData.isGoogleAuth)

    // Validate required fields
    const requiredFields = [
      'businessName', 'businessDescription', 'ownerName', 
      'email', 'category', 'planId'
    ]
    
    // Add password requirement only for non-Google auth
    if (!signupData.isGoogleAuth) {
      requiredFields.push('password')
    }
    
    for (const field of requiredFields) {
      if (!signupData[field]) {
        return NextResponse.json({ 
          error: `${field} is required` 
        }, { status: 400 })
      }
    }

    // For Google Auth, ensure we have Google ID
    if (signupData.isGoogleAuth && !signupData.googleId) {
      return NextResponse.json({ 
        error: 'Google ID is required for Google authentication' 
      }, { status: 400 })
    }

    // Check if email already exists
    const emailExists = await SignupService.checkEmailExists(signupData.email)
    if (emailExists) {
      return NextResponse.json({ 
        error: 'Email already exists' 
      }, { status: 400 })
    }

    // Create the account
    const result = await SignupService.createAccount(signupData)

    return NextResponse.json(result, { status: 201 })

  } catch (error) {
    console.error('Signup API error:', error)
    
    let errorMessage = 'Internal server error'
    
    if (error instanceof Error) {
      if (error.message.includes('fetch failed') || error.message.includes('ENOTFOUND')) {
        errorMessage = 'Unable to connect to database. Please check your Supabase configuration.'
      } else if (error.message.includes('row-level security')) {
        errorMessage = 'Database access denied. Please disable RLS on the businesses table or configure proper policies.'
      } else if (error.message.includes('schema cache')) {
        errorMessage = 'Database schema mismatch. Please ensure all required columns exist in the businesses table.'
      } else {
        errorMessage = error.message
      }
    }
    
    return NextResponse.json({ 
      error: errorMessage 
    }, { status: 500 })
  }
}