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
import MenuAnalyticsComponent from "../menu-category-component/MenuAnalyticsComponent" // Import your MenuAnalyticsComponent

type AnalyticsView = 
  | "overview" 
  | "analytics" 
  | "orders" 
  | "messages" 
  | "revenue" 
  | "customers" 
  | "export"
  | "menu-analytics" // Add this new view

interface AnalyticsComponentProps {
  onBack?: () => void // Optional prop for navigation
}

export default function AnalyticsComponent({ onBack }: AnalyticsComponentProps) {
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
      id: "analytics" as const, 
      label: "Analytics", 
      icon: TrendingUp,
      description: "Detailed analytics and trends"
    },
    { 
      id: "menu-analytics" as const, // New tab for menu analytics
      label: "Menu Analytics", 
      icon: BarChart3,
      description: "Menu performance and profitability"
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

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      setActiveView("overview") // Fallback to overview if no onBack provided
    }
  }

  const renderActiveView = () => {
    switch (activeView) {
      case "overview":
        return <AnalyticsOverview timeRange={timeRange} />
      case "analytics":
        return (
          <div className="space-y-6">
            {/* Your existing analytics content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Total Orders</p>
                    <p className="text-2xl font-bold text-white mt-2">1,247</p>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-purple-400" />
                </div>
                <p className="text-xs text-green-400 mt-2">↑ 12% from last period</p>
              </Card>
              {/* ... other cards */}
            </div>
          </div>
        )
      case "menu-analytics":
        // This will render your MenuAnalyticsComponent
        return <MenuAnalyticsComponent onBack={handleBack} />
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
            {/* Time Range Selector - Only show for relevant views */}
            {activeView !== "menu-analytics" && (
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
            )}

            {/* Refresh Button - Only show for non-menu-analytics views */}
            {activeView !== "menu-analytics" && (
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-3 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/30 rounded-lg transition-all duration-200 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs - Only show when not in menu-analytics view */}
        {activeView !== "menu-analytics" && (
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
        )}
      </div>

      {/* Main Content */}
      <div className="min-h-[600px]">
        {renderActiveView()}
      </div>
    </div>
  )
}