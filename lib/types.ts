export interface User {
  id: string
  email: string
  user_metadata: {
    name: string
  }
}

export interface Business {
  id: string
  name: string
  description: string
  category: string
  owner_name: string
  phone?: string
  website_url?: string
  subscription_plan: string
  subscription_status: string
  is_active: boolean
  created_at: string
}

export interface BusinessCategory {
  id: string
  name: string
  icon: any
  description: string
  color: string
  bgColor: string
  hoverColor: string
  gradient: string
}

export interface SubscriptionPlan {
  id: string
  name: string
  price: string
  period: string
  description: string
  features: string[]
  color: string
  bgColor: string
  borderColor: string
  hoverColor: string
  gradient: string
  popular: boolean
}

export interface SignUpData {
  email: string
  password: string
  ownerName: string
  businessData: {
    businessName: string
    businessDescription: string
    websiteUrl?: string
    phone?: string
  }
  selectedCategory: BusinessCategory
  selectedPlan: SubscriptionPlan
}

export interface AuthResponse {
  user: User
  business: Business
  session: any
}