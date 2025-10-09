// hooks/use-inventory.ts

'use client'

import { useState, useEffect, useCallback } from 'react'
import React from 'react'
import { FoodHospitalityInventoryService } from '@/src/api/generated/services/FoodHospitalityInventoryService'
import { configureAPI } from '@/lib/api-config'
import type { InventoryItem } from '@/src/api/generated/models/InventoryItem'
import type { InventoryItemCreate } from '@/src/api/generated/models/InventoryItemCreate'
import type { InventoryItemUpdate } from '@/src/api/generated/models/InventoryItemUpdate'
import type { InventoryItemWithMetrics } from '@/src/api/generated/models/InventoryItemWithMetrics'
import type { InventorySearch } from '@/src/api/generated/models/InventorySearch'
import type { StockAdjustment } from '@/src/api/generated/models/StockAdjustment'
import type { Supplier } from '@/src/api/generated/models/Supplier'
import type { SupplierCreate } from '@/src/api/generated/models/SupplierCreate'
import type { SupplierUpdate } from '@/src/api/generated/models/SupplierUpdate'
import type { PurchaseOrder } from '@/src/api/generated/models/PurchaseOrder'
import type { PurchaseOrderCreate } from '@/src/api/generated/models/PurchaseOrderCreate'
import type { PurchaseOrderUpdate } from '@/src/api/generated/models/PurchaseOrderUpdate'
import type { StockAlert } from '@/src/api/generated/models/StockAlert'
import type { StockAlertCreate } from '@/src/api/generated/models/StockAlertCreate'
import type { InventoryTransaction } from '@/src/api/generated/models/InventoryTransaction'

// Hook for inventory items management
export const useInventoryItems = (businessId: string) => {
  const [items, setItems] = useState<InventoryItemWithMetrics[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = useCallback(async (params?: {
    location_id?: string
    category?: string
    low_stock_only?: boolean
    limit?: number
    offset?: number
  }) => {
    try {
      setLoading(true)
      setError(null)
      configureAPI()
      
      const data = await FoodHospitalityInventoryService.listInventoryItemsApiV1FoodInventoryItemsGet(
        businessId,
        params?.location_id || null,
        params?.category || null,
        params?.low_stock_only || false,
        params?.limit || 50,
        params?.offset || 0
      )
      setItems(data)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch inventory items')
      console.error('Error fetching inventory items:', err)
    } finally {
      setLoading(false)
    }
  }, [businessId])

  const createItem = useCallback(async (data: InventoryItemCreate) => {
    try {
      setError(null)
      configureAPI()
      
      const newItem = await FoodHospitalityInventoryService.createInventoryItemApiV1FoodInventoryItemsPost(data)
      setItems(prev => [newItem, ...prev])
      return newItem
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create inventory item'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateItem = useCallback(async (itemId: string, data: InventoryItemUpdate) => {
    try {
      setError(null)
      configureAPI()
      
      const updatedItem = await FoodHospitalityInventoryService.updateInventoryItemApiV1FoodInventoryItemsItemIdPut(itemId, data)
      setItems(prev => prev.map(item => item.id === itemId ? updatedItem : item))
      return updatedItem
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update inventory item'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const deleteItem = useCallback(async (itemId: string) => {
    try {
      setError(null)
      configureAPI()
      
      await FoodHospitalityInventoryService.deleteInventoryItemApiV1FoodInventoryItemsItemIdDelete(itemId)
      setItems(prev => prev.filter(item => item.id !== itemId))
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete inventory item'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateStockQuantity = useCallback(async (itemId: string, stockQuantity: number, minThreshold?: number) => {
    const updateData: InventoryItemUpdate = { current_stock: stockQuantity }
    if (minThreshold !== undefined) {
      updateData.min_stock = minThreshold
    }
    return updateItem(itemId, updateData)
  }, [updateItem])

  const searchItems = useCallback(async (searchParams: InventorySearch) => {
    try {
      setLoading(true)
      setError(null)
      configureAPI()
      
      const data = await FoodHospitalityInventoryService.searchInventoryItemsApiV1FoodInventoryItemsSearchPost(searchParams)
      setItems(data)
      return data
    } catch (err: any) {
      setError(err.message || 'Failed to search inventory items')
      throw new Error(err.message || 'Failed to search inventory items')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (businessId) {
      fetchItems()
    }
  }, [businessId, fetchItems])

  return {
    items,
    loading,
    error,
    refresh: fetchItems,
    createItem,
    updateItem,
    deleteItem,
    updateStockQuantity,
    searchItems,
    fetchItems
  }
}

// Hook for low stock items and alerts
export const useLowStockItems = (businessId: string) => {
  const [lowStockItems, setLowStockItems] = useState<InventoryItemWithMetrics[]>([])
  const [activeAlerts, setActiveAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLowStockItems = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      configureAPI()
      
      // Fetch low stock items
      const lowStockData = await FoodHospitalityInventoryService.listInventoryItemsApiV1FoodInventoryItemsGet(
        businessId,
        null, // location_id
        null, // category
        true, // low_stock_only
        50,   // limit
        0     // offset
      )
      setLowStockItems(lowStockData)

      // Fetch active alerts
      const alertsData = await FoodHospitalityInventoryService.getActiveAlertsApiV1FoodInventoryAlertsActiveGet(businessId)
      setActiveAlerts(alertsData)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch low stock items')
      console.error('Error fetching low stock items:', err)
    } finally {
      setLoading(false)
    }
  }, [businessId])

  const createStockAlert = useCallback(async (alertData: StockAlertCreate) => {
    try {
      setError(null)
      configureAPI()
      
      const newAlert = await FoodHospitalityInventoryService.createStockAlertApiV1FoodInventoryAlertsPost(alertData)
      await fetchLowStockItems() // Refresh data
      return newAlert
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create stock alert'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [fetchLowStockItems])

  useEffect(() => {
    if (businessId) {
      fetchLowStockItems()
    }
  }, [businessId, fetchLowStockItems])

  return {
    lowStockItems,
    activeAlerts,
    loading,
    error,
    refresh: fetchLowStockItems,
    createStockAlert
  }
}

// Hook for stock adjustments
export const useStockAdjustments = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const adjustStock = useCallback(async (adjustment: StockAdjustment, performedBy?: string) => {
    try {
      setLoading(true)
      setError(null)
      configureAPI()
      
      const result = await FoodHospitalityInventoryService.adjustStockApiV1FoodInventoryAdjustmentsPost(adjustment, performedBy)
      return result
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to adjust stock'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const performStockCount = useCallback(async (businessId: string, locationId?: string, counts: any[] = []) => {
    try {
      setLoading(true)
      setError(null)
      configureAPI()
      
      const result = await FoodHospitalityInventoryService.performStockCountApiV1FoodInventoryCountPost(businessId, locationId, counts)
      return result
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to perform stock count'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    adjustStock,
    performStockCount,
    clearError: () => setError(null)
  }
}

// Hook for suppliers management
export const useSuppliers = (businessId: string) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSuppliers = useCallback(async (isActive?: boolean) => {
    try {
      setLoading(true)
      setError(null)
      configureAPI()
      
      const data = await FoodHospitalityInventoryService.listSuppliersApiV1FoodInventorySuppliersGet(businessId, isActive)
      setSuppliers(data)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch suppliers')
      console.error('Error fetching suppliers:', err)
    } finally {
      setLoading(false)
    }
  }, [businessId])

  const createSupplier = useCallback(async (data: SupplierCreate) => {
    try {
      setError(null)
      configureAPI()
      
      const newSupplier = await FoodHospitalityInventoryService.createSupplierApiV1FoodInventorySuppliersPost(data)
      setSuppliers(prev => [newSupplier, ...prev])
      return newSupplier
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create supplier'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateSupplier = useCallback(async (supplierId: string, data: SupplierUpdate) => {
    try {
      setError(null)
      configureAPI()
      
      const updatedSupplier = await FoodHospitalityInventoryService.updateSupplierApiV1FoodInventorySuppliersSupplierIdPut(supplierId, data)
      setSuppliers(prev => prev.map(supplier => supplier.id === supplierId ? updatedSupplier : supplier))
      return updatedSupplier
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update supplier'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const deleteSupplier = useCallback(async (supplierId: string) => {
    try {
      setError(null)
      configureAPI()
      
      await FoodHospitalityInventoryService.deleteSupplierApiV1FoodInventorySuppliersSupplierIdDelete(supplierId)
      setSuppliers(prev => prev.filter(supplier => supplier.id !== supplierId))
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete supplier'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  useEffect(() => {
    if (businessId) {
      fetchSuppliers()
    }
  }, [businessId, fetchSuppliers])

  return {
    suppliers,
    loading,
    error,
    refresh: fetchSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier
  }
}

// Hook for purchase orders management
export const usePurchaseOrders = (businessId: string) => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPurchaseOrders = useCallback(async (filters?: {
    supplier_id?: string
    status?: string
    start_date?: string
    end_date?: string
  }) => {
    try {
      setLoading(true)
      setError(null)
      configureAPI()
      
      const data = await FoodHospitalityInventoryService.listPurchaseOrdersApiV1FoodInventoryPurchaseOrdersGet(
        businessId,
        filters?.supplier_id,
        filters?.status,
        filters?.start_date,
        filters?.end_date
      )
      setPurchaseOrders(data)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch purchase orders')
      console.error('Error fetching purchase orders:', err)
    } finally {
      setLoading(false)
    }
  }, [businessId])

  const createPurchaseOrder = useCallback(async (data: PurchaseOrderCreate, createdBy?: string) => {
    try {
      setError(null)
      configureAPI()
      
      const newPO = await FoodHospitalityInventoryService.createPurchaseOrderApiV1FoodInventoryPurchaseOrdersPost(data, createdBy)
      setPurchaseOrders(prev => [newPO, ...prev])
      return newPO
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create purchase order'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updatePurchaseOrder = useCallback(async (poId: string, data: PurchaseOrderUpdate) => {
    try {
      setError(null)
      configureAPI()
      
      const updatedPO = await FoodHospitalityInventoryService.updatePurchaseOrderApiV1FoodInventoryPurchaseOrdersPoIdPut(poId, data)
      setPurchaseOrders(prev => prev.map(po => po.id === poId ? updatedPO : po))
      return updatedPO
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update purchase order'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const receivePurchaseOrder = useCallback(async (poId: string, receivedItems: any[]) => {
    try {
      setError(null)
      configureAPI()
      
      const result = await FoodHospitalityInventoryService.receivePurchaseOrderApiV1FoodInventoryPurchaseOrdersPoIdReceivePost(poId, receivedItems)
      await fetchPurchaseOrders() // Refresh data
      return result
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to receive purchase order'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [fetchPurchaseOrders])

  useEffect(() => {
    if (businessId) {
      fetchPurchaseOrders()
    }
  }, [businessId, fetchPurchaseOrders])

  return {
    purchaseOrders,
    loading,
    error,
    refresh: fetchPurchaseOrders,
    createPurchaseOrder,
    updatePurchaseOrder,
    receivePurchaseOrder
  }
}

// Hook for inventory transactions
export const useInventoryTransactions = (businessId: string) => {
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = useCallback(async (filters?: {
    inventory_item_id?: string
    transaction_type?: string
    start_date?: string
    end_date?: string
    limit?: number
    offset?: number
  }) => {
    try {
      setLoading(true)
      setError(null)
      configureAPI()
      
      const data = await FoodHospitalityInventoryService.listInventoryTransactionsApiV1FoodInventoryTransactionsGet(
        businessId,
        filters?.inventory_item_id,
        filters?.transaction_type,
        filters?.start_date,
        filters?.end_date,
        filters?.limit || 50,
        filters?.offset || 0
      )
      setTransactions(data)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch inventory transactions')
      console.error('Error fetching inventory transactions:', err)
    } finally {
      setLoading(false)
    }
  }, [businessId])

  useEffect(() => {
    if (businessId) {
      fetchTransactions()
    }
  }, [businessId, fetchTransactions])

  return {
    transactions,
    loading,
    error,
    refresh: fetchTransactions
  }
}

// Hook for inventory reports
export const useInventoryReports = (businessId: string) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getInventorySummary = useCallback(async (locationId?: string) => {
    try {
      setLoading(true)
      setError(null)
      configureAPI()
      
      const summary = await FoodHospitalityInventoryService.getInventorySummaryApiV1FoodInventoryReportsSummaryGet(businessId, locationId)
      return summary
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get inventory summary'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [businessId])

  const getInventoryValuation = useCallback(async (locationId?: string, asOfDate?: string) => {
    try {
      setLoading(true)
      setError(null)
      configureAPI()
      
      const valuation = await FoodHospitalityInventoryService.getInventoryValuationApiV1FoodInventoryReportsValuationGet(
        businessId,
        locationId,
        asOfDate
      )
      return valuation
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get inventory valuation'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [businessId])

  const getInventoryTurnover = useCallback(async (periodDays: number = 30) => {
    try {
      setLoading(true)
      setError(null)
      configureAPI()
      
      const turnover = await FoodHospitalityInventoryService.getInventoryTurnoverApiV1FoodInventoryReportsTurnoverGet(businessId, periodDays)
      return turnover
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get inventory turnover'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [businessId])

  const getWasteReport = useCallback(async (startDate: string, endDate: string) => {
    try {
      setLoading(true)
      setError(null)
      configureAPI()
      
      const wasteReport = await FoodHospitalityInventoryService.getWasteReportApiV1FoodInventoryReportsWasteGet(
        businessId,
        startDate,
        endDate
      )
      return wasteReport
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get waste report'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [businessId])

  return {
    loading,
    error,
    getInventorySummary,
    getInventoryValuation,
    getInventoryTurnover,
    getWasteReport,
    clearError: () => setError(null)
  }
}

// Hook for inventory statistics (computed from available data)
export const useInventoryStats = (businessId: string) => {
  const { items: inventoryItems, loading: itemsLoading } = useInventoryItems(businessId)
  const { lowStockItems, activeAlerts, loading: alertsLoading } = useLowStockItems(businessId)
  const { transactions, loading: transactionsLoading } = useInventoryTransactions(businessId)
  const { getInventorySummary, loading: reportsLoading } = useInventoryReports(businessId)

  const [summaryReport, setSummaryReport] = React.useState<any>(null)

  const stats = React.useMemo(() => {
    const totalItems = inventoryItems.length
    const lowStockCount = lowStockItems.length
    const outOfStockCount = inventoryItems.filter(item => 
      parseFloat(item.current_stock || '0') <= 0
    ).length
    const inStockCount = inventoryItems.filter(item => 
      parseFloat(item.current_stock || '0') > 0 && !item.needs_reorder
    ).length
    
    // Calculate total value from inventory items
    const totalValue = inventoryItems.reduce((sum, item) => {
      const currentStock = parseFloat(item.current_stock || '0')
      const unitCost = parseFloat(item.unit_cost || '0')
      return sum + (currentStock * unitCost)
    }, 0)

    // Recent transactions
    const recentTransactions = transactions.slice(0, 10)

    return {
      overview: {
        totalItems,
        totalValue,
        lowStockCount,
        outOfStockCount,
        inStockCount,
        activeAlerts: activeAlerts.length
      },
      lowStockItems,
      activeAlerts,
      recentTransactions,
      summaryReport
    }
  }, [inventoryItems, lowStockItems, activeAlerts, transactions, summaryReport])

  const refreshStats = React.useCallback(async () => {
    try {
      const summary = await getInventorySummary()
      setSummaryReport(summary)
    } catch (error) {
      console.error('Failed to fetch inventory summary:', error)
    }
  }, [getInventorySummary])

  React.useEffect(() => {
    if (businessId) {
      refreshStats()
    }
  }, [businessId, refreshStats])

  return {
    stats,
    loading: itemsLoading || alertsLoading || transactionsLoading || reportsLoading,
    error: null,
    refresh: refreshStats
  }
}

// Combined hook for complete inventory management
export const useInventoryManagement = (businessId: string) => {
  const inventoryItems = useInventoryItems(businessId)
  const lowStockItems = useLowStockItems(businessId)
  const stockAdjustments = useStockAdjustments()
  const suppliers = useSuppliers(businessId)
  const purchaseOrders = usePurchaseOrders(businessId)
  const transactions = useInventoryTransactions(businessId)
  const reports = useInventoryReports(businessId)
  const stats = useInventoryStats(businessId)

  const refreshAll = useCallback(async () => {
    await Promise.all([
      inventoryItems.refresh(),
      lowStockItems.refresh(),
      suppliers.refresh(),
      purchaseOrders.refresh(),
      transactions.refresh(),
      stats.refresh()
    ])
  }, [
    inventoryItems.refresh,
    lowStockItems.refresh,
    suppliers.refresh,
    purchaseOrders.refresh,
    transactions.refresh,
    stats.refresh
  ])

  return {
    // Core inventory management
    inventoryItems,
    lowStockItems,
    stockAdjustments,
    
    // Supplier and procurement
    suppliers,
    purchaseOrders,
    
    // Tracking and reporting
    transactions,
    reports,
    stats,
    
    // Combined operations
    refreshAll,
    
    // Loading and error states
    loading: inventoryItems.loading || lowStockItems.loading || suppliers.loading || purchaseOrders.loading || transactions.loading,
    error: inventoryItems.error || lowStockItems.error || suppliers.error || purchaseOrders.error || transactions.error
  }
}