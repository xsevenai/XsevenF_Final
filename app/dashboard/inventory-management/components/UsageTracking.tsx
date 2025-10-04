// app/dashboard/inventory-management/components/UsageTracking.tsx

"use client"

import React, { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { useTheme } from "@/hooks/useTheme"
import { 
  ArrowLeft,
  TrendingDown, 
  BarChart3, 
  Calendar,
  DollarSign,
  Package,
  AlertTriangle,
  RefreshCw,
  Loader2
} from "lucide-react"
import type { UsageTracking as UsageData, ExtendedInventoryItem } from '@/app/api/inventory/route'

interface UsageTrackingProps {
  usageHistory: UsageData[]
  loading: boolean
  error: string | null
  onRefresh: () => void
  onChangePeriod: (period: '7d' | '30d' | '90d') => void
  currentPeriod: '7d' | '30d' | '90d'
  inventoryItems: ExtendedInventoryItem[]
  onBack: () => void
}

export default function UsageTracking({
  usageHistory,
  loading,
  error,
  onRefresh,
  onChangePeriod,
  currentPeriod,
  inventoryItems,
  onBack
}: UsageTrackingProps) {
  const [mounted, setMounted] = useState(false)
  const { theme, isLoaded: themeLoaded, isDark, currentTheme } = useTheme()

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
  const innerCardBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'
  const tableRowHover = isDark ? 'hover:bg-[#1f1f1f]' : 'hover:bg-gray-50'
  const tableHeaderBg = isDark ? 'bg-[#1f1f1f]' : 'bg-gray-50'

  const periodLabels = {
    '7d': 'Last 7 Days',
    '30d': 'Last 30 Days',
    '90d': 'Last 90 Days'
  }

  const totalSold = usageHistory.reduce((sum, item) => sum + item.total_sold, 0)
  const totalRevenue = usageHistory.reduce((sum, item) => sum + item.total_revenue, 0)
  const averagePerItem = usageHistory.length > 0 ? totalRevenue / usageHistory.length : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={`flex items-center gap-3 ${textSecondary}`}>
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading usage data...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className={`text-lg font-medium ${textPrimary} mb-2`}>Error Loading Usage Data</h3>
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
            <h1 className={`text-4xl font-bold ${textPrimary} mb-2`}>Usage Tracking</h1>
            <p className={`${textSecondary}`}>Track ingredient consumption and usage patterns</p>
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          {(['7d', '30d', '90d'] as const).map((period) => (
            <button
              key={period}
              onClick={() => onChangePeriod(period)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                currentPeriod === period
                  ? `${isDark ? 'bg-[#2a2a2a] border-[#3a3a3a]' : 'bg-gray-100 border-gray-300'} ${textPrimary} shadow-lg scale-105`
                  : `${innerCardBg} border ${textSecondary} hover:shadow-md hover:scale-105`
              }`}
            >
              {periodLabels[period]}
            </button>
          ))}
          <button
            onClick={onRefresh}
            className={`p-3 ${textSecondary} ${buttonHoverBg} rounded-xl transition-all duration-200 hover:scale-110`}
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`${cardBg} border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`} style={{ borderRadius: '2.5rem' }}>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-blue-500 font-semibold mb-2">Total Items Sold</h3>
                <div className={`text-2xl font-bold ${textPrimary}`}>{totalSold}</div>
                <p className={`${textSecondary} text-sm mt-1`}>{periodLabels[currentPeriod]}</p>
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
                <h3 className="text-green-500 font-semibold mb-2">Total Revenue</h3>
                <div className={`text-2xl font-bold ${textPrimary}`}>${totalRevenue.toFixed(2)}</div>
                <p className={`${textSecondary} text-sm mt-1`}>{periodLabels[currentPeriod]}</p>
              </div>
              <div className={`p-3 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-2xl`}>
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </div>
        </div>
        
        <div className={`${cardBg} border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`} style={{ borderRadius: '1rem' }}>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-purple-500 font-semibold mb-2">Items Tracked</h3>
                <div className={`text-2xl font-bold ${textPrimary}`}>{usageHistory.length}</div>
                <p className={`${textSecondary} text-sm mt-1`}>Different items</p>
              </div>
              <div className={`p-3 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-2xl`}>
                <BarChart3 className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </div>
        </div>

        <div className={`${cardBg} border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`} style={{ borderRadius: '2rem' }}>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-orange-500 font-semibold mb-2">Avg Revenue/Item</h3>
                <div className={`text-2xl font-bold ${textPrimary}`}>${averagePerItem.toFixed(2)}</div>
                <p className={`${textSecondary} text-sm mt-1`}>Per item average</p>
              </div>
              <div className={`p-3 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-2xl`}>
                <TrendingDown className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Data Table */}
      <div className={`${cardBg} border shadow-lg overflow-hidden`} style={{ borderRadius: '1.5rem' }}>
        <div className="p-6 border-b border-current border-opacity-10">
          <h3 className={`text-xl font-semibold ${textPrimary}`}>Usage Details - {periodLabels[currentPeriod]}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${tableHeaderBg}`}>
              <tr>
                <th className={`text-left p-4 ${textPrimary} font-semibold`}>Rank</th>
                <th className={`text-left p-4 ${textPrimary} font-semibold`}>Item</th>
                <th className={`text-left p-4 ${textPrimary} font-semibold`}>Units Sold</th>
                <th className={`text-left p-4 ${textPrimary} font-semibold`}>Revenue</th>
                <th className={`text-left p-4 ${textPrimary} font-semibold`}>Avg per Unit</th>
                <th className={`text-left p-4 ${textPrimary} font-semibold`}>Period</th>
              </tr>
            </thead>
            <tbody>
              {usageHistory.length === 0 ? (
                <tr>
                  <td colSpan={6} className={`text-center py-8 ${textSecondary}`}>
                    <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No usage data available for {periodLabels[currentPeriod].toLowerCase()}</p>
                    <p className="text-sm mt-1">Sales data will appear here once orders are completed</p>
                  </td>
                </tr>
              ) : (
                usageHistory.map((usage, index) => (
                  <tr key={usage.item_id} className={`border-t border-current border-opacity-10 ${tableRowHover} transition-colors`}>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-yellow-500 text-black' :
                          index === 1 ? 'bg-gray-500 text-white' :
                          index === 2 ? 'bg-orange-500 text-black' :
                          'bg-blue-500/20 text-blue-500'
                        }`}>
                          {index + 1}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className={`${textPrimary} font-medium`}>{usage.item_name}</p>
                        <p className={`${textSecondary} text-sm`}>ID: {usage.item_id}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-blue-500" />
                        <span className={`${textPrimary} font-medium`}>{usage.total_sold} units</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-green-500 font-semibold">${usage.total_revenue.toFixed(2)}</span>
                    </td>
                    <td className="p-4">
                      <span className={`${textPrimary}`}>
                        ${usage.total_sold > 0 ? (usage.total_revenue / usage.total_sold).toFixed(2) : '0.00'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`${textPrimary}`}>{usage.period}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Performers */}
      {usageHistory.length > 0 && (
        <div className={`${cardBg} border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
          <div className="p-6">
            <h3 className={`text-xl font-semibold ${textPrimary} mb-4`}>Top Performing Items - {periodLabels[currentPeriod]}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {usageHistory.slice(0, 6).map((item, index) => (
                <div key={item.item_id} className={`${innerCardBg} border rounded-xl p-4 ${tableRowHover} transition-all duration-200 hover:scale-[1.02]`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      index === 0 ? 'bg-yellow-500/20 text-yellow-500' :
                      index === 1 ? 'bg-gray-500/20 text-gray-500' :
                      index === 2 ? 'bg-orange-500/20 text-orange-500' :
                      'bg-blue-500/20 text-blue-500'
                    }`}>
                      #{index + 1}
                    </span>
                    <span className="text-green-500 font-semibold">${item.total_revenue.toFixed(2)}</span>
                  </div>
                  <h4 className={`${textPrimary} font-medium mb-1`}>{item.item_name}</h4>
                  <div className="flex justify-between text-sm">
                    <span className={`${textSecondary}`}>{item.total_sold} units sold</span>
                    <span className={`${textSecondary}`}>
                      ${item.total_sold > 0 ? (item.total_revenue / item.total_sold).toFixed(2) : '0.00'}/unit
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Usage Insights */}
      {usageHistory.length > 0 && (
        <div className={`${cardBg} border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
          <div className="p-6">
            <h3 className={`text-xl font-semibold ${textPrimary} mb-4`}>Usage Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className={`${textPrimary} font-medium mb-3`}>Performance Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className={`${textSecondary}`}>Best Seller:</span>
                    <span className={`${textPrimary}`}>{usageHistory[0]?.item_name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${textSecondary}`}>Top Revenue:</span>
                    <span className="text-green-500">${usageHistory[0]?.total_revenue.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${textSecondary}`}>Total Items Tracked:</span>
                    <span className={`${textPrimary}`}>{usageHistory.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${textSecondary}`}>Avg Units per Item:</span>
                    <span className={`${textPrimary}`}>
                      {usageHistory.length > 0 ? Math.round(totalSold / usageHistory.length) : 0}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className={`${textPrimary} font-medium mb-3`}>Period Analysis</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className={`${textSecondary}`}>Current Period:</span>
                    <span className={`${textPrimary}`}>{periodLabels[currentPeriod]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${textSecondary}`}>Daily Average:</span>
                    <span className={`${textPrimary}`}>
                      {Math.round(totalSold / (currentPeriod === '7d' ? 7 : currentPeriod === '30d' ? 30 : 90))} units
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${textSecondary}`}>Revenue/Day:</span>
                    <span className="text-green-500">
                      ${(totalRevenue / (currentPeriod === '7d' ? 7 : currentPeriod === '30d' ? 30 : 90)).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${textSecondary}`}>Avg per Unit:</span>
                    <span className={`${textPrimary}`}>
                      ${totalSold > 0 ? (totalRevenue / totalSold).toFixed(2) : '0.00'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}