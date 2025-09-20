// app/dashboard/components/AnalyticsPanel.tsx

"use client"

import {
  Activity,
  TrendingUp,
  Users,
  MenuIcon,
  BarChart3,
  ChefHat,
} from "lucide-react"
import type { Table } from "./types"

interface AnalyticsPanelProps {
  tables: Table[]
}

export default function AnalyticsPanel({ tables }: AnalyticsPanelProps) {
  return (
    <div className="w-80 m-4 ml-0 bg-gradient-to-b from-[#16213e] to-[#0f172a] rounded-2xl border border-gray-700/50 backdrop-blur-sm shadow-2xl flex flex-col transition-all duration-300 hover:shadow-purple-500/10">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#16213e] to-[#1a1b2e] border-b border-gray-700/50 px-6 py-4 shadow-sm flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Analytics & Outputs</h2>
            <p className="text-gray-400 text-sm">Real-time insights and reports</p>
          </div>
          <div className="flex items-center gap-2 text-green-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
            <span className="text-sm font-medium">Live</span>
          </div>
        </div>
      </div>

      {/* Analytics Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600/50 scrollbar-track-transparent hover:scrollbar-thumb-gray-500/70 transition-colors p-6 space-y-6">
        {/* Real-Time Performance */}
        <div className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] rounded-xl border border-gray-700/50 p-4">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-orange-400" />
            Real-Time Performance
          </h3>

          {/* Kitchen Dashboard */}
          <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg p-4 mb-4 border border-orange-500/20">
            <div className="flex items-center gap-2 mb-3">
              <ChefHat className="h-4 w-4 text-orange-400" />
              <span className="text-orange-400 font-medium text-sm">Kitchen Dashboard</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">0</div>
                <div className="text-xs text-gray-400">Orders in Queue</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">12m</div>
                <div className="text-xs text-gray-400">Avg Prep Time</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">5</div>
                <div className="text-xs text-gray-400">Staff On Duty</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sales Overview */}
        <div className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] rounded-xl border border-gray-700/50 p-4">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            Sales Overview
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Today's Revenue</span>
              <span className="text-2xl font-bold text-white">$0.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Peak Hour</span>
              <span className="text-white font-medium">0:00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Avg Order</span>
              <span className="text-white font-medium">$0.00</span>
            </div>
          </div>
        </div>

        {/* Customer Flow */}
        <div className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] rounded-xl border border-gray-700/50 p-4">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-400" />
            Customer Flow
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Table Turnover</span>
              <span className="text-2xl font-bold text-white">0%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Avg Wait Time</span>
              <span className="text-white font-medium">8m</span>
            </div>
          </div>
        </div>

        {/* Menu Performance */}
        <div className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] rounded-xl border border-gray-700/50 p-4">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <MenuIcon className="h-5 w-5 text-purple-400" />
            Menu Performance
          </h3>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-400 mb-1">Best Sellers</div>
              <div className="text-white font-medium">No data yet</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Low Performers</div>
              <div className="text-white font-medium">No data yet</div>
            </div>
          </div>
        </div>

        {/* Visual Analytics */}
        <div className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] rounded-xl border border-gray-700/50 p-4">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-cyan-400" />
            Visual Analytics
          </h3>
          <div className="text-center py-8">
            <div className="text-gray-400 text-sm">Charts and graphs will appear here</div>
          </div>
        </div>
      </div>
    </div>
  )
}