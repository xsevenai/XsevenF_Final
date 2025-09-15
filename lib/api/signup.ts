import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export class SignupService {
  static async createAccount(signupData: SignupData) {
    try {
      // Start a transaction-like process
      
      // 1. Create the user in auth.users
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          data: {
            full_name: signupData.ownerName,
            business_name: signupData.businessName
          }
        }
      })

      if (authError) {
        throw new Error(`Authentication error: ${authError.message}`)
      }

      if (!authData.user) {
        throw new Error('Failed to create user account')
      }

      const userId = authData.user.id

      // 2. Create the business record
      const { data: businessData, error: businessError } = await supabase
        .from('businesses')
        .insert([
          {
            id: crypto.randomUUID(),
            name: signupData.businessName,
            description: signupData.businessDescription,
            website_url: signupData.websiteUrl || null,
            owner_name: signupData.ownerName,
            email: signupData.email,
            phone: signupData.phone || null,
            category: signupData.category,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select('id')
        .single()

      if (businessError) {
        // Cleanup: delete the auth user if business creation fails
        await supabase.auth.admin.deleteUser(userId)
        throw new Error(`Business creation error: ${businessError.message}`)
      }

      const businessId = businessData.id

      // 3. Create subscription record
      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .insert([
          {
            id: crypto.randomUUID(),
            business_id: businessId,
            subscription_plan: signupData.planId,
            subscription_status: signupData.planId === 'free' ? 'trial' : 'pending',
            stripe_customer_id: null, // Will be set when payment is processed
            stripe_subscription_id: null,
            trial_ends_at: signupData.planId === 'free' 
              ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() 
              : null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])

      if (subscriptionError) {
        // Cleanup
        await supabase.from('businesses').delete().eq('id', businessId)
        await supabase.auth.admin.deleteUser(userId)
        throw new Error(`Subscription creation error: ${subscriptionError.message}`)
      }

      // 4. Create default settings
      await this.createDefaultSettings(businessId)

      // 5. Create default branding config
      await this.createDefaultBranding(businessId)

      return {
        success: true,
        userId,
        businessId,
        message: 'Account created successfully'
      }

    } catch (error) {
      console.error('Signup error:', error)
      throw error
    }
  }

  private static async createDefaultSettings(businessId: string) {
    const defaultSettings = {
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
      ai_personality: 'professional'
    }

    const { error } = await supabase
      .from('settings')
      .insert([
        {
          id: crypto.randomUUID(),
          business_id: businessId,
          ...defaultSettings,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])

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
    const { data } = await supabase
      .from('businesses')
      .select('email')
      .eq('email', email)
      .single()

    return !!data
  }
}
