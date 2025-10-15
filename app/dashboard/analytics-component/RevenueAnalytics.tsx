"use client"

import { useState, useEffect } from 'react'
import { useTheme } from '@/hooks/useTheme'
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
}

export default function RevenueAnalytics({ timeRange }: RevenueAnalyticsProps) {
  const { isDark } = useTheme()
  const [loading, setLoading] = useState(true)

  // Mock data for demonstration
  const mockData = {
    totalRevenue: 45230.50,
    dailyRevenue: 2150.25,
    weeklyRevenue: 15050.75,
    monthlyRevenue: 45230.50,
    revenueGrowth: 12.5,
    dailyGrowth: 8.3,
    weeklyGrowth: 15.2,
    monthlyGrowth: 12.5,
    revenueByDay: [
      { day: 'Mon', revenue: 1200, orders: 45 },
      { day: 'Tue', revenue: 1900, orders: 52 },
      { day: 'Wed', revenue: 3000, orders: 78 },
      { day: 'Thu', revenue: 2800, orders: 65 },
      { day: 'Fri', revenue: 1890, orders: 89 },
      { day: 'Sat', revenue: 2390, orders: 95 },
      { day: 'Sun', revenue: 3490, orders: 112 }
    ],
    revenueByHour: [
      { hour: '6AM', revenue: 120, orders: 5 },
      { hour: '9AM', revenue: 450, orders: 15 },
      { hour: '12PM', revenue: 1200, orders: 45 },
      { hour: '3PM', revenue: 800, orders: 25 },
      { hour: '6PM', revenue: 1500, orders: 65 },
      { hour: '9PM', revenue: 900, orders: 35 }
    ],
    revenueByChannel: [
      { channel: 'Dine-in', revenue: 18520, percentage: 40.9 },
      { channel: 'Takeout', revenue: 18950, percentage: 41.9 },
      { channel: 'Delivery', revenue: 7760, percentage: 17.2 }
    ],
    paymentMethods: [
      { method: 'Credit Card', revenue: 22615, percentage: 50.0 },
      { method: 'Cash', revenue: 13569, percentage: 30.0 },
      { method: 'Mobile Pay', revenue: 9046, percentage: 20.0 }
    ],
    revenueByCategory: [
      { category: 'Main Courses', revenue: 22615, percentage: 50.0 },
      { category: 'Appetizers', revenue: 9046, percentage: 20.0 },
      { category: 'Beverages', revenue: 6785, percentage: 15.0 },
      { category: 'Desserts', revenue: 6785, percentage: 15.0 }
    ],
    topRevenueItems: [
      { name: 'Margherita Pizza', revenue: 2175, orders: 145 },
      { name: 'Caesar Salad', revenue: 1470, orders: 98 },
      { name: 'Chicken Burger', revenue: 1305, orders: 87 },
      { name: 'Pasta Carbonara', revenue: 1520, orders: 76 },
      { name: 'Fish & Chips', revenue: 1300, orders: 65 }
    ],
    revenueProjection: [
      { month: 'Jan', actual: 42000, projected: 45000 },
      { month: 'Feb', actual: 38000, projected: 42000 },
      { month: 'Mar', actual: 45000, projected: 48000 },
      { month: 'Apr', actual: 42000, projected: 45000 },
      { month: 'May', actual: 48000, projected: 52000 },
      { month: 'Jun', actual: 45230, projected: 50000 }
    ]
  }

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 100)
    return () => clearTimeout(timer)
  }, [timeRange])

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`
  const formatNumber = (num: number) => num.toLocaleString()

  return (
    <div className="space-y-6">
      {/* Key Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(mockData.totalRevenue)}
          icon={<DollarSign className="h-6 w-6 text-green-500" />}
          trend={{ value: mockData.revenueGrowth, isPositive: mockData.revenueGrowth > 0 }}
          isLoading={loading}
          isDark={isDark}
        />
        
        <MetricCard
          title="Daily Revenue"
          value={formatCurrency(mockData.dailyRevenue)}
          icon={<Calendar className="h-6 w-6 text-blue-500" />}
          trend={{ value: mockData.dailyGrowth, isPositive: mockData.dailyGrowth > 0 }}
          isLoading={loading}
          isDark={isDark}
        />
        
        <MetricCard
          title="Weekly Revenue"
          value={formatCurrency(mockData.weeklyRevenue)}
          icon={<TrendingUp className="h-6 w-6 text-purple-500" />}
          trend={{ value: mockData.weeklyGrowth, isPositive: mockData.weeklyGrowth > 0 }}
          isLoading={loading}
          isDark={isDark}
        />
        
        <MetricCard
          title="Monthly Revenue"
          value={formatCurrency(mockData.monthlyRevenue)}
          icon={<BarChart3 className="h-6 w-6 text-orange-500" />}
          trend={{ value: mockData.monthlyGrowth, isPositive: mockData.monthlyGrowth > 0 }}
          isLoading={loading}
          isDark={isDark}
        />
          </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Average Order Value"
          value={formatCurrency(mockData.totalRevenue / 1247)}
          icon={<ShoppingBag className="h-6 w-6 text-indigo-500" />}
          subtitle="Per transaction"
          isLoading={loading}
          isDark={isDark}
        />
        
        <MetricCard
          title="Revenue per Customer"
          value={formatCurrency(mockData.totalRevenue / 892)}
          icon={<Users className="h-6 w-6 text-pink-500" />}
          subtitle="Customer value"
          isLoading={loading}
          isDark={isDark}
        />
        
        <MetricCard
          title="Peak Revenue Hour"
          value="6PM"
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
          subtitle="Revenue performance over the last 7 days"
          isDark={isDark}
        >
          <ModernLineChart
            data={mockData.revenueByDay}
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
            data={mockData.revenueByChannel}
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
            data={mockData.revenueByHour}
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
            data={mockData.paymentMethods}
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
          data={mockData.revenueByCategory}
          dataKey="revenue"
          nameKey="category"
          isDark={isDark}
          colors={['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981']}
        />
      </ChartContainer>

      {/* Revenue Projection */}
      <ChartContainer
        title="Revenue Projection"
        subtitle="Actual vs projected revenue for the year"
        isDark={isDark}
      >
        <ModernLineChart
          data={mockData.revenueProjection}
          dataKey="actual"
          nameKey="month"
          isDark={isDark}
          color="#3b82f6"
          type="line"
        />
      </ChartContainer>

      {/* Top Revenue Items */}
      <ChartContainer
        title="Top Revenue Items"
        subtitle="Highest earning menu items"
        isDark={isDark}
      >
        <div className="space-y-4">
          {mockData.topRevenueItems.map((item, index) => (
            <div key={index} className={`${isDark ? 'bg-[#1f1f1f]' : 'bg-gray-50'} p-4 rounded-lg border ${isDark ? 'border-[#2a2a2a]' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm
                    ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-blue-500'}
                  `}>
                    {index + 1}
                  </div>
                  <div>
                    <h5 className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium`}>{item.name}</h5>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                      {formatNumber(item.orders)} orders
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
