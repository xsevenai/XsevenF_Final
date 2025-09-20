// app/dashboard/order-component/OrderStatsComponent.tsx

"use client"

import { useState } from "react"
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
  RefreshCw
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { useOrderStats } from "@/hooks/use-orders"

interface OrderStatsComponentProps {
  defaultDays?: number
}

export default function OrderStatsComponent({ defaultDays = 30 }: OrderStatsComponentProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(defaultDays)
  const { stats, loading, error, refresh } = useOrderStats(selectedPeriod)

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
        <div className="flex items-center gap-3 text-gray-400">
          <Clock className="h-6 w-6 animate-spin" />
          <span>Loading statistics...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-red-500/20 p-8 text-center">
          <p className="text-red-400 mb-4">Failed to load statistics</p>
          <button
            onClick={refresh}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Order Analytics
          </h2>
          <p className="text-gray-400">Insights and performance metrics for your orders</p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Period Selector */}
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(Number(e.target.value))}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
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
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Orders */}
        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Orders</p>
              <p className="text-3xl font-bold text-white mt-1">{stats?.total_orders || 0}</p>
              <p className="text-gray-400 text-xs mt-1">Last {selectedPeriod} days</p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </Card>

        {/* Total Revenue */}
        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold text-white mt-1">
                {formatCurrency(stats?.total_revenue || 0)}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {getTrendDirection(stats?.total_revenue || 0) === 'up' ? (
                  <TrendingUp className="h-3 w-3 text-green-400" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-400" />
                )}
                <p className="text-gray-400 text-xs">vs previous period</p>
              </div>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-400" />
            </div>
          </div>
        </Card>

        {/* Average Order Value */}
        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Avg Order Value</p>
              <p className="text-3xl font-bold text-white mt-1">
                {formatCurrency(stats?.average_order_value || 0)}
              </p>
              <p className="text-gray-400 text-xs mt-1">Per order</p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </Card>

        {/* Completion Rate */}
        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Completion Rate</p>
              <p className="text-3xl font-bold text-white mt-1">
                {formatPercentage(stats?.completion_rate || 0)}
              </p>
              <p className="text-gray-400 text-xs mt-1">
                {stats?.completed_orders || 0} of {stats?.total_orders || 0} completed
              </p>
            </div>
            <div className="p-3 bg-emerald-500/20 rounded-lg">
              <CheckCircle className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Breakdown */}
        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="h-5 w-5 text-purple-400" />
            <h3 className="text-xl font-semibold text-white">Order Status Breakdown</h3>
          </div>
          
          <div className="space-y-4">
            {stats?.status_breakdown && Object.entries(stats.status_breakdown).map(([status, count]) => {
              const percentage = stats.total_orders > 0 ? (count / stats.total_orders) * 100 : 0
              
              return (
                <div key={status} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`}></div>
                      <span className="text-gray-300 capitalize">{getStatusLabel(status)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-white font-medium">{count}</span>
                      <span className="text-gray-400 text-sm ml-2">({percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getStatusColor(status)}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
            
            {(!stats?.status_breakdown || Object.keys(stats.status_breakdown).length === 0) && (
              <p className="text-gray-400 text-center py-8">No order data available</p>
            )}
          </div>
        </Card>

        {/* Daily Orders Chart */}
        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="h-5 w-5 text-blue-400" />
            <h3 className="text-xl font-semibold text-white">Daily Order Volume</h3>
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
                      <span className="text-gray-300 text-sm">{formattedDate}</span>
                      <span className="text-white font-medium">{count} orders</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
              
            {(!stats?.daily_order_counts || Object.keys(stats.daily_order_counts).length === 0) && (
              <p className="text-gray-400 text-center py-8">No daily data available</p>
            )}
          </div>
        </Card>
      </div>

      {/* Additional Insights */}
      <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Key Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400 mb-2">
              {((stats?.completed_orders || 0) / Math.max(selectedPeriod, 1)).toFixed(1)}
            </div>
            <p className="text-gray-400 text-sm">Orders per day</p>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-2">
              {((stats?.total_revenue || 0) / Math.max(selectedPeriod, 1)).toFixed(0)}
            </div>
            <p className="text-gray-400 text-sm">Daily revenue</p>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400 mb-2">
              {stats?.status_breakdown?.['pending'] || 0}
            </div>
            <p className="text-gray-400 text-sm">Pending orders</p>
          </div>
        </div>
      </Card>
    </div>
  )
}