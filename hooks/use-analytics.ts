// hooks/use-analytics.ts

"use client"

import { useState, useEffect, useCallback } from "react"
import { analyticsApi } from "@/lib/analytics-api"
import type { AnalyticsData, OrderAnalytics, MessageAnalytics } from "@/app/dashboard/components/types"

// Main analytics hook
export function useAnalytics(timeRange: string = "7d") {
  const [dashboardSummary, setDashboardSummary] = useState<any>(null)
  const [combinedAnalytics, setCombinedAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Get business ID from local storage or context
      const businessId = localStorage.getItem('business_id') || '1'
      
      // Fetch dashboard summary and combined analytics
      const [summaryData, combinedData] = await Promise.all([
        analyticsApi.getDashboardSummary(businessId),
        analyticsApi.getCombinedAnalytics(businessId, timeRange)
      ])
      
      setDashboardSummary(summaryData)
      setCombinedAnalytics(combinedData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics')
    } finally {
      setLoading(false)
    }
  }, [timeRange])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  const refetch = useCallback(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  return {
    dashboardSummary,
    combinedAnalytics,
    loading,
    error,
    refetch
  }
}

// Orders analytics hook
export function useOrdersAnalytics(timeRange: string = "7d", statusFilter?: string) {
  const [ordersData, setOrdersData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrdersAnalytics = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const businessId = localStorage.getItem('business_id') || '1'
      const data = await analyticsApi.getOrdersAnalytics(businessId, timeRange, statusFilter)
      
      setOrdersData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders analytics')
    } finally {
      setLoading(false)
    }
  }, [timeRange, statusFilter])

  useEffect(() => {
    fetchOrdersAnalytics()
  }, [fetchOrdersAnalytics])

  const refetch = useCallback(() => {
    fetchOrdersAnalytics()
  }, [fetchOrdersAnalytics])

  return {
    ordersData,
    loading,
    error,
    refetch
  }
}

// Messages analytics hook
export function useMessagesAnalytics(timeRange: string = "7d", sessionId?: string) {
  const [messagesData, setMessagesData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMessagesAnalytics = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const businessId = localStorage.getItem('business_id') || '1'
      const data = await analyticsApi.getMessagesAnalytics(businessId, timeRange, sessionId)
      
      setMessagesData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messages analytics')
    } finally {
      setLoading(false)
    }
  }, [timeRange, sessionId])

  useEffect(() => {
    fetchMessagesAnalytics()
  }, [fetchMessagesAnalytics])

  const refetch = useCallback(() => {
    fetchMessagesAnalytics()
  }, [fetchMessagesAnalytics])

  return {
    messagesData,
    loading,
    error,
    refetch
  }
}

// Order creation hook
export function useCreateOrderRecord() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createOrderRecord = useCallback(async (orderData: any) => {
    try {
      setLoading(true)
      setError(null)
      
      const businessId = localStorage.getItem('business_id') || '1'
      const result = await analyticsApi.createOrderRecord(businessId, orderData)
      
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order record')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateOrderStatus = useCallback(async (orderId: string, statusData: any) => {
    try {
      setLoading(true)
      setError(null)
      
      const businessId = localStorage.getItem('business_id') || '1'
      const result = await analyticsApi.updateOrderStatus(businessId, orderId, statusData)
      
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order status')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    createOrderRecord,
    updateOrderStatus,
    loading,
    error
  }
}

// Message creation hook
export function useCreateMessageRecord() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createMessageRecord = useCallback(async (messageData: any) => {
    try {
      setLoading(true)
      setError(null)
      
      const businessId = localStorage.getItem('business_id') || '1'
      const result = await analyticsApi.createMessageRecord(businessId, messageData)
      
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create message record')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    createMessageRecord,
    loading,
    error
  }
}