// lib/tables-api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

// API response handler
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text()
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`
    
    try {
      const errorData = JSON.parse(errorText)
      errorMessage = errorData.message || errorData.detail || errorMessage
    } catch {
      // If not JSON, use the raw text or default message
      errorMessage = errorText || errorMessage
    }
    
    throw new Error(errorMessage)
  }
  
  const contentType = response.headers.get('content-type')
  if (contentType?.includes('application/json')) {
    return response.json()
  }
  
  // For responses without content (like successful DELETE)
  return {} as T
}

// Get authorization header
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('accessToken')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }
}

export interface Table {
  id: string
  business_id: string
  table_number: number
  capacity: number
  section: string
  location_notes?: string
  status: "available" | "occupied" | "reserved" | "maintenance"
  qr_code_id?: string | null
  qr_code_url?: string | null
  created_at?: string
  updated_at?: string
}

export interface CreateTableData {
  table_number: string
  capacity: number
  section: string
  location_notes: string
}

export interface TableAvailabilityResponse {
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
}

export interface TableLayoutUpdateData {
  tables: Array<{
    id: string
    section?: string
    location_notes?: string
    capacity?: number
  }>
}

export interface TableLayoutUpdateResponse {
  message: string
  updated_tables: number
}

export const tablesApi = {
  // Get all tables
  async getTables(): Promise<Table[]> {
    const response = await fetch(`${API_BASE_URL}/tables`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    
    return handleResponse<Table[]>(response)
  },

  // Get single table
  async getTable(id: string): Promise<Table> {
    const response = await fetch(`${API_BASE_URL}/tables/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    
    return handleResponse<Table>(response)
  },

  // Create new table
  async createTable(tableData: CreateTableData): Promise<Table> {
    const response = await fetch(`${API_BASE_URL}/tables`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(tableData),
    })
    
    return handleResponse<Table>(response)
  },

  // Update table status (dedicated endpoint)
  async updateTableStatus(id: string, status: string): Promise<Table> {
    const response = await fetch(`${API_BASE_URL}/tables/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    })
    
    return handleResponse<Table>(response)
  },

  // Update entire table
  async updateTable(id: string, tableData: Partial<Table>): Promise<Table> {
    const response = await fetch(`${API_BASE_URL}/tables/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(tableData),
    })
    
    return handleResponse<Table>(response)
  },

  // Partially update table
  async patchTable(id: string, tableData: Partial<Table>): Promise<Table> {
    const response = await fetch(`${API_BASE_URL}/tables/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(tableData),
    })
    
    return handleResponse<Table>(response)
  },

  // Delete table
  async deleteTable(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/tables/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    
    return handleResponse<void>(response)
  },

  // Check table availability
  async checkTableAvailability(filters?: {
    section?: string
    capacity?: number
  }): Promise<TableAvailabilityResponse> {
    const params = new URLSearchParams()
    if (filters?.section) params.append('section', filters.section)
    if (filters?.capacity) params.append('capacity', filters.capacity.toString())
    
    const queryString = params.toString()
    const url = `${API_BASE_URL}/tables/availability${queryString ? `?${queryString}` : ''}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    
    return handleResponse<TableAvailabilityResponse>(response)
  },

  // Update table layout
  async updateTableLayout(layoutData: TableLayoutUpdateData): Promise<TableLayoutUpdateResponse> {
    const response = await fetch(`${API_BASE_URL}/tables/layout`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(layoutData),
    })
    
    return handleResponse<TableLayoutUpdateResponse>(response)
  },

  // Get table QR code
  async getTableQRCode(
    id: string, 
    options?: {
      size?: number
      color?: string
      background_color?: string
    }
  ): Promise<{
    table_id: string  // Changed from number to string for UUID
    table_number: string
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
    
    const queryString = params.toString()
    const url = `${API_BASE_URL}/tables/${id}/qr${queryString ? `?${queryString}` : ''}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    
    return handleResponse(response)
  },

  // Assign customer to table
  async assignCustomerToTable(
    id: string,
    customerData: {
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
    const response = await fetch(`${API_BASE_URL}/tables/${id}/assign`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(customerData),
    })
    
    return handleResponse(response)
  }
}