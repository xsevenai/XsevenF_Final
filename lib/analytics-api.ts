// lib/analytics-api.ts

const API_BASE_URL = '/api'

class AnalyticsAPI {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    // Add auth token if available
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      }
    }

    const response = await fetch(url, config)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  }

  // Orders Analytics
  async getOrdersAnalytics(
    businessId: string, 
    period: string = "7d", 
    statusFilter?: string,
    startDate?: string,
    endDate?: string
  ) {
    const params = new URLSearchParams({
      period,
      ...(statusFilter && { status_filter: statusFilter }),
      ...(startDate && { start_date: startDate }),
      ...(endDate && { end_date: endDate }),
    })

    return this.request(`/analytics/orders/${businessId}?${params}`)
  }

  async createOrderRecord(businessId: string, orderData: any) {
    return this.request(`/analytics/orders/${businessId}`, {
      method: 'POST',
      body: JSON.stringify(orderData),
    })
  }

  async updateOrderStatus(businessId: string, orderId: string, statusData: any) {
    return this.request(`/analytics/orders/${businessId}/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    })
  }

  async exportOrdersData(businessId: string, period: string = "30d", format: string = "json") {
    const params = new URLSearchParams({ period, format })
    return this.request(`/analytics/orders/${businessId}/export?${params}`)
  }

  // Messages Analytics
  async getMessagesAnalytics(
    businessId: string, 
    period: string = "7d", 
    sessionId?: string,
    startDate?: string,
    endDate?: string
  ) {
    const params = new URLSearchParams({
      period,
      ...(sessionId && { session_id: sessionId }),
      ...(startDate && { start_date: startDate }),
      ...(endDate && { end_date: endDate }),
    })

    return this.request(`/analytics/messages/${businessId}?${params}`)
  }

  async createMessageRecord(businessId: string, messageData: any) {
    return this.request(`/analytics/messages/${businessId}`, {
      method: 'POST',
      body: JSON.stringify(messageData),
    })
  }

  async exportMessagesData(businessId: string, period: string = "30d", format: string = "json") {
    const params = new URLSearchParams({ period, format })
    return this.request(`/analytics/messages/${businessId}/export?${params}`)
  }

  // Combined Analytics
  async getCombinedAnalytics(businessId: string, period: string = "7d") {
    const params = new URLSearchParams({ period })
    return this.request(`/analytics/combined/${businessId}?${params}`)
  }

  // Dashboard Summary
  async getDashboardSummary(businessId: string) {
    return this.request(`/analytics/dashboard/${businessId}/summary`)
  }

  // Utility methods for real-time updates
  async refreshAnalytics(businessId: string) {
    return Promise.all([
      this.getDashboardSummary(businessId),
      this.getCombinedAnalytics(businessId, "7d"),
      this.getOrdersAnalytics(businessId, "7d"),
      this.getMessagesAnalytics(businessId, "7d")
    ])
  }

  // Batch operations
  async createMultipleOrderRecords(businessId: string, ordersData: any[]) {
    return Promise.all(
      ordersData.map(orderData => this.createOrderRecord(businessId, orderData))
    )
  }

  async createMultipleMessageRecords(businessId: string, messagesData: any[]) {
    return Promise.all(
      messagesData.map(messageData => this.createMessageRecord(businessId, messageData))
    )
  }

  // Analytics insights and calculations
  async getRevenueInsights(businessId: string, period: string = "30d") {
    const ordersData = await this.getOrdersAnalytics(businessId, period)
    
    if (!ordersData.orders) return null

    const orders = ordersData.orders
    const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.totalAmount, 0)
    const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0
    
    // Calculate growth rate if we have data for comparison
    const previousPeriod = this.getPreviousPeriod(period)
    let growthRate = 0
    
    try {
      const previousData = await this.getOrdersAnalytics(businessId, previousPeriod)
      const previousRevenue = previousData.orders.reduce((sum: number, order: any) => sum + order.totalAmount, 0)
      
      if (previousRevenue > 0) {
        growthRate = ((totalRevenue - previousRevenue) / previousRevenue) * 100
      }
    } catch (error) {
      console.warn('Could not calculate growth rate:', error)
    }

    return {
      totalRevenue,
      averageOrderValue,
      growthRate,
      totalOrders: orders.length,
      revenuePerDay: totalRevenue / this.getDaysInPeriod(period)
    }
  }

  async getCustomerInsights(businessId: string, period: string = "30d") {
    const [ordersData, messagesData] = await Promise.all([
      this.getOrdersAnalytics(businessId, period),
      this.getMessagesAnalytics(businessId, period)
    ])

    const uniqueCustomers = new Set()
    const customerOrderCounts: Record<string, number> = {}

    ordersData.orders?.forEach((order: any) => {
      if (order.customerId) {
        uniqueCustomers.add(order.customerId)
        customerOrderCounts[order.customerId] = (customerOrderCounts[order.customerId] || 0) + 1
      }
    })

    const returningCustomers = Object.values(customerOrderCounts).filter(count => count > 1).length
    const avgOrdersPerCustomer = uniqueCustomers.size > 0 
      ? Object.values(customerOrderCounts).reduce((sum, count) => sum + count, 0) / uniqueCustomers.size 
      : 0

    return {
      totalCustomers: uniqueCustomers.size,
      returningCustomers,
      retentionRate: uniqueCustomers.size > 0 ? (returningCustomers / uniqueCustomers.size) * 100 : 0,
      avgOrdersPerCustomer,
      totalSessions: messagesData.summary?.total_sessions || 0,
      avgMessagesPerSession: messagesData.summary?.average_messages_per_session || 0
    }
  }

  // Helper methods
  private getPreviousPeriod(period: string): string {
    // Simple implementation - in a real app you might want more sophisticated logic
    const periodMap: Record<string, string> = {
      '1d': '1d', // Compare with previous day
      '7d': '7d', // Compare with previous week
      '30d': '30d', // Compare with previous month
      '90d': '90d' // Compare with previous quarter
    }
    return periodMap[period] || '7d'
  }

  private getDaysInPeriod(period: string): number {
    const periodMap: Record<string, number> = {
      '1d': 1,
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    }
    return periodMap[period] || 7
  }
}

export const analyticsApi = new AnalyticsAPI()