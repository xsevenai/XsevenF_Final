// app/dashboard/analytics-component/RevenueAnalytics.tsx

"use client"

import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { DollarSign, TrendingUp, CreditCard, Wallet } from "lucide-react"

interface RevenueAnalyticsProps {
  timeRange: string
}

export default function RevenueAnalytics({ timeRange }: RevenueAnalyticsProps) {
  // Mock data - replace with real API call
  const revenueData = {
    total: 15420.50,
    growth: 12.5,
    avgOrderValue: 32.45,
    transactions: 475
  }

  const chartData = [
    { date: '2024-01-01', revenue: 1200, orders: 35 },
    { date: '2024-01-02', revenue: 1800, orders: 42 },
    { date: '2024-01-03', revenue: 1500, orders: 38 },
    { date: '2024-01-04', revenue: 2100, orders: 55 },
    { date: '2024-01-05', revenue: 1900, orders: 48 },
    { date: '2024-01-06', revenue: 2300, orders: 60 },
    { date: '2024-01-07', revenue: 2000, orders: 52 }
  ]

  return (
    <div className="space-y-6">
      {/* Revenue Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-white">${revenueData.total.toFixed(2)}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span className="text-sm ml-1 text-green-400">+{revenueData.growth}%</span>
              </div>
            </div>
            <DollarSign className="h-8 w-8 text-green-400" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg Order Value</p>
              <p className="text-2xl font-bold text-white">${revenueData.avgOrderValue.toFixed(2)}</p>
            </div>
            <CreditCard className="h-8 w-8 text-blue-400" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Transactions</p>
              <p className="text-2xl font-bold text-white">{revenueData.transactions}</p>
            </div>
            <Wallet className="h-8 w-8 text-purple-400" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Revenue/Order</p>
              <p className="text-2xl font-bold text-white">${(revenueData.total / revenueData.transactions).toFixed(2)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-400" />
          </div>
        </Card>
      </div>

      {/* Revenue Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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

        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Revenue vs Orders</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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
                <Bar dataKey="revenue" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Revenue Breakdown */}
      <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Revenue Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-gray-400 text-sm">Food & Beverages</p>
            <p className="text-2xl font-bold text-white">$12,450</p>
            <p className="text-green-400 text-sm">80.7%</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm">Delivery Fees</p>
            <p className="text-2xl font-bold text-white">$1,890</p>
            <p className="text-blue-400 text-sm">12.3%</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm">Tips</p>
            <p className="text-2xl font-bold text-white">$1,080</p>
            <p className="text-purple-400 text-sm">7.0%</p>
          </div>
        </div>
      </Card>
    </div>
  )
}