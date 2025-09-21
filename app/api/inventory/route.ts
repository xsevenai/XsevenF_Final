// app/api/inventory.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken')
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

// Helper function for API calls
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API call failed: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

// Backend API Types (matching Python models)
export interface InventoryItem {
  id: number
  name: string
  current_stock: number
  min_threshold: number
  is_low_stock: boolean
  is_out_of_stock: boolean
  last_updated: string | null
}

export interface InventoryUpdate {
  stock_quantity: number
  min_stock_threshold?: number
}

export interface LowStockItem {
  item_id: number
  item_name: string
  current_stock: number
  threshold: number
  days_since_last_order: number | null
}

export interface ReorderRequest {
  item_id: number
  quantity: number
  supplier?: string
  notes?: string
}

export interface ReorderResponse {
  message: string
  item_id: number
  item_name: string
  requested_quantity: number
}

export interface UsageTracking {
  item_id: number
  item_name: string
  total_sold: number
  total_revenue: number
  period: string
}

// API Functions
export const inventoryApi = {
  // Get all inventory items
  getItems: async (params?: {
    low_stock_only?: boolean
    category_id?: number
  }): Promise<InventoryItem[]> => {
    const searchParams = new URLSearchParams()
    if (params?.low_stock_only) searchParams.append('low_stock_only', 'true')
    if (params?.category_id) searchParams.append('category_id', params.category_id.toString())
    
    const queryString = searchParams.toString()
    const endpoint = `/api/v1/food/inventory/items${queryString ? `?${queryString}` : ''}`
    
    return apiCall(endpoint)
  },

  // Update inventory item stock
  updateItem: async (itemId: number, data: InventoryUpdate): Promise<InventoryItem> => {
    return apiCall(`/api/v1/food/inventory/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  // Get low stock items
  getLowStockItems: async (): Promise<LowStockItem[]> => {
    return apiCall('/api/v1/food/inventory/low-stock')
  },

  // Create reorder request
  createReorder: async (data: ReorderRequest): Promise<ReorderResponse> => {
    return apiCall('/api/v1/food/inventory/reorder', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Get usage tracking
  getUsageTracking: async (period: '7d' | '30d' | '90d' = '7d'): Promise<UsageTracking[]> => {
    return apiCall(`/api/v1/food/inventory/usage?period=${period}`)
  },
}

// Extended types for frontend UI (combining backend data with UI state)
export interface ExtendedInventoryItem extends InventoryItem {
  category?: string
  unit?: string
  cost_per_unit?: number
  total_value?: number
  supplier?: string
  location?: string
  expiry_date?: string | null
  status: 'in-stock' | 'low-stock' | 'out-of-stock'
}

export interface ExtendedLowStockItem extends LowStockItem {
  category?: string
  unit?: string
  supplier?: string
  urgency: 'low' | 'medium' | 'high'
  status: 'low-stock' | 'out-of-stock'
}

// Helper functions to transform backend data for frontend
export const transformInventoryItem = (item: InventoryItem): ExtendedInventoryItem => {
  let status: 'in-stock' | 'low-stock' | 'out-of-stock' = 'in-stock'
  
  if (item.is_out_of_stock) {
    status = 'out-of-stock'
  } else if (item.is_low_stock) {
    status = 'low-stock'
  }

  return {
    ...item,
    status,
    // These would need to come from menu_items table or be calculated
    category: 'Unknown',
    unit: 'units',
    cost_per_unit: 0,
    total_value: 0,
    supplier: 'Unknown',
    location: 'Unknown',
    expiry_date: null
  }
}

export const transformLowStockItem = (item: LowStockItem): ExtendedLowStockItem => {
  // Determine urgency based on stock level
  const stockRatio = item.current_stock / item.threshold
  let urgency: 'low' | 'medium' | 'high' = 'low'
  
  if (item.current_stock === 0) {
    urgency = 'high'
  } else if (stockRatio <= 0.5) {
    urgency = 'high'
  } else if (stockRatio <= 0.8) {
    urgency = 'medium'
  }

  const status = item.current_stock === 0 ? 'out-of-stock' : 'low-stock'

  return {
    ...item,
    urgency,
    status,
    category: 'Unknown',
    unit: 'units',
    supplier: 'Unknown'
  }
}

// Frontend API service with transformations
export const frontendInventoryApi = {
  // Get transformed inventory items
  getItems: async (params?: {
    low_stock_only?: boolean
    category_id?: number
  }): Promise<ExtendedInventoryItem[]> => {
    const items = await inventoryApi.getItems(params)
    return items.map(transformInventoryItem)
  },

  // Update item with proper error handling
  updateItem: async (itemId: number, data: InventoryUpdate): Promise<ExtendedInventoryItem> => {
    const item = await inventoryApi.updateItem(itemId, data)
    return transformInventoryItem(item)
  },

  // Get transformed low stock items
  getLowStockItems: async (): Promise<ExtendedLowStockItem[]> => {
    const items = await inventoryApi.getLowStockItems()
    return items.map(transformLowStockItem)
  },

  // Create reorder with validation
  createReorder: async (data: ReorderRequest): Promise<ReorderResponse> => {
    // Validate quantity
    if (data.quantity <= 0 || data.quantity > 10000) {
      throw new Error('Quantity must be between 1 and 10,000')
    }
    
    return inventoryApi.createReorder(data)
  },

  // Get usage tracking with period validation
  getUsageTracking: async (period: '7d' | '30d' | '90d' = '7d'): Promise<UsageTracking[]> => {
    if (!['7d', '30d', '90d'].includes(period)) {
      throw new Error('Invalid period. Must be 7d, 30d, or 90d')
    }
    
    return inventoryApi.getUsageTracking(period)
  },
}

// WebSocket event types for real-time updates
export interface InventoryWebSocketMessage {
  type: 'low_stock_alert' | 'reorder_request'
  item_id: number
  item_name: string
  current_stock?: number
  threshold?: number
  quantity?: number
  requested_by?: string
  supplier?: string
  notes?: string
}

// WebSocket handler for inventory updates
export const handleInventoryWebSocketMessage = (
  message: InventoryWebSocketMessage,
  onLowStockAlert?: (alert: LowStockItem) => void,
  onReorderRequest?: (request: any) => void
) => {
  switch (message.type) {
    case 'low_stock_alert':
      if (onLowStockAlert && message.current_stock !== undefined && message.threshold !== undefined) {
        onLowStockAlert({
          item_id: message.item_id,
          item_name: message.item_name,
          current_stock: message.current_stock,
          threshold: message.threshold,
          days_since_last_order: null
        })
      }
      break
    
    case 'reorder_request':
      if (onReorderRequest) {
        onReorderRequest({
          item_id: message.item_id,
          item_name: message.item_name,
          quantity: message.quantity,
          requested_by: message.requested_by,
          supplier: message.supplier,
          notes: message.notes
        })
      }
      break
  }
}