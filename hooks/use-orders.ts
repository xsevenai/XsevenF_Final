// hooks/use-orders.ts

import { useState, useEffect, useCallback } from 'react'
import { 
  orderAPI, 
  Order, 
  CreateOrderData, 
  UpdateOrderData, 
  OrderStats, 
  OrderFilters,
  OrderStatus,
  PaymentStatus,
  PaymentData
} from '@/lib/order-api'

export function useOrders(filters?: OrderFilters) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await orderAPI.getOrders(filters)
      setOrders(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const refresh = useCallback(() => {
    fetchOrders()
  }, [fetchOrders])

  const createOrder = async (data: CreateOrderData) => {
    try {
      setError(null)
      const newOrder = await orderAPI.createOrder(data)
      setOrders(prev => [newOrder, ...prev])
      return newOrder
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create order'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const updateOrder = async (orderId: string, data: UpdateOrderData) => {
    try {
      setError(null)
      // Optimistic update
      setOrders(prev => prev.map(order => 
        order.id.toString() === orderId ? { ...order, ...data } : order
      ))
      
      const updatedOrder = await orderAPI.updateOrder(orderId, data)
      setOrders(prev => prev.map(order => 
        order.id.toString() === orderId ? updatedOrder : order
      ))
      return updatedOrder
    } catch (err) {
      // Revert optimistic update on error by refreshing
      await fetchOrders()
      const errorMessage = err instanceof Error ? err.message : 'Failed to update order'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    return updateOrder(orderId, { status })
  }

  const updatePaymentStatus = async (orderId: string, payment_status: PaymentStatus) => {
    return updateOrder(orderId, { payment_status })
  }

  const cancelOrder = async (orderId: string, reason?: string) => {
    try {
      setError(null)
      
      // Optimistic update
      setOrders(prev => prev.map(order => 
        order.id.toString() === orderId 
          ? { ...order, status: OrderStatus.CANCELLED, cancellation_reason: reason }
          : order
      ))

      await orderAPI.cancelOrder(orderId, reason)
      
      // Refresh to get the latest data from backend
      await fetchOrders()
    } catch (err) {
      // Revert optimistic update on error
      await fetchOrders()
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel order'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const processPayment = async (orderId: string, paymentData: PaymentData) => {
    try {
      setError(null)
      const updatedOrder = await orderAPI.processPayment(orderId, paymentData)
      setOrders(prev => prev.map(order => 
        order.id.toString() === orderId ? updatedOrder : order
      ))
      return updatedOrder
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process payment'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  return {
    orders,
    loading,
    error,
    refresh,
    createOrder,
    updateOrder,
    updateOrderStatus,
    updatePaymentStatus,
    cancelOrder,
    processPayment
  }
}

export function useActiveOrders() {
  const [activeOrders, setActiveOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchActiveOrders = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await orderAPI.getActiveOrders()
      setActiveOrders(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch active orders')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchActiveOrders()
    
    // Set up polling for real-time updates (every 30 seconds)
    const interval = setInterval(fetchActiveOrders, 30000)
    return () => clearInterval(interval)
  }, [fetchActiveOrders])

  const refresh = useCallback(() => {
    fetchActiveOrders()
  }, [fetchActiveOrders])

  return {
    activeOrders,
    loading,
    error,
    refresh
  }
}

export function useOrderStats(days: number = 30) {
  const [stats, setStats] = useState<OrderStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await orderAPI.getOrderStats(days)
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch order stats')
    } finally {
      setLoading(false)
    }
  }, [days])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const refresh = useCallback(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    refresh
  }
}

export function useOrder(orderId: string) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrder = useCallback(async () => {
    if (!orderId) return
    
    try {
      setLoading(true)
      setError(null)
      const data = await orderAPI.getOrder(orderId)
      setOrder(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch order')
    } finally {
      setLoading(false)
    }
  }, [orderId])

  useEffect(() => {
    fetchOrder()
  }, [fetchOrder])

  const refresh = useCallback(() => {
    fetchOrder()
  }, [fetchOrder])

  const updateOrder = async (data: UpdateOrderData) => {
    try {
      setError(null)
      const updatedOrder = await orderAPI.updateOrder(orderId, data)
      setOrder(updatedOrder)
      return updatedOrder
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update order'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  return {
    order,
    loading,
    error,
    refresh,
    updateOrder
  }
}