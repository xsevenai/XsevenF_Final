// hooks/use-analytics.ts - Simplified like tables hooks

"use client"

import { useState, useEffect, useCallback } from "react"
import { analyticsApi } from "@/lib/analytics-api"

// Main analytics hook - simplified API
export function useAnalytics(timeRange: string = "7d") {
  const [dashboardSummary, setDashboardSummary] = useState<any>(null)
  const [combinedAnalytics, setCombinedAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // No need to get business ID here - analytics API handles it automatically
      const [summaryData, combinedData] = await Promise.all([
        analyticsApi.getDashboardSummary(), // No business ID needed
        analyticsApi.getCombinedAnalytics(timeRange) // No business ID needed
      ])
      
      setDashboardSummary(summaryData)
      setCombinedAnalytics(combinedData)
    } catch (err) {
      console.error('Analytics fetch error:', err)
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

// Orders analytics hook - simplified
export function useOrdersAnalytics(timeRange: string = "7d", statusFilter?: string) {
  const [ordersData, setOrdersData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrdersAnalytics = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // No business ID needed - handled automatically
      const data = await analyticsApi.getOrdersAnalytics(timeRange, statusFilter)
      setOrdersData(data)
    } catch (err) {
      console.error('Orders analytics error:', err)
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

// Messages analytics hook - simplified
export function useMessagesAnalytics(timeRange: string = "7d", sessionId?: string) {
  const [messagesData, setMessagesData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMessagesAnalytics = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // No business ID needed - handled automatically
      const data = await analyticsApi.getMessagesAnalytics(timeRange, sessionId)
      setMessagesData(data)
    } catch (err) {
      console.error('Messages analytics error:', err)
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

// Order management hooks
export function useCreateOrderRecord() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createOrderRecord = useCallback(async (orderData: any) => {
    try {
      setLoading(true)
      setError(null)
      
      // No business ID needed - handled automatically
      const result = await analyticsApi.createOrderRecord(orderData)
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
      
      // No business ID needed - handled automatically
      const result = await analyticsApi.updateOrderStatus(orderId, statusData)
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

// Category Performance analytics hook
export function useCategoryPerformance(timeRange: string = "7d", includeDetails: boolean = true) {
  const [categoryData, setCategoryData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategoryPerformance = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // No business ID needed - handled automatically
      const data = await analyticsApi.getCategoryPerformance(timeRange, includeDetails)
      setCategoryData(data)
    } catch (err) {
      console.error('Category performance error:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch category performance')
    } finally {
      setLoading(false)
    }
  }, [timeRange, includeDetails])

  useEffect(() => {
    fetchCategoryPerformance()
  }, [fetchCategoryPerformance])

  const refetch = useCallback(() => {
    fetchCategoryPerformance()
  }, [fetchCategoryPerformance])

  return {
    categoryData,
    loading,
    error,
    refetch
  }
}

// Message management hook
export function useCreateMessageRecord() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createMessageRecord = useCallback(async (messageData: any) => {
    try {
      setLoading(true)
      setError(null)
      
      // No business ID needed - handled automatically
      const result = await analyticsApi.createMessageRecord(messageData)
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