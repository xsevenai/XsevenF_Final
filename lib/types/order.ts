// lib/types/order.ts

export interface OrderItem {
  menu_item_id: number
  name: string
  quantity: number
  price: number
  special_instructions?: string
}

export interface Order {
  id: number
  business_id: number
  table_id?: number
  customer_name?: string
  customer_phone?: string
  customer_email?: string
  order_type: 'dine-in' | 'takeout' | 'delivery'
  items: OrderItem[]
  subtotal: number
  tax_amount: number
  tip_amount: number
  total_amount: number
  status: OrderStatus
  payment_status: PaymentStatus
  payment_method: PaymentMethod
  special_instructions?: string
  created_at: string
  updated_at: string
  cancellation_reason?: string
  cancelled_by?: number
  cancelled_at?: string
  paid_amount?: number
  paid_at?: string
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY = 'ready',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  DIGITAL_WALLET = 'digital_wallet',
  BANK_TRANSFER = 'bank_transfer'
}

export interface CreateOrderData {
  table_id?: number
  customer_name?: string
  customer_phone?: string
  customer_email?: string
  order_type: 'dine-in' | 'takeout' | 'delivery'
  items: {
    menu_item_id: number
    name: string
    quantity: number
    price: number
    special_instructions?: string
  }[]
  special_instructions?: string
  payment_method?: PaymentMethod
}

export interface UpdateOrderData {
  status?: OrderStatus
  payment_status?: PaymentStatus
  special_instructions?: string
  items?: {
    menu_item_id: number
    name: string
    quantity: number
    price: number
    special_instructions?: string
  }[]
}

export interface OrderStats {
  period_days: number
  total_orders: number
  completed_orders: number
  completion_rate: number
  total_revenue: number
  average_order_value: number
  status_breakdown: Record<string, number>
  daily_order_counts: Record<string, number>
}

export interface OrderFilters {
  status?: OrderStatus
  order_type?: 'dine-in' | 'takeout' | 'delivery'
  table_id?: number
  limit?: number
}

export interface PaymentData {
  payment_amount: number
  payment_method: PaymentMethod
}