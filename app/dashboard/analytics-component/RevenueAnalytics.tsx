"use client"

import { useState, useEffect } from 'react'
import { useTheme } from '@/hooks/useTheme'
import { useRevenueAnalytics } from '@/hooks/use-revenue-analytics'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  CreditCard,
  ShoppingBag,
  Users,
  BarChart3
} from 'lucide-react'
import MetricCard from './components/MetricCard'
import ChartContainer from './components/ChartContainer'
import SectionHeader from './components/SectionHeader'
import ModernBarChart from './components/ModernBarChart'
import ModernLineChart from './components/ModernLineChart'
import ModernPieChart from './components/ModernPieChart'

interface RevenueAnalyticsProps {
  timeRange: string
  businessId?: string
}

export default function RevenueAnalytics({ timeRange, businessId }: RevenueAnalyticsProps) {
  const { isDark } = useTheme()
  
  // Get businessId from localStorage or props
  const getBusinessId = () => {
    if (businessId) return businessId
    if (typeof window !== 'undefined') {
      return localStorage.getItem('businessId') || localStorage.getItem('business_id')
    }
    return null
  }
  
  const validBusinessId = getBusinessId()
  
  const { 
    loading, 
    error, 
    getRevenueAnalyticsDashboard 
  } = useRevenueAnalytics(validBusinessId || '550e8400-e29b-41d4-a716-446655440000')
  
  const [dashboardData, setDashboardData] = useState<any>(null)

  // Convert timeRange to API period format
  const getPeriodFromTimeRange = (timeRange: string): '1d' | '7d' | '30d' | '90d' | '1y' => {
    switch (timeRange) {
      case '1d': return '1d'
      case '7d': return '7d'
      case '30d': return '30d'
      case '90d': return '90d'
      case '1y': return '1y'
      default: return '7d'
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      // Don't fetch if no valid business ID
      if (!validBusinessId) {
        console.warn('No business ID found in localStorage or props')
        return
      }

      try {
        const period = getPeriodFromTimeRange(timeRange)
        const data = await getRevenueAnalyticsDashboard(period, true)
        setDashboardData(data)
      } catch (err) {
        console.error('Failed to fetch revenue analytics:', err)
        // Set fallback data structure for error handling
        setDashboardData({
          overview: {
            total_revenue: 0,
            daily_revenue: 0,
            weekly_revenue: 0,
            monthly_revenue: 0,
            revenue_growth: 0,
            daily_growth: 0,
            weekly_growth: 0,
            monthly_growth: 0,
            average_order_value: 0,
            revenue_per_customer: 0,
            total_orders: 0,
            total_customers: 0
          },
          trend_data: { trend_data: [] },
          channel_data: { channel_data: [] },
          hour_data: { hour_data: [] },
          payment_methods: { payment_data: [] },
          category_data: { category_data: [] },
          top_items: { top_items: [] },
          projection_data: { projection_data: [] }
        })
      }
    }

    fetchData()
  }, [timeRange, validBusinessId, getRevenueAnalyticsDashboard])

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`
  const formatNumber = (num: number) => num.toLocaleString()

  // Show message if no business ID is found
  if (!validBusinessId) {
    return (
      <div className="space-y-6">
        <div className={`${isDark ? 'bg-yellow-900/20 border-yellow-500/50' : 'bg-yellow-50 border-yellow-200'} border rounded-lg p-6`}>
          <h3 className={`${isDark ? 'text-yellow-400' : 'text-yellow-600'} font-medium mb-2`}>
            Business ID Required
          </h3>
          <p className={`${isDark ? 'text-yellow-300' : 'text-yellow-500'} text-sm`}>
            Please ensure you're logged in and have a valid business ID in localStorage.
          </p>
        </div>
      </div>
    )
  }

  // Show loading state while data is being fetched
  if (loading && !dashboardData) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`${isDark ? 'bg-[#1f1f1f]' : 'bg-gray-50'} p-6 rounded-lg border ${isDark ? 'border-[#2a2a2a]' : 'border-gray-200'} animate-pulse`}>
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-300 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Show error state if there's an error and no data
  if (error && !dashboardData) {
    return (
      <div className="space-y-6">
        <div className={`${isDark ? 'bg-red-900/20 border-red-500/50' : 'bg-red-50 border-red-200'} border rounded-lg p-6`}>
          <h3 className={`${isDark ? 'text-red-400' : 'text-red-600'} font-medium mb-2`}>
            Failed to load revenue analytics
          </h3>
          <p className={`${isDark ? 'text-red-300' : 'text-red-500'} text-sm`}>
            {error}
          </p>
        </div>
      </div>
    )
  }

  // Use dashboard data or fallback to empty structure
  const data = dashboardData || {
    overview: {
      total_revenue: 0,
      daily_revenue: 0,
      weekly_revenue: 0,
      monthly_revenue: 0,
      revenue_growth: 0,
      daily_growth: 0,
      weekly_growth: 0,
      monthly_growth: 0,
      average_order_value: 0,
      revenue_per_customer: 0,
      total_orders: 0,
      total_customers: 0
    },
    trend_data: { trend_data: [] },
    channel_data: { channel_data: [] },
    hour_data: { hour_data: [] },
    payment_methods: { payment_data: [] },
    category_data: { category_data: [] },
    top_items: { top_items: [] },
    projection_data: { projection_data: [] }
  }

  return (
    <div className="space-y-6">
      {/* Key Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(data.overview.total_revenue)}
          icon={<DollarSign className="h-6 w-6 text-green-500" />}
          trend={{ value: data.overview.revenue_growth, isPositive: data.overview.revenue_growth > 0 }}
          isLoading={loading}
          isDark={isDark}
        />
        
        <MetricCard
          title="Daily Revenue"
          value={formatCurrency(data.overview.daily_revenue)}
          icon={<Calendar className="h-6 w-6 text-blue-500" />}
          trend={{ value: data.overview.daily_growth, isPositive: data.overview.daily_growth > 0 }}
          isLoading={loading}
          isDark={isDark}
        />
        
        <MetricCard
          title="Weekly Revenue"
          value={formatCurrency(data.overview.weekly_revenue)}
          icon={<TrendingUp className="h-6 w-6 text-purple-500" />}
          trend={{ value: data.overview.weekly_growth, isPositive: data.overview.weekly_growth > 0 }}
          isLoading={loading}
          isDark={isDark}
        />
        
        <MetricCard
          title="Monthly Revenue"
          value={formatCurrency(data.overview.monthly_revenue)}
          icon={<BarChart3 className="h-6 w-6 text-orange-500" />}
          trend={{ value: data.overview.monthly_growth, isPositive: data.overview.monthly_growth > 0 }}
          isLoading={loading}
          isDark={isDark}
        />
          </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Average Order Value"
          value={formatCurrency(data.overview.average_order_value)}
          icon={<ShoppingBag className="h-6 w-6 text-indigo-500" />}
          subtitle="Per transaction"
          isLoading={loading}
          isDark={isDark}
        />
        
        <MetricCard
          title="Revenue per Customer"
          value={formatCurrency(data.overview.revenue_per_customer)}
          icon={<Users className="h-6 w-6 text-pink-500" />}
          subtitle="Customer value"
          isLoading={loading}
          isDark={isDark}
        />
        
        <MetricCard
          title="Peak Revenue Hour"
          value={data.hour_data?.peak_hour || "N/A"}
          icon={<TrendingUp className="h-6 w-6 text-red-500" />}
          subtitle="Highest earning time"
          isLoading={loading}
          isDark={isDark}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Daily Revenue Trend */}
        <ChartContainer
          title="Daily Revenue Trend"
          subtitle="Revenue performance over the selected period"
          isDark={isDark}
        >
          <ModernLineChart
            data={data.trend_data?.trend_data || []}
            dataKey="revenue"
            nameKey="day"
            isDark={isDark}
            color="#10b981"
            type="area"
          />
        </ChartContainer>

        {/* Revenue by Channel */}
        <ChartContainer
          title="Revenue by Channel"
          subtitle="Distribution of revenue across different channels"
          isDark={isDark}
        >
          <ModernPieChart
            data={data.channel_data?.channel_data || []}
            dataKey="revenue" 
            nameKey="channel"
            isDark={isDark}
            colors={['#3b82f6', '#8b5cf6', '#06b6d4']}
          />
        </ChartContainer>
          </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue by Hour */}
        <ChartContainer
          title="Revenue by Hour"
          subtitle="Peak revenue hours throughout the day"
          isDark={isDark}
        >
          <ModernBarChart
            data={data.hour_data?.hour_data || []}
            dataKey="revenue"
            nameKey="hour"
            isDark={isDark}
            colors={['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#3b82f6']}
          />
        </ChartContainer>

        {/* Payment Methods */}
        <ChartContainer
          title="Payment Methods"
          subtitle="Revenue distribution by payment type"
          isDark={isDark}
        >
          <ModernPieChart
            data={data.payment_methods?.payment_data || []}
            dataKey="revenue"
            nameKey="method"
            isDark={isDark}
            colors={['#3b82f6', '#10b981', '#f59e0b']}
          />
        </ChartContainer>
      </div>

      {/* Revenue by Category */}
      <ChartContainer
        title="Revenue by Category"
        subtitle="Revenue distribution across menu categories"
        isDark={isDark}
      >
        <ModernBarChart
          data={data.category_data?.category_data || []}
          dataKey="revenue"
          nameKey="category"
          isDark={isDark}
          colors={['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981']}
        />
      </ChartContainer>

    </div>
  )
}
