// lib/analytics-api.ts - Updated to get business ID like tables

const API_BASE_URL =  '/api'

class AnalyticsAPI {
  // Get authorization header (same pattern as tables-api.ts)
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('accessToken') // Same token storage as tables
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  }

  // Get business ID from user context (similar to how tables API works)
  private getBusinessId(): string {
    // Try multiple possible storage locations (same pattern as tables)
    const businessId = localStorage.getItem('business_id') ||
                      localStorage.getItem('businessId') ||
                      localStorage.getItem('current_business_id') ||
                      sessionStorage.getItem('business_id')
    
    if (!businessId) {
      throw new Error('Business ID not found. Please log in again.')
    }
    
    return businessId
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    }

    const response = await fetch(url, config)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  }

  // Updated methods to automatically get business ID
  async getOrdersAnalytics(
    period: string = "7d", 
    statusFilter?: string,
    startDate?: string,
    endDate?: string
  ) {
    const businessId = this.getBusinessId() // Get business ID automatically
    const params = new URLSearchParams({
      period,
      ...(statusFilter && { status_filter: statusFilter }),
      ...(startDate && { start_date: startDate }),
      ...(endDate && { end_date: endDate }),
    })

    return this.request(`/analytics/orders/${businessId}?${params}`)
  }

  async createOrderRecord(orderData: any) {
    const businessId = this.getBusinessId()
    return this.request(`/analytics/orders/${businessId}`, {
      method: 'POST',
      body: JSON.stringify(orderData),
    })
  }

  async updateOrderStatus(orderId: string, statusData: any) {
    const businessId = this.getBusinessId()
    return this.request(`/analytics/orders/${businessId}/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    })
  }

  // Messages Analytics
  async getMessagesAnalytics(
    period: string = "7d", 
    sessionId?: string,
    startDate?: string,
    endDate?: string
  ) {
    const businessId = this.getBusinessId()
    const params = new URLSearchParams({
      period,
      ...(sessionId && { session_id: sessionId }),
      ...(startDate && { start_date: startDate }),
      ...(endDate && { end_date: endDate }),
    })

    return this.request(`/analytics/messages/${businessId}?${params}`)
  }

  async createMessageRecord(messageData: any) {
    const businessId = this.getBusinessId()
    return this.request(`/analytics/messages/${businessId}`, {
      method: 'POST',
      body: JSON.stringify(messageData),
    })
  }

  // Combined Analytics
  async getCombinedAnalytics(period: string = "7d") {
    const businessId = this.getBusinessId()
    const params = new URLSearchParams({ period })
    return this.request(`/analytics/combined/${businessId}?${params}`)
  }

  // Dashboard Summary
  async getDashboardSummary() {
    const businessId = this.getBusinessId()
    return this.request(`/analytics/dashboard/${businessId}/summary`)
  }

  // Export methods
  async exportOrdersData(period: string = "30d", format: string = "json") {
    const businessId = this.getBusinessId()
    const params = new URLSearchParams({ period, format })
    return this.request(`/analytics/orders/${businessId}/export?${params}`)
  }

  async exportMessagesData(period: string = "30d", format: string = "json") {
    const businessId = this.getBusinessId()
    const params = new URLSearchParams({ period, format })
    return this.request(`/analytics/messages/${businessId}/export?${params}`)
  }

  // Utility method to check if user has business ID
  hasBusinessId(): boolean {
    try {
      this.getBusinessId()
      return true
    } catch {
      return false
    }
  }
}

export const analyticsApi = new AnalyticsAPI()