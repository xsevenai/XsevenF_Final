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

// QR Code related interfaces - matching backend API
export interface QRCode {
  id: string
  type: "TABLE" | "MENU" | "CUSTOM"
  data: string
  image_base64: string
  size: number
  color: string
  background_color: string
  logo_url?: string
  created_at: string
  business_id: string
  table_id?: number
  scan_count?: number
  last_scanned_at?: string
}

export interface GenerateQRRequest {
  type: "TABLE" | "MENU" | "CUSTOM"
  table_id?: number
  size?: number
  color?: string
  background_color?: string
  logo_url?: string
  custom_data?: string
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

// Updated to include food-qr
// In your types.ts file, update SectionType to include:
export type SectionType = 
  | "dashboard"
  | "analytics" 
  | "ai-chat"
  | "catalog"
  | "menu-management"
  | "categories"
  | "listings"
  | "services"
  | "modifiers"
  | "discounts"
  | "attributes"
  | "orders"
  | "inventory"
  | "food-qr"
  | "tables"
  | "working-hours"
  | "floorplans"
  | "kitchen"
  | "customers"
  | "directory"
  | "feedback"
  | "payments"
  | "profile"
  | "menu-upload-qr"
  | "category-upload-qr"
  | "inventory-upload-qr"
  | "notifications"
  | "bill-printing"
  | "pos"

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
  | "add-inventory-item"
  | "view-qr-code"
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

// Inventory related interfaces
export interface InventoryItem {
  id: string
  business_id: string
  name: string
  description?: string
  category: string
  unit: string
  current_stock: number
  min_stock_threshold: number
  max_stock_threshold?: number
  unit_cost: number
  supplier?: string
  last_restocked?: string
  created_at?: string
  updated_at?: string
}

export interface InventoryCategory {
  id: string
  name: string
  description?: string
}

// Order related interfaces
export interface Order {
  id: string
  business_id: string
  customer_name?: string
  customer_phone?: string
  table_number?: number
  order_type: "dine-in" | "takeaway" | "delivery"
  status: "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled"
  items: OrderItem[]
  subtotal: number
  tax: number
  total: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  menu_item_id: string
  name: string
  price: number
  quantity: number
  special_instructions?: string
}

export interface OrderAnalytics {
  id: string
  orderId: string
  customerId?: string
  totalAmount: number
  status: "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled"
  items: OrderItem[]
  createdAt: string
  updatedAt: string
}

export interface MessageAnalytics {
  id: string
  sessionId: string
  content: string
  sender: "customer" | "ai" | "staff"
  timestamp: string
  metadata?: Record<string, any>
}

export interface AnalyticsSummary {
  totalOrders: number
  totalRevenue: number
  totalMessages: number
  totalSessions: number
  averageOrderValue: number
  averageMessagesPerSession: number
}

export interface AnalyticsData {
  summary: AnalyticsSummary
  orders: OrderAnalytics[]
  messages: MessageAnalytics[]
  timeRange: string
  generatedAt: string
}