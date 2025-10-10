// lib/tables-api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1/food'

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

export interface UpdateTableData {
  table_number?: string
  capacity?: number
  section?: string
  location_notes?: string
  status?: "available" | "occupied" | "reserved" | "maintenance"
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

export interface AssignTableData {
  customer_name?: string
  customer_phone?: string
  customer_email?: string
  party_size: number
  special_requests?: string
}

export interface AssignTableResponse {
  message: string
  table: Table
  order_id: string
}

export const tablesApi = {
  // POST /api/v1/food/tables - Create Table
  async createTable(tableData: CreateTableData): Promise<Table> {
    const response = await fetch(`${API_BASE_URL}/tables`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(tableData),
    })
    
    return handleResponse<Table>(response)
  },

  // GET /api/v1/food/tables - List Tables
  async getTables(): Promise<Table[]> {
    const response = await fetch(`${API_BASE_URL}/tables`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    
    return handleResponse<Table[]>(response)
  },

  // GET /api/v1/food/tables/{table_id} - Get Table
  async getTable(id: string): Promise<Table> {
    const response = await fetch(`${API_BASE_URL}/tables/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    
    return handleResponse<Table>(response)
  },

  // PUT /api/v1/food/tables/{table_id} - Update Table
  async updateTable(id: string, tableData: UpdateTableData): Promise<Table> {
    const response = await fetch(`${API_BASE_URL}/tables/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(tableData),
    })
    
    return handleResponse<Table>(response)
  },

  // POST /api/v1/food/tables/assign - Assign Table
  async assignTable(assignData: AssignTableData): Promise<AssignTableResponse> {
    const response = await fetch(`${API_BASE_URL}/tables/assign`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(assignData),
    })
    
    return handleResponse<AssignTableResponse>(response)
  },

  // POST /api/v1/food/tables/{table_id}/release - Release Table
  async releaseTable(id: string): Promise<Table> {
    const response = await fetch(`${API_BASE_URL}/tables/${id}/release`, {
      method: 'POST',
      headers: getAuthHeaders(),
    })
    
    return handleResponse<Table>(response)
  },

  // GET /api/v1/food/tables/availability - Check Table Availability
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
  }
}