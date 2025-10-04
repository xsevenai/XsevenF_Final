// app/dashboard/page.tsx

"use client"

import { useState, useEffect } from "react"
import { useTheme } from "@/hooks/useTheme"
import Sidebar from "./components/Sidebar"
import MainPanel from "./components/MainPanel"
import RightSidebar from "./components/RightSidebar"
import ExpandedViews from "./components/ExpandedViews"
import { useMenuItems, useMenuCategories } from "@/hooks/use-menu"
import type { 
  Table, 
  WorkingHours, 
  ActivityItem, 
  LiveChat, 
  SectionType, 
  ExpandedViewType 
} from "./components/types"
import {
  ShoppingCart,
  Users,
  MessageSquare,
  Clock,
  TrendingUp,
  Bell,
  Loader2
} from "lucide-react"

export default function Dashboard() {
  const { theme, isLoaded: themeLoaded, isDark } = useTheme()
  const [activeSection, setActiveSection] = useState<SectionType>("dashboard")
  const [expandedView, setExpandedView] = useState<ExpandedViewType>(null)
  
  // Use the custom hooks for menu data
  const { refresh: refreshMenuItems } = useMenuItems()
  const { refresh: refreshCategories } = useMenuCategories()

  // Mock data - you can replace these with real API calls later
  const [tables] = useState<Table[]>([
    { id: "1", number: 1, seats: 4, status: "occupied", location: "Window side" },
    { id: "2", number: 2, seats: 2, status: "available", location: "Center" },
    { id: "3", number: 3, seats: 6, status: "cleaning", location: "Corner" },
    { id: "4", number: 4, seats: 4, status: "reserved", location: "Patio" },
    { id: "5", number: 5, seats: 8, status: "available", location: "Private room" },
    { id: "6", number: 6, seats: 2, status: "occupied", location: "Bar area" },
    { id: "7", number: 7, seats: 4, status: "available", location: "Window side" },
    { id: "8", number: 8, seats: 6, status: "cleaning", location: "Center" },
  ])

  const [workingHours, setWorkingHours] = useState<WorkingHours[]>([
    { day: "Monday", isOpen: true, openTime: "09:00", closeTime: "22:00" },
    { day: "Tuesday", isOpen: true, openTime: "09:00", closeTime: "22:00" },
    { day: "Wednesday", isOpen: true, openTime: "09:00", closeTime: "22:00" },
    { day: "Thursday", isOpen: true, openTime: "09:00", closeTime: "22:00" },
    { day: "Friday", isOpen: true, openTime: "09:00", closeTime: "23:00" },
    { day: "Saturday", isOpen: true, openTime: "10:00", closeTime: "23:00" },
    { day: "Sunday", isOpen: false, openTime: "10:00", closeTime: "21:00" },
  ])

  const [activityFeed] = useState<ActivityItem[]>([
    {
      id: 1,
      type: "order",
      message: "New order received",
      subtext: "Table 5 - $45.50",
      time: "2 mins ago",
      icon: ShoppingCart,
      color: "text-green-400",
    },
    {
      id: 2,
      type: "customer",
      message: "New customer registered",
      subtext: "John Smith via mobile app",
      time: "5 mins ago",
      icon: Users,
      color: "text-blue-400",
    },
    {
      id: 3,
      type: "review",
      message: "New 5-star review",
      subtext: "Amazing food and service!",
      time: "15 mins ago",
      icon: TrendingUp,
      color: "text-yellow-400",
    },
    {
      id: 4,
      type: "message",
      message: "Customer support message",
      subtext: "Question about allergens",
      time: "20 mins ago",
      icon: MessageSquare,
      color: "text-purple-400",
    },
    {
      id: 5,
      type: "reservation",
      message: "Table reservation",
      subtext: "Party of 4 for 7:30 PM",
      time: "30 mins ago",
      icon: Clock,
      color: "text-orange-400",
    },
    {
      id: 6,
      type: "alert",
      message: "Low stock alert",
      subtext: "Salmon - 3 portions left",
      time: "45 mins ago",
      icon: Bell,
      color: "text-red-400",
    },
  ])

  const [liveChats] = useState<LiveChat[]>([
    {
      id: "1",
      customer: "Sarah Johnson",
      lastMessage: "Do you have gluten-free options?",
      time: "2 mins ago",
      status: "online",
    },
    {
      id: "2",
      customer: "Mike Chen",
      lastMessage: "Can I modify my order?",
      time: "5 mins ago",
      status: "online",
    },
    {
      id: "3",
      customer: "Emma Davis",
      lastMessage: "Thank you for the great service!",
      time: "10 mins ago",
      status: "offline",
    },
  ])

  // Check for authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      // Redirect to login if no token
      window.location.href = '/'
    }
  }, [])

  // Handlers for updating data
  const handleUpdateTableStatus = (id: string, status: string) => {
    // TODO: Implement API call to update table status
    console.log(`Update table ${id} status to ${status}`)
  }

  const handleToggleDayStatus = (day: string) => {
    setWorkingHours(prev =>
      prev.map(item =>
        item.day === day ? { ...item, isOpen: !item.isOpen } : item
      )
    )
  }

  const handleUpdateWorkingHours = (day: string, field: keyof WorkingHours, value: string) => {
    setWorkingHours(prev =>
      prev.map(item =>
        item.day === day ? { ...item, [field]: value } : item
      )
    )
  }

  // Callbacks for when items are created
  const handleMenuItemCreated = () => {
    refreshMenuItems()
  }

  const handleCategoryCreated = () => {
    refreshCategories()
  }

  const handleItemUpdated = () => {
    refreshMenuItems()
    // Clear the editing item from localStorage
    localStorage.removeItem('editingMenuItem')
  }

  // Get editing item from localStorage
  const getEditingItem = () => {
    if (typeof window === 'undefined') return null
    const stored = localStorage.getItem('editingMenuItem')
    return stored ? JSON.parse(stored) : null
  }

  // Show loading screen while theme is loading
  if (!themeLoaded) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-gray-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${theme.primaryBg} flex transition-colors duration-300`}>
      {/* Left Sidebar - Navigation */}
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        setExpandedView={setExpandedView}
      />
      
      {/* Main Content Area */}
      {expandedView ? (
        <ExpandedViews
          expandedView={expandedView}
          setExpandedView={setExpandedView}
          tables={tables}
          onMenuItemCreated={handleMenuItemCreated}
          onCategoryCreated={handleCategoryCreated}
          editingItem={getEditingItem()}
          onItemUpdated={handleItemUpdated}
        />
      ) : (
        <>
          {/* Center Main Panel */}
          <MainPanel
            activeSection={activeSection}
            expandedView={expandedView}
            setExpandedView={setExpandedView}
            tables={tables}
            workingHours={workingHours}
            activityFeed={activityFeed}
            liveChats={liveChats}
            onUpdateTableStatus={handleUpdateTableStatus}
            onToggleDayStatus={handleToggleDayStatus}
            onUpdateWorkingHours={handleUpdateWorkingHours}
          />
          
          {/* Right Sidebar - Real-time Performance */}
          <RightSidebar setActiveSection={setActiveSection} />
        </>
      )}
    </div>
  )
}