// app/dashboard/components/MainPanel.tsx

"use client"

import { ArrowLeft, Users, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { useMenuItems, useMenuCategories } from "@/hooks/use-menu"
import { useTheme } from "@/hooks/useTheme"
import type { Table, WorkingHours, ActivityItem, LiveChat, SectionType, ExpandedViewType } from "./types"
import Profile from "../profile/page"
import MenuComponent from "./MenuComponent"
import OrderComponent from "../order-component/OrderComponent"
import TableComponent from "../table-component/TableComponent"
import InventoryComponent from "../inventory-management/InventoryComponent"
import FoodQRComponent from "../food-qr-component/FoodQRComponent"
import AnalyticsComponent from "../analytics-component/AnalyticsComponent"

interface MainPanelProps {
  activeSection: SectionType
  expandedView: ExpandedViewType
  setExpandedView: (view: ExpandedViewType) => void
  tables: Table[]
  workingHours: WorkingHours[]
  activityFeed: ActivityItem[]
  liveChats: LiveChat[]
  onUpdateTableStatus: (id: string, status: string) => void
  onToggleDayStatus: (day: string) => void
  onUpdateWorkingHours: (day: string, field: keyof WorkingHours, value: string) => void
}

export default function MainPanel({
  activeSection,
  expandedView,
  setExpandedView,
  tables,
  workingHours,
  activityFeed,
  liveChats,
  onUpdateTableStatus,
  onToggleDayStatus,
  onUpdateWorkingHours,
}: MainPanelProps) {
  const { items: menuItems, loading: menuLoading, error: menuError, refresh: refreshMenu } = useMenuItems()
  const { categories, loading: categoriesLoading, error: categoriesError, refresh: refreshCategories } = useMenuCategories()
  const { theme, isLoaded: themeLoaded, isDark, currentTheme } = useTheme()

  // Remove the manual localStorage polling - useTheme hook already handles this
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const getTableStatusCounts = () => {
    const occupied = tables.filter((t) => t.status === "occupied").length
    const available = tables.filter((t) => t.status === "available").length
    const cleaning = tables.filter((t) => t.status === "cleaning").length
    return { occupied, available, cleaning }
  }

  const tableStats = getTableStatusCounts()

  const onToggleMenuItemAvailability = async (id: string) => {
    console.log('Toggle availability for item:', id)
    refreshMenu()
  }

  const handleMenuRefresh = () => {
    refreshMenu()
    refreshCategories()
  }

  const handleCreateOrder = () => {
    console.log('Create order button clicked')
  }

  // Show loading while theme is being loaded
  if (!themeLoaded || !mounted) {
    return (
      <div className="flex-1 bg-gray-100 dark:bg-gray-900 flex items-center justify-center transition-all duration-300">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  // Theme-aware background and text colors
  const mainPanelBg = isDark ? 'bg-[#111111]' : 'bg-gray-50'
  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const innerCardBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'

  const renderDashboardOverview = () => (
    <div className="p-6 space-y-6">
      {/* Page Header Card */}
      <div className={`${cardBg} rounded-xl p-6 border shadow-lg`}>
        <h1 className={`text-3xl font-semibold ${textPrimary} mb-2`}>
          Dashboard
        </h1>
        <p className={`${textSecondary} text-sm`}>Welcome back! Here's your business overview</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className={`${cardBg} rounded-xl p-6 border shadow-lg`}>
          <h3 className={`${textSecondary} text-sm font-medium mb-2`}>Total Revenue</h3>
          <div className={`${textPrimary} text-2xl font-semibold`}>$12,345</div>
        </div>
        <div className={`${cardBg} rounded-xl p-6 border shadow-lg`}>
          <h3 className={`${textSecondary} text-sm font-medium mb-2`}>New Customers</h3>
          <div className={`${textPrimary} text-2xl font-semibold`}>1,234</div>
        </div>
        <div className={`${cardBg} rounded-xl p-6 border shadow-lg`}>
          <h3 className={`${textSecondary} text-sm font-medium mb-2`}>Menu Items</h3>
          <div className={`${textPrimary} text-2xl font-semibold`}>{menuLoading ? '...' : menuItems.length || '56'}</div>
        </div>
        <div className={`${cardBg} rounded-xl p-6 border shadow-lg`}>
          <h3 className={`${textSecondary} text-sm font-medium mb-2`}>Categories</h3>
          <div className={`${textPrimary} text-2xl font-semibold`}>{categoriesLoading ? '...' : categories.length || '12'}</div>
        </div>
      </div>

      {/* Quick Actions Card */}
      <div className={`${cardBg} rounded-xl p-6 border shadow-lg`}>
        <h2 className={`text-lg font-semibold ${textPrimary} mb-4`}>Quick Actions</h2>
        <div className="space-y-3">
          <button
            onClick={() => setExpandedView("add-menu-item")}
            className={`w-full flex items-center space-x-3 ${innerCardBg} rounded-lg p-4 hover:bg-opacity-80 transition-colors text-left border`}
          >
            <div className={`w-6 h-6 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded flex items-center justify-center`}>
              <span className={`${textPrimary} text-sm`}>+</span>
            </div>
            <span className={`${textPrimary} text-sm font-medium`}>Add New Menu Item</span>
          </button>
          <button
            onClick={() => setExpandedView("add-category")}
            className={`w-full flex items-center space-x-3 ${innerCardBg} rounded-lg p-4 hover:bg-opacity-80 transition-colors text-left border`}
          >
            <div className={`w-6 h-6 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded flex items-center justify-center`}>
              <span className={`${textPrimary} text-sm`}>⊞</span>
            </div>
            <span className={`${textPrimary} text-sm font-medium`}>Add New Category</span>
          </button>
          <button
            onClick={() => setExpandedView("add-inventory-item")}
            className={`w-full flex items-center space-x-3 ${innerCardBg} rounded-lg p-4 hover:bg-opacity-80 transition-colors text-left border`}
          >
            <div className={`w-6 h-6 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded flex items-center justify-center`}>
              <span className={`${textPrimary} text-sm`}>📦</span>
            </div>
            <span className={`${textPrimary} text-sm font-medium`}>Add Inventory Item</span>
          </button>
        </div>
      </div>

      {/* Recent Activity Card */}
      <div className={`${cardBg} rounded-xl p-6 border shadow-lg`}>
        <h2 className={`text-lg font-semibold ${textPrimary} mb-4`}>Recent Activity</h2>
        <div className="space-y-3">
          {activityFeed.slice(0, 3).map((activity) => (
            <div
              key={activity.id}
              className={`${innerCardBg} rounded-lg p-4 border`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <activity.icon className={`h-5 w-5 ${activity.color}`} />
                  <div>
                    <h4 className={`${textPrimary} font-medium text-sm`}>{activity.message}</h4>
                    {activity.subtext && <p className={`${textSecondary} text-xs mt-1`}>{activity.subtext}</p>}
                  </div>
                </div>
                <span className={`${textSecondary} text-xs`}>{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table Status Card */}
      <div className={`${cardBg} rounded-xl p-6 border shadow-lg`}>
        <h2 className={`text-lg font-semibold ${textPrimary} mb-4`}>Table Status</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className={`${innerCardBg} rounded-lg p-4 border`}>
            <h3 className="text-green-400 text-xs font-medium mb-2">Available</h3>
            <div className={`${textPrimary} text-xl font-semibold`}>{tableStats.available}</div>
          </div>
          <div className={`${innerCardBg} rounded-lg p-4 border`}>
            <h3 className="text-red-400 text-xs font-medium mb-2">Occupied</h3>
            <div className={`${textPrimary} text-xl font-semibold`}>{tableStats.occupied}</div>
          </div>
          <div className={`${innerCardBg} rounded-lg p-4 border`}>
            <h3 className="text-yellow-400 text-xs font-medium mb-2">Cleaning</h3>
            <div className={`${textPrimary} text-xl font-semibold`}>{tableStats.cleaning}</div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderAIChat = () => (
    <div className="p-6 space-y-6">
      {/* Page Header Card */}
      <div className={`${cardBg} rounded-xl p-6 border shadow-lg`}>
        <h1 className={`text-3xl font-semibold ${textPrimary} mb-2`}>
          AI Chat Support
        </h1>
        <p className={`${textSecondary} text-sm`}>Manage customer conversations and AI responses</p>
      </div>

      {/* Chat Cards */}
      <div className="space-y-4">
        {liveChats.map((chat) => (
          <div
            key={chat.id}
            className={`${cardBg} rounded-xl p-6 border shadow-lg transition-colors cursor-pointer hover:bg-opacity-80`}
            onClick={() => setExpandedView(`chat-${chat.id}`)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">{chat.customer.charAt(0)}</span>
                </div>
                <div>
                  <h3 className={`${textPrimary} font-semibold text-sm`}>{chat.customer}</h3>
                  <p className={`${textSecondary} text-xs mt-1`}>{chat.lastMessage}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`w-2 h-2 rounded-full ${chat.status === "online" ? "bg-green-500" : "bg-gray-500"} mb-2`}></div>
                <span className={`${textSecondary} text-xs`}>{chat.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderWorkingHours = () => (
    <div className="p-6 space-y-6">
      {/* Page Header Card */}
      <div className={`${cardBg} rounded-xl p-6 border shadow-lg`}>
        <h1 className={`text-3xl font-semibold ${textPrimary} mb-2`}>
          Working Hours
        </h1>
        <p className={`${textSecondary} text-sm`}>Manage restaurant operating hours and schedules</p>
      </div>

      {/* Working Hours Cards */}
      <div className="space-y-4">
        {workingHours.map((day) => (
          <div key={day.day} className={`${cardBg} rounded-xl p-6 border shadow-lg`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h3 className={`${textPrimary} font-semibold text-base w-24`}>{day.day}</h3>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={day.isOpen}
                    onChange={() => onToggleDayStatus(day.day)}
                    className="w-4 h-4 rounded"
                  />
                  <span className={`${textSecondary} text-sm`}>Open</span>
                </label>
              </div>
              {day.isOpen && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className={`${textSecondary} text-sm`}>Open:</span>
                    <input
                      type="time"
                      value={day.openTime}
                      onChange={(e) => onUpdateWorkingHours(day.day, "openTime", e.target.value)}
                      className={`${innerCardBg} ${textPrimary} px-3 py-2 rounded-lg text-sm border`}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`${textSecondary} text-sm`}>Close:</span>
                    <input
                      type="time"
                      value={day.closeTime}
                      onChange={(e) => onUpdateWorkingHours(day.day, "closeTime", e.target.value)}
                      className={`${innerCardBg} ${textPrimary} px-3 py-2 rounded-lg text-sm border`}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderExpandedView = () => {
    return null
  }

  const renderAnalytics = () => (
    <AnalyticsComponent />
  )

  const renderMenu = () => (
    <MenuComponent 
      menuItems={menuItems}
      categories={categories}
      onRefresh={handleMenuRefresh}
    />
  )

  const renderOrders = () => (
    <OrderComponent 
      onCreateOrder={handleCreateOrder}
    />
  )

  const renderInventory = () => (
    <InventoryComponent />
  )

  const renderFoodQR = () => (
    <FoodQRComponent />
  )

  const renderTables = () => (
    <TableComponent />
  )

  const renderContent = () => {
    if (expandedView) {
      const expandedViewContent = renderExpandedView()
      if (expandedViewContent) return expandedViewContent
      return null
    }
    
    switch (activeSection) {
      case "dashboard":
        return renderDashboardOverview()
      case "analytics":
        return renderAnalytics()
      case "ai-chat":
        return renderAIChat()
      case "menu":
        return renderMenu()
      case "orders":
        return renderOrders()
      case "inventory":
        return renderInventory()
      case "food-qr":
        return renderFoodQR()
      case "tables":
        return renderTables()
      case "working-hours":
        return renderWorkingHours()
      case "profile":
        return <Profile />
      default:
        return renderDashboardOverview()
    }
  }

  return (
    <div className={`flex-1 ${mainPanelBg} h-screen overflow-y-auto transition-colors duration-300`} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      {renderContent()}
    </div>
  )
}