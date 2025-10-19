"use client"

import { useState, useEffect } from 'react'
import { useTheme } from '@/hooks/useTheme'
import { useOrderAnalytics } from '@/hooks/use-order-analytics'
import { 
  ShoppingCart, 
  CheckCircle, 
  Clock, 
  XCircle,
  TrendingUp,
  DollarSign,
  Users,
  Calendar
} from 'lucide-react'
import MetricCard from './components/MetricCard'
import ChartContainer from './components/ChartContainer'
import SectionHeader from './components/SectionHeader'
import ModernBarChart from './components/ModernBarChart'
import ModernLineChart from './components/ModernLineChart'
import ModernPieChart from './components/ModernPieChart'

interface OrdersAnalyticsProps {
  timeRange: string
  businessId: string
}

export default function OrdersAnalytics({ timeRange, businessId }: OrdersAnalyticsProps) {
  const { isDark } = useTheme()
  
  console.log('OrdersAnalytics: Component rendered with businessId:', businessId, 'timeRange:', timeRange)
  
  const { 
    loading, 
    error, 
    getOrdersAnalyticsDashboard 
  } = useOrderAnalytics(businessId)
  
  const [analyticsData, setAnalyticsData] = useState<any>(null)

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        console.log('🔄 OrdersAnalytics: Fetching analytics for businessId:', businessId, 'timeRange:', timeRange)
        const data = await getOrdersAnalyticsDashboard(timeRange as '1d' | '7d' | '30d' | '90d')
        console.log('📈 OrdersAnalytics: Data received:', data)
        
        // Debug the hour_data structure specifically
        console.log('🕐 OrdersAnalytics: Hour data structure:', {
          hour_data: data.hour_data,
          hour_data_type: typeof data.hour_data,
          hour_data_keys: data.hour_data ? Object.keys(data.hour_data) : 'null',
          hour_data_hour_data: data.hour_data?.hour_data,
          peak_hour: data.hour_data?.peak_hour
        })
        
        setAnalyticsData(data)
      } catch (err) {
        console.error('❌ OrdersAnalytics: Failed to fetch analytics:', err)
        setAnalyticsData(null)
      }
    }

    if (businessId && businessId.trim() !== '') {
      console.log('OrdersAnalytics: businessId is valid, fetching data')
      fetchAnalyticsData()
    } else {
      console.log('OrdersAnalytics: businessId is empty or invalid, skipping fetch')
    }
  }, [timeRange, businessId])

  const formatCurrency = (amount: number | undefined | null) => {
    if (amount === undefined || amount === null || isNaN(amount)) return '$0.00'
    return `$${amount.toFixed(2)}`
  }
  const formatNumber = (num: number | undefined | null) => {
    if (num === undefined || num === null || isNaN(num)) return '0'
    return num.toLocaleString()
  }

  // Format time range for display (e.g., "3PM-6PM" -> "3:00 PM - 6:00 PM")
  const formatTimeRange = (timeRange: string) => {
    if (!timeRange || timeRange === 'N/A') return 'N/A'
    
    // Handle time ranges like "3PM-6PM", "6AM-9AM", "9PM-6AM"
    const timeRangePattern = /^(\d{1,2})(AM|PM)-(\d{1,2})(AM|PM)$/
    const match = timeRange.match(timeRangePattern)
    
    if (match) {
      const [, startHour, startPeriod, endHour, endPeriod] = match
      const startHourNum = parseInt(startHour)
      const endHourNum = parseInt(endHour)
      
      // Format start time
      const startTime = `${startHourNum}:00 ${startPeriod}`
      
      // Format end time
      const endTime = `${endHourNum}:00 ${endPeriod}`
      
      return `${startTime} - ${endTime}`
    }
    
    // If it doesn't match the pattern, return as-is
    return timeRange
  }

  // Show loading state or error
  if (loading && !analyticsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders analytics...</p>
        </div>
      </div>
    )
  }

  if (error && !analyticsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <p className="text-red-600 mb-2">Failed to load orders analytics</p>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!businessId || businessId.trim() === '') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-yellow-500 mb-4">⚠️</div>
          <p className="text-yellow-600 mb-2">Business ID not found</p>
          <p className="text-gray-600 text-sm">Please ensure you are logged in and have a valid business ID</p>
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Preparing analytics data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Order Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Orders"
          value={formatNumber(analyticsData?.overview?.total_orders)}
          icon={<ShoppingCart className="h-6 w-6 text-blue-500" />}
          trend={{ value: analyticsData?.overview?.orders_growth || 0, isPositive: (analyticsData?.overview?.orders_growth || 0) > 0 }}
          isLoading={loading}
          isDark={isDark}
        />
        
        <MetricCard
          title="Completed Orders"
          value={formatNumber(analyticsData?.overview?.completed_orders)}
          icon={<CheckCircle className="h-6 w-6 text-green-500" />}
          subtitle={`${analyticsData?.overview?.completion_rate || 0}% completion rate`}
          isLoading={loading}
          isDark={isDark}
        />
        
        <MetricCard
          title="Pending Orders"
          value={formatNumber(analyticsData?.overview?.pending_orders)}
          icon={<Clock className="h-6 w-6 text-yellow-500" />}
          subtitle="Awaiting fulfillment"
          isLoading={loading}
          isDark={isDark}
        />
        
        <MetricCard
          title="Cancelled Orders"
          value={formatNumber(analyticsData?.overview?.cancelled_orders)}
          icon={<XCircle className="h-6 w-6 text-red-500" />}
          subtitle={`${analyticsData?.overview?.cancellation_rate || 0}% cancellation rate`}
          isLoading={loading}
          isDark={isDark}
        />
      </div>

      {/* Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(analyticsData?.overview?.total_revenue)}
          icon={<DollarSign className="h-6 w-6 text-green-500" />}
          trend={{ value: analyticsData?.overview?.revenue_growth || 0, isPositive: (analyticsData?.overview?.revenue_growth || 0) > 0 }}
          isLoading={loading}
          isDark={isDark}
        />
        
        <MetricCard
          title="Average Order Value"
          value={formatCurrency(analyticsData?.overview?.average_order_value)}
          icon={<TrendingUp className="h-6 w-6 text-purple-500" />}
          subtitle="Per order"
          isLoading={loading}
          isDark={isDark}
        />
        
        <MetricCard
          title="Peak Hour"
          value={formatTimeRange(analyticsData?.hour_data?.peak_hour || 'N/A')}
          icon={<Clock className="h-6 w-6 text-orange-500" />}
          subtitle="Most active time"
          isLoading={loading}
          isDark={isDark}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Orders Trend */}
        <ChartContainer
          title="Orders Trend"
          subtitle="Daily order volume and revenue"
          isDark={isDark}
        >
          <ModernLineChart
            data={analyticsData?.trend_data?.trend_data || []}
            dataKey="orders"
            nameKey="day"
            isDark={isDark}
            color="#3b82f6"
            type="line"
          />
        </ChartContainer>

        {/* Order Status Distribution */}
        <ChartContainer
          title="Order Status Distribution"
          subtitle="Current order status breakdown"
          isDark={isDark}
        >
          <ModernPieChart
            data={analyticsData?.status_distribution?.status_data || []}
            dataKey="count"
            nameKey="status"
            isDark={isDark}
            colors={['#10b981', '#f59e0b', '#ef4444']}
          />
        </ChartContainer>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Orders by Hour */}
        <ChartContainer
          title="Orders by Hour"
          subtitle={`Peak ordering hours throughout the day (Peak: ${formatTimeRange(analyticsData?.hour_data?.peak_hour || 'N/A')})`}
          isDark={isDark}
        >
          {(() => {
            // Debug the data being passed to the chart
            const hourData = analyticsData?.hour_data?.hour_data || []
            console.log('📊 OrdersAnalytics: Rendering hour chart with data:', hourData)
            console.log('📊 OrdersAnalytics: Data length:', hourData.length)
            
            if (hourData.length === 0) {
              console.log('⚠️ OrdersAnalytics: No hour data available, showing empty state')
              return (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="text-gray-400 mb-2">📊</div>
                    <p className="text-gray-600">No hourly data available</p>
                    <p className="text-gray-500 text-sm">Check console for debugging info</p>
                  </div>
                </div>
              )
            }
            
            return (
              <ModernBarChart
                data={hourData}
                dataKey="orders" 
                nameKey="hour"
                isDark={isDark}
                colors={['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#3b82f6']}
              />
            )
          })()}
        </ChartContainer>

        {/* Order Types */}
        <ChartContainer
          title="Order Types"
          subtitle="Distribution of order types"
          isDark={isDark}
        >
          <ModernPieChart
            data={analyticsData?.order_types?.type_data || []}
            dataKey="count"
            nameKey="type"
            isDark={isDark}
            colors={['#3b82f6', '#8b5cf6', '#06b6d4']}
          />
        </ChartContainer>
      </div>

      {/* Top Selling Items */}
      <ChartContainer
        title="Top Selling Items"
        subtitle="Best performing menu items by quantity sold"
        isDark={isDark}
      >
        <div className="space-y-4">
          {(analyticsData?.top_items?.top_items || []).map((item: any, index: number) => (
            <div key={index} className={`${isDark ? 'bg-[#1f1f1f]' : 'bg-gray-50'} p-4 rounded-lg border ${isDark ? 'border-[#2a2a2a]' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm
                    ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-blue-500'}
                  `}>
                    {index + 1}
                  </div>
                  <div>
                    <h5 className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium`}>{item.name || 'Unknown Item'}</h5>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                      {formatNumber(item.quantity)} sold
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`${isDark ? 'text-white' : 'text-gray-900'} font-bold`}>
                    {formatCurrency(item.revenue)}
                  </div>
                  <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                    Revenue
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ChartContainer>
    </div>
  )
}
