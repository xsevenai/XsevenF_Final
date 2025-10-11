// hooks/use-kds.ts

'use client'

import { useState, useEffect, useCallback } from 'react'
import { FoodHospitalityOperationsService } from '@/src/api/generated/services/FoodHospitalityOperationsService'
import { configureAPI } from '@/lib/api-config'
import type { KDSOrder } from '@/src/api/generated/models/KDSOrder'
import type { KDSOrderCreate } from '@/src/api/generated/models/KDSOrderCreate'
import type { KDSOrderUpdate } from '@/src/api/generated/models/KDSOrderUpdate'
import type { KDSOrderWithMetrics } from '@/src/api/generated/models/KDSOrderWithMetrics'
import type { KDSStatus } from '@/src/api/generated/models/KDSStatus'

// Hook for KDS orders management
export const useKDSOrders = (businessId: string) => {
  const [orders, setOrders] = useState<KDSOrderWithMetrics[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = useCallback(async (filters?: {
    station?: string
    status?: string
    activeOnly?: boolean
  }) => {
    try {
      setLoading(true)
      setError(null)
      configureAPI()
      
      console.log('Fetching KDS orders with params:', filters)
      const data = await FoodHospitalityOperationsService.listKdsOrdersApiV1FoodKdsOrdersGet(
        businessId,
        filters?.station || null,
        filters?.status || null,
        filters?.activeOnly !== undefined ? filters.activeOnly : true
      )
      console.log('Fetched KDS orders:', data.length, 'orders')
      setOrders(data)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch KDS orders')
      console.error('Error fetching KDS orders:', err)
    } finally {
      setLoading(false)
    }
  }, [businessId])

  const createOrder = useCallback(async (data: KDSOrderCreate) => {
    try {
      setError(null)
      configureAPI()
      
      console.log('Creating KDS order with data:', data)
      const newOrder = await FoodHospitalityOperationsService.createKdsOrderApiV1FoodKdsOrdersPost(data)
      console.log('KDS order created successfully:', newOrder)
      setOrders(prev => [newOrder, ...prev])
      return newOrder
    } catch (err: any) {
      console.error('Error creating KDS order:', err)
      const errorMessage = err.message || 'Failed to create KDS order'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateOrder = useCallback(async (orderId: string, data: KDSOrderUpdate) => {
    try {
      setError(null)
      configureAPI()
      
      // Clean up the data to ensure proper format
      const cleanData: KDSOrderUpdate = {
        status: data.status || null,
        assigned_to: data.assigned_to || null,
        prep_start_time: data.prep_start_time || null,
        prep_end_time: data.prep_end_time || null
      }
      
      console.log('Updating KDS order:', orderId, 'with data:', cleanData)
      const updatedOrder = await FoodHospitalityOperationsService.updateKdsOrderApiV1FoodKdsOrdersOrderIdPut(orderId, cleanData)
      console.log('KDS order updated successfully:', updatedOrder)
      setOrders(prev => prev.map(order => order.id === orderId ? updatedOrder : order))
      return updatedOrder
    } catch (err: any) {
      console.error('Error updating KDS order:', err)
      const errorMessage = err.message || 'Failed to update KDS order'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getOrder = useCallback(async (orderId: string) => {
    try {
      setError(null)
      configureAPI()
      
      const order = await FoodHospitalityOperationsService.getKdsOrderApiV1FoodKdsOrdersOrderIdGet(orderId)
      return order
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get KDS order'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateOrderStatus = useCallback(async (orderId: string, status: KDSStatus, assignedTo?: string) => {
    const updateData: KDSOrderUpdate = { 
      status,
      assigned_to: assignedTo || null,
      prep_start_time: null,
      prep_end_time: null
    }
    
    // Set timing based on status
    const now = new Date().toISOString()
    if (status === 'preparing' && !orders.find(o => o.id === orderId)?.prep_start_time) {
      updateData.prep_start_time = now
    } else if (status === 'ready' || status === 'served') {
      updateData.prep_end_time = now
    }
    
    return updateOrder(orderId, updateData)
  }, [updateOrder, orders])

  useEffect(() => {
    if (businessId) {
      fetchOrders()
    }
  }, [businessId, fetchOrders])

  const refresh = useCallback(async () => {
    return fetchOrders()
  }, [fetchOrders])

  return {
    orders,
    loading,
    error,
    refresh,
    createOrder,
    updateOrder,
    getOrder,
    updateOrderStatus,
    fetchOrders
  }
}

// Hook for KDS performance metrics
export const useKDSPerformance = (businessId: string) => {
  const [performance, setPerformance] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPerformance = useCallback(async (startDate?: string, endDate?: string) => {
    try {
      setLoading(true)
      setError(null)
      configureAPI()
      
      const defaultEndDate = endDate || new Date().toISOString()
      const defaultStartDate = startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      
      console.log('Fetching KDS performance:', { startDate: defaultStartDate, endDate: defaultEndDate })
      const data = await FoodHospitalityOperationsService.getKitchenPerformanceApiV1FoodKdsPerformanceGet(
        businessId,
        defaultStartDate,
        defaultEndDate
      )
      console.log('Fetched KDS performance:', data)
      setPerformance(data)
      return data
    } catch (err: any) {
      console.error('Error fetching KDS performance:', err)
      const errorMessage = err.message || 'Failed to fetch KDS performance'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [businessId])

  return {
    performance,
    loading,
    error,
    fetchPerformance,
    clearError: () => setError(null)
  }
}

// Combined hook for complete KDS management
export const useKDSManagement = (businessId: string) => {
  const orders = useKDSOrders(businessId)
  const performance = useKDSPerformance(businessId)

  const refreshAll = useCallback(async () => {
    await Promise.all([
      orders.refresh(),
      performance.fetchPerformance()
    ])
  }, [orders.refresh, performance.fetchPerformance])

  return {
    orders,
    performance,
    refreshAll,
    loading: orders.loading || performance.loading,
    error: orders.error || performance.error
  }
}
