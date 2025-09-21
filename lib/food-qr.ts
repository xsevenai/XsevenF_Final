// lib/food-qr.ts

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

export interface QRCodeAnalytics {
  total_scans: number
  unique_scanners: number
  scans_by_type: Record<string, number>
  scans_by_table: Array<{
    table_id: number
    table_number: string
    scans: number
  }>
  conversion_rate: number
  average_session_duration: number
  time_period: {
    start: string
    end: string
  }
  scans_by_food_item?: Record<string, number>
  average_order_value?: number
  peak_scanning_hours?: number[]
}

class FoodQRService {
  private baseURL = '/api/food/qr-codes'

  private getAuthHeaders() {
    const token = localStorage.getItem('accessToken')
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || errorData.detail || errorData.message || `HTTP ${response.status}: ${response.statusText}`)
    }
    return response.json()
  }

  // Get all QR codes with optional filters
  async getAllQRCodes(type?: string, table_id?: number): Promise<QRCode[]> {
    const params = new URLSearchParams()
    if (type) params.append('type', type)
    if (table_id) params.append('table_id', table_id.toString())
    
    const url = params.toString() ? `${this.baseURL}?${params.toString()}` : this.baseURL
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders()
    })
    return this.handleResponse<QRCode[]>(response)
  }

  // Generate new QR code
  async generateQRCode(request: GenerateQRRequest): Promise<QRCode> {
    const response = await fetch(`${this.baseURL}/generate`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(request)
    })
    return this.handleResponse<QRCode>(response)
  }

  // Get QR code analytics
  async getQRAnalytics(qrId: string, timeRange: '7d' | '30d' | '90d' | '1y' = '30d'): Promise<QRCodeAnalytics> {
    const response = await fetch(`${this.baseURL}/${qrId}/analytics?time_range=${timeRange}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    })
    return this.handleResponse<QRCodeAnalytics>(response)
  }

  // Update QR code
  async updateQRCode(qrId: string, updates: {
    size?: number
    color?: string
    background_color?: string
    logo_url?: string
    template_id?: string
  }): Promise<QRCode> {
    const response = await fetch(`${this.baseURL}/${qrId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updates)
    })
    return this.handleResponse<QRCode>(response)
  }

  // Bulk generate QR codes
  async bulkGenerateQRCodes(
    type: 'TABLE' | 'MENU' | 'CUSTOM',
    count: number = 10,
    templateId: string = 'food_standard'
  ): Promise<{
    total_requested: number
    qr_codes_generated: number
    errors: string[]
    qr_codes: Array<{
      table_id?: number
      table_number?: string
      type?: string
      qr_code: QRCode
    }>
  }> {
    const response = await fetch(`${this.baseURL}/batch?type=${type}&count=${count}&template_id=${templateId}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    })
    return this.handleResponse(response)
  }

  // Download QR code image (convert base64 to blob)
  async downloadQRCode(qrCode: QRCode, filename?: string): Promise<void> {
    try {
      // Convert base64 to blob
      const byteCharacters = atob(qrCode.image_base64)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: 'image/png' })
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename || `qr-code-${qrCode.id}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      throw new Error(`Failed to download QR code: ${error}`)
    }
  }
}

export const foodQRService = new FoodQRService()