// app/dashboard/business/components/BusinessSidebar.tsx

"use client"

import { Home, BarChart3, Activity, Target } from "lucide-react"
import type { TabType, BusinessMetrics } from "./types"

interface BusinessSidebarProps {
  activeTab: TabType
  setActiveTab: (tab: TabType) => void
  businessMetrics: BusinessMetrics
}

export default function BusinessSidebar({ activeTab, setActiveTab, businessMetrics }: BusinessSidebarProps) {
  const tabs = [
    { id: "overview" as const, label: "Business Overview", icon: Home },
    { id: "analytics" as const, label: "Revenue Analytics", icon: BarChart3 },
    { id: "operations" as const, label: "Operations", icon: Activity },
    { id: "insights" as const, label: "Market Insights", icon: Target },
  ]

  return (
    <div className="w-80 bg-gradient-to-b from-[#16213e] to-[#0f172a] border-r border-gray-700/50 p-6">
      <nav className="space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-300 ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] text-white shadow-lg shadow-purple-500/25"
                : "text-gray-300 hover:bg-gray-700/30 hover:text-white"
            }`}
          >
            <tab.icon className="h-5 w-5 flex-shrink-0" />
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Quick Stats Sidebar */}
      <div className="mt-8 space-y-4">
        <div className="p-4 bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] rounded-xl border border-gray-700/50">
          <h4 className="text-white font-semibold mb-3">Today's Summary</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Revenue</span>
              <span className="text-green-400 font-medium">${businessMetrics.revenue.daily}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Orders</span>
              <span className="text-white font-medium">{businessMetrics.operations.ordersToday}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Avg Wait</span>
              <span className="text-yellow-400 font-medium">{businessMetrics.operations.averageWaitTime}m</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] rounded-xl border border-gray-700/50">
          <h4 className="text-white font-semibold mb-3">Performance Score</h4>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-1">A+</div>
            <div className="text-gray-400 text-sm">Excellent Performance</div>
            <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{width: '92%'}}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}