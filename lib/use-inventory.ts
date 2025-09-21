// hooks/use-inventory.ts

'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  frontendInventoryApi,
  type ExtendedInventoryItem,
  type ExtendedLowStockItem,
  type InventoryUpdate,
  type ReorderRequest,
  type ReorderResponse,
  type UsageTracking
} from '@/app/api/inventory'

// Hook for inventory items management
export const useInventoryItems = () => {
  const [items, setItems] = useState<ExtendedInventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = useCallback(async (params?: {
    low_stock_only?: boolean
    category_id?: number
  }) => {
    try {
      setLoading(true)
      setError(null)
      const data = await frontendInventoryApi.getItems(params)
      setItems(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch inventory items')
    } finally {
      setLoading(false)
    }
  }, [])

  const updateItem = useCallback(async (itemId: number, data: InventoryUpdate) => {
    try {
      const updatedItem = await frontendInventoryApi.updateItem(itemId, data)
      setItems(prev => prev.map(item => item.id === itemId ? updatedItem : item))
      return updatedItem
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update inventory item')
    }
  }, [])

  const updateStockQuantity = useCallback(async (itemId: number, stockQuantity: number, minThreshold?: number) => {
    const updateData: InventoryUpdate = { stock_quantity: stockQuantity }
    if (minThreshold !== undefined) {
      updateData.min_stock_threshold = minThreshold
    }
    return updateItem(itemId, updateData)
  }, [updateItem])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  return {
    items,
    loading,
    error,
    refresh: fetchItems,
    updateItem,
    updateStockQuantity,
    fetchItems
  }
}

// Hook for low stock items
export const useLowStockItems = () => {
  const [lowStockItems, setLowStockItems] = useState<ExtendedLowStockItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLowStockItems = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await frontendInventoryApi.getLowStockItems()
      setLowStockItems(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch low stock items')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLowStockItems()
  }, [fetchLowStockItems])

  return {
    lowStockItems,
    loading,
    error,
    refresh: fetchLowStockItems
  }
}

// Hook for reorder management
export const useReorders = () => {
  const [reorderHistory, setReorderHistory] = useState<ReorderResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createReorder = useCallback(async (data: ReorderRequest) => {
    try {
      setLoading(true)
      setError(null)
      const response = await frontendInventoryApi.createReorder(data)
      setReorderHistory(prev => [response, ...prev])
      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create reorder request'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const createReorderFromLowStock = useCallback(async (item: ExtendedLowStockItem, quantity?: number, supplier?: string, notes?: string) => {
    const defaultQuantity = Math.max(item.threshold * 2, 10) // Default to 2x threshold or 10 units
    
    const reorderData: ReorderRequest = {
      item_id: item.item_id,
      quantity: quantity || defaultQuantity,
      supplier: supplier || item.supplier,
      notes: notes || `Auto-generated reorder for ${item.status} item`
    }
    
    return createReorder(reorderData)
  }, [createReorder])

  return {
    reorderHistory,
    loading,
    error,
    createReorder,
    createReorderFromLowStock,
    clearError: () => setError(null)
  }
}

// Hook for usage tracking
export const useUsageTracking = () => {
  const [usageHistory, setUsageHistory] = useState<UsageTracking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPeriod, setCurrentPeriod] = useState<'7d' | '30d' | '90d'>('7d')

  const fetchUsageHistory = useCallback(async (period: '7d' | '30d' | '90d' = '7d') => {
    try {
      setLoading(true)
      setError(null)
      const data = await frontendInventoryApi.getUsageTracking(period)
      setUsageHistory(data)
      setCurrentPeriod(period)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch usage history')
    } finally {
      setLoading(false)
    }
  }, [])

  const changePeriod = useCallback(async (period: '7d' | '30d' | '90d') => {
    await fetchUsageHistory(period)
  }, [fetchUsageHistory])

  useEffect(() => {
    fetchUsageHistory()
  }, [fetchUsageHistory])

  return {
    usageHistory,
    loading,
    error,
    currentPeriod,
    refresh: () => fetchUsageHistory(currentPeriod),
    fetchUsageHistory,
    changePeriod
  }
}

// Hook for inventory statistics (computed from available data)
export const useInventoryStats = () => {
  const { items: inventoryItems } = useInventoryItems()
  const { lowStockItems } = useLowStockItems()
  const { usageHistory } = useUsageTracking()

  const stats = React.useMemo(() => {
    const totalItems = inventoryItems.length
    const lowStockCount = lowStockItems.length
    const outOfStockCount = inventoryItems.filter(item => item.is_out_of_stock).length
    const inStockCount = inventoryItems.filter(item => !item.is_low_stock && !item.is_out_of_stock).length
    
    // Calculate total value (would need cost_per_unit from menu_items)
    const totalValue = inventoryItems.reduce((sum, item) => {
      return sum + (item.current_stock * (item.cost_per_unit || 0))
    }, 0)

    // Top usage items from current period
    const topUsageItems = usageHistory.slice(0, 5)

    // Revenue from usage tracking
    const totalRevenue = usageHistory.reduce((sum, item) => sum + item.total_revenue, 0)

    return {
      overview: {
        totalItems,
        totalValue,
        lowStockCount,
        outOfStockCount,
        inStockCount,
        totalRevenue
      },
      lowStockItems,
      topUsageItems,
      usageHistory
    }
  }, [inventoryItems, lowStockItems, usageHistory])

  return {
    stats,
    loading: false,
    error: null,
    refresh: () => {
      // This would trigger refresh of all dependent hooks
    }
  }
}

// Combined hook for complete inventory management
export const useInventoryManagement = () => {
  const inventoryItems = useInventoryItems()
  const lowStockItems = useLowStockItems()
  const reorders = useReorders()
  const usageTracking = useUsageTracking()
  const stats = useInventoryStats()

  const refreshAll = useCallback(async () => {
    await Promise.all([
      inventoryItems.refresh(),
      lowStockItems.refresh(),
      usageTracking.refresh()
    ])
  }, [
    inventoryItems.refresh,
    lowStockItems.refresh,
    usageTracking.refresh
  ])

  return {
    inventoryItems,
    lowStockItems,
    reorders,
    usageTracking,
    stats,
    refreshAll
  }
}

// React import for useMemo
import React from 'react'