// lib/tables-api.ts

import type { Table, CreateTableData } from '@/hooks/use-tables'

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://127.0.0.1:8000/api/v1"

// Helper function to get access token
function getAccessToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken')
  }
  return null
}

// Helper function to create headers
function createHeaders(): HeadersInit {
  const token = getAccessToken()
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  
  return headers
}

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or invalid
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken')
        window.location.href = '/login'
      }
      throw new Error('Session expired. Please login again.')
    }
    
    let errorMessage = `HTTP error! status: ${response.status}`
    try {
      const errorData = await response.json()
      console.error('Backend error details:', JSON.stringify(errorData, null, 2)) // Better debug log
      
      // Handle FastAPI validation errors
      if (errorData.detail && Array.isArray(errorData.detail)) {
        const validationErrors = errorData.detail.map((err: any) => 
          `${err.loc?.join('.') || 'field'}: ${err.msg}`
        ).join(', ')
        errorMessage = `Validation error: ${validationErrors}`
      } else {
        errorMessage = errorData.detail || errorData.message || JSON.stringify(errorData)
      }
    } catch {
      // If can't parse error response, use status text
      errorMessage = response.statusText || errorMessage
    }
    
    throw new Error(errorMessage)
  }
  
  // Handle empty responses (like DELETE)
  const contentType = response.headers.get('content-type')
  if (!contentType || !contentType.includes('application/json')) {
    return {} as T
  }
  
  return response.json()
}

export const tablesApi = {
  // Get all tables
  async getTables(): Promise<Table[]> {
    const response = await fetch(`${API_BASE_URL}/food/tables/`, {
      method: 'GET',
      headers: createHeaders(),
    })
    
    return handleResponse<Table[]>(response)
  },

  // Get single table by ID
  async getTable(id: string): Promise<Table> {
    const response = await fetch(`${API_BASE_URL}/food/tables/${id}/`, {
      method: 'GET',
      headers: createHeaders(),
    })
    
    return handleResponse<Table>(response)
  },

  // Create new table
  async createTable(tableData: CreateTableData): Promise<Table> {
    const response = await fetch(`${API_BASE_URL}/food/tables/`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(tableData),
    })
    
    return handleResponse<Table>(response)
  },

  // Update table status  
  async updateTableStatus(id: string, status: string): Promise<Table> {
    // FastAPI expects the status as a query parameter for enums
    const response = await fetch(`${API_BASE_URL}/food/tables/${id}/status`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify(status) // Send status as JSON-encoded string
    })
    
    return handleResponse<Table>(response)
  },

  // Delete table
  async deleteTable(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/food/tables/${id}/`, {
      method: 'DELETE',
      headers: createHeaders(),
    })
    
    return handleResponse<void>(response)
  },

  // Get table availability
  async getTableAvailability(section?: string, capacity?: number): Promise<{
    total_tables: number
    available_count: number
    occupied_count: number
    reserved_count: number
    maintenance_count: number
    available_tables: Array<{
      id: string
      table_number: number
      capacity: number
      section: string
    }>
  }> {
    const params = new URLSearchParams()
    if (section) params.append('section', section)
    if (capacity) params.append('capacity', capacity.toString())
    
    const url = `${API_BASE_URL}/food/tables/availability${params.toString() ? '?' + params.toString() : ''}`
    const response = await fetch(url, {
      method: 'GET',
      headers: createHeaders(),
    })
    
    return handleResponse(response)
  },

  // Get QR code for table
  async getTableQRCode(
    tableId: string, 
    options?: {
      size?: number
      color?: string
      background_color?: string
    }
  ): Promise<{
    table_id: string
    table_number: number
    qr_code: {
      id: string
      image_base64: string
      data: string
      size: number
      color: string
      background_color: string
      url: string
    }
  }> {
    const params = new URLSearchParams()
    if (options?.size) params.append('size', options.size.toString())
    if (options?.color) params.append('color', options.color)
    if (options?.background_color) params.append('background_color', options.background_color)
    
    const url = `${API_BASE_URL}/food/tables/${tableId}/qr${params.toString() ? '?' + params.toString() : ''}`
    const response = await fetch(url, {
      method: 'GET',
      headers: createHeaders(),
    })
    
    return handleResponse(response)
  },

  // Assign customer to table
  async assignCustomerToTable(
    tableId: string, 
    assignment: {
      customer_name?: string
      customer_phone?: string
      customer_email?: string
      party_size: number
      special_requests?: string
    }
  ): Promise<{
    message: string
    table: Table
    order_id: string
  }> {
    const response = await fetch(`${API_BASE_URL}/food/tables/${tableId}/assign`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(assignment),
    })
    
    return handleResponse(response)
  },

  // Update table layout
  async updateTableLayout(tables: Array<{ id: string; [key: string]: any }>): Promise<{
    message: string
    updated_tables: number
  }> {
    const response = await fetch(`${API_BASE_URL}/food/tables/layout`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify({ tables }),
    })
    
    return handleResponse(response)
  }
}

// Export individual functions for convenience
export const {
  getTables,
  getTable,
  createTable,
  updateTableStatus,
  deleteTable,
  getTableAvailability,
  getTableQRCode,
  assignCustomerToTable,
  updateTableLayout
} = tablesApi