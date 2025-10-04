// app/dashboard/inventory-management/components/InventoryOverview.tsx

"use client"

import React, { useEffect, useState } from 'react'
import { Card } from "@/components/ui/card"
import { useTheme } from "@/hooks/useTheme"
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
  RefreshCw,
  Loader2
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
  const [mounted, setMounted] = useState(false)
  const { theme, isLoaded: themeLoaded, isDark, currentTheme } = useTheme()

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
  const alertCardBg = isDark ? 'bg-red-900/20 border-red-500/30' : 'bg-red-50 border-red-200'
  const innerCardBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={`flex items-center gap-3 ${textSecondary}`}>
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading inventory overview...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className={`text-lg font-medium ${textPrimary} mb-2`}>Error Loading Overview</h3>
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

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`${cardBg} border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`} style={{ borderRadius: '2.5rem' }}>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-blue-500 font-semibold mb-2">Total Items</h3>
                <div className={`text-2xl font-bold ${textPrimary}`}>{metrics.totalItems}</div>
                <p className={`${textSecondary} text-sm mt-1`}>Active inventory items</p>
              </div>
              <div className={`p-3 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-2xl`}>
                <Package className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </div>
        </div>
        
        <div className={`${cardBg} border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`} style={{ borderRadius: '1.5rem' }}>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-green-500 font-semibold mb-2">In Stock</h3>
                <div className={`text-2xl font-bold ${textPrimary}`}>{metrics.inStockCount}</div>
                <p className={`${textSecondary} text-sm mt-1`}>Well stocked items</p>
              </div>
              <div className={`p-3 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-2xl`}>
                <Scale className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </div>
        </div>
        
        <div className={`${cardBg} border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`} style={{ borderRadius: '1rem' }}>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-yellow-500 font-semibold mb-2">Low Stock Alerts</h3>
                <div className={`text-2xl font-bold ${textPrimary}`}>{metrics.lowStockCount}</div>
                <p className={`${textSecondary} text-sm mt-1`}>Need attention</p>
              </div>
              <div className={`p-3 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-2xl`}>
                <AlertTriangle className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </div>
        </div>
        
        <div className={`${cardBg} border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`} style={{ borderRadius: '2rem' }}>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-red-500 font-semibold mb-2">Out of Stock</h3>
                <div className={`text-2xl font-bold ${textPrimary}`}>{metrics.outOfStockCount}</div>
                <p className={`${textSecondary} text-sm mt-1`}>Critical shortage</p>
              </div>
              <div className={`p-3 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-2xl`}>
                <TrendingDown className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Metrics */}
      {metrics.totalRevenue > 0 && (
        <div className={`${cardBg} border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-purple-500 font-semibold mb-2">Revenue from Tracked Usage</h3>
                <div className={`text-3xl font-bold ${textPrimary}`}>${metrics.totalRevenue.toFixed(2)}</div>
                <p className={`${textSecondary} text-sm mt-1`}>From recent sales period</p>
              </div>
              <div className={`p-3 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-2xl`}>
                <DollarSign className="h-8 w-8 text-purple-500" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className={`${cardBg} border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
        <div className="p-6">
          <h3 className={`text-xl font-semibold ${textPrimary} mb-4`}>Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              className={`${innerCardBg} border p-4 hover:shadow-md transition-all duration-300 cursor-pointer hover:scale-105 rounded-xl`}
              onClick={onViewItems}
            >
              <div className="flex items-center gap-3">
                <RefreshCw className="h-6 w-6 text-purple-500" />
                <div>
                  <h3 className={`${textPrimary} font-semibold`}>View All Items</h3>
                  <p className={`${textSecondary} text-sm`}>Manage inventory items</p>
                </div>
              </div>
            </div>
            
            <div 
              className={`${innerCardBg} border p-4 hover:shadow-md transition-all duration-300 cursor-pointer hover:scale-105 rounded-xl`}
              onClick={onViewLowStock}
            >
              <div className="flex items-center gap-3">
                <Package className="h-6 w-6 text-green-500" />
                <div>
                  <h3 className={`${textPrimary} font-semibold`}>Low Stock Alerts</h3>
                  <p className={`${textSecondary} text-sm`}>View critical items</p>
                </div>
              </div>
            </div>
            
            <div 
              className={`${innerCardBg} border p-4 hover:shadow-md transition-all duration-300 cursor-pointer hover:scale-105 rounded-xl`}
              onClick={onViewUsage}
            >
              <div className="flex items-center gap-3">
                <Download className="h-6 w-6 text-blue-500" />
                <div>
                  <h3 className={`${textPrimary} font-semibold`}>Usage Tracking</h3>
                  <p className={`${textSecondary} text-sm`}>View consumption data</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Low Stock Alert */}
      {metrics.lowStockCount > 0 && (
        <div className={`${alertCardBg} border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
          <div className="p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-red-500 mt-1" />
              <div className="flex-1">
                <h3 className="text-red-500 font-semibold mb-2">Low Stock Alert</h3>
                <p className={`${textPrimary} mb-4`}>
                  You have {metrics.lowStockCount} item(s) that are below their minimum threshold.
                </p>
                <div className="space-y-2">
                  {lowStockItems.slice(0, 3).map((item) => (
                    <div key={item.item_id} className={`flex justify-between items-center p-3 ${innerCardBg} border rounded-xl`}>
                      <span className={`${textPrimary} font-medium`}>{item.item_name}</span>
                      <span className="text-red-500 text-sm font-medium">
                        {item.current_stock}/{item.threshold} units
                      </span>
                    </div>
                  ))}
                  {lowStockItems.length > 3 && (
                    <p className={`${textSecondary} text-sm`}>
                      And {lowStockItems.length - 3} more items...
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Usage Items */}
      {usageHistory.length > 0 && (
        <div className={`${cardBg} border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-xl font-semibold ${textPrimary}`}>Top Selling Items</h3>
              <button 
                onClick={onRefresh}
                className={`text-sm ${textSecondary} hover:${textPrimary.replace('text-', 'text-')} transition-colors`}
              >
                View All Usage
              </button>
            </div>
            <div className="space-y-3">
              {usageHistory.slice(0, 5).map((usage) => (
                <div key={usage.item_id} className={`flex items-center justify-between p-4 ${innerCardBg} border rounded-xl hover:shadow-sm transition-all duration-200`}>
                  <div className="flex items-center gap-3">
                    <TrendingDown className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className={`${textPrimary} font-medium`}>{usage.item_name}</p>
                      <p className={`${textSecondary} text-sm`}>
                        Sold {usage.total_sold} units - ${usage.total_revenue.toFixed(2)} revenue
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-500 text-sm font-medium">{usage.total_sold} units</p>
                    <p className={`${textSecondary} text-xs`}>{usage.period} period</p>
                  </div>
                </div>
              ))}
              {usageHistory.length === 0 && (
                <div className="text-center py-6">
                  <div className={`${textSecondary} text-sm`}>No usage data available</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stock Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`${cardBg} border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
          <div className="p-6">
            <h3 className={`text-lg font-semibold ${textPrimary} mb-4`}>Stock Status Distribution</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className={`${textPrimary}`}>In Stock</span>
                </div>
                <span className={`${textPrimary} font-medium`}>{metrics.inStockCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className={`${textPrimary}`}>Low Stock</span>
                </div>
                <span className={`${textPrimary} font-medium`}>{metrics.lowStockCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className={`${textPrimary}`}>Out of Stock</span>
                </div>
                <span className={`${textPrimary} font-medium`}>{metrics.outOfStockCount}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={`${cardBg} border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
          <div className="p-6">
            <h3 className={`text-lg font-semibold ${textPrimary} mb-4`}>Recent Activity Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`${textPrimary}`}>Total Sales</span>
                <span className={`${textPrimary} font-medium`}>
                  {usageHistory.reduce((sum, item) => sum + item.total_sold, 0)} units
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`${textPrimary}`}>Revenue Generated</span>
                <span className={`${textPrimary} font-medium`}>
                  ${metrics.totalRevenue.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`${textPrimary}`}>Items Tracked</span>
                <span className={`${textPrimary} font-medium`}>{usageHistory.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}