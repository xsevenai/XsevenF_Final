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

export interface SignupData {
  businessName: string
  businessDescription: string
  websiteUrl: string
  ownerName: string
  email: string
  phone: string
  password: string
  category: string
  planId: string
}