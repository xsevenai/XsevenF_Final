// hooks/use-revenue-analytics.ts
import { useState, useEffect, useCallback } from 'react'
import { RevenueAnalyticsService } from '@/src/api/generated/services/RevenueAnalyticsService'
import { OpenAPI } from '@/src/api/generated/core/OpenAPI'

// TypeScript interfaces for revenue analytics responses
export interface RevenueOverview {
  business_id: string
  period: string
  total_revenue: number
  daily_revenue: number
  weekly_revenue: number
  monthly_revenue: number
  revenue_growth: number
  daily_growth: number
  weekly_growth: number
  monthly_growth: number
  average_order_value: number
  revenue_per_customer: number
  total_orders: number
  total_customers: number
  last_updated: string
  trends_included?: boolean
}

export interface RevenueTrendData {
  day: string
  revenue: number
  orders: number
}

export interface RevenueTrendResponse {
  business_id: string
  period: string
  trend_data: RevenueTrendData[]
  generated_at: string
}

export interface RevenueByChannel {
  channel: string
  revenue: number
  percentage: number
}

export interface RevenueByChannelResponse {
  business_id: string
  period: string
  channel_data: RevenueByChannel[]
  total_revenue: number
  generated_at: string
}

export interface RevenueByHour {
  hour: string
  revenue: number
  orders: number
}

export interface RevenueByHourResponse {
  business_id: string
  period: string
  hour_data: RevenueByHour[]
  peak_hour: string
  peak_hour_revenue: number
  generated_at: string
}

export interface PaymentMethodData {
  method: string
  revenue: number
  percentage: number
}

export interface PaymentMethodsResponse {
  business_id: string
  period: string
  payment_data: PaymentMethodData[]
  total_revenue: number
  generated_at: string
}

export interface RevenueByCategory {
  category: string
  revenue: number
  percentage: number
}

export interface RevenueByCategoryResponse {
  business_id: string
  period: string
  category_data: RevenueByCategory[]
  total_revenue: number
  generated_at: string
}

export interface TopRevenueItem {
  name: string
  revenue: number
  orders: number
}

export interface TopRevenueItemsResponse {
  business_id: string
  period: string
  top_items: TopRevenueItem[]
  generated_at: string
}

export interface RevenueProjection {
  month: string
  actual: number
  projected: number
}

export interface RevenueProjectionResponse {
  business_id: string
  months: number
  projection_data: RevenueProjection[]
  avg_growth_rate: number
  generated_at: string
}

export interface RevenueAnalyticsResponse {
  business_id: string
  period: string
  overview: RevenueOverview
  trend_data: RevenueTrendResponse
  channel_data: RevenueByChannelResponse
  hour_data: RevenueByHourResponse
  payment_methods: PaymentMethodsResponse
  category_data: RevenueByCategoryResponse
  top_items: TopRevenueItemsResponse
  projection_data: RevenueProjectionResponse
  generated_at: string
  cache_expires_at: string
}

export function useRevenueAnalytics(businessId: string) {
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

  // Get Revenue Overview
  const getRevenueOverview = useCallback(async (
    period: '1d' | '7d' | '30d' | '90d' | '1y' = '7d',
    includeTrends: boolean = true
  ): Promise<RevenueOverview> => {
    try {
      console.log('🔍 getRevenueOverview: Starting fetch for businessId:', businessId, 'period:', period)
      setLoading(true)
      setError(null)
      
      const result = await RevenueAnalyticsService.getRevenueOverviewApiV1AnalyticsRevenueOverviewBusinessIdGet({
        businessId,
        period,
        includeTrends
      })
      
      console.log('✅ getRevenueOverview: Data received:', result)
      setLastUpdated(new Date())
      return result
    } catch (err: any) {
      console.error('❌ getRevenueOverview: Error occurred:', err)
      const errorMessage = err.message || 'Failed to get revenue overview'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [businessId])

  // Get Revenue Trend
  const getRevenueTrend = useCallback(async (
    period: '1d' | '7d' | '30d' | '90d' | '1y' = '7d'
  ): Promise<RevenueTrendResponse> => {
    try {
      console.log('🔍 getRevenueTrend: Starting fetch for businessId:', businessId, 'period:', period)
      setLoading(true)
      setError(null)
      
      const result = await RevenueAnalyticsService.getRevenueTrendApiV1AnalyticsRevenueTrendBusinessIdGet({
        businessId,
        period
      })
      
      console.log('✅ getRevenueTrend: Data received:', result)
      setLastUpdated(new Date())
      return result
    } catch (err: any) {
      console.error('❌ getRevenueTrend: Error occurred:', err)
      const errorMessage = err.message || 'Failed to get revenue trend'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [businessId])

  // Get Revenue by Channel
  const getRevenueByChannel = useCallback(async (
    period: '1d' | '7d' | '30d' | '90d' | '1y' = '7d'
  ): Promise<RevenueByChannelResponse> => {
    try {
      console.log('🔍 getRevenueByChannel: Starting fetch for businessId:', businessId, 'period:', period)
      setLoading(true)
      setError(null)
      
      const result = await RevenueAnalyticsService.getRevenueByChannelApiV1AnalyticsRevenueByChannelBusinessIdGet({
        businessId,
        period
      })
      
      console.log('✅ getRevenueByChannel: Data received:', result)
      setLastUpdated(new Date())
      return result
    } catch (err: any) {
      console.error('❌ getRevenueByChannel: Error occurred:', err)
      const errorMessage = err.message || 'Failed to get revenue by channel'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [businessId])

  // Get Revenue by Hour
  const getRevenueByHour = useCallback(async (
    period: '1d' | '7d' | '30d' | '90d' | '1y' = '7d'
  ): Promise<RevenueByHourResponse> => {
    try {
      console.log('🔍 getRevenueByHour: Starting fetch for businessId:', businessId, 'period:', period)
      setLoading(true)
      setError(null)
      
      const result = await RevenueAnalyticsService.getRevenueByHourApiV1AnalyticsRevenueByHourBusinessIdGet({
        businessId,
        period
      })
      
      console.log('✅ getRevenueByHour: Data received:', result)
      setLastUpdated(new Date())
      return result
    } catch (err: any) {
      console.error('❌ getRevenueByHour: Error occurred:', err)
      const errorMessage = err.message || 'Failed to get revenue by hour'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [businessId])

  // Get Payment Methods Revenue
  const getPaymentMethodsRevenue = useCallback(async (
    period: '1d' | '7d' | '30d' | '90d' | '1y' = '7d'
  ): Promise<PaymentMethodsResponse> => {
    try {
      console.log('🔍 getPaymentMethodsRevenue: Starting fetch for businessId:', businessId, 'period:', period)
      setLoading(true)
      setError(null)
      
      const result = await RevenueAnalyticsService.getPaymentMethodsRevenueApiV1AnalyticsRevenuePaymentMethodsBusinessIdGet({
        businessId,
        period
      })
      
      console.log('✅ getPaymentMethodsRevenue: Data received:', result)
      setLastUpdated(new Date())
      return result
    } catch (err: any) {
      console.error('❌ getPaymentMethodsRevenue: Error occurred:', err)
      const errorMessage = err.message || 'Failed to get payment methods revenue'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [businessId])

  // Get Revenue by Category
  const getRevenueByCategory = useCallback(async (
    period: '1d' | '7d' | '30d' | '90d' | '1y' = '7d'
  ): Promise<RevenueByCategoryResponse> => {
    try {
      console.log('🔍 getRevenueByCategory: Starting fetch for businessId:', businessId, 'period:', period)
      setLoading(true)
      setError(null)
      
      const result = await RevenueAnalyticsService.getRevenueByCategoryApiV1AnalyticsRevenueByCategoryBusinessIdGet({
        businessId,
        period
      })
      
      console.log('✅ getRevenueByCategory: Data received:', result)
      setLastUpdated(new Date())
      return result
    } catch (err: any) {
      console.error('❌ getRevenueByCategory: Error occurred:', err)
      const errorMessage = err.message || 'Failed to get revenue by category'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [businessId])

  // Get Top Revenue Items
  const getTopRevenueItems = useCallback(async (
    period: '1d' | '7d' | '30d' | '90d' | '1y' = '7d',
    limit: number = 5
  ): Promise<TopRevenueItemsResponse> => {
    try {
      console.log('🔍 getTopRevenueItems: Starting fetch for businessId:', businessId, 'period:', period, 'limit:', limit)
      setLoading(true)
      setError(null)
      
      const result = await RevenueAnalyticsService.getTopRevenueItemsApiV1AnalyticsRevenueTopItemsBusinessIdGet({
        businessId,
        period,
        limit
      })
      
      console.log('✅ getTopRevenueItems: Data received:', result)
      setLastUpdated(new Date())
      return result
    } catch (err: any) {
      console.error('❌ getTopRevenueItems: Error occurred:', err)
      const errorMessage = err.message || 'Failed to get top revenue items'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [businessId])

  // Get Revenue Projection
  const getRevenueProjection = useCallback(async (
    months: number = 6
  ): Promise<RevenueProjectionResponse> => {
    try {
      console.log('🔍 getRevenueProjection: Starting fetch for businessId:', businessId, 'months:', months)
      setLoading(true)
      setError(null)
      
      const result = await RevenueAnalyticsService.getRevenueProjectionApiV1AnalyticsRevenueProjectionBusinessIdGet({
        businessId,
        months
      })
      
      console.log('✅ getRevenueProjection: Data received:', result)
      setLastUpdated(new Date())
      return result
    } catch (err: any) {
      console.error('❌ getRevenueProjection: Error occurred:', err)
      const errorMessage = err.message || 'Failed to get revenue projection'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [businessId])

  // Get Complete Revenue Analytics Dashboard
  const getRevenueAnalyticsDashboard = useCallback(async (
    period: '1d' | '7d' | '30d' | '90d' | '1y' = '7d',
    includeTrends: boolean = true
  ): Promise<RevenueAnalyticsResponse> => {
    try {
      console.log('🚀 getRevenueAnalyticsDashboard: Starting dashboard fetch for businessId:', businessId, 'period:', period)
      setLoading(true)
      setError(null)
      
      const result = await RevenueAnalyticsService.getRevenueAnalyticsDashboardApiV1AnalyticsRevenueDashboardBusinessIdGet({
        businessId,
        period,
        includeTrends
      })
      
      console.log('✅ getRevenueAnalyticsDashboard: Complete dashboard data:', result)
      setLastUpdated(new Date())
      return result
    } catch (err: any) {
      console.error('❌ getRevenueAnalyticsDashboard: Dashboard fetch failed:', err)
      const errorMessage = err.message || 'Failed to get revenue analytics dashboard'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [businessId])

  // Refresh Revenue Analytics Data
  const refreshRevenueAnalytics = useCallback(async (forceRefresh: boolean = false): Promise<void> => {
    try {
      console.log('🔄 refreshRevenueAnalytics: Starting refresh for businessId:', businessId, 'forceRefresh:', forceRefresh)
      setLoading(true)
      setError(null)
      
      await RevenueAnalyticsService.refreshRevenueAnalyticsApiV1AnalyticsRevenueRefreshBusinessIdPost({
        businessId,
        forceRefresh
      })
      
      console.log('✅ refreshRevenueAnalytics: Refresh completed')
      setLastUpdated(new Date())
    } catch (err: any) {
      console.error('❌ refreshRevenueAnalytics: Error occurred:', err)
      const errorMessage = err.message || 'Failed to refresh revenue analytics'
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
    getRevenueOverview,
    getRevenueTrend,
    getRevenueByChannel,
    getRevenueByHour,
    getPaymentMethodsRevenue,
    getRevenueByCategory,
    getTopRevenueItems,
    getRevenueProjection,
    getRevenueAnalyticsDashboard,
    refreshRevenueAnalytics
  }
}
