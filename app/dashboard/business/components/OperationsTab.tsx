// app/dashboard/business/components/OperationsTab.tsx

"use client"

import { Card } from "@/components/ui/card"
import { ChefHat, Clock, Target, Users, ArrowUpRight, ArrowDownRight } from "lucide-react"
import type { BusinessMetrics, MenuPerformance } from "./types"

interface OperationsTabProps {
  businessMetrics: BusinessMetrics
  menuPerformance: MenuPerformance
}

export default function OperationsTab({ businessMetrics, menuPerformance }: OperationsTabProps) {
  return (
    <div className="space-y-6">
      {/* Top Performing Items */}
      <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
        <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
          <ChefHat className="h-5 w-5 text-orange-400" />
          Top Performing Menu Items
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 text-gray-400 font-medium">Item Name</th>
                <th className="text-left py-3 text-gray-400 font-medium">Category</th>
                <th className="text-right py-3 text-gray-400 font-medium">Sales</th>
                <th className="text-right py-3 text-gray-400 font-medium">Revenue</th>
                <th className="text-right py-3 text-gray-400 font-medium">Growth</th>
              </tr>
            </thead>
            <tbody>
              {menuPerformance.topItems.map((item) => (
                <tr key={item.id} className="border-b border-gray-800">
                  <td className="py-4 text-white font-medium">{item.name}</td>
                  <td className="py-4 text-gray-400">{item.category}</td>
                  <td className="py-4 text-right text-white">{item.sales}</td>
                  <td className="py-4 text-right text-white">${item.revenue.toLocaleString()}</td>
                  <td className="py-4 text-right">
                    <div className={`flex items-center justify-end gap-1 ${item.growth > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {item.growth > 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                      <span>{Math.abs(item.growth)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Operational Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-400" />
            Service Efficiency
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Average Wait Time</span>
              <span className="text-white font-semibold">{businessMetrics.operations.averageWaitTime} min</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Orders Completed Today</span>
              <span className="text-white font-semibold">{businessMetrics.operations.ordersToday}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Peak Hour</span>
              <span className="text-white font-semibold">7:30 PM - 8:30 PM</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Current Queue</span>
              <span className="text-green-400 font-semibold">3 orders</span>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-green-400" />
            Category Performance
          </h3>
          <div className="space-y-3">
            {menuPerformance.categories.slice(0, 4).map((category) => (
              <div key={category.name} className="flex justify-between items-center">
                <span className="text-gray-400">{category.name}</span>
                <div className="text-right">
                  <div className="text-white font-semibold">{category.margin}%</div>
                  <div className="text-gray-400 text-sm">profit margin</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Staffing Overview */}
      <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-400" />
          Staffing & Capacity
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">12</div>
            <div className="text-gray-400">Staff On Duty</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">85%</div>
            <div className="text-gray-400">Productivity Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">48</div>
            <div className="text-gray-400">Max Capacity</div>
          </div>
        </div>
      </Card>
    </div>
  )
}