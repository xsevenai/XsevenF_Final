import { supabase } from './supabase'
import { SignUpData, AuthResponse, User, Business } from './types'

export const authService = {
  async signUp(data: SignUpData): Promise<AuthResponse> {
    try {
      // Step 1: Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.ownerName,
          }
        }
      })

      if (authError) throw authError

      if (!authData.user) {
        throw new Error('User creation failed')
      }

      // Step 2: Create business record
      const { data: business, error: businessError } = await supabase
        .from('businesses')
        .insert({
          name: data.businessData.businessName,
          description: data.businessData.businessDescription,
          category: data.selectedCategory.id,
          owner_name: data.ownerName,
          phone: data.businessData.phone || null,
          website_url: data.businessData.websiteUrl || null,
          subscription_plan: data.selectedPlan.id,
          subscription_status: data.selectedPlan.id === 'free' ? 'trial' : 'active',
          is_active: true,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (businessError) throw businessError

      // Step 3: Link user to business
      const { error: linkError } = await supabase
        .from('user_businesses')
        .insert({
          user_id: authData.user.id,
          business_id: business.id,
          role: 'owner'
        })

      if (linkError) throw linkError

      return {
        user: authData.user as User,
        business: business as Business,
        session: authData.session
      }

    } catch (error) {
      console.error('Signup error:', error)
      throw error
    }
  },

  async signIn({ email, password }: { email: string; password: string }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  },

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentUser(): Promise<User | null> {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user as User | null
  },

  async getUserBusiness(userId: string): Promise<Business | null> {
    const { data, error } = await supabase
      .from('user_businesses')
      .select(`
        *,
        businesses (*)
      `)
      .eq('user_id', userId)
      .eq('role', 'owner')
      .single()

    if (error) throw error
    return data?.businesses as Business || null
  }
}