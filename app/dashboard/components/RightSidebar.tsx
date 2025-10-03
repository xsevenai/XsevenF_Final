"use client"

import { useTheme } from "@/hooks/useTheme"
import { Loader2, Bell, User } from "lucide-react"

interface RightSidebarProps {
  // Add any props you need for real-time data
}

export default function RightSidebar({}: RightSidebarProps) {
  const { theme, isLoaded: themeLoaded, isDark } = useTheme()

  // Mock real-time data - replace with actual API calls
  const kitchenData = {
    ordersInQueue: 7,
    avgPrepTime: "12 min",
    staffOnDuty: 8
  }

  const salesData = {
    todayRevenue: "$2,847",
    avgOrderValue: "$23.50"
  }

  const customerData = {
    activeCustomers: 156,
    peakHours: "12-2 PM",
    tableTurnover: "1.2x"
  }

  // Theme-aware colors
  const sidebarBg = isDark ? 'bg-[#171717]' : 'bg-white'
  const borderColor = isDark ? 'border-[#2a2a2a]' : 'border-gray-200'
  const cardBg = isDark ? 'bg-[#171717]' : 'bg-white'
  const innerCardBg = isDark ? 'bg-[#1f1f1f]' : 'bg-gray-50'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const headerBg = isDark ? 'bg-[#171717]' : 'bg-white'

  // Show loading while theme is being loaded
  if (!themeLoaded) {
    return (
      <div className={`w-80 ${isDark ? 'bg-gray-900' : 'bg-gray-100'} flex items-center justify-center m-4 rounded-2xl`}>
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  return (
    <div className={`w-80 ${sidebarBg} flex flex-col h-screen border-l ${borderColor} transition-colors duration-300`}>
      {/* Header */}
      <div className={`p-6 border-b ${borderColor}`}>
        <div className="flex items-center justify-end gap-3 mb-4">
          {/* Notification Button */}
          <button 
            className={`relative ${innerCardBg} p-2 rounded-lg border ${borderColor} hover:scale-110 transition-transform`}
            aria-label="Notifications"
          >
            <Bell className={`h-5 w-5 ${textPrimary}`} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
              3
            </span>
          </button>
          
          {/* Profile Button - Oval Shape */}
          <button 
            className={`${innerCardBg} px-4 py-2 rounded-full border ${borderColor} hover:scale-105 transition-transform flex items-center gap-2`}
            aria-label="Profile"
          >
            <User className={`h-5 w-5 ${textPrimary}`} />
            <span className={`${textPrimary} text-sm font-medium`}>JD</span>
          </button>
        </div>
        
        <h2 className={`text-xl font-semibold ${textPrimary}`}>
          Live Metrics
        </h2>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        {/* Kitchen Dashboard Card */}
        <div className={`${cardBg} rounded-xl p-5 border ${borderColor}`}>
          <h3 className={`text-sm font-medium ${textSecondary} mb-4 uppercase tracking-wider`}>Kitchen Dashboard</h3>
          <div className="space-y-3">
            <div className={`${innerCardBg} rounded-lg p-4 border ${borderColor}`}>
              <div className="flex items-center justify-between">
                <span className={`${textSecondary} text-xs`}>Orders in Queue</span>
                <span className={`${textPrimary} text-lg font-semibold`}>{kitchenData.ordersInQueue}</span>
              </div>
            </div>
            
            <div className={`${innerCardBg} rounded-lg p-4 border ${borderColor}`}>
              <div className="flex items-center justify-between">
                <span className={`${textSecondary} text-xs`}>Avg Prep Time</span>
                <span className={`${textPrimary} text-lg font-semibold`}>{kitchenData.avgPrepTime}</span>
              </div>
            </div>
            
            <div className={`${innerCardBg} rounded-lg p-4 border ${borderColor}`}>
              <div className="flex items-center justify-between">
                <span className={`${textSecondary} text-xs`}>Staff on Duty</span>
                <span className={`${textPrimary} text-lg font-semibold`}>{kitchenData.staffOnDuty}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sales Overview Card */}
        <div className={`${cardBg} rounded-xl p-5 border ${borderColor}`}>
          <h3 className={`text-sm font-medium ${textSecondary} mb-4 uppercase tracking-wider`}>Sales Overview</h3>
          <div className="space-y-3">
            <div className={`${innerCardBg} rounded-lg p-4 border ${borderColor}`}>
              <div className="flex items-center justify-between">
                <span className={`${textSecondary} text-xs`}>Today's Revenue</span>
                <span className="text-green-500 text-lg font-semibold">{salesData.todayRevenue}</span>
              </div>
            </div>
            
            <div className={`${innerCardBg} rounded-lg p-4 border ${borderColor}`}>
              <div className="flex items-center justify-between">
                <span className={`${textSecondary} text-xs`}>Avg Order Value</span>
                <span className={`${textPrimary} text-lg font-semibold`}>{salesData.avgOrderValue}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Analytics Card */}
        <div className={`${cardBg} rounded-xl p-5 border ${borderColor}`}>
          <h3 className={`text-sm font-medium ${textSecondary} mb-4 uppercase tracking-wider`}>Customer Analytics</h3>
          <div className="space-y-3">
            <div className={`${innerCardBg} rounded-lg p-4 border ${borderColor}`}>
              <div className="flex items-center justify-between">
                <span className={`${textSecondary} text-xs`}>Active Customers</span>
                <span className="text-blue-500 text-lg font-semibold">{customerData.activeCustomers}</span>
              </div>
            </div>
            
            <div className={`${innerCardBg} rounded-lg p-4 border ${borderColor}`}>
              <div className="flex items-center justify-between">
                <span className={`${textSecondary} text-xs`}>Peak Hours</span>
                <span className={`${textPrimary} text-sm font-semibold`}>{customerData.peakHours}</span>
              </div>
            </div>
            
            <div className={`${innerCardBg} rounded-lg p-4 border ${borderColor}`}>
              <div className="flex items-center justify-between">
                <span className={`${textSecondary} text-xs`}>Table Turnover</span>
                <span className="text-yellow-500 text-lg font-semibold">{customerData.tableTurnover}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Status Card */}
        <div className={`${cardBg} rounded-xl p-5 border ${borderColor}`}>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-500 text-xs font-medium">Live Updates</span>
          </div>
        </div>
      </div>
    </div>
  )
}