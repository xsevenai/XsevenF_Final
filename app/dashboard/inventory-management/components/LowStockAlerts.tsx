// app/dashboard/inventory-management/components/LowStockAlerts.tsx

"use client"

import React, { useState } from 'react'
import { Card } from "@/components/ui/card"
import { 
  AlertTriangle, 
  Package, 
  RefreshCw, 
  Plus, 
  Clock,
  TrendingDown,
  Truck,
  ArrowLeft
} from "lucide-react"
import type { LowStockItem, CreateReorderRequest, ReorderRequest } from '@/lib/inventory-api'

interface LowStockAlertsProps {
  lowStockItems: LowStockItem[]
  loading: boolean
  error: string | null
  onRefresh: () => void
  onCreateReorder: (data: CreateReorderRequest) => Promise<ReorderRequest>
}

export default function LowStockAlerts({
  lowStockItems,
  loading,
  error,
  onRefresh,
  onCreateReorder,
  onBack
}: LowStockAlertsProps) {
  const [creatingReorder, setCreatingReorder] = useState<string | null>(null)

  // Group items by urgency
  const groupedItems = React.useMemo(() => {
    const groups = {
      high: lowStockItems.filter(item => item.urgency === 'high'),
      medium: lowStockItems.filter(item => item.urgency === 'medium'),
      low: lowStockItems.filter(item => item.urgency === 'low')
    }
    return groups
  }, [lowStockItems])

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'border-red-500/30 bg-red-900/20'
      case 'medium': return 'border-yellow-500/30 bg-yellow-900/20'
      case 'low': return 'border-orange-500/30 bg-orange-900/20'
      default: return 'border-gray-500/30 bg-gray-900/20'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'out-of-stock': return 'bg-red-400/10 text-red-400 border-red-400/20'
      case 'low-stock': return 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20'
      default: return 'bg-gray-400/10 text-gray-400 border-gray-400/20'
    }
  }

  const handleCreateReorder = async (item: LowStockItem) => {
    try {
      setCreatingReorder(item.id)
      
      // Calculate suggested reorder quantity (to reach max stock)
      const suggestedQuantity = Math.max(item.minStock * 2, 10) // At least double min stock or 10 units
      
      await onCreateReorder({
        itemId: item.id,
        requestedQuantity: suggestedQuantity,
        priority: item.urgency,
        notes: `Auto-generated reorder for ${item.status} item`
      })
      
      // Refresh to get updated data
      onRefresh()
    } catch (error) {
      console.error('Error creating reorder:', error)
      alert('Failed to create reorder request')
    } finally {
      setCreatingReorder(null)
    }
  }

  const createBulkReorder = async () => {
    try {
      const highPriorityItems = groupedItems.high
      if (highPriorityItems.length === 0) return

      for (const item of highPriorityItems) {
        const suggestedQuantity = Math.max(item.minStock * 2, 10)
        await onCreateReorder({
          itemId: item.id,
          requestedQuantity: suggestedQuantity,
          priority: 'high',
          notes: 'Bulk reorder for high priority low stock items'
        })
      }
      
      onRefresh()
    } catch (error) {
      console.error('Error creating bulk reorder:', error)
      alert('Failed to create bulk reorder requests')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">Error Loading Low Stock Items</h3>
        <p className="text-gray-400 mb-4">{error}</p>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (lowStockItems.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 text-green-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">All Stock Levels Good!</h3>
        <p className="text-gray-400">No items are currently low on stock.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg text-gray-300 hover:text-white transition-all duration-200 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Overview
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Low Stock & Critical Alerts
            </h2>
            <p className="text-gray-400">Items that need immediate attention</p>
          </div>
          <div className="flex gap-2">
            {groupedItems.high.length > 0 && (
              <button
                onClick={createBulkReorder}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 transition-all duration-200 flex items-center gap-2"
              >
                <Truck className="h-4 w-4" />
                Bulk Reorder High Priority
              </button>
            )}
            <button
              onClick={onRefresh}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Header with Actions */}
      <div className="px-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white">Low Stock & Critical Alerts</h3>
            <p className="text-gray-400">Items that need immediate attention</p>
          </div>
        <div className="flex gap-2">
          {groupedItems.high.length > 0 && (
            <button
              onClick={createBulkReorder}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 transition-all duration-200 flex items-center gap-2"
            >
              <Truck className="h-4 w-4" />
              Bulk Reorder High Priority
            </button>
          )}
          <button
            onClick={onRefresh}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-red-900/20 to-red-800/20 border-red-500/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-red-400 font-semibold">High Priority</h4>
              <div className="text-2xl font-bold text-white">{groupedItems.high.length}</div>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/20 border-yellow-500/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-yellow-400 font-semibold">Medium Priority</h4>
              <div className="text-2xl font-bold text-white">{groupedItems.medium.length}</div>
            </div>
            <Clock className="h-8 w-8 text-yellow-400" />
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-900/20 to-orange-800/20 border-orange-500/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-orange-400 font-semibold">Low Priority</h4>
              <div className="text-2xl font-bold text-white">{groupedItems.low.length}</div>
            </div>
            <TrendingDown className="h-8 w-8 text-orange-400" />
          </div>
        </Card>
      </div>

      {/* High Priority Items */}
      {groupedItems.high.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <h4 className="text-lg font-semibold text-white">Critical - Immediate Action Required</h4>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {groupedItems.high.map((item) => (
              <Card key={item.id} className={`p-6 ${getUrgencyColor(item.urgency)}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-white font-semibold text-lg">{item.name}</h4>
                    <p className="text-gray-400 text-sm">{item.category}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                    {item.status.replace('-', ' ')}
                  </span>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Current Stock:</span>
                    <span className="text-red-400 font-bold">{item.currentStock} {item.unit}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Minimum Required:</span>
                    <span className="text-yellow-400">{item.minStock} {item.unit}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Supplier:</span>
                    <span className="text-white">{item.supplier}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleCreateReorder(item)}
                  disabled={creatingReorder === item.id}
                  className="w-full px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {creatingReorder === item.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  {creatingReorder === item.id ? 'Creating...' : 'Create Reorder Request'}
                </button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Medium Priority Items */}
      {groupedItems.medium.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-400" />
            <h4 className="text-lg font-semibold text-white">Medium Priority - Plan Reorder Soon</h4>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {groupedItems.medium.map((item) => (
              <Card key={item.id} className={`p-4 ${getUrgencyColor(item.urgency)}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-white font-semibold">{item.name}</h4>
                    <p className="text-gray-400 text-sm">{item.category}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                    {item.status.replace('-', ' ')}
                  </span>
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Stock:</span>
                    <span className="text-white">{item.currentStock}/{item.minStock} {item.unit}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Supplier:</span>
                    <span className="text-white text-xs">{item.supplier}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleCreateReorder(item)}
                  disabled={creatingReorder === item.id}
                  className="w-full px-3 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-lg hover:from-yellow-700 hover:to-orange-700 transition-all duration-200 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                >
                  {creatingReorder === item.id ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                  ) : (
                    <Plus className="h-3 w-3" />
                  )}
                  {creatingReorder === item.id ? 'Creating...' : 'Reorder'}
                </button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Low Priority Items */}
      {groupedItems.low.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-orange-400" />
            <h4 className="text-lg font-semibold text-white">Low Priority - Monitor Closely</h4>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
            {groupedItems.low.map((item) => (
              <Card key={item.id} className={`p-4 ${getUrgencyColor(item.urgency)}`}>
                <div className="mb-3">
                  <h4 className="text-white font-semibold text-sm">{item.name}</h4>
                  <p className="text-gray-400 text-xs">{item.category}</p>
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Stock:</span>
                    <span className="text-white">{item.currentStock}/{item.minStock} {item.unit}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleCreateReorder(item)}
                  disabled={creatingReorder === item.id}
                  className="w-full px-2 py-1 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded text-xs hover:from-orange-700 hover:to-red-700 transition-all duration-200 flex items-center justify-center gap-1 disabled:opacity-50"
                >
                  {creatingReorder === item.id ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                  ) : (
                    <Plus className="h-3 w-3" />
                  )}
                  {creatingReorder === item.id ? 'Creating...' : 'Reorder'}
                </button>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}