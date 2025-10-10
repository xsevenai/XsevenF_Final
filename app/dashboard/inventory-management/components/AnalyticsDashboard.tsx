// app/dashboard/inventory-management/components/AnalyticsDashboard.tsx

"use client"

import React, { useState, useEffect } from 'react'
import { 
  ArrowLeft, 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  Calendar,
  DollarSign,
  Package,
  AlertTriangle,
  Loader2,
  RefreshCw
} from "lucide-react"
import { useTheme } from "@/hooks/useTheme"

interface AnalyticsDashboardProps {
  stats: any
  loading: boolean
  error: string | null
  onRefresh: () => void
  onBack: () => void
}

export default function AnalyticsDashboard({
  stats,
  loading,
  error,
  onRefresh,
  onBack
}: AnalyticsDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
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

  const periods = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' }
  ]

  // Mock analytics data - in real implementation, this would come from the stats prop
  const analyticsData = {
    turnoverRate: 4.2,
    averageStockValue: 1250.50,
    topPerformingItems: [
      { name: 'Chicken Breast', value: 2450.00, change: 12.5 },
      { name: 'Rice', value: 1890.00, change: 8.3 },
      { name: 'Vegetables', value: 1650.00, change: -2.1 }
    ],
    categoryDistribution: [
      { name: 'Proteins', value: 35, color: 'bg-blue-500' },
      { name: 'Grains', value: 25, color: 'bg-green-500' },
      { name: 'Vegetables', value: 20, color: 'bg-yellow-500' },
      { name: 'Dairy', value: 15, color: 'bg-purple-500' },
      { name: 'Other', value: 5, color: 'bg-gray-500' }
    ],
    trends: {
      stockValue: { current: 12500, previous: 11800, change: 5.9 },
      turnover: { current: 4.2, previous: 3.8, change: 10.5 },
      waste: { current: 150, previous: 180, change: -16.7 }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={`flex items-center gap-3 ${textSecondary}`}>
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading analytics...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className={`text-lg font-medium ${textPrimary} mb-2`}>Error Loading Analytics</h3>
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
            <h1 className={`text-4xl font-bold ${textPrimary} mb-2`}>Inventory Analytics</h1>
            <p className={`${textSecondary}`}>Advanced insights and performance metrics</p>
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          {periods.map((period) => (
            <button
              key={period.value}
              onClick={() => setSelectedPeriod(period.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                selectedPeriod === period.value
                  ? `${isDark ? 'bg-[#2a2a2a] border-[#3a3a3a]' : 'bg-gray-100 border-gray-300'} ${textPrimary} shadow-lg scale-105`
                  : `${innerCardBg} border ${textSecondary} hover:shadow-md hover:scale-105`
              }`}
            >
              {period.label}
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`${cardBg} border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`} style={{ borderRadius: '2.5rem' }}>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-blue-500 font-semibold mb-2">Turnover Rate</h3>
                <div className={`text-2xl font-bold ${textPrimary}`}>{analyticsData.turnoverRate}x</div>
                <p className={`${textSecondary} text-sm mt-1`}>Inventory cycles</p>
              </div>
              <div className={`p-3 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-2xl`}>
                <TrendingUp className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </div>
        </div>
        
        <div className={`${cardBg} border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`} style={{ borderRadius: '1.5rem' }}>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-green-500 font-semibold mb-2">Avg Stock Value</h3>
                <div className={`text-2xl font-bold ${textPrimary}`}>${analyticsData.averageStockValue}</div>
                <p className={`${textSecondary} text-sm mt-1`}>Per item</p>
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
                <h3 className="text-purple-500 font-semibold mb-2">Total Value</h3>
                <div className={`text-2xl font-bold ${textPrimary}`}>${analyticsData.trends.stockValue.current.toLocaleString()}</div>
                <p className={`${textSecondary} text-sm mt-1`}>Inventory worth</p>
              </div>
              <div className={`p-3 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-2xl`}>
                <Package className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </div>
        </div>
        
        <div className={`${cardBg} border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`} style={{ borderRadius: '2rem' }}>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-orange-500 font-semibold mb-2">Waste Cost</h3>
                <div className={`text-2xl font-bold ${textPrimary}`}>${analyticsData.trends.waste.current}</div>
                <p className={`${textSecondary} text-sm mt-1`}>This month</p>
              </div>
              <div className={`p-3 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-2xl`}>
                <AlertTriangle className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trends */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`${cardBg} border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
          <div className="p-6">
            <h3 className={`text-lg font-semibold ${textPrimary} mb-4`}>Stock Value Trend</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={`${textSecondary}`}>Current:</span>
                <span className={`${textPrimary} font-medium`}>${analyticsData.trends.stockValue.current.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`${textSecondary}`}>Previous:</span>
                <span className={`${textPrimary} font-medium`}>${analyticsData.trends.stockValue.previous.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`${textSecondary}`}>Change:</span>
                <span className="text-green-500 font-medium">+{analyticsData.trends.stockValue.change}%</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`${cardBg} border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
          <div className="p-6">
            <h3 className={`text-lg font-semibold ${textPrimary} mb-4`}>Turnover Trend</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={`${textSecondary}`}>Current:</span>
                <span className={`${textPrimary} font-medium`}>{analyticsData.trends.turnover.current}x</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`${textSecondary}`}>Previous:</span>
                <span className={`${textPrimary} font-medium`}>{analyticsData.trends.turnover.previous}x</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`${textSecondary}`}>Change:</span>
                <span className="text-green-500 font-medium">+{analyticsData.trends.turnover.change}%</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`${cardBg} border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
          <div className="p-6">
            <h3 className={`text-lg font-semibold ${textPrimary} mb-4`}>Waste Trend</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={`${textSecondary}`}>Current:</span>
                <span className={`${textPrimary} font-medium`}>${analyticsData.trends.waste.current}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`${textSecondary}`}>Previous:</span>
                <span className={`${textPrimary} font-medium`}>${analyticsData.trends.waste.previous}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`${textSecondary}`}>Change:</span>
                <span className="text-green-500 font-medium">{analyticsData.trends.waste.change}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Items */}
      <div className={`${cardBg} border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
        <div className="p-6">
          <h3 className={`text-xl font-semibold ${textPrimary} mb-4`}>Top Performing Items</h3>
          <div className="space-y-4">
            {analyticsData.topPerformingItems.map((item, index) => (
              <div key={index} className={`${innerCardBg} border rounded-xl p-4`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-yellow-500 text-black' :
                      index === 1 ? 'bg-gray-500 text-white' :
                      index === 2 ? 'bg-orange-500 text-black' :
                      'bg-blue-500/20 text-blue-500'
                    }`}>
                      {index + 1}
                    </span>
                    <div>
                      <h4 className={`${textPrimary} font-semibold`}>{item.name}</h4>
                      <p className={`${textSecondary} text-sm`}>${item.value.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-medium ${
                      item.change > 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {item.change > 0 ? '+' : ''}{item.change}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Distribution */}
      <div className={`${cardBg} border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
        <div className="p-6">
          <h3 className={`text-xl font-semibold ${textPrimary} mb-4`}>Category Distribution</h3>
          <div className="space-y-4">
            {analyticsData.categoryDistribution.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className={`${textPrimary} font-medium`}>{category.name}</span>
                  <span className={`${textSecondary}`}>{category.value}%</span>
                </div>
                <div className={`w-full ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-full h-2`}>
                  <div
                    className={`h-2 rounded-full ${category.color}`}
                    style={{ width: `${category.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className={`${cardBg} border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
        <div className="p-6">
          <h3 className={`text-xl font-semibold ${textPrimary} mb-4`}>Key Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className={`${textPrimary} font-medium`}>Performance Highlights</h4>
              <ul className={`${textSecondary} text-sm space-y-1`}>
                <li>• Inventory turnover improved by 10.5%</li>
                <li>• Stock value increased by $700</li>
                <li>• Waste reduced by 16.7%</li>
                <li>• Top performer: Chicken Breast</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className={`${textPrimary} font-medium`}>Recommendations</h4>
              <ul className={`${textSecondary} text-sm space-y-1`}>
                <li>• Increase stock of high-performing items</li>
                <li>• Review pricing for low-turnover items</li>
                <li>• Implement waste reduction strategies</li>
                <li>• Consider seasonal adjustments</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
