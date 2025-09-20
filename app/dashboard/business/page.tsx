// app/dashboard/business/page.tsx

"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Home } from "lucide-react"

import BusinessSidebar from "./components/BusinessSidebar"
import OverviewTab from "./components/OverviewTab"
import AnalyticsTab from "./components/AnalyticsTab"
import OperationsTab from "./components/OperationsTab"
import InsightsTab from "./components/InsightsTab"
import type { 
  BusinessMetrics, 
  MenuPerformance, 
  CompetitorData, 
  TabType, 
  TimeRangeType 
} from "./components/types"

export default function BusinessDetailsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("overview")
  const [timeRange, setTimeRange] = useState<TimeRangeType>("month")

  // Mock data - in real app, this would come from API
  const businessMetrics: BusinessMetrics = {
    revenue: {
      daily: 2450,
      weekly: 15800,
      monthly: 67200,
      yearly: 756000,
      growth: 12.5
    },
    customers: {
      total: 3247,
      newThisMonth: 89,
      returningRate: 68.3,
      averageSpend: 42.50
    },
    operations: {
      ordersToday: 127,
      averageWaitTime: 8.5,
      tableUtilization: 78.2,
      staffEfficiency: 92.1
    },
    satisfaction: {
      overallRating: 4.7,
      totalReviews: 892,
      responseRate: 95.2,
      netPromoterScore: 73
    }
  }

  const menuPerformance: MenuPerformance = {
    topItems: [
      { id: "1", name: "Margherita Pizza", category: "Pizza", sales: 234, revenue: 3038, growth: 15.2 },
      { id: "2", name: "Grilled Salmon", category: "Main Course", sales: 189, revenue: 3591, growth: 8.7 },
      { id: "3", name: "Caesar Salad", category: "Salads", sales: 156, revenue: 1404, growth: -2.1 },
      { id: "4", name: "Tiramisu", category: "Desserts", sales: 98, revenue: 784, growth: 22.4 },
      { id: "5", name: "House Wine", category: "Beverages", sales: 145, revenue: 1160, growth: 5.8 }
    ],
    categories: [
      { name: "Main Course", revenue: 28400, orders: 456, margin: 65.2 },
      { name: "Pizza", revenue: 18950, orders: 234, margin: 72.8 },
      { name: "Appetizers", revenue: 12200, orders: 298, margin: 78.5 },
      { name: "Desserts", revenue: 4800, orders: 98, margin: 81.2 },
      { name: "Beverages", revenue: 3650, orders: 189, margin: 85.6 }
    ]
  }

  const competitorData: CompetitorData[] = [
    { name: "Restaurant A", rating: 4.2, avgPrice: 38, distance: "0.3 mi" },
    { name: "Restaurant B", rating: 4.5, avgPrice: 45, distance: "0.7 mi" },
    { name: "Restaurant C", rating: 4.1, avgPrice: 52, distance: "1.2 mi" }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab businessMetrics={businessMetrics} />
      case "analytics":
        return (
          <AnalyticsTab 
            businessMetrics={businessMetrics}
            menuPerformance={menuPerformance}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
          />
        )
      case "operations":
        return (
          <OperationsTab 
            businessMetrics={businessMetrics}
            menuPerformance={menuPerformance}
          />
        )
      case "insights":
        return <InsightsTab competitorData={competitorData} />
      default:
        return <OverviewTab businessMetrics={businessMetrics} />
    }
  }

  return (
    <div className="h-screen bg-gradient-to-br from-[#1a1b2e] via-[#16213e] to-[#1a1b2e] text-white overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#16213e] to-[#1a1b2e] border-b border-gray-700/50 px-6 py-4 shadow-sm flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard" 
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700/30 rounded-lg"
                title="Back to Dashboard"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                  Business Details & Analytics
                </h1>
                <p className="text-gray-400">Comprehensive business insights and performance metrics</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg text-gray-300 hover:text-white transition-all duration-200"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
              <div className="flex items-center gap-2 text-green-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                <span className="text-sm font-medium">Live Data</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <BusinessSidebar 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            businessMetrics={businessMetrics}
          />

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600/50 scrollbar-track-transparent p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  )
}