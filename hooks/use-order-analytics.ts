// hooks/use-order-analytics.ts
import { useState, useEffect, useCallback } from 'react'
import { OrdersAnalyticsService } from '@/src/api/generated/services/OrdersAnalyticsService'
import { OpenAPI } from '@/src/api/generated/core/OpenAPI'

// TypeScript interfaces for orders analytics responses
export interface OrdersOverview {
  business_id: string
  period: string
  total_orders: number
  completed_orders: number
  pending_orders: number
  cancelled_orders: number
  total_revenue: number
  average_order_value: number
  orders_growth: number
  revenue_growth: number
  completion_rate: number
  cancellation_rate: number
  last_updated: string
}

export interface OrderTrendData {
  day: string
  orders: number
  revenue: number
}

export interface OrdersTrendResponse {
  business_id: string
  period: string
  trend_data: OrderTrendData[]
  generated_at: string
}

export interface OrderHourData {
  hour: string
  orders: number
}

export interface OrdersByHourResponse {
  business_id: string
  period: string
  hour_data: OrderHourData[]
  peak_hour: string
  generated_at: string
}

export interface OrderStatusData {
  status: string
  count: number
  percentage: number
}

export interface OrderStatusDistributionResponse {
  business_id: string
  period: string
  status_data: OrderStatusData[]
  generated_at: string
}

export interface OrderTypeData {
  type: string
  count: number
  percentage: number
}

export interface OrderTypesResponse {
  business_id: string
  period: string
  type_data: OrderTypeData[]
  generated_at: string
}

export interface TopSellingItem {
  name: string
  quantity: number
  revenue: number
}

export interface TopSellingItemsResponse {
  business_id: string
  period: string
  top_items: TopSellingItem[]
  generated_at: string
}

export interface OrdersAnalyticsResponse {
  business_id: string
  period: string
  overview: OrdersOverview
  trend_data: OrdersTrendResponse
  status_distribution: OrderStatusDistributionResponse
  hour_data: OrdersByHourResponse
  order_types: OrderTypesResponse
  top_items: TopSellingItemsResponse
  generated_at: string
  cache_expires_at: string
}

export function useOrderAnalytics(businessId: string) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Configure OpenAPI
  useEffect(() => {
    OpenAPI.BASE = 'http://127.0.0.1:8060'
    OpenAPI.TOKEN = async () => {
      const token = localStorage.getItem('accessToken')
      if (!token) throw new Error('No authentication token found')
      return token
    }
    OpenAPI.HEADERS = {
      'Content-Type': 'application/json',
    }
    OpenAPI.WITH_CREDENTIALS = false
  }, [])

  // Get Orders Overview
  const getOrdersOverview = useCallback(async (
    period: '1d' | '7d' | '30d' | '90d' = '7d'
  ): Promise<OrdersOverview> => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await OrdersAnalyticsService.getOrdersOverviewApiV1OrdersOverviewBusinessIdGet({
        businessId,
        period
      })
      
      setLastUpdated(new Date())
      return result
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get orders overview'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [businessId])

  // Get Orders Trend
  const getOrdersTrend = useCallback(async (
    period: '1d' | '7d' | '30d' | '90d' = '7d'
  ): Promise<OrdersTrendResponse> => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await OrdersAnalyticsService.getOrdersTrendApiV1OrdersTrendBusinessIdGet({
        businessId,
        period
      })
      
      setLastUpdated(new Date())
      return result
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get orders trend'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [businessId])

  // Get Orders by Hour
  const getOrdersByHour = useCallback(async (
    period: '1d' | '7d' | '30d' | '90d' = '7d'
  ): Promise<OrdersByHourResponse> => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await OrdersAnalyticsService.getOrdersByHourApiV1OrdersByHourBusinessIdGet({
        businessId,
        period
      })
      
      setLastUpdated(new Date())
      return result
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get orders by hour'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [businessId])

  // Get Order Status Distribution
  const getOrderStatusDistribution = useCallback(async (
    period: '1d' | '7d' | '30d' | '90d' = '7d'
  ): Promise<OrderStatusDistributionResponse> => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await OrdersAnalyticsService.getOrderStatusDistributionApiV1OrdersStatusDistributionBusinessIdGet({
        businessId,
        period
      })
      
      setLastUpdated(new Date())
      return result
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get order status distribution'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [businessId])

  // Get Order Types Distribution
  const getOrderTypesDistribution = useCallback(async (
    period: '1d' | '7d' | '30d' | '90d' = '7d'
  ): Promise<OrderTypesResponse> => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await OrdersAnalyticsService.getOrderTypesDistributionApiV1OrdersTypesBusinessIdGet({
        businessId,
        period
      })
      
      setLastUpdated(new Date())
      return result
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get order types distribution'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [businessId])

  // Get Top Selling Items
  const getTopSellingItems = useCallback(async (
    period: '1d' | '7d' | '30d' | '90d' = '7d',
    limit: number = 5
  ): Promise<TopSellingItemsResponse> => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await OrdersAnalyticsService.getTopSellingItemsApiV1OrdersTopItemsBusinessIdGet({
        businessId,
        period,
        limit
      })
      
      setLastUpdated(new Date())
      return result
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get top selling items'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [businessId])

  // Get Complete Orders Analytics Dashboard
  const getOrdersAnalyticsDashboard = useCallback(async (
    period: '1d' | '7d' | '30d' | '90d' = '7d'
  ): Promise<OrdersAnalyticsResponse> => {
    try {
      console.log('useOrderAnalytics: Starting dashboard fetch for businessId:', businessId, 'period:', period)
      setLoading(true)
      setError(null)
      
      // Use the new OrdersAnalyticsService
      const result = await OrdersAnalyticsService.getOrdersAnalyticsDashboardApiV1OrdersDashboardBusinessIdGet({
        businessId,
        period
      })
      
      console.log('useOrderAnalytics: Dashboard data received:', result)
      setLastUpdated(new Date())
      return result
    } catch (err: any) {
      console.error('useOrderAnalytics: Dashboard fetch failed:', err)
      const errorMessage = err.message || 'Failed to get orders analytics dashboard'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [businessId])

  // Refresh Analytics Data (if backend supports it)
  const refreshOrdersAnalytics = useCallback(async (forceRefresh: boolean = false): Promise<void> => {
    try {
      setLoading(true)
      setError(null)
      
      // Use the new OrdersAnalyticsService refresh method
      await OrdersAnalyticsService.refreshOrdersAnalyticsApiV1OrdersRefreshBusinessIdPost({
        businessId,
        forceRefresh
      })
      
      setLastUpdated(new Date())
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to refresh orders analytics'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [businessId])

  return {
    loading,
    error,
    lastUpdated,
    getOrdersOverview,
    getOrdersTrend,
    getOrdersByHour,
    getOrderStatusDistribution,
    getOrderTypesDistribution,
    getTopSellingItems,
    getOrdersAnalyticsDashboard,
    refreshOrdersAnalytics
  }
}
