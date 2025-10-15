"use client"

import { useState, useEffect } from 'react'
import { useTheme } from '@/hooks/useTheme'
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
}

export default function OrdersAnalytics({ timeRange }: OrdersAnalyticsProps) {
  const { isDark } = useTheme()
  const [loading, setLoading] = useState(true)

  // Mock data for demonstration
  const mockData = {
    totalOrders: 1247,
    completedOrders: 856,
    pendingOrders: 234,
    cancelledOrders: 157,
    totalRevenue: 45230.50,
    averageOrderValue: 36.28,
    ordersGrowth: 8.3,
    revenueGrowth: 12.5,
    completionRate: 68.7,
    cancellationRate: 12.6,
    ordersByDay: [
      { day: 'Mon', orders: 45, revenue: 1200 },
      { day: 'Tue', orders: 52, revenue: 1900 },
      { day: 'Wed', orders: 78, revenue: 3000 },
      { day: 'Thu', orders: 65, revenue: 2800 },
      { day: 'Fri', orders: 89, revenue: 1890 },
      { day: 'Sat', orders: 95, revenue: 2390 },
      { day: 'Sun', orders: 112, revenue: 3490 }
    ],
    ordersByHour: [
      { hour: '6AM', orders: 5 },
      { hour: '9AM', orders: 15 },
      { hour: '12PM', orders: 45 },
      { hour: '3PM', orders: 25 },
      { hour: '6PM', orders: 65 },
      { hour: '9PM', orders: 35 }
    ],
    orderStatusData: [
      { status: 'Completed', count: 856, percentage: 68.7 },
      { status: 'Pending', count: 234, percentage: 18.8 },
      { status: 'Cancelled', count: 157, percentage: 12.6 }
    ],
    topItems: [
      { name: 'Margherita Pizza', quantity: 145, revenue: 2175 },
      { name: 'Caesar Salad', quantity: 98, revenue: 1470 },
      { name: 'Chicken Burger', quantity: 87, revenue: 1305 },
      { name: 'Pasta Carbonara', quantity: 76, revenue: 1520 },
      { name: 'Fish & Chips', quantity: 65, revenue: 1300 }
    ],
    orderTypes: [
      { type: 'Dine-in', count: 456, percentage: 36.6 },
      { type: 'Takeout', count: 523, percentage: 41.9 },
      { type: 'Delivery', count: 268, percentage: 21.5 }
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
      {/* Order Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Orders"
          value={formatNumber(mockData.totalOrders)}
          icon={<ShoppingCart className="h-6 w-6 text-blue-500" />}
          trend={{ value: mockData.ordersGrowth, isPositive: mockData.ordersGrowth > 0 }}
          isLoading={loading}
          isDark={isDark}
        />
        
        <MetricCard
          title="Completed Orders"
          value={formatNumber(mockData.completedOrders)}
          icon={<CheckCircle className="h-6 w-6 text-green-500" />}
          subtitle={`${mockData.completionRate}% completion rate`}
          isLoading={loading}
          isDark={isDark}
        />
        
        <MetricCard
          title="Pending Orders"
          value={formatNumber(mockData.pendingOrders)}
          icon={<Clock className="h-6 w-6 text-yellow-500" />}
          subtitle="Awaiting fulfillment"
          isLoading={loading}
          isDark={isDark}
        />
        
        <MetricCard
          title="Cancelled Orders"
          value={formatNumber(mockData.cancelledOrders)}
          icon={<XCircle className="h-6 w-6 text-red-500" />}
          subtitle={`${mockData.cancellationRate}% cancellation rate`}
          isLoading={loading}
          isDark={isDark}
        />
      </div>

      {/* Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(mockData.totalRevenue)}
          icon={<DollarSign className="h-6 w-6 text-green-500" />}
          trend={{ value: mockData.revenueGrowth, isPositive: mockData.revenueGrowth > 0 }}
          isLoading={loading}
          isDark={isDark}
        />
        
        <MetricCard
          title="Average Order Value"
          value={formatCurrency(mockData.averageOrderValue)}
          icon={<TrendingUp className="h-6 w-6 text-purple-500" />}
          subtitle="Per order"
          isLoading={loading}
          isDark={isDark}
        />
        
        <MetricCard
          title="Peak Hour"
          value="6PM"
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
            data={mockData.ordersByDay}
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
            data={mockData.orderStatusData}
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
            data={mockData.ordersByHour}
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
            data={mockData.orderTypes}
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
          {mockData.topItems.map((item, index) => (
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
