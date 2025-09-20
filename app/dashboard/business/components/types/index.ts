// app/dashboard/business/components/types/index.ts

export interface BusinessMetrics {
  revenue: {
    daily: number
    weekly: number
    monthly: number
    yearly: number
    growth: number
  }
  customers: {
    total: number
    newThisMonth: number
    returningRate: number
    averageSpend: number
  }
  operations: {
    ordersToday: number
    averageWaitTime: number
    tableUtilization: number
    staffEfficiency: number
  }
  satisfaction: {
    overallRating: number
    totalReviews: number
    responseRate: number
    netPromoterScore: number
  }
}

export interface MenuPerformance {
  topItems: Array<{
    id: string
    name: string
    category: string
    sales: number
    revenue: number
    growth: number
  }>
  categories: Array<{
    name: string
    revenue: number
    orders: number
    margin: number
  }>
}

export interface CompetitorData {
  name: string
  rating: number
  avgPrice: number
  distance: string
}

export type TabType = "overview" | "analytics" | "operations" | "insights"
export type TimeRangeType = "today" | "week" | "month" | "year"