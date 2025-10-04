// app/dashboard/order-component/OrderStatsComponent.tsx

"use client"

import { useState, useEffect } from "react"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingBag, 
  Clock, 
  CheckCircle,
  Calendar,
  BarChart3,
  PieChart,
  RefreshCw,
  Loader2
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { useOrderStats } from "@/hooks/use-orders"
import { useTheme } from "@/hooks/useTheme"

interface OrderStatsComponentProps {
  defaultDays?: number
}

export default function OrderStatsComponent({ defaultDays = 30 }: OrderStatsComponentProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(defaultDays)
  const [mounted, setMounted] = useState(false)
  const { stats, loading, error, refresh } = useOrderStats(selectedPeriod)
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
  const inputBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'
  const innerCardBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'
  const progressBg = isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'

  const periodOptions = [
    { value: 7, label: '7 Days' },
    { value: 30, label: '30 Days' },
    { value: 90, label: '90 Days' },
    { value: 365, label: '1 Year' }
  ]

  // Calculate trend indicators (mock calculation for demo)
  const getTrendDirection = (value: number) => {
    // This would typically compare with previous period
    // For now, using completion rate as indicator
    return stats?.completion_rate > 80 ? 'up' : stats?.completion_rate > 60 ? 'stable' : 'down'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const getStatusColor = (status: string) => {
    const colors = {
      'pending': 'bg-yellow-500',
      'confirmed': 'bg-blue-500',
      'preparing': 'bg-orange-500',
      'ready': 'bg-green-500',
      'completed': 'bg-emerald-500',
      'cancelled': 'bg-red-500'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-500'
  }

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className={`flex items-center gap-3 ${textSecondary}`}>
          <Clock className="h-6 w-6 animate-spin" />
          <span>Loading statistics...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className={`${cardBg} border border-red-500/20 shadow-lg p-8 text-center`} style={{ borderRadius: '1.5rem' }}>
          <p className="text-red-500 mb-4 font-medium">Failed to load statistics</p>
          <button
            onClick={refresh}
            className={`px-6 py-3 ${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535] border-[#3a3a3a]' : 'bg-gray-100 hover:bg-gray-200 border-gray-300'} ${textPrimary} rounded-xl font-medium transition-all duration-300 border shadow-lg hover:shadow-xl hover:scale-105`}
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`${cardBg} border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
        <div className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-4xl font-bold ${textPrimary} mb-2`}>Order Analytics</h2>
              <p className={`${textSecondary}`}>Insights and performance metrics for your orders</p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Period Selector */}
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(Number(e.target.value))}
                className={`${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none transition-all duration-200`}
              >
                {periodOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              {/* Refresh Button */}
              <button
                onClick={refresh}
                className={`flex items-center gap-2 px-6 py-3 ${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535] border-[#3a3a3a]' : 'bg-gray-100 hover:bg-gray-200 border-gray-300'} ${textPrimary} rounded-xl font-medium transition-all duration-300 border shadow-lg hover:shadow-xl hover:scale-105`}
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Orders */}
        <div className={`${cardBg} border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`} style={{ borderRadius: '2.5rem' }}>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textSecondary} text-sm font-medium`}>Total Orders</p>
                <p className={`text-3xl font-bold ${textPrimary} mt-1`}>{stats?.total_orders || 0}</p>
                <p className={`${textSecondary} text-xs mt-1`}>Last {selectedPeriod} days</p>
              </div>
              <div className={`p-3 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-2xl`}>
                <ShoppingBag className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className={`${cardBg} border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`} style={{ borderRadius: '1.5rem' }}>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textSecondary} text-sm font-medium`}>Total Revenue</p>
                <p className={`text-3xl font-bold ${textPrimary} mt-1`}>
                  {formatCurrency(stats?.total_revenue || 0)}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendDirection(stats?.total_revenue || 0) === 'up' ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <p className={`${textSecondary} text-xs`}>vs previous period</p>
                </div>
              </div>
              <div className={`p-3 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-2xl`}>
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Average Order Value */}
        <div className={`${cardBg} border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`} style={{ borderRadius: '1rem' }}>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textSecondary} text-sm font-medium`}>Avg Order Value</p>
                <p className={`text-3xl font-bold ${textPrimary} mt-1`}>
                  {formatCurrency(stats?.average_order_value || 0)}
                </p>
                <p className={`${textSecondary} text-xs mt-1`}>Per order</p>
              </div>
              <div className={`p-3 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-2xl`}>
                <BarChart3 className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Completion Rate */}
        <div className={`${cardBg} border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`} style={{ borderRadius: '2rem' }}>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textSecondary} text-sm font-medium`}>Completion Rate</p>
                <p className={`text-3xl font-bold ${textPrimary} mt-1`}>
                  {formatPercentage(stats?.completion_rate || 0)}
                </p>
                <p className={`${textSecondary} text-xs mt-1`}>
                  {stats?.completed_orders || 0} of {stats?.total_orders || 0} completed
                </p>
              </div>
              <div className={`p-3 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-2xl`}>
                <CheckCircle className="h-6 w-6 text-emerald-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Breakdown */}
        <div className={`${cardBg} border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <PieChart className="h-5 w-5 text-purple-500" />
              <h3 className={`text-xl font-semibold ${textPrimary}`}>Order Status Breakdown</h3>
            </div>
            
            <div className="space-y-4">
              {stats?.status_breakdown && Object.entries(stats.status_breakdown).map(([status, count]) => {
                const percentage = stats.total_orders > 0 ? (count / stats.total_orders) * 100 : 0
                
                return (
                  <div key={status} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`}></div>
                        <span className={`${textPrimary} capitalize`}>{getStatusLabel(status)}</span>
                      </div>
                      <div className="text-right">
                        <span className={`${textPrimary} font-medium`}>{count}</span>
                        <span className={`${textSecondary} text-sm ml-2`}>({percentage.toFixed(1)}%)</span>
                      </div>
                    </div>
                    <div className={`w-full ${progressBg} rounded-full h-2`}>
                      <div 
                        className={`h-2 rounded-full ${getStatusColor(status)}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
              
              {(!stats?.status_breakdown || Object.keys(stats.status_breakdown).length === 0) && (
                <p className={`${textSecondary} text-center py-8`}>No order data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Daily Orders Chart */}
        <div className={`${cardBg} border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="h-5 w-5 text-blue-500" />
              <h3 className={`text-xl font-semibold ${textPrimary}`}>Daily Order Volume</h3>
            </div>
            
            <div className="space-y-3">
              {stats?.daily_order_counts && Object.entries(stats.daily_order_counts)
                .sort(([a], [b]) => a.localeCompare(b))
                .slice(-7) // Show last 7 days
                .map(([date, count]) => {
                  const maxCount = Math.max(...Object.values(stats.daily_order_counts))
                  const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0
                  const formattedDate = new Date(date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })
                  
                  return (
                    <div key={date} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`${textPrimary} text-sm`}>{formattedDate}</span>
                        <span className={`${textPrimary} font-medium`}>{count} orders</span>
                      </div>
                      <div className={`w-full ${progressBg} rounded-full h-2`}>
                        <div 
                          className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
                
              {(!stats?.daily_order_counts || Object.keys(stats.daily_order_counts).length === 0) && (
                <p className={`${textSecondary} text-center py-8`}>No daily data available</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className={`${cardBg} border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
        <div className="p-6">
          <h3 className={`text-xl font-semibold ${textPrimary} mb-4`}>Key Insights</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500 mb-2">
                {((stats?.completed_orders || 0) / Math.max(selectedPeriod, 1)).toFixed(1)}
              </div>
              <p className={`${textSecondary} text-sm`}>Orders per day</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500 mb-2">
                ${((stats?.total_revenue || 0) / Math.max(selectedPeriod, 1)).toFixed(0)}
              </div>
              <p className={`${textSecondary} text-sm`}>Daily revenue</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500 mb-2">
                {stats?.status_breakdown?.['pending'] || 0}
              </div>
              <p className={`${textSecondary} text-sm`}>Pending orders</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}