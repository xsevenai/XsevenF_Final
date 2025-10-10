// app/dashboard/components/MainPanel.tsx

"use client"

import { ArrowLeft, Users, Loader2, TrendingUp, DollarSign, ShoppingBag, Package } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { useMenu } from "@/hooks/use-menu"
import { useTheme } from "@/hooks/useTheme"
import type { Table, WorkingHours, ActivityItem, LiveChat, SectionType, ExpandedViewType } from "./types"
import type { MenuItem } from "@/src/api/generated/models/MenuItem"
import type { MenuCategory } from "@/src/api/generated/models/MenuCategory"

// Import existing components
import Profile from "../profile/page"
import NotificationComponent from "../notifcation/NotificationComponent"
import BillComponent from "./BillComponent"
import MenuComponent from "../menu-category-component/MenuComponent"
import OrderComponent from "../order-component/OrderComponent"
import TableComponent from "../table-component/TableComponent"
import InventoryComponent from "../inventory-management/InventoryComponent"
import FoodQRComponent from "../food-qr-component/FoodQRComponent"
import AnalyticsComponent from "../analytics-component/AnalyticsComponent"

// Import new menu components
import MenuAttributesComponent from "../menu-category-component/MenuAttributesComponent"
import MenuDiscountsComponent from "../menu-category-component/MenuDiscountsComponent"
import MenuListingsComponent from "../menu-category-component/MenuListingsComponent"
import MenuModifiersComponent from "../menu-category-component/MenuModifiersComponent"
import MenuServicesComponent from "../menu-category-component/MenuServicesComponent"

// Import upload components
import MenuUploadQRComponent from "../menu-category-component/MenuUploadQRComponent"
import CategoryUploadQRComponent from "./CategoryUploadQRComponent"
import InventoryUploadQRComponent from "./InventoryUploadQRComponent"
import CustomerDirectoryComponent from "../customer-component/CustomerDirectoryComponent"
import CustomerFeedbackComponent from "../customer-component/CustomerFeedbackComponent"
import POSComponent from "../pos-component.tsx/PosComponent"
import FloorPlanComponent from "../floorplan-component/FloorPlanComponent"

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
  menuItems: MenuItem[]
  menuCategories: MenuCategory[]
  onRefreshMenu: () => void
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
  menuItems,
  menuCategories,
  onRefreshMenu,
}: MainPanelProps) {
  // Get businessId from localStorage or your auth context
  const [businessId, setBusinessId] = useState<string>("")
  
  useEffect(() => {
    // Get business ID from localStorage or your auth system
    const storedBusinessId = localStorage.getItem('businessId')
    if (storedBusinessId) {
      setBusinessId(storedBusinessId)
    } else {
      console.warn('No business ID found. Please ensure user is logged in.')
    }
  }, [])

  // Use the merged menu hook for additional functionality if needed
  const { 
    loading: menuLoading,
    error: menuError,
    refreshAll
  } = useMenu(businessId)
  
  const { theme, isLoaded: themeLoaded, isDark, currentTheme } = useTheme()

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

  const handleCreateOrder = () => {
    console.log('Create order button clicked')
  }

  if (!themeLoaded || !mounted) {
    return (
      <div className={`flex-1 ${isDark ? 'bg-[#111111]' : 'bg-gray-50'} flex items-center justify-center transition-all duration-300`}>
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  const mainPanelBg = isDark ? 'bg-[#111111]' : 'bg-gray-50'
  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const innerCardBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'

  const renderExpandedView = () => {
    // Keep your existing expanded view logic
    switch (expandedView) {
      // ... your existing expanded view cases ...
      default:
        return null
    }
  }

  const renderDashboardOverview = () => (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className={`${cardBg} p-8 border shadow-lg relative overflow-hidden`}
        style={{ borderRadius: '1.5rem' }}>
        <h1 className={`text-4xl font-bold ${textPrimary} mb-2`}>Dashboard</h1>
        <p className={`${textSecondary}`}>Welcome back! Here's your business overview</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Revenue Card */}
        <div className={`${cardBg} p-6 border shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group`}
          style={{ borderRadius: '2.5rem' }}>
          <div className="flex items-start justify-between mb-4">
            <div className={`${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} p-3 rounded-2xl group-hover:scale-110 transition-transform`}>
              <DollarSign className={`h-6 w-6 ${textPrimary}`} />
            </div>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <h3 className={`${textSecondary} text-xs font-medium uppercase tracking-wider mb-2`}>Total Revenue</h3>
          <div className={`${textPrimary} text-3xl font-bold`}>$12,345</div>
        </div>

        {/* Customers Card */}
        <div className={`${cardBg} p-6 border shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group`}
          style={{ borderRadius: '2.5rem' }}>
          <div className="flex items-start justify-between mb-4">
            <div className={`${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} p-3 rounded-2xl group-hover:scale-110 transition-transform`}>
              <Users className={`h-6 w-6 ${textPrimary}`} />
            </div>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </div>
          <h3 className={`${textSecondary} text-xs font-medium uppercase tracking-wider mb-2`}>New Customers</h3>
          <div className={`${textPrimary} text-3xl font-bold`}>1,234</div>
        </div>

        {/* Menu Items Card */}
        <div className={`${cardBg} p-6 border shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group`}
          style={{ borderRadius: '2.5rem' }}>
          <div className="flex items-start justify-between mb-4">
            <div className={`${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} p-3 rounded-2xl group-hover:scale-110 transition-transform`}>
              <ShoppingBag className={`h-6 w-6 ${textPrimary}`} />
            </div>
          </div>
          <h3 className={`${textSecondary} text-xs font-medium uppercase tracking-wider mb-2`}>Menu Items</h3>
          <div className={`${textPrimary} text-3xl font-bold`}>
            {menuLoading ? (
              <Loader2 className="h-6 w-6 animate-spin inline" />
            ) : menuError ? (
              '0'
            ) : (
              menuItems.length
            )}
          </div>
        </div>

        {/* Categories Card */}
        <div className={`${cardBg} p-6 border shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group`}
          style={{ borderRadius: '2.5rem' }}>
          <div className="flex items-start justify-between mb-4">
            <div className={`${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} p-3 rounded-2xl group-hover:scale-110 transition-transform`}>
              <Package className={`h-6 w-6 ${textPrimary}`} />
            </div>
          </div>
          <h3 className={`${textSecondary} text-xs font-medium uppercase tracking-wider mb-2`}>Categories</h3>
          <div className={`${textPrimary} text-3xl font-bold`}>
            {menuLoading ? (
              <Loader2 className="h-6 w-6 animate-spin inline" />
            ) : menuError ? (
              '0'
            ) : (
              menuCategories.length
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className={`${cardBg} p-6 border shadow-lg`}
        style={{ borderRadius: '1.5rem' }}>
        <h2 className={`text-xl font-bold ${textPrimary} mb-6`}>Recent Activity</h2>
        <div className="space-y-3">
          {activityFeed.slice(0, 3).map((activity, index) => (
            <div
              key={activity.id}
              className={`${innerCardBg} p-4 border hover:scale-[1.02] transition-all duration-200 cursor-pointer flex items-center gap-4`}
              style={{ borderRadius: '1rem' }}
            >
              <div className={`w-2 h-12 rounded-full ${activity.color.includes('green') ? 'bg-green-500' : activity.color.includes('blue') ? 'bg-blue-500' : 'bg-purple-500'}`}></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`${textPrimary} font-medium text-sm`}>{activity.message}</h4>
                    {activity.subtext && <p className={`${textSecondary} text-xs mt-1`}>{activity.subtext}</p>}
                  </div>
                  <span className={`${textSecondary} text-xs`}>{activity.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table Status */}
      <div className="grid grid-cols-3 gap-4">
        <div className={`${cardBg} p-5 border shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105`}
          style={{ borderRadius: '1.5rem' }}>
          <h3 className="text-green-400 text-xs font-bold uppercase tracking-wider mb-2">Available</h3>
          <div className={`${textPrimary} text-3xl font-bold`}>{tableStats.available}</div>
        </div>

        <div className={`${cardBg} p-5 border shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105`}
          style={{ borderRadius: '2rem' }}>
          <h3 className="text-red-400 text-xs font-bold uppercase tracking-wider mb-2">Occupied</h3>
          <div className={`${textPrimary} text-3xl font-bold`}>{tableStats.occupied}</div>
        </div>

        <div className={`${cardBg} p-5 border shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105`}
          style={{ borderRadius: '1rem' }}>
          <h3 className="text-yellow-400 text-xs font-bold uppercase tracking-wider mb-2">Cleaning</h3>
          <div className={`${textPrimary} text-3xl font-bold`}>{tableStats.cleaning}</div>
        </div>
      </div>
    </div>
  )

  const renderAIChat = () => (
    <div className="p-6 space-y-6">
      <div className={`${cardBg} p-8 border shadow-lg`}
        style={{ borderRadius: '1.5rem' }}>
        <h1 className={`text-4xl font-bold ${textPrimary} mb-2`}>AI Chat Support</h1>
        <p className={`${textSecondary}`}>Manage customer conversations and AI responses</p>
      </div>

      <div className="space-y-4">
        {liveChats.map((chat, index) => (
          <div
            key={chat.id}
            className={`${cardBg} p-6 border shadow-lg transition-all cursor-pointer hover:shadow-xl hover:scale-[1.02]`}
            style={{ 
              borderRadius: index % 3 === 0 ? '1.5rem' : index % 3 === 1 ? '2rem' : '1rem'
            }}
            onClick={() => setExpandedView(`chat-${chat.id}`)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-2xl flex items-center justify-center`}>
                  <span className={`${textPrimary} font-bold`}>{chat.customer.charAt(0)}</span>
                </div>
                <div>
                  <h3 className={`${textPrimary} font-semibold`}>{chat.customer}</h3>
                  <p className={`${textSecondary} text-sm mt-1`}>{chat.lastMessage}</p>
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
      <div className={`${cardBg} p-8 border shadow-lg`}
        style={{ borderRadius: '1.5rem' }}>
        <h1 className={`text-4xl font-bold ${textPrimary} mb-2`}>Working Hours</h1>
        <p className={`${textSecondary}`}>Manage restaurant operating hours and schedules</p>
      </div>

      <div className="space-y-4">
        {workingHours.map((day, index) => (
          <div key={day.day} className={`${cardBg} p-6 border shadow-lg hover:shadow-xl transition-all`}
            style={{ 
              borderRadius: index % 3 === 0 ? '1.5rem' : index % 3 === 1 ? '2rem' : index % 3 === 2 ? '1rem' : '1.5rem'
            }}>
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

  // Menu-related render functions
  const renderMenu = () => (
    <MenuComponent 
      menuItems={menuItems}
      categories={menuCategories}
      onRefresh={onRefreshMenu}
    />
  )

  const renderAnalytics = () => (
    <AnalyticsComponent />
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

  // Simple placeholder components for other sections
  const renderFloorplans = () => (
    <FloorPlanComponent businessId={businessId} />
  )

  const renderKitchen = () => (
    <div className="p-6 space-y-6">
      <div className={`${cardBg} p-8 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
        <h1 className={`text-4xl font-bold ${textPrimary} mb-2`}>Kitchen Display</h1>
        <p className={`${textSecondary}`}>Monitor kitchen operations and order status</p>
      </div>
      <div className={`${cardBg} p-6 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
        <p className={`${textPrimary}`}>Kitchen display system coming soon...</p>
      </div>
    </div>
  )

  const renderPayments = () => (
    <div className="p-6 space-y-6">
      <div className={`${cardBg} p-8 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
        <h1 className={`text-4xl font-bold ${textPrimary} mb-2`}>Payment Management</h1>
        <p className={`${textSecondary}`}>Process and track payments and transactions</p>
      </div>
      <div className={`${cardBg} p-6 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
        <p className={`${textPrimary}`}>Payment management coming soon...</p>
      </div>
    </div>
  )

  const renderPOS = () => (
    <POSComponent />
  )

  // Main render function
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
      
      // Main catalog section - shows placeholder
      case "catalog":
        return (
          <div className="p-6 space-y-6">
            <div className={`${cardBg} p-8 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
              <h1 className={`text-4xl font-bold ${textPrimary} mb-2`}>Menu Catalog</h1>
              <p className={`${textSecondary}`}>Select an option from the sidebar to manage your menu catalog</p>
            </div>
          </div>
        )
      
      // Catalog sub-sections
      case "menu-management":
        return renderMenu()
      case "listings":
        return <MenuListingsComponent />
      case "services":
        return <MenuServicesComponent />
      case "modifiers":
        return <MenuModifiersComponent /> 
      case "discounts":
        return <MenuDiscountsComponent />
      case "attributes":
        return <MenuAttributesComponent />
      
      // Upload QR sections
      case "menu-upload-qr":
        return <MenuUploadQRComponent />
      case "category-upload-qr":
        return <CategoryUploadQRComponent />
      case "inventory-upload-qr":
        return <InventoryUploadQRComponent />
      
      // Customer sub-sections
      case "directory":
        return <CustomerDirectoryComponent />
      case "feedback":
        return <CustomerFeedbackComponent />
      
      // Other sections
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
      case "floorplans":
        return renderFloorplans()
      case "kitchen":
        return renderKitchen()
      case "payments":
        return renderPayments()
      case "pos":
        return renderPOS()

      case "profile":
        return <Profile />
      case "notifications":
        return <NotificationComponent />  
      case "bill-printing":
        return <BillComponent />
      
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