// app/dashboard/components/Sidebar.tsx

"use client"

import {
  Home,
  MessageSquare,
  MenuIcon,
  Clock,
  Plus,
  Users,
  UserPlus,
  LogOut,
  User,
  ShoppingCart,
  Package,
  QrCode,
  BarChart3,
  Loader2,
}
 from "lucide-react"
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

  const handleSignOut = () => {
    window.location.href = "/"
  }

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
    { label: "Generate QR Code", icon: QrCode, action: () => setExpandedView("generate-qr") },
    { label: "Import Customer Data", icon: UserPlus, action: () => setExpandedView("import-data") },
    { label: "Create Staff Schedule", icon: Clock, action: () => setExpandedView("staff-schedule") },
  ]

  // Show loading while theme is being loaded
  if (!themeLoaded) {
    return (
      <div className="w-64 m-4 bg-gray-100 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  return (
    <div className={`w-64 m-4 ${theme.primaryBg} rounded-2xl ${theme.borderPrimary} backdrop-blur-sm shadow-2xl flex flex-col transition-all duration-300 ${
      isDark ? 'hover:shadow-purple-500/10' : 'hover:shadow-orange-500/10'
    }`}>
      {/* Header Section */}
      <div className={`p-6 border-b ${theme.borderPrimary} flex-shrink-0`}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#B76E79] rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg transform transition-transform duration-200 hover:scale-105">
            <span className="text-black font-bold text-lg">X</span>
          </div>
          <div className="min-w-0">
            <h1 className={`text-lg font-bold truncate ${
              isDark 
                ? 'text-white'
                : 'text-gray-900'
            }`}>
              DEYBYNAVEEN
            </h1>
            <p className={`text-sm ${theme.textMuted} truncate`}>Enterprise Dashboard</p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <div className="p-4 space-y-6">
          {/* Main Navigation */}
          <div>
            <h3 className={`text-xs font-semibold ${theme.textMuted} uppercase tracking-wider mb-3 px-1`}>
              MAIN NAVIGATION
            </h3>
            <nav className="space-y-1">
              {mainNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-300 transform hover:scale-[1.02] ${
                    activeSection === item.id
                      ? `${theme.active} shadow-lg ${isDark ? 'shadow-purple-500/25' : 'shadow-orange-500/25'}`
                      : `${theme.textSecondary} ${theme.hover} hover:shadow-md`
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 flex-shrink-0 transition-all duration-300 ${
                      activeSection === item.id 
                        ? "text-white"
                        : `group-hover:${isDark ? 'text-purple-400' : 'text-orange-400'}`
                    }`}
                  />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className={`text-xs font-semibold ${theme.textMuted} uppercase tracking-wider mb-3 px-1`}>
              QUICK ACTIONS
            </h3>
            <nav className="space-y-1">
              {quickActions.map((item, index) => (
                <button
                  key={index}
                  onClick={item.action}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-300 ${theme.textSecondary} ${theme.hover} group transform hover:scale-[1.02] hover:shadow-md`}
                >
                  <item.icon className={`h-4 w-4 flex-shrink-0 group-hover:${isDark ? 'text-purple-400' : 'text-orange-400'} transition-all duration-300 group-hover:scale-110`} />
                  <span className="text-sm font-medium truncate">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Account Section */}
          <div>
            <h3 className={`text-xs font-semibold ${theme.textMuted} uppercase tracking-wider mb-3 px-1`}>
              ACCOUNT
            </h3>
            <nav className="space-y-1">
              <button 
                onClick={() => setActiveSection("profile")}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-300 group transform hover:scale-[1.02] hover:shadow-md ${
                  activeSection === "profile"
                    ? `${theme.active} shadow-lg ${isDark ? 'shadow-purple-500/25' : 'shadow-orange-500/25'}`
                    : `${theme.textSecondary} ${theme.hover} ${isDark ? 'hover:shadow-purple-500/20' : 'hover:shadow-orange-500/20'}`
                }`}
              >
                <User className={`h-4 w-4 flex-shrink-0 transition-all duration-300 ${
                  activeSection === "profile" 
                    ? "text-white"
                    : `group-hover:${isDark ? 'text-purple-400' : 'text-orange-400'}`
                }`} />
                <span className="text-sm font-medium">Profile Settings</span>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Sign Out Button */}
      <div className={`p-4 border-t ${theme.borderPrimary} flex-shrink-0`}>
        <button
          onClick={handleSignOut}
          className={`w-full flex items-center space-x-3 px-3 py-2.5 ${theme.textSecondary} hover:bg-red-600/20 hover:text-red-400 rounded-lg text-left transition-all duration-300 group transform hover:scale-[1.02] hover:shadow-md hover:shadow-red-500/20`}
        >
          <LogOut className="h-5 w-5 flex-shrink-0 group-hover:text-red-400 transition-all duration-300 group-hover:translate-x-1" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  )
}