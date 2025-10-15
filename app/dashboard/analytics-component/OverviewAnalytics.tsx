"use client"

import { useState, useEffect } from 'react'
import { useTheme } from '@/hooks/useTheme'
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  MessageSquare,
  TrendingUp,
  Activity,
  Clock,
  BarChart3
} from 'lucide-react'
import MetricCard from './components/MetricCard'
import ChartContainer from './components/ChartContainer'
import SectionHeader from './components/SectionHeader'
import ModernBarChart from './components/ModernBarChart'
import ModernLineChart from './components/ModernLineChart'
import ModernPieChart from './components/ModernPieChart'

interface OverviewAnalyticsProps {
  timeRange: string
}

export default function OverviewAnalytics({ timeRange }: OverviewAnalyticsProps) {
  const { isDark } = useTheme()
  const [loading, setLoading] = useState(true)

  // Mock data for demonstration - replace with real API calls
  const mockData = {
    totalRevenue: 45230.50,
    totalOrders: 1247,
    activeCustomers: 892,
    totalMessages: 3456,
    revenueGrowth: 12.5,
    ordersGrowth: 8.3,
    customersGrowth: 15.2,
    messagesGrowth: -2.1,
    dailyRevenue: [
      { day: 'Mon', revenue: 1200 },
      { day: 'Tue', revenue: 1900 },
      { day: 'Wed', revenue: 3000 },
      { day: 'Thu', revenue: 2800 },
      { day: 'Fri', revenue: 1890 },
      { day: 'Sat', revenue: 2390 },
      { day: 'Sun', revenue: 3490 }
    ],
    orderStatusData: [
      { status: 'Completed', count: 856, percentage: 68.7 },
      { status: 'Pending', count: 234, percentage: 18.8 },
      { status: 'Cancelled', count: 157, percentage: 12.6 }
    ],
    revenueByHour: [
      { hour: '6AM', revenue: 120 },
      { hour: '9AM', revenue: 450 },
      { hour: '12PM', revenue: 1200 },
      { hour: '3PM', revenue: 800 },
      { hour: '6PM', revenue: 1500 },
      { hour: '9PM', revenue: 900 }
    ]
  }

  useEffect(() => {
    // Reduced loading time for better UX
    const timer = setTimeout(() => setLoading(false), 100)
    return () => clearTimeout(timer)
  }, [timeRange])

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`
  const formatNumber = (num: number) => num.toLocaleString()

  return (
    <div className="space-y-6">
      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(mockData.totalRevenue)}
          icon={<DollarSign className="h-6 w-6 text-blue-500" />}
          trend={{ value: mockData.revenueGrowth, isPositive: mockData.revenueGrowth > 0 }}
          isLoading={loading}
          isDark={isDark}
        />
        
        <MetricCard
          title="Total Orders"
          value={formatNumber(mockData.totalOrders)}
          icon={<ShoppingCart className="h-6 w-6 text-green-500" />}
          trend={{ value: mockData.ordersGrowth, isPositive: mockData.ordersGrowth > 0 }}
          isLoading={loading}
          isDark={isDark}
        />
        
        <MetricCard
          title="Active Customers"
          value={formatNumber(mockData.activeCustomers)}
          icon={<Users className="h-6 w-6 text-purple-500" />}
          trend={{ value: mockData.customersGrowth, isPositive: mockData.customersGrowth > 0 }}
          isLoading={loading}
          isDark={isDark}
        />
        
        <MetricCard
          title="Messages Sent"
          value={formatNumber(mockData.totalMessages)}
          icon={<MessageSquare className="h-6 w-6 text-orange-500" />}
          trend={{ value: mockData.messagesGrowth, isPositive: mockData.messagesGrowth > 0 }}
          isLoading={loading}
          isDark={isDark}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Daily Revenue Trend */}
        <ChartContainer
          title="Daily Revenue Trend"
          subtitle="Revenue performance over the last 7 days"
          isDark={isDark}
        >
          <ModernLineChart
            data={mockData.dailyRevenue}
            dataKey="revenue"
            nameKey="day"
            isDark={isDark}
            color="#3b82f6"
            type="area"
          />
        </ChartContainer>

        {/* Order Status Distribution */}
        <ChartContainer
          title="Order Status Distribution"
          subtitle="Current distribution of order statuses"
          isDark={isDark}
        >
          <ModernPieChart
            data={mockData.orderStatusData}
            dataKey="count"
            nameKey="status"
            isDark={isDark}
            colors={['#10b981', '#f59e0b', '#ef4444']}
          />
        </ChartContainer>
      </div>

      {/* Revenue by Hour */}
      <ChartContainer
        title="Revenue by Hour"
        subtitle="Peak hours and revenue distribution throughout the day"
        isDark={isDark}
      >
        <ModernBarChart
          data={mockData.revenueByHour}
          dataKey="revenue"
          nameKey="hour"
          isDark={isDark}
          colors={['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#3b82f6']}
        />
      </ChartContainer>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ChartContainer
          title="Average Order Value"
          subtitle="AOV trend over time"
          isDark={isDark}
        >
          <div className="text-center py-8">
            <div className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
              {formatCurrency(mockData.totalRevenue / mockData.totalOrders)}
            </div>
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Current AOV
            </div>
          </div>
        </ChartContainer>

        <ChartContainer
          title="Conversion Rate"
          subtitle="Customer conversion metrics"
          isDark={isDark}
        >
          <div className="text-center py-8">
            <div className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
              24.3%
            </div>
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Conversion Rate
            </div>
          </div>
        </ChartContainer>

        <ChartContainer
          title="Customer Retention"
          subtitle="Returning customer percentage"
          isDark={isDark}
        >
          <div className="text-center py-8">
            <div className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
              68.7%
            </div>
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Retention Rate
            </div>
          </div>
        </ChartContainer>
      </div>
    </div>
  )
}
