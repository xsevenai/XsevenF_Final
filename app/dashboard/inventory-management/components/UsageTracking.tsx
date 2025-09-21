// app/dashboard/inventory-management/components/UsageTracking.tsx

"use client"

import React from 'react'
import { Card } from "@/components/ui/card"
import { 
  ArrowLeft,
  TrendingDown, 
  BarChart3, 
  Calendar,
  DollarSign,
  Package,
  AlertTriangle,
  RefreshCw
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">Error Loading Usage Data</h3>
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
              Usage Tracking
            </h2>
            <p className="text-gray-400">Track ingredient consumption and usage patterns</p>
          </div>
          <div className="flex gap-2">
            {(['7d', '30d', '90d'] as const).map((period) => (
              <button
                key={period}
                onClick={() => onChangePeriod(period)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPeriod === period
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white'
                }`}
              >
                {periodLabels[period]}
              </button>
            ))}
            <button
              onClick={onRefresh}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-blue-400 font-semibold mb-2">Total Items Sold</h3>
                <div className="text-2xl font-bold text-white">{totalSold}</div>
                <p className="text-gray-400 text-sm mt-1">{periodLabels[currentPeriod]}</p>
              </div>
              <Package className="h-8 w-8 text-blue-400" />
            </div>
          </Card>
          
          <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-green-400 font-semibold mb-2">Total Revenue</h3>
                <div className="text-2xl font-bold text-white">${totalRevenue.toFixed(2)}</div>
                <p className="text-gray-400 text-sm mt-1">{periodLabels[currentPeriod]}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </Card>
          
          <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-purple-400 font-semibold mb-2">Items Tracked</h3>
                <div className="text-2xl font-bold text-white">{usageHistory.length}</div>
                <p className="text-gray-400 text-sm mt-1">Different items</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-400" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-orange-400 font-semibold mb-2">Avg Revenue/Item</h3>
                <div className="text-2xl font-bold text-white">${averagePerItem.toFixed(2)}</div>
                <p className="text-gray-400 text-sm mt-1">Per item average</p>
              </div>
              <TrendingDown className="h-8 w-8 text-orange-400" />
            </div>
          </Card>
        </div>
      </div>

      {/* Usage Data Table */}
      <div className="px-6">
        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 overflow-hidden">
          <div className="p-6 border-b border-gray-700/50">
            <h3 className="text-lg font-semibold text-white">Usage Details - {periodLabels[currentPeriod]}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="text-left p-4 text-gray-300 font-semibold">Rank</th>
                  <th className="text-left p-4 text-gray-300 font-semibold">Item</th>
                  <th className="text-left p-4 text-gray-300 font-semibold">Units Sold</th>
                  <th className="text-left p-4 text-gray-300 font-semibold">Revenue</th>
                  <th className="text-left p-4 text-gray-300 font-semibold">Avg per Unit</th>
                  <th className="text-left p-4 text-gray-300 font-semibold">Period</th>
                </tr>
              </thead>
              <tbody>
                {usageHistory.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-400">
                      <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No usage data available for {periodLabels[currentPeriod].toLowerCase()}</p>
                      <p className="text-sm mt-1">Sales data will appear here once orders are completed</p>
                    </td>
                  </tr>
                ) : (
                  usageHistory.map((usage, index) => (
                    <tr key={usage.item_id} className="border-t border-gray-700/50 hover:bg-gray-800/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0 ? 'bg-yellow-400 text-black' :
                            index === 1 ? 'bg-gray-400 text-black' :
                            index === 2 ? 'bg-orange-400 text-black' :
                            'bg-blue-400/20 text-blue-400'
                          }`}>
                            {index + 1}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="text-white font-medium">{usage.item_name}</p>
                          <p className="text-gray-400 text-sm">ID: {usage.item_id}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 text-blue-400" />
                          <span className="text-white font-medium">{usage.total_sold} units</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-green-400 font-semibold">${usage.total_revenue.toFixed(2)}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-gray-300">
                          ${usage.total_sold > 0 ? (usage.total_revenue / usage.total_sold).toFixed(2) : '0.00'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-gray-300">{usage.period}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Top Performers */}
      {usageHistory.length > 0 && (
        <div className="px-6">
          <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Top Performing Items - {periodLabels[currentPeriod]}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {usageHistory.slice(0, 6).map((item, index) => (
                <div key={item.item_id} className="bg-gray-800/30 rounded-lg p-4 hover:bg-gray-700/30 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      index === 0 ? 'bg-yellow-400/20 text-yellow-400' :
                      index === 1 ? 'bg-gray-400/20 text-gray-400' :
                      index === 2 ? 'bg-orange-400/20 text-orange-400' :
                      'bg-blue-400/20 text-blue-400'
                    }`}>
                      #{index + 1}
                    </span>
                    <span className="text-green-400 font-semibold">${item.total_revenue.toFixed(2)}</span>
                  </div>
                  <h4 className="text-white font-medium mb-1">{item.item_name}</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{item.total_sold} units sold</span>
                    <span className="text-gray-400">
                      ${item.total_sold > 0 ? (item.total_revenue / item.total_sold).toFixed(2) : '0.00'}/unit
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Usage Insights */}
      {usageHistory.length > 0 && (
        <div className="px-6">
          <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Usage Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-medium mb-3">Performance Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Best Seller:</span>
                    <span className="text-white">{usageHistory[0]?.item_name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Top Revenue:</span>
                    <span className="text-green-400">${usageHistory[0]?.total_revenue.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Items Tracked:</span>
                    <span className="text-white">{usageHistory.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Avg Units per Item:</span>
                    <span className="text-white">
                      {usageHistory.length > 0 ? Math.round(totalSold / usageHistory.length) : 0}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-white font-medium mb-3">Period Analysis</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Current Period:</span>
                    <span className="text-white">{periodLabels[currentPeriod]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Daily Average:</span>
                    <span className="text-white">
                      {Math.round(totalSold / (currentPeriod === '7d' ? 7 : currentPeriod === '30d' ? 30 : 90))} units
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Revenue/Day:</span>
                    <span className="text-green-400">
                      ${(totalRevenue / (currentPeriod === '7d' ? 7 : currentPeriod === '30d' ? 30 : 90)).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Avg per Unit:</span>
                    <span className="text-white">
                      ${totalSold > 0 ? (totalRevenue / totalSold).toFixed(2) : '0.00'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}