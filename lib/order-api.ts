// lib/order-api.ts

import { 
  Order, 
  CreateOrderData, 
  UpdateOrderData, 
  OrderStats, 
  OrderFilters,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  PaymentData
} from './types/order'

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken')
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }
}

// Helper function to handle API errors
const handleApiError = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
  }
  return response
}

export const orderAPI = {
  // Create a new order
  createOrder: async (data: CreateOrderData): Promise<Order> => {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    })
    
    await handleApiError(response)
    return response.json()
  },

  // Get all orders with optional filters
  getOrders: async (filters?: OrderFilters): Promise<Order[]> => {
    const params = new URLSearchParams()
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString())
        }
      })
    }
    
    const url = `/api/orders${params.toString() ? `?${params.toString()}` : ''}`
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders()
    })
    
    await handleApiError(response)
    return response.json()
  },

  // Get active orders only
  getActiveOrders: async (): Promise<Order[]> => {
    const response = await fetch('/api/orders/active', {
      method: 'GET',
      headers: getAuthHeaders()
    })
    
    await handleApiError(response)
    return response.json()
  },

  // Get a specific order by ID
  getOrder: async (orderId: string): Promise<Order> => {
    const response = await fetch(`/api/orders/${orderId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    })
    
    await handleApiError(response)
    return response.json()
  },

  // Update an existing order
  updateOrder: async (orderId: string, data: UpdateOrderData): Promise<Order> => {
    const response = await fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    })
    
    await handleApiError(response)
    return response.json()
  },

  // Cancel an order
cancelOrder: async (orderId: string, reason?: string): Promise<{ message: string; order_id: number }> => {
  console.log('cancelOrder called with:', { orderId, reason })
  
  try {
    const params = new URLSearchParams()
    if (reason) {
      params.append('reason', reason)
    }
    
    const url = `/api/orders/${orderId}${params.toString() ? `?${params.toString()}` : ''}`
    console.log('Frontend API URL:', url)
    
    const headers = getAuthHeaders()
    console.log('Request headers:', headers)
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers
    })
    
    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))
    
    if (!response.ok) {
      const errorText = await response.text()
      console.log('Error response text:', errorText)
      
      let errorData = {}
      try {
        errorData = JSON.parse(errorText)
        console.log('Parsed error data:', errorData)
      } catch (parseError) {
        console.log('Failed to parse error response as JSON:', parseError)
        errorData = { error: errorText || 'Unknown error' }
      }
      
      const errorMessage = errorData.error || errorData.detail || errorData.message || `HTTP error! status: ${response.status}`
      console.log('Final error message:', errorMessage)
      throw new Error(errorMessage)
    }
    
    const result = await response.json()
    console.log('Success response:', result)
    return result
  } catch (error) {
    console.log('Exception in cancelOrder:', error)
    throw error
  }
},
  // Process payment for an order
  processPayment: async (orderId: string, paymentData: PaymentData): Promise<Order> => {
    const params = new URLSearchParams()
    params.append('payment_amount', paymentData.payment_amount.toString())
    params.append('payment_method', paymentData.payment_method)
    
    const response = await fetch(`/api/orders/${orderId}/payment?${params.toString()}`, {
      method: 'PUT',
      headers: getAuthHeaders()
    })
    
    await handleApiError(response)
    return response.json()
  },

  // Get order statistics
  getOrderStats: async (days: number = 30): Promise<OrderStats> => {
    const params = new URLSearchParams()
    params.append('days', days.toString())
    
    const url = `/api/orders/stats/summary?${params.toString()}`
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders()
    })
    
    await handleApiError(response)
    return response.json()
  },

  // Update order status (convenience method)
  updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<Order> => {
    return orderAPI.updateOrder(orderId, { status })
  },

  // Update payment status (convenience method)
  updatePaymentStatus: async (orderId: string, payment_status: PaymentStatus): Promise<Order> => {
    return orderAPI.updateOrder(orderId, { payment_status })
  }
}

// Export types
export {
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  type Order,
  type CreateOrderData,
  type UpdateOrderData,
  type OrderStats,
  type OrderFilters,
  type PaymentData
}