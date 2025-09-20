// app/dashboard/components/MainPanel.tsx

"use client"

import { ArrowLeft, Users, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useMenuItems, useMenuCategories } from "@/hooks/use-menu"
import type { Table, WorkingHours, ActivityItem, LiveChat, SectionType, ExpandedViewType } from "./types"
import Profile from "../profile/page"
import MenuComponent from "./MenuComponent"
import OrderComponent from "../order-component/OrderComponent"
import TableComponent from "../table-component/TableComponent" // Import the new component

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

  const getTableStatusCounts = () => {
    const occupied = tables.filter((t) => t.status === "occupied").length
    const available = tables.filter((t) => t.status === "available").length
    const cleaning = tables.filter((t) => t.status === "cleaning").length
    return { occupied, available, cleaning }
  }

  const tableStats = getTableStatusCounts()

  const onToggleMenuItemAvailability = async (id: string) => {
    // TODO: Implement API call to update menu item availability
    console.log('Toggle availability for item:', id)
    refreshMenu()
  }

  // Handler for when menu items are created/updated
  const handleMenuRefresh = () => {
    refreshMenu()
    refreshCategories()
  }

  // Handler for order creation
  const handleCreateOrder = () => {
    console.log('Create order button clicked')
    // OrderComponent now handles this internally, no need to set expandedView
  }

  const renderDashboardOverview = () => (
    <div className="p-6 space-y-6">
      {/* Greeting Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
          Good Evening, DEYBYNAVEEN
        </h2>
        <p className="text-gray-400">Here's your live business overview for today</p>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
          <span className="text-green-400 text-sm font-medium">Live Updates</span>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-4">
          <h3 className="text-blue-400 font-semibold mb-2">Total Revenue</h3>
          <div className="text-2xl font-bold text-white">$0.00</div>
        </Card>
        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-4">
          <h3 className="text-green-400 font-semibold mb-2">New Customers</h3>
          <div className="text-2xl font-bold text-white">0</div>
        </Card>
        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-4">
          <h3 className="text-yellow-400 font-semibold mb-2">Menu Items</h3>
          <div className="text-2xl font-bold text-white">{menuLoading ? '...' : menuItems.length}</div>
        </Card>
        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-4">
          <h3 className="text-purple-400 font-semibold mb-2">Categories</h3>
          <div className="text-2xl font-bold text-white">{categoriesLoading ? '...' : categories.length}</div>
        </Card>
      </div>

      {/* Live Activity Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Live Activity Feed</h2>
          <button
            onClick={() => setExpandedView("live-feed")}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            View All
          </button>
        </div>
        <div className="space-y-3">
          {activityFeed.map((activity) => (
            <Card
              key={activity.id}
              className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-4 hover:border-purple-500/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <activity.icon className={`h-5 w-5 ${activity.color}`} />
                  <div>
                    <h4 className="text-white font-medium">{activity.message}</h4>
                    {activity.subtext && <p className="text-gray-400 text-sm">{activity.subtext}</p>}
                  </div>
                </div>
                <span className="text-gray-500 text-xs">{activity.time}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Table Status Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Table Status Overview</h2>
          <button
            onClick={() => setExpandedView("tables")}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Manage Tables
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-4">
            <h3 className="text-green-400 font-semibold mb-2">Available Tables</h3>
            <div className="text-2xl font-bold text-white">{tableStats.available}</div>
          </Card>
          <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-4">
            <h3 className="text-red-400 font-semibold mb-2">Occupied Tables</h3>
            <div className="text-2xl font-bold text-white">{tableStats.occupied}</div>
          </Card>
          <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-4">
            <h3 className="text-yellow-400 font-semibold mb-2">Cleaning Tables</h3>
            <div className="text-2xl font-bold text-white">{tableStats.cleaning}</div>
          </Card>
        </div>
      </div>

      {/* Live Reservations */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Live Reservations</h2>
            <button
              onClick={() => setExpandedView("live-reservations")}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              View All
            </button>
          </div>
          <div className="text-center py-6">
            <div className="text-gray-400 text-sm">No upcoming reservations</div>
          </div>
        </Card>
      </div>
    </div>
  )

  const renderAIChat = () => (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
          AI Chat Support
        </h2>
        <p className="text-gray-400">Manage customer conversations and AI responses</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {liveChats.map((chat) => (
          <Card
            key={chat.id}
            className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6 hover:border-purple-500/30 transition-all duration-300 cursor-pointer"
            onClick={() => setExpandedView(`chat-${chat.id}`)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">{chat.customer.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">{chat.customer}</h3>
                  <p className="text-gray-400 text-sm">{chat.lastMessage}</p>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`w-2 h-2 rounded-full ${chat.status === "online" ? "bg-green-500" : "bg-gray-500"}`}
                ></div>
                <span className="text-gray-500 text-xs">{chat.time}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )

  // Use the MenuComponent instead of the original renderMenu function
  const renderMenu = () => (
    <MenuComponent 
      menuItems={menuItems}
      categories={categories}
      onRefresh={handleMenuRefresh}
    />
  )

  // Render the OrderComponent
  const renderOrders = () => (
    <OrderComponent 
      onCreateOrder={handleCreateOrder}
    />
  )

  // Updated renderTables to use the new TableComponent
  const renderTables = () => (
    <TableComponent />
  )

  const renderWorkingHours = () => (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
          Working Hours
        </h2>
        <p className="text-gray-400">Manage restaurant operating hours and schedules</p>
      </div>

      <div className="space-y-4">
        {workingHours.map((day) => (
          <Card key={day.day} className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h3 className="text-white font-semibold w-24">{day.day}</h3>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={day.isOpen}
                    onChange={() => onToggleDayStatus(day.day)}
                    className="rounded"
                  />
                  <span className="text-gray-400">Open</span>
                </label>
              </div>
              {day.isOpen && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Open:</span>
                    <input
                      type="time"
                      value={day.openTime}
                      onChange={(e) => onUpdateWorkingHours(day.day, "openTime", e.target.value)}
                      className="bg-gray-700 text-white px-3 py-2 rounded-lg text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Close:</span>
                    <input
                      type="time"
                      value={day.closeTime}
                      onChange={(e) => onUpdateWorkingHours(day.day, "closeTime", e.target.value)}
                      className="bg-gray-700 text-white px-3 py-2 rounded-lg text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )

  // Handle expanded views
  const renderExpandedView = () => {
    // OrderComponent now handles its own expanded views internally
    return null
  }

  const renderContent = () => {
    // Handle expanded views first
    if (expandedView) {
      const expandedViewContent = renderExpandedView()
      if (expandedViewContent) return expandedViewContent
      return null
    }
    
    switch (activeSection) {
      case "dashboard":
        return renderDashboardOverview()
      case "ai-chat":
        return renderAIChat()
      case "menu":
        return renderMenu()
      case "orders":
        return renderOrders()
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

  const getPageTitle = () => {
    if (expandedView) {
      switch (expandedView) {
        case "live-reservations":
          return "Live Reservations Management"
        case "live-chat":
          return "Live Chat Support"
        case "live-feed":
          return "Live Activity Feed"
        case "add-menu-item":
          return "Add New Menu Item"
        case "add-category":
          return "Add New Category"
        case "generate-qr":
          return "Generate QR Codes"
        case "import-data":
          return "Import Customer Data"
        case "staff-schedule":
          return "Create Staff Schedule"
        default:
          return "Detailed View"
      }
    }

    switch (activeSection) {
      case "dashboard":
        return "Dashboard Overview"
      case "ai-chat":
        return "AI Chat Support"
      case "menu":
        return "Menu Management"
      case "orders":
        return "Order Management"
      case "tables":
        return "Table Management"
      case "working-hours":
        return "Working Hours"
      case "profile":
        return "Profile Settings"
      default:
        return "Overview"
    }
  }

  const getPageDescription = () => {
    if (expandedView) {
      return "Detailed view and management"
    }

    switch (activeSection) {
      case "dashboard":
        return "Welcome back! Here's your business overview"
      case "ai-chat":
        return "Manage customer conversations and AI responses"
      case "menu":
        return "Manage your restaurant menu items and categories"
      case "orders":
        return "Track and manage all customer orders"
      case "tables":
        return "Monitor and manage restaurant table status"
      case "working-hours":
        return "Manage restaurant operating hours and schedules"
      case "profile":
        return "Manage your personal and restaurant information"
      default:
        return "Welcome back! Here's your business overview"
    }
  }

  return (
    <div className="flex-1 m-4 ml-0 bg-gradient-to-b from-[#16213e] to-[#0f172a] rounded-2xl border border-gray-700/50 backdrop-blur-sm shadow-2xl flex flex-col transition-all duration-300 hover:shadow-purple-500/10">
      <div className="bg-gradient-to-r from-[#16213e] to-[#1a1b2e] border-b border-gray-700/50 px-6 py-4 shadow-sm flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {getPageTitle()}
            </h1>
            <p className="text-gray-400 text-sm">
              {getPageDescription()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {expandedView && (
              <button
                onClick={() => setExpandedView(null)}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg text-gray-300 hover:text-white transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Overview
              </button>
            )}
            {activeSection !== "profile" && !expandedView && (
              <div className="flex items-center gap-2 text-green-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                <span className="text-sm font-medium">Live</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto ${
        activeSection === "profile" 
          ? "" 
          : "scrollbar-thin scrollbar-thumb-gray-600/50 scrollbar-track-transparent hover:scrollbar-thumb-gray-500/70 transition-colors"
      }`}>
        {renderContent()}
      </div>
    </div>
  )
}