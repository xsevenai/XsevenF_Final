// app/dashboard/inventory-management/components/InventoryOverview.tsx

"use client"

import React from 'react'
import { Card } from "@/components/ui/card"
import { 
  Package, 
  AlertTriangle, 
  TrendingDown, 
  Scale, 
  Plus, 
  Upload, 
  Download,
  DollarSign,
  Calendar,
  Clock,
  RefreshCw
} from "lucide-react"
import type { ExtendedInventoryItem, ExtendedLowStockItem, UsageTracking } from '@/app/api/inventory/route'

interface InventoryOverviewProps {
  stats: any
  loading: boolean
  error: string | null
  onRefresh: () => void
  inventoryItems: ExtendedInventoryItem[]
  lowStockItems: ExtendedLowStockItem[]
  usageHistory: UsageTracking[]
  onViewItems?: () => void
  onViewLowStock?: () => void
  onViewUsage?: () => void
}

export default function InventoryOverview({
  stats,
  loading,
  error,
  onRefresh,
  inventoryItems,
  lowStockItems,
  usageHistory,
  onViewItems,
  onViewLowStock,
  onViewUsage
}: InventoryOverviewProps) {
  // Calculate metrics from actual data
  const metrics = React.useMemo(() => {
    const totalItems = inventoryItems.length
    const lowStockCount = lowStockItems.length
    const outOfStockCount = inventoryItems.filter(item => item.is_out_of_stock).length
    const inStockCount = inventoryItems.filter(item => !item.is_low_stock && !item.is_out_of_stock).length
    
    // Calculate total value and revenue
    const totalValue = inventoryItems.reduce((sum, item) => {
      return sum + (item.current_stock * (item.cost_per_unit || 0))
    }, 0)
    
    const totalRevenue = usageHistory.reduce((sum, item) => sum + item.total_revenue, 0)
    
    // Find items expiring soon (if we had expiry data)
    const expiringItemsCount = 0 // Would be calculated from expiry_date
    
    return {
      totalItems,
      totalValue,
      lowStockCount,
      outOfStockCount,
      inStockCount,
      totalRevenue,
      expiringItemsCount
    }
  }, [inventoryItems, lowStockItems, usageHistory])

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
        <h3 className="text-lg font-medium text-white mb-2">Error Loading Overview</h3>
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

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-blue-400 font-semibold mb-2">Total Items</h3>
              <div className="text-2xl font-bold text-white">{metrics.totalItems}</div>
              <p className="text-gray-400 text-sm mt-1">Active inventory items</p>
            </div>
            <Package className="h-8 w-8 text-blue-400" />
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-green-400 font-semibold mb-2">In Stock</h3>
              <div className="text-2xl font-bold text-white">{metrics.inStockCount}</div>
              <p className="text-gray-400 text-sm mt-1">Well stocked items</p>
            </div>
            <Scale className="h-8 w-8 text-green-400" />
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-yellow-400 font-semibold mb-2">Low Stock Alerts</h3>
              <div className="text-2xl font-bold text-white">{metrics.lowStockCount}</div>
              <p className="text-gray-400 text-sm mt-1">Need attention</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-400" />
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-red-400 font-semibold mb-2">Out of Stock</h3>
              <div className="text-2xl font-bold text-white">{metrics.outOfStockCount}</div>
              <p className="text-gray-400 text-sm mt-1">Critical shortage</p>
            </div>
            <TrendingDown className="h-8 w-8 text-red-400" />
          </div>
        </Card>
      </div>

      {/* Revenue Metrics */}
      {metrics.totalRevenue > 0 && (
        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-purple-400 font-semibold mb-2">Revenue from Tracked Usage</h3>
              <div className="text-3xl font-bold text-white">${metrics.totalRevenue.toFixed(2)}</div>
              <p className="text-gray-400 text-sm mt-1">From recent sales period</p>
            </div>
            <DollarSign className="h-10 w-10 text-purple-400" />
          </div>
        </Card>
      )}

                {/* Quick Actions */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card 
            className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-4 hover:border-purple-500/30 transition-all duration-300 cursor-pointer"
            onClick={onViewItems}
          >
            <div className="flex items-center gap-3">
              <RefreshCw className="h-6 w-6 text-purple-400" />
              <div>
                <h3 className="text-white font-semibold">View All Items</h3>
                <p className="text-gray-400 text-sm">Manage inventory items</p>
              </div>
            </div>
          </Card>
          
          <Card 
            className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-4 hover:border-green-500/30 transition-all duration-300 cursor-pointer"
            onClick={onViewLowStock}
          >
            <div className="flex items-center gap-3">
              <Package className="h-6 w-6 text-green-400" />
              <div>
                <h3 className="text-white font-semibold">Low Stock Alerts</h3>
                <p className="text-gray-400 text-sm">View critical items</p>
              </div>
            </div>
          </Card>
          
          <Card 
            className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-4 hover:border-blue-500/30 transition-all duration-300 cursor-pointer"
            onClick={onViewUsage}
          >
            <div className="flex items-center gap-3">
              <Download className="h-6 w-6 text-blue-400" />
              <div>
                <h3 className="text-white font-semibold">Usage Tracking</h3>
                <p className="text-gray-400 text-sm">View consumption data</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Critical Low Stock Alert */}
      {metrics.lowStockCount > 0 && (
        <Card className="bg-gradient-to-br from-red-900/20 to-orange-900/20 border-red-500/30 p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-red-400 mt-1" />
            <div className="flex-1">
              <h3 className="text-red-400 font-semibold mb-2">Low Stock Alert</h3>
              <p className="text-gray-300 mb-4">
                You have {metrics.lowStockCount} item(s) that are below their minimum threshold.
              </p>
              <div className="space-y-2">
                {lowStockItems.slice(0, 3).map((item) => (
                  <div key={item.item_id} className="flex justify-between items-center p-2 bg-gray-800/30 rounded">
                    <span className="text-white">{item.item_name}</span>
                    <span className="text-red-400 text-sm">
                      {item.current_stock}/{item.threshold} units
                    </span>
                  </div>
                ))}
                {lowStockItems.length > 3 && (
                  <p className="text-gray-400 text-sm">
                    And {lowStockItems.length - 3} more items...
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Top Usage Items */}
      {usageHistory.length > 0 && (
        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">Top Selling Items</h3>
            <button 
              onClick={onRefresh}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              View All Usage
            </button>
          </div>
          <div className="space-y-3">
            {usageHistory.slice(0, 5).map((usage) => (
              <div key={usage.item_id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <TrendingDown className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-white font-medium">{usage.item_name}</p>
                    <p className="text-gray-400 text-sm">
                      Sold {usage.total_sold} units - ${usage.total_revenue.toFixed(2)} revenue
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-blue-400 text-sm font-medium">{usage.total_sold} units</p>
                  <p className="text-gray-500 text-xs">{usage.period} period</p>
                </div>
              </div>
            ))}
            {usageHistory.length === 0 && (
              <div className="text-center py-6">
                <div className="text-gray-400 text-sm">No usage data available</div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Stock Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Stock Status Distribution</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-300">In Stock</span>
              </div>
              <span className="text-white font-medium">{metrics.inStockCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-300">Low Stock</span>
              </div>
              <span className="text-white font-medium">{metrics.lowStockCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-300">Out of Stock</span>
              </div>
              <span className="text-white font-medium">{metrics.outOfStockCount}</span>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity Summary</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Total Sales</span>
              <span className="text-white font-medium">
                {usageHistory.reduce((sum, item) => sum + item.total_sold, 0)} units
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Revenue Generated</span>
              <span className="text-white font-medium">
                ${metrics.totalRevenue.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Items Tracked</span>
              <span className="text-white font-medium">{usageHistory.length}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}