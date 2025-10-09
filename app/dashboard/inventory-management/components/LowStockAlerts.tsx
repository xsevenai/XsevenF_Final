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

      {/* High Priority Items */}
      {groupedItems.high.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h4 className={`text-lg font-semibold ${textPrimary}`}>Critical - Immediate Action Required</h4>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {groupedItems.high.map((item, index) => (
              <div key={item.id} className={`${cardBg} border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] ${getUrgencyColor('high')}`}
                style={{ 
                  borderRadius: index % 2 === 0 ? '1.5rem' : '2rem'
                }}>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className={`${textPrimary} font-semibold text-lg`}>{item.name}</h4>
                      <p className={`${textSecondary} text-sm`}>{item.category}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      parseFloat(item.current_stock || '0') === 0 ? 'out-of-stock' : 'low-stock'
                    )}`}>
                      {parseFloat(item.current_stock || '0') === 0 ? 'Out of Stock' : 'Low Stock'}
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className={`${textSecondary}`}>Current Stock:</span>
                      <span className="text-red-500 font-bold">{item.current_stock} {item.unit}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className={`${textSecondary}`}>Minimum Required:</span>
                      <span className="text-yellow-500">{item.min_stock} {item.unit}</span>
                    </div>
                    {item.supplier_id && (
                      <div className="flex justify-between text-sm">
                        <span className={`${textSecondary}`}>Supplier:</span>
                        <span className={`${textPrimary}`}>{item.supplier_id}</span>
                      </div>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => handleCreateStockAlert(item)}
                    disabled={creatingReorder === item.id}
                    className={`w-full px-4 py-3 ${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535] border-[#3a3a3a]' : 'bg-gray-100 hover:bg-gray-200 border-gray-300'} ${textPrimary} rounded-xl font-medium transition-all duration-300 border shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50`}
                  >
                    {creatingReorder === item.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    {creatingReorder === item.id ? 'Creating...' : 'Create Stock Alert'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Medium Priority Items */}
      {groupedItems.medium.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-500" />
            <h4 className={`text-lg font-semibold ${textPrimary}`}>Medium Priority - Plan Reorder Soon</h4>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {groupedItems.medium.map((item, index) => (
              <div key={item.id} className={`${cardBg} border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] ${getUrgencyColor('medium')}`}
                style={{ 
                  borderRadius: index % 3 === 0 ? '1.5rem' : index % 3 === 1 ? '2rem' : '1rem'
                }}>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className={`${textPrimary} font-semibold`}>{item.name}</h4>
                      <p className={`${textSecondary} text-sm`}>{item.category}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor('low-stock')}`}>
                      Low Stock
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className={`${textSecondary}`}>Stock:</span>
                      <span className={`${textPrimary}`}>{item.current_stock}/{item.min_stock} {item.unit}</span>
                    </div>
                    {item.supplier_id && (
                      <div className="flex justify-between text-sm">
                        <span className={`${textSecondary}`}>Supplier:</span>
                        <span className={`${textPrimary} text-xs`}>{item.supplier_id}</span>
                      </div>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => handleCreateStockAlert(item)}
                    disabled={creatingReorder === item.id}
                    className={`w-full px-3 py-2 ${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535] border-[#3a3a3a]' : 'bg-gray-100 hover:bg-gray-200 border-gray-300'} ${textPrimary} rounded-xl font-medium transition-all duration-300 border shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 text-sm disabled:opacity-50`}
                  >
                    {creatingReorder === item.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Plus className="h-3 w-3" />
                    )}
                    {creatingReorder === item.id ? 'Creating...' : 'Create Alert'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Low Priority Items */}
      {groupedItems.low.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-orange-500" />
            <h4 className={`text-lg font-semibold ${textPrimary}`}>Low Priority - Monitor Closely</h4>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
            {groupedItems.low.map((item, index) => (
              <div key={item.id} className={`${cardBg} border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] ${getUrgencyColor('low')}`}
                style={{ 
                  borderRadius: index % 4 === 0 ? '1.5rem' : index % 4 === 1 ? '2rem' : index % 4 === 2 ? '1rem' : '2.5rem'
                }}>
                <div className="p-4">
                  <div className="mb-3">
                    <h4 className={`${textPrimary} font-semibold text-sm`}>{item.name}</h4>
                    <p className={`${textSecondary} text-xs`}>{item.category}</p>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-xs">
                      <span className={`${textSecondary}`}>Stock:</span>
                      <span className={`${textPrimary}`}>{item.current_stock}/{item.min_stock} {item.unit}</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleCreateStockAlert(item)}
                    disabled={creatingReorder === item.id}
                    className={`w-full px-2 py-1 ${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535] border-[#3a3a3a]' : 'bg-gray-100 hover:bg-gray-200 border-gray-300'} ${textPrimary} rounded-lg font-medium transition-all duration-300 border shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-1 text-xs disabled:opacity-50`}
                  >
                    {creatingReorder === item.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Plus className="h-3 w-3" />
                    )}
                    {creatingReorder === item.id ? 'Creating...' : 'Create Alert'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}