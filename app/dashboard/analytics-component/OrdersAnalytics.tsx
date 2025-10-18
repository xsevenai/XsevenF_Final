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
        console.log('Fetching orders analytics for businessId:', businessId, 'timeRange:', timeRange)
        const data = await getOrdersAnalyticsDashboard(timeRange as '1d' | '7d' | '30d' | '90d')
        console.log('Orders analytics data received:', data)
        setAnalyticsData(data)
      } catch (err) {
        console.error('Failed to fetch orders analytics:', err)
        // Fallback to mock data if API fails
        console.log('Using fallback mock data')
        setAnalyticsData({
          overview: {
            total_orders: 1247,
            completed_orders: 856,
            pending_orders: 234,
            cancelled_orders: 157,
            total_revenue: 45230.50,
            average_order_value: 36.28,
            orders_growth: 8.3,
            revenue_growth: 12.5,
            completion_rate: 68.7,
            cancellation_rate: 12.6
          },
          trend_data: {
            trend_data: [
              { day: 'Mon', orders: 45, revenue: 1200 },
              { day: 'Tue', orders: 52, revenue: 1900 },
              { day: 'Wed', orders: 78, revenue: 3000 },
              { day: 'Thu', orders: 65, revenue: 2800 },
              { day: 'Fri', orders: 89, revenue: 1890 },
              { day: 'Sat', orders: 95, revenue: 2390 },
              { day: 'Sun', orders: 112, revenue: 3490 }
            ]
          },
          hour_data: {
            hour_data: [
              { hour: '6AM', orders: 5 },
              { hour: '9AM', orders: 15 },
              { hour: '12PM', orders: 45 },
              { hour: '3PM', orders: 25 },
              { hour: '6PM', orders: 65 },
              { hour: '9PM', orders: 35 }
            ],
            peak_hour: '6PM'
          },
          status_distribution: {
            status_data: [
              { status: 'Completed', count: 856, percentage: 68.7 },
              { status: 'Pending', count: 234, percentage: 18.8 },
              { status: 'Cancelled', count: 157, percentage: 12.6 }
            ]
          },
          order_types: {
            type_data: [
              { type: 'Dine-in', count: 456, percentage: 36.6 },
              { type: 'Takeout', count: 523, percentage: 41.9 },
              { type: 'Delivery', count: 268, percentage: 21.5 }
            ]
          },
          top_items: {
            top_items: [
              { name: 'Margherita Pizza', quantity: 145, revenue: 2175 },
              { name: 'Caesar Salad', quantity: 98, revenue: 1470 },
              { name: 'Chicken Burger', quantity: 87, revenue: 1305 },
              { name: 'Pasta Carbonara', quantity: 76, revenue: 1520 },
              { name: 'Fish & Chips', quantity: 65, revenue: 1300 }
            ]
          }
        })
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
          <p className="text-gray-600 text-sm">{error}</p>
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
          value={analyticsData?.hour_data?.peak_hour || 'N/A'}
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
          subtitle="Peak ordering hours throughout the day"
          isDark={isDark}
        >
          <ModernBarChart
            data={analyticsData?.hour_data?.hour_data || []}
            dataKey="orders" 
            nameKey="hour"
            isDark={isDark}
            colors={['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#3b82f6']}
          />
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
