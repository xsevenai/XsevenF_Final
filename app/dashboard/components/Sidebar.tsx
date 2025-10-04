"use client"

import {
  Home,
  MessageSquare,
  MenuIcon,
  Clock,
  Plus,
  Users,
  ShoppingCart,
  Package,
  QrCode,
  BarChart3,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { useTheme } from "@/hooks/useTheme"
import type { SectionType, ExpandedViewType } from "./types"

interface SidebarProps {
  activeSection: SectionType
  setActiveSection: (section: SectionType) => void
  setExpandedView: (view: ExpandedViewType) => void
}

export default function Sidebar({ activeSection, setActiveSection, setExpandedView }: SidebarProps) {
  const { theme, isLoaded: themeLoaded, isDark, currentTheme } = useTheme()

  const mainNavItems = [
    { id: "dashboard" as const, label: "Dashboard", icon: Home },
    { id: "analytics" as const, label: "Analytics", icon: BarChart3 },
    { id: "ai-chat" as const, label: "AI Chat", icon: MessageSquare },
    { id: "menu" as const, label: "Menu", icon: MenuIcon },
    { id: "orders" as const, label: "Orders", icon: ShoppingCart },
    { id: "inventory" as const, label: "Inventory", icon: Package },
    { id: "food-qr" as const, label: "Food QR", icon: QrCode },
    { id: "tables" as const, label: "Tables", icon: Users },
    { id: "working-hours" as const, label: "Working Hours", icon: Clock },
  ]

  const quickActions = [
    { label: "Add New Menu Item", icon: Plus, action: () => setExpandedView("add-menu-item") },
    { label: "Add New Category", icon: Plus, action: () => setExpandedView("add-category") },
    { label: "Add Inventory Item", icon: Package, action: () => setExpandedView("add-inventory-item") },
  ]

  // Show loading while theme is being loaded
  if (!themeLoaded) {
    return (
      <div className="w-64 bg-[#171717] flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  return (
    <div className={`w-64 ${isDark ? 'bg-[#171717]' : 'bg-white border-r border-gray-200'} flex flex-col h-screen`}>
      {/* Header Section */}
      <div className={`p-6 ${isDark ? '' : 'border-b border-gray-200'}`}>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#B76E79] rounded flex items-center justify-center">
            <span className="text-black font-bold text-lg">X</span>
          </div>
          <h1 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} tracking-wide`}>
            DEYBYNAVEEN
          </h1>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 px-4">
        <nav className="space-y-1">
          {mainNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-all duration-200 rounded-lg ${
                activeSection === item.id
                  ? isDark 
                    ? 'bg-[#2a2a2a] text-white'
                    : 'bg-gray-100 text-gray-900'
                  : isDark
                    ? 'text-gray-400 hover:text-white hover:bg-[#222222]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Quick Actions Section */}
        <div className="mt-8">
          <h3 className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'} mb-4 px-4 uppercase tracking-wider`}>
            Quick Actions
          </h3>
          <nav className="space-y-1">
            {quickActions.map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-all duration-200 rounded-lg group ${
                  isDark 
                    ? 'text-gray-400 hover:text-white hover:bg-[#222222]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}