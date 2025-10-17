// app/dashboard/inventory-management/components/LowStockAlerts.tsx

"use client"

import React, { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { useTheme } from "@/hooks/useTheme"
import { 
  AlertTriangle, 
  Package, 
  RefreshCw, 
  Plus, 
  Clock,
  TrendingDown,
  Truck,
  ArrowLeft,
  Loader2
} from "lucide-react"
import type { InventoryItemWithMetrics } from '@/src/api/generated/models/InventoryItemWithMetrics'
import type { StockAlertCreate } from '@/src/api/generated/models/StockAlertCreate'
import { AlertType } from '@/src/api/generated/models/AlertType'

interface LowStockAlertsProps {
  lowStockItems: InventoryItemWithMetrics[]
  activeAlerts: any[]
  loading: boolean
  error: string | null
  onRefresh: () => void
  onCreateStockAlert: (alertData: StockAlertCreate) => Promise<any>
  onBack: () => void
}

export default function LowStockAlerts({
  lowStockItems,
  activeAlerts,
  loading,
  error,
  onRefresh,
  onCreateStockAlert,
  onBack
}: LowStockAlertsProps) {
  const [creatingReorder, setCreatingReorder] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const { theme, isLoaded: themeLoaded, isDark, currentTheme } = useTheme()

  // Group items by urgency - moved before early returns to avoid hooks order issues
  const groupedItems = React.useMemo(() => {
    const groups = {
      high: lowStockItems.filter(item => item.needs_reorder && parseFloat(item.current_stock || '0') <= parseFloat(item.min_stock || '0') * 0.5),
      medium: lowStockItems.filter(item => item.needs_reorder && parseFloat(item.current_stock || '0') > parseFloat(item.min_stock || '0') * 0.5),
      low: lowStockItems.filter(item => !item.needs_reorder)
    }
    return groups
  }, [lowStockItems])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!themeLoaded || !mounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  // Theme-based styling variables
  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const buttonHoverBg = isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-100'

  const getUrgencyColor = (urgency: string) => {
    if (isDark) {
      switch (urgency) {
        case 'high': return 'border-red-500/30 bg-red-900/20'
        case 'medium': return 'border-yellow-500/30 bg-yellow-900/20'
        case 'low': return 'border-orange-500/30 bg-orange-900/20'
        default: return 'border-gray-500/30 bg-gray-900/20'
      }
    } else {
      switch (urgency) {
        case 'high': return 'border-red-300/50 bg-red-50'
        case 'medium': return 'border-yellow-300/50 bg-yellow-50'
        case 'low': return 'border-orange-300/50 bg-orange-50'
        default: return 'border-gray-300/50 bg-gray-50'
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'out-of-stock': return 'bg-red-500/20 text-red-500 border-red-500/30'
      case 'low-stock': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500/30'
    }
  }

  const handleCreateStockAlert = async (item: InventoryItemWithMetrics) => {
    try {
      setCreatingReorder(item.id)
      
      const alertData: StockAlertCreate = {
        inventory_item_id: item.id,
        alert_type: AlertType.LOW_STOCK,
        threshold: parseFloat(item.min_stock || '0'),
        is_active: true,
        business_id: typeof window !== "undefined" ? localStorage.getItem("businessId") || "" : ""
      }
      
      await onCreateStockAlert(alertData)
      
      // Refresh to get updated data
      onRefresh()
    } catch (error) {
      console.error('Error creating stock alert:', error)
      alert('Failed to create stock alert')
    } finally {
      setCreatingReorder(null)
    }
  }

  const createBulkStockAlerts = async () => {
    try {
      const highPriorityItems = groupedItems.high
      if (highPriorityItems.length === 0) return

      for (const item of highPriorityItems) {
        const alertData: StockAlertCreate = {
          inventory_item_id: item.id,
          alert_type: AlertType.LOW_STOCK,
          threshold: parseFloat(item.min_stock || '0'),
          is_active: true,
          business_id: typeof window !== "undefined" ? localStorage.getItem("businessId") || "" : ""
        }
        await onCreateStockAlert(alertData)
      }
      
      onRefresh()
    } catch (error) {
      console.error('Error creating bulk stock alerts:', error)
      alert('Failed to create bulk stock alerts')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={`flex items-center gap-3 ${textSecondary}`}>
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading low stock alerts...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className={`text-lg font-medium ${textPrimary} mb-2`}>Error Loading Low Stock Items</h3>
        <p className={`${textSecondary} mb-4`}>{error}</p>
        <button
          onClick={onRefresh}
          className={`px-6 py-3 ${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535] border-[#3a3a3a]' : 'bg-gray-100 hover:bg-gray-200 border-gray-300'} ${textPrimary} rounded-xl font-medium transition-all duration-300 border shadow-lg hover:shadow-xl hover:scale-105`}
        >
          Try Again
        </button>
      </div>
    )
  }

  if (lowStockItems.length === 0) {
    return (
      <div className="space-y-6">
        <div className={`${cardBg} p-8 border shadow-lg relative overflow-hidden`} style={{ borderRadius: '1.5rem' }}>
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className={`${textSecondary} ${buttonHoverBg} p-2 rounded-xl transition-all duration-200 hover:scale-110`}
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className={`text-4xl font-bold ${textPrimary} mb-2`}>Low Stock & Critical Alerts</h1>
              <p className={`${textSecondary}`}>Items that need immediate attention</p>
            </div>
          </div>
        </div>
        
        <div className={`${cardBg} border shadow-lg text-center py-12`} style={{ borderRadius: '1.5rem' }}>
          <Package className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className={`text-lg font-medium ${textPrimary} mb-2`}>All Stock Levels Good!</h3>
          <p className={`${textSecondary}`}>No items are currently low on stock.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`${cardBg} p-8 border shadow-lg relative overflow-hidden`} style={{ borderRadius: '1.5rem' }}>
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className={`${textSecondary} ${buttonHoverBg} p-2 rounded-xl transition-all duration-200 hover:scale-110`}
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className={`text-4xl font-bold ${textPrimary} mb-2`}>Low Stock & Critical Alerts</h1>
            <p className={`${textSecondary}`}>Items that need immediate attention</p>
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          {groupedItems.high.length > 0 && (
            <button
              onClick={createBulkStockAlerts}
              className={`px-6 py-3 ${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535] border-[#3a3a3a]' : 'bg-gray-100 hover:bg-gray-200 border-gray-300'} ${textPrimary} rounded-xl font-medium transition-all duration-300 border shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2`}
            >
              <AlertTriangle className="h-4 w-4" />
              Create Bulk Alerts
            </button>
          )}
          <button
            onClick={onRefresh}
            className={`p-3 ${textSecondary} ${buttonHoverBg} rounded-xl transition-all duration-200 hover:scale-110`}
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`${cardBg} border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`} style={{ borderRadius: '2.5rem' }}>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-red-500 font-semibold mb-2">High Priority</h4>
                <div className={`text-2xl font-bold ${textPrimary}`}>{groupedItems.high.length}</div>
              </div>
              <div className={`p-3 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-2xl`}>
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </div>
        </div>
        
        <div className={`${cardBg} border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`} style={{ borderRadius: '1.5rem' }}>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-yellow-500 font-semibold mb-2">Medium Priority</h4>
                <div className={`text-2xl font-bold ${textPrimary}`}>{groupedItems.medium.length}</div>
              </div>
              <div className={`p-3 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-2xl`}>
                <Clock className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </div>
        </div>
        
        <div className={`${cardBg} border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`} style={{ borderRadius: '1rem' }}>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-orange-500 font-semibold mb-2">Low Priority</h4>
                <div className={`text-2xl font-bold ${textPrimary}`}>{groupedItems.low.length}</div>
              </div>
              <div className={`p-3 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-2xl`}>
                <TrendingDown className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Items Table */}
      <div className={`${cardBg} border transition-colors duration-300 overflow-hidden`} style={{ borderTopLeftRadius: "1.5rem", borderTopRightRadius: "1.5rem" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Table Header */}
            <thead>
              <tr className={`${isDark ? "border-b border-[#2a2a2a]" : "border-b border-gray-200"}`}>
                <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                  Item Name
                </th>
                <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                  Category
                </th>
                <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                  Current Stock
                </th>
                <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                  Min Required
                </th>
                <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                  Priority
                </th>
                <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                  Status
                </th>
                <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                  Supplier
                </th>
                <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                  Actions
                </th>
              </tr>
            </thead>
            
            {/* Table Body */}
            <tbody>
              {lowStockItems.map((item) => {
                const currentStock = parseFloat(item.current_stock || '0')
                const minStock = parseFloat(item.min_stock || '0')
                const isOutOfStock = currentStock === 0
                const isLowStock = currentStock <= minStock
                const priority = isOutOfStock ? 'high' : currentStock <= minStock * 0.5 ? 'high' : 'medium'
                
                return (
                  <tr 
                    key={item.id}
                    className={`${isDark ? "border-b border-[#2a2a2a] hover:bg-[#1f1f1f]" : "border-b border-gray-200 hover:bg-gray-50"} transition-colors duration-200`}
                  >
                    {/* Item Name */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-full flex items-center justify-center`}>
                          <Package className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <div className={`${textPrimary} font-semibold text-sm`}>{item.name}</div>
                          <div className={`${textSecondary} text-xs`}>
                            {item.description ? item.description.substring(0, 30) + '...' : 'No description'}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    {/* Category */}
                    <td className="py-4 px-6">
                      <div className={`${textPrimary} text-sm`}>
                        {item.category || 'Uncategorized'}
                      </div>
                    </td>
                    
                    {/* Current Stock */}
                    <td className="py-4 px-6">
                      <div className={`${textPrimary} text-sm font-medium ${
                        isOutOfStock ? 'text-red-500' : 
                        isLowStock ? 'text-yellow-500' : 'text-green-500'
                      }`}>
                        {item.current_stock} {item.unit}
                      </div>
                    </td>
                    
                    {/* Min Required */}
                    <td className="py-4 px-6">
                      <div className={`${textSecondary} text-sm`}>
                        {item.min_stock} {item.unit}
                      </div>
                    </td>
                    
                    {/* Priority */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          priority === 'high' ? 'bg-red-500' : 
                          priority === 'medium' ? 'bg-yellow-500' : 'bg-orange-500'
                        }`}></div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            priority === 'high' 
                              ? isDark ? "bg-red-900 text-red-300" : "bg-red-100 text-red-800"
                              : priority === 'medium'
                              ? isDark ? "bg-yellow-900 text-yellow-300" : "bg-yellow-100 text-yellow-800"
                              : isDark ? "bg-orange-900 text-orange-300" : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {priority === 'high' ? 'High' : priority === 'medium' ? 'Medium' : 'Low'}
                        </span>
                      </div>
                    </td>
                    
                    {/* Status */}
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        isOutOfStock ? 'out-of-stock' : 'low-stock'
                      )}`}>
                        {isOutOfStock ? 'Out of Stock' : 'Low Stock'}
                      </span>
                    </td>
                    
                    {/* Supplier */}
                    <td className="py-4 px-6">
                      <div className={`${textSecondary} text-sm`}>
                        {item.supplier_id || 'No supplier'}
                      </div>
                    </td>
                    
                    {/* Actions */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCreateStockAlert(item)}
                          disabled={creatingReorder === item.id}
                          className={`${textSecondary} hover:text-blue-400 p-1 transition-colors duration-300 disabled:opacity-50`}
                          title="Create Stock Alert"
                        >
                          {creatingReorder === item.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        
        {/* Empty State */}
        {lowStockItems.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className={`text-lg font-medium ${textPrimary} mb-2`}>All Stock Levels Good!</h3>
            <p className={`${textSecondary} mb-4`}>No items are currently low on stock.</p>
          </div>
        )}
      </div>
    </div>
  )
}