// app/dashboard/analytics-component/OrdersAnalytics.tsx

"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { ShoppingCart, TrendingUp, DollarSign, Clock, Package, Filter, Search } from "lucide-react"
import { useOrdersAnalytics } from "@/hooks/use-analytics"

// Define interfaces for type safety
interface OrderItem {
  id?: string
  name: string
  quantity: number
  price: number
  category?: string
}

interface Order {
  id: string
  orderId: string
  customerId?: string
  totalAmount: number
  status: string
  items: OrderItem[]
  createdAt: string
  updatedAt: string
}

interface OrdersSummary {
  total_orders: number
  total_revenue: number
  average_order_value: number
  status_distribution?: Record<string, number>
}

interface OrdersData {
  summary: OrdersSummary
  orders: Order[]
  daily_breakdown?: Record<string, any>
}

interface ChartDataPoint {
  date: string
  orders: number
  revenue: number
  avgOrderValue: number
}

interface StatusDataPoint {
  status: string
  count: number
  percentage: string
}

interface OrdersAnalyticsProps {
  timeRange: string
}

export default function OrdersAnalytics({ timeRange }: OrdersAnalyticsProps) {
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState<string>("")
  
  const { 
    ordersData, 
    loading, 
    error, 
    refetch 
  } = useOrdersAnalytics(timeRange, statusFilter)

  const orderStatuses = [
    { value: "", label: "All Orders" },
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "preparing", label: "Preparing" },
    { value: "ready", label: "Ready" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" }
  ]

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
        <p className="text-red-400">Error loading orders analytics</p>
        <button 
          onClick={refetch}
          className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Retry
        </button>
      </div>
    )
  }

  const summary: OrdersSummary = ordersData?.summary || {
    total_orders: 0,
    total_revenue: 0,
    average_order_value: 0
  }

  const orders: Order[] = ordersData?.orders || []

  // Filter orders based on search term
  const filteredOrders = orders.filter((order: Order) => 
    order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.items.some((item: OrderItem) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Generate chart data for order trends
  const chartData: ChartDataPoint[] = []
  const days = timeRange === "1d" ? 1 : timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    
    const dayOrders = orders.filter((order: Order) => 
      order.createdAt.split('T')[0] === dateStr
    )
    
    chartData.push({
      date: dateStr,
      orders: dayOrders.length,
      revenue: dayOrders.reduce((sum: number, order: Order) => sum + order.totalAmount, 0),
      avgOrderValue: dayOrders.length > 0 ? dayOrders.reduce((sum: number, order: Order) => sum + order.totalAmount, 0) / dayOrders.length : 0
    })
  }

  // Status distribution
  const statusCounts = orders.reduce((acc: Record<string, number>, order: Order) => {
    acc[order.status] = (acc[order.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const statusData: StatusDataPoint[] = Object.entries(statusCounts).map(([status, count]: [string, number]) => ({
    status: status.charAt(0).toUpperCase() + status.slice(1),
    count,
    percentage: ((count / orders.length) * 100).toFixed(1)
  }))

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-white">{summary.total_orders}</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-blue-400" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-white">${summary.total_revenue.toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-400" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg Order Value</p>
              <p className="text-2xl font-bold text-white">${summary.average_order_value.toFixed(2)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-400" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Completion Rate</p>
              <p className="text-2xl font-bold text-white">
                {orders.length > 0 ? ((orders.filter((o: Order) => o.status === 'delivered').length / orders.length) * 100).toFixed(1) : 0}%
              </p>
            </div>
            <Clock className="h-8 w-8 text-orange-400" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-700/50 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {orderStatuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 flex-1">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders by ID or item name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-gray-700/50 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders Trend */}
        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Orders Trend</h3>
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
                  dataKey="orders" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Status Distribution */}
        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Order Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="status" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Bar dataKey="count" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-gray-400 font-medium py-3">Order ID</th>
                <th className="text-left text-gray-400 font-medium py-3">Items</th>
                <th className="text-left text-gray-400 font-medium py-3">Amount</th>
                <th className="text-left text-gray-400 font-medium py-3">Status</th>
                <th className="text-left text-gray-400 font-medium py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.slice(0, 10).map((order: Order) => (
                <tr key={order.id} className="border-b border-gray-700/30 hover:bg-gray-700/20">
                  <td className="py-3 text-white">{order.orderId}</td>
                  <td className="py-3 text-gray-300">
                    {order.items.slice(0, 2).map((item: OrderItem) => item.name).join(', ')}
                    {order.items.length > 2 && `... +${order.items.length - 2} more`}
                  </td>
                  <td className="py-3 text-white">${order.totalAmount.toFixed(2)}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                      order.status === 'preparing' ? 'bg-yellow-500/20 text-yellow-400' :
                      order.status === 'pending' ? 'bg-red-500/20 text-red-400' :
                      order.status === 'ready' ? 'bg-blue-500/20 text-blue-400' :
                      order.status === 'cancelled' ? 'bg-gray-500/20 text-gray-400' :
                      'bg-purple-500/20 text-purple-400'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No orders found matching your criteria
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}