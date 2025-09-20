// app/dashboard/business/components/AnalyticsTab.tsx

"use client"

import { Card } from "@/components/ui/card"
import { BarChart3, PieChart, Users, TrendingUp } from "lucide-react"
import type { BusinessMetrics, MenuPerformance, TimeRangeType } from "./types"

interface AnalyticsTabProps {
  businessMetrics: BusinessMetrics
  menuPerformance: MenuPerformance
  timeRange: TimeRangeType
  setTimeRange: (range: TimeRangeType) => void
}

export default function AnalyticsTab({ 
  businessMetrics, 
  menuPerformance, 
  timeRange, 
  setTimeRange 
}: AnalyticsTabProps) {
  return (
    <div className="space-y-6">
      {/* Revenue Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-green-400" />
            Revenue Breakdown
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Today</span>
              <span className="text-white font-semibold">${businessMetrics.revenue.daily.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">This Week</span>
              <span className="text-white font-semibold">${businessMetrics.revenue.weekly.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">This Month</span>
              <span className="text-white font-semibold">${businessMetrics.revenue.monthly.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">This Year</span>
              <span className="text-white font-semibold">${businessMetrics.revenue.yearly.toLocaleString()}</span>
            </div>
          </div>
          <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <span className="text-green-400 font-medium">Growth Rate: +{businessMetrics.revenue.growth}%</span>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <PieChart className="h-5 w-5 text-blue-400" />
            Revenue by Category
          </h3>
          <div className="space-y-3">
            {menuPerformance.categories.map((category, index) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    index === 0 ? 'bg-blue-500' :
                    index === 1 ? 'bg-green-500' :
                    index === 2 ? 'bg-purple-500' :
                    index === 3 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-gray-300">{category.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">${category.revenue.toLocaleString()}</div>
                  <div className="text-gray-400 text-sm">{category.orders} orders</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Customer Analytics */}
      <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
        <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
          <Users className="h-5 w-5 text-purple-400" />
          Customer Analytics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-2">{businessMetrics.customers.total}</div>
            <div className="text-gray-400 text-sm">Total Customers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-2">{businessMetrics.customers.newThisMonth}</div>
            <div className="text-gray-400 text-sm">New This Month</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400 mb-2">{businessMetrics.customers.returningRate}%</div>
            <div className="text-gray-400 text-sm">Return Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-2">${businessMetrics.customers.averageSpend}</div>
            <div className="text-gray-400 text-sm">Avg Spend</div>
          </div>
        </div>
      </Card>

      {/* Time-based Analytics Chart Placeholder */}
      <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-cyan-400" />
            Revenue Trends
          </h3>
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRangeType)}
            className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
        <div className="h-64 bg-gray-800/50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">Revenue trend chart would appear here</p>
            <p className="text-gray-500 text-sm">Integration with charting library needed</p>
          </div>
        </div>
      </Card>
    </div>
  )
}