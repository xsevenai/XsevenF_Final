// app/dashboard/components/types/index.ts

// Menu related interfaces - synchronized with API
export interface MenuItem {
  id: string
  business_id: string
  name: string
  description?: string
  price: number
  category_id: string
  image_url?: string
  is_available: boolean
  preparation_time?: number
  sort_order: number
  created_at?: string
  updated_at?: string
}

export interface MenuCategory {
  id: string
  business_id: string
  name: string
  description?: string
  sort_order: number
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface Table {
  id: string
  number: number
  seats: number
  status: "available" | "occupied" | "cleaning" | "reserved"
  location: string
}

export interface ChatMessage {
  id: string
  type: "user" | "ai"
  message: string
  timestamp: Date
}

export interface WorkingHours {
  day: string
  isOpen: boolean
  openTime: string
  closeTime: string
}

export interface ActivityItem {
  id: number
  type: string
  message: string
  subtext?: string
  time: string
  icon: any
  color: string
}

export interface LiveChat {
  id: string
  customer: string
  lastMessage: string
  time: string
  status: "online" | "offline"
}

// Updated to include profile
export type SectionType = "dashboard" | "ai-chat" | "menu" | "orders" | "tables" | "working-hours" | "profile"

export type ExpandedViewType = 
  | "add-menu-item" 
  | "add-category" 
  | "edit-menu-item" 
  | "edit-category"
  | "create-order"     
  | "view-order"      
  | "generate-qr" 
  | "import-data" 
  | "staff-schedule" 
  | "live-feed" 
  | "live-orders" 
  | "live-reservations" 
  | string 
  | null

// Profile related interfaces
export interface ProfileData {
  personal: {
    firstName: string
    lastName: string
    email: string
    phone: string
    profilePhoto: string
    emergencyContact: string
    emergencyPhone: string
  }
  restaurant: {
    name: string
    description: string
    address: string
    city: string
    state: string
    zipCode: string
    phone: string
    email: string
    logo: string
    website: string
    licenseNumber: string
  }
  settings: {
    emailNotifications: boolean
    smsNotifications: boolean
    orderAlerts: boolean
    reviewAlerts: boolean
    twoFactorEnabled: boolean
    theme: string
  }
}