// app/dashboard/analytics-component/AnalyticsComponent.tsx

"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  MessageSquare, 
  Users,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from "lucide-react"
import OrdersAnalytics from "./OrdersAnalytics"
import MessagesAnalytics from "./MessagesAnalytics"
import RevenueAnalytics from "./RevenueAnalytics"
import CustomerAnalytics from "./CustomerAnalytics"
import ExportData from "./ExportData"
import AnalyticsOverview from "./AnalyticsOverview"
type AnalyticsView = 
  | "overview" 
  | "orders" 
  | "messages" 
  | "revenue" 
  | "customers" 
  | "export"

export default function AnalyticsComponent() {
  const [activeView, setActiveView] = useState<AnalyticsView>("overview")
  const [timeRange, setTimeRange] = useState("7d")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const analyticsViews = [
    { 
      id: "overview" as const, 
      label: "Overview", 
      icon: BarChart3,
      description: "Key metrics and insights"
    },
    { 
      id: "orders" as const, 
      label: "Orders", 
      icon: ShoppingCart,
      description: "Order analytics and trends"
    },
    { 
      id: "messages" as const, 
      label: "Messages", 
      icon: MessageSquare,
      description: "Customer communication insights"
    },
    { 
      id: "revenue" as const, 
      label: "Revenue", 
      icon: DollarSign,
      description: "Financial performance analysis"
    },
    { 
      id: "customers" as const, 
      label: "Customers", 
      icon: Users,
      description: "Customer behavior and patterns"
    },
    { 
      id: "export" as const, 
      label: "Export", 
      icon: Download,
      description: "Export data for analysis"
    },
  ]

  const timeRanges = [
    { value: "1d", label: "Today" },
    { value: "7d", label: "7 Days" },
    { value: "30d", label: "30 Days" },
    { value: "90d", label: "90 Days" },
  ]

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const renderActiveView = () => {
    switch (activeView) {
      case "overview":
        return <AnalyticsOverview timeRange={timeRange} />
      case "orders":
        return <OrdersAnalytics timeRange={timeRange} />
      case "messages":
        return <MessagesAnalytics timeRange={timeRange} />
      case "revenue":
        return <RevenueAnalytics timeRange={timeRange} />
      case "customers":
        return <CustomerAnalytics timeRange={timeRange} />
      case "export":
        return <ExportData />
      default:
        return <AnalyticsOverview timeRange={timeRange} />
    }
  }

  const getActiveViewInfo = () => {
    return analyticsViews.find(view => view.id === activeView) || analyticsViews[0]
  }

  const activeViewInfo = getActiveViewInfo()

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Analytics Dashboard
            </h2>
            <p className="text-gray-400">
              {activeViewInfo.description} • {timeRanges.find(t => t.value === timeRange)?.label}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Time Range Selector */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-gray-700/50 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {timeRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-3 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/30 rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {analyticsViews.map((view) => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                activeView === view.id
                  ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/25"
                  : "bg-gray-700/30 text-gray-300 hover:bg-gray-600/30 hover:text-white"
              }`}
            >
              <view.icon className="h-4 w-4" />
              {view.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-[600px]">
        {renderActiveView()}
      </div>
    </div>
  )
}