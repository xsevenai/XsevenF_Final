// hooks/use-inventory.ts

'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  inventoryApi, 
  reorderApi, 
  usageApi, 
  inventoryStatsApi,
  type InventoryItem,
  type LowStockItem,
  type ReorderRequest,
  type IngredientUsage,
  type CreateInventoryItemRequest,
  type UpdateInventoryItemRequest,
  type CreateReorderRequest,
  type RecordUsageRequest
} from '@/lib/inventory-api'

// Hook for inventory items management
export const useInventoryItems = () => {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await inventoryApi.getItems()
      setItems(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch inventory items')
    } finally {
      setLoading(false)
    }
  }, [])

  const createItem = useCallback(async (data: CreateInventoryItemRequest) => {
    try {
      const newItem = await inventoryApi.createItem(data)
      setItems(prev => [...prev, newItem])
      return newItem
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create inventory item')
    }
  }, [])

  const updateItem = useCallback(async (itemId: string, data: UpdateInventoryItemRequest) => {
    try {
      const updatedItem = await inventoryApi.updateItem(itemId, data)
      setItems(prev => prev.map(item => item.id === itemId ? updatedItem : item))
      return updatedItem
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update inventory item')
    }
  }, [])

  const deleteItem = useCallback(async (itemId: string) => {
    try {
      await inventoryApi.deleteItem(itemId)
      setItems(prev => prev.filter(item => item.id !== itemId))
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete inventory item')
    }
  }, [])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  return {
    items,
    loading,
    error,
    refresh: fetchItems,
    createItem,
    updateItem,
    deleteItem
  }
}

// Hook for low stock items
export const useLowStockItems = () => {
  const [lowStockItems, setLowStockItems] = useState<LowStockItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLowStockItems = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await inventoryApi.getLowStockItems()
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
  const [reorders, setReorders] = useState<ReorderRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReorders = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await reorderApi.getReorders()
      setReorders(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reorder requests')
    } finally {
      setLoading(false)
    }
  }, [])

  const createReorder = useCallback(async (data: CreateReorderRequest) => {
    try {
      const newReorder = await reorderApi.createReorder(data)
      setReorders(prev => [...prev, newReorder])
      return newReorder
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create reorder request')
    }
  }, [])

  const updateReorderStatus = useCallback(async (
    reorderId: string, 
    status: ReorderRequest['status'],
    notes?: string
  ) => {
    try {
      const updatedReorder = await reorderApi.updateReorderStatus(reorderId, status, notes)
      setReorders(prev => prev.map(reorder => 
        reorder.id === reorderId ? updatedReorder : reorder
      ))
      return updatedReorder
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update reorder status')
    }
  }, [])

  const approveReorder = useCallback(async (reorderId: string, notes?: string) => {
    try {
      const updatedReorder = await reorderApi.approveReorder(reorderId, notes)
      setReorders(prev => prev.map(reorder => 
        reorder.id === reorderId ? updatedReorder : reorder
      ))
      return updatedReorder
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to approve reorder')
    }
  }, [])

  const markReceived = useCallback(async (
    reorderId: string, 
    receivedQuantity: number, 
    notes?: string
  ) => {
    try {
      const updatedReorder = await reorderApi.markReceived(reorderId, receivedQuantity, notes)
      setReorders(prev => prev.map(reorder => 
        reorder.id === reorderId ? updatedReorder : reorder
      ))
      return updatedReorder
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to mark reorder as received')
    }
  }, [])

  const cancelReorder = useCallback(async (reorderId: string, reason?: string) => {
    try {
      const updatedReorder = await reorderApi.cancelReorder(reorderId, reason)
      setReorders(prev => prev.map(reorder => 
        reorder.id === reorderId ? updatedReorder : reorder
      ))
      return updatedReorder
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to cancel reorder')
    }
  }, [])

  useEffect(() => {
    fetchReorders()
  }, [fetchReorders])

  return {
    reorders,
    loading,
    error,
    refresh: fetchReorders,
    createReorder,
    updateReorderStatus,
    approveReorder,
    markReceived,
    cancelReorder
  }
}

// Hook for usage tracking
export const useUsageTracking = () => {
  const [usageHistory, setUsageHistory] = useState<IngredientUsage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsageHistory = useCallback(async (
    startDate?: string, 
    endDate?: string, 
    itemId?: string
  ) => {
    try {
      setLoading(true)
      setError(null)
      const data = await usageApi.getUsageHistory(startDate, endDate, itemId)
      setUsageHistory(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch usage history')
    } finally {
      setLoading(false)
    }
  }, [])

  const recordUsage = useCallback(async (data: RecordUsageRequest) => {
    try {
      const newUsage = await usageApi.recordUsage(data)
      setUsageHistory(prev => [newUsage, ...prev])
      return newUsage
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to record usage')
    }
  }, [])

  useEffect(() => {
    fetchUsageHistory()
  }, [fetchUsageHistory])

  return {
    usageHistory,
    loading,
    error,
    refresh: fetchUsageHistory,
    recordUsage,
    fetchUsageHistory
  }
}

// Hook for inventory statistics
export const useInventoryStats = () => {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const [overview, valueByCategory, expiringItems] = await Promise.all([
        inventoryStatsApi.getOverviewStats(),
        inventoryStatsApi.getValueByCategory(),
        inventoryStatsApi.getExpiringItems(7)
      ])
      
      setStats({
        overview,
        valueByCategory,
        expiringItems
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch inventory stats')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    refresh: fetchStats
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
      reorders.refresh(),
      usageTracking.refresh(),
      stats.refresh()
    ])
  }, [
    inventoryItems.refresh,
    lowStockItems.refresh,
    reorders.refresh,
    usageTracking.refresh,
    stats.refresh
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