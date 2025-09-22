// app/dashboard/analytics-component/AnalyticsOverview.tsx

"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, MessageSquare, Users, Clock, Star } from "lucide-react"
import { useAnalytics } from "@/hooks/use-analytics"

// Define interfaces for type safety
interface ChartDataPoint {
  date: string
  revenue: number
  orders: number
  messages: number
  customers: number
}

interface PieDataPoint {
  name: string
  value: number
  color: string
}

interface DashboardSummary {
  today?: {
    revenue: number
    orders: number
    messages: number
    sessions: number
  }
  averages?: {
    order_value_today: number
    messages_per_session_today: number
  }
}

interface CombinedAnalytics {
  summary?: {
    total_orders: number
    total_revenue: number
    total_messages: number
    total_sessions: number
    average_order_value: number
    average_messages_per_session: number
  }
}

interface AnalyticsOverviewProps {
  timeRange: string
}

export default function AnalyticsOverview({ timeRange }: AnalyticsOverviewProps) {
  const { 
    dashboardSummary, 
    combinedAnalytics, 
    loading, 
    error, 
    refetch 
  } = useAnalytics(timeRange)

  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [pieData, setPieData] = useState<PieDataPoint[]>([])

  useEffect(() => {
    if (combinedAnalytics) {
      // Generate sample chart data based on time range
      const generateChartData = (): ChartDataPoint[] => {
        const days = timeRange === "1d" ? 1 : timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90
        const data: ChartDataPoint[] = []
        
        for (let i = days - 1; i >= 0; i--) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          
          data.push({
            date: date.toISOString().split('T')[0],
            revenue: Math.floor(Math.random() * 1000) + 200,
            orders: Math.floor(Math.random() * 50) + 10,
            messages: Math.floor(Math.random() * 100) + 20,
            customers: Math.floor(Math.random() * 30) + 5
          })
        }
        return data
      }

      setChartData(generateChartData())

      // Generate pie chart data for order status distribution
      setPieData([
        { name: 'Delivered', value: 45, color: '#10B981' },
        { name: 'Preparing', value: 25, color: '#F59E0B' },
        { name: 'Pending', value: 20, color: '#EF4444' },
        { name: 'Cancelled', value: 10, color: '#6B7280' }
      ])
    }
  }, [combinedAnalytics, timeRange])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400">Error loading analytics data</p>
        <button 
          onClick={refetch}
          className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Retry
        </button>
      </div>
    )
  }

  const typedDashboardSummary = dashboardSummary as DashboardSummary | null

  const metrics = [
    {
      title: "Total Revenue",
      value: typedDashboardSummary?.today?.revenue || 0,
      change: "+12.5%",
      changeType: "increase" as const,
      icon: DollarSign,
      color: "text-green-400",
      bgColor: "bg-green-500/10"
    },
    {
      title: "Total Orders",
      value: typedDashboardSummary?.today?.orders || 0,
      change: "+8.2%",
      changeType: "increase" as const,
      icon: ShoppingCart,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "Messages",
      value: typedDashboardSummary?.today?.messages || 0,
      change: "+15.3%",
      changeType: "increase" as const,
      icon: MessageSquare,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10"
    },
    {
      title: "Active Sessions",
      value: typedDashboardSummary?.today?.sessions || 0,
      change: "-2.1%",
      changeType: "decrease" as const,
      icon: Users,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">{metric.title}</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {metric.title.includes("Revenue") ? `$${metric.value.toFixed(2)}` : metric.value}
                </p>
                <div className="flex items-center mt-2">
                  {metric.changeType === "increase" ? (
                    <TrendingUp className="h-4 w-4 text-green-400" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-400" />
                  )}
                  <span className={`text-sm ml-1 ${
                    metric.changeType === "increase" ? "text-green-400" : "text-red-400"
                  }`}>
                    {metric.change}
                  </span>
                </div>
              </div>
              <div className={`${metric.bgColor} p-3 rounded-lg`}>
                <metric.icon className={`h-6 w-6 ${metric.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Revenue Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickFormatter={(value: string) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ fill: '#10B981', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Order Status Distribution */}
        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Order Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry: PieDataPoint, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            {pieData.map((entry: PieDataPoint, index: number) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-sm text-gray-400">{entry.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Orders and Messages Combined Chart */}
      <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Orders vs Messages Activity</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9CA3AF"
                fontSize={12}
                tickFormatter={(value: string) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Bar dataKey="orders" fill="#3B82F6" name="Orders" />
              <Bar dataKey="messages" fill="#8B5CF6" name="Messages" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Average Order Value</p>
              <p className="text-xl font-bold text-white">
                ${typedDashboardSummary?.averages?.order_value_today || 0}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-400" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg. Response Time</p>
              <p className="text-xl font-bold text-white">2.3s</p>
            </div>
            <Clock className="h-8 w-8 text-blue-400" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Customer Satisfaction</p>
              <p className="text-xl font-bold text-white">4.8/5</p>
            </div>
            <Star className="h-8 w-8 text-yellow-400" />
          </div>
        </Card>
      </div>
    </div>
  )
}