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
  Map,
  Monitor,
  CreditCard,
  ChevronDown,
  ChevronRight,
  UserCheck,
  MessageCircle,
  List,
  Wrench,
  Settings,
  Percent,
  Tags,
  ChefHat,
} from "lucide-react"
import Link from "next/link"
import { useTheme } from "@/hooks/useTheme"
import { useState } from "react"
import type { SectionType, ExpandedViewType } from "./types"

interface SidebarProps {
  activeSection: SectionType
  setActiveSection: (section: SectionType) => void
  setExpandedView: (view: ExpandedViewType) => void
}

export default function Sidebar({ activeSection, setActiveSection, setExpandedView }: SidebarProps) {
  const { theme, isLoaded: themeLoaded, isDark, currentTheme } = useTheme()
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const mainNavItems = [
    { id: "dashboard" as const, label: "Dashboard", icon: Home },
    { id: "analytics" as const, label: "Analytics", icon: BarChart3 },
    { id: "ai-chat" as const, label: "Assistant", icon: MessageSquare },
    { 
      id: "catalog" as const, 
      label: "Catalog", 
      icon: MenuIcon,
      hasSubItems: true,
      subItems: [
        { id: "menu-management" as const, label: "Menu & Categories", icon: MenuIcon },
        { id: "listings" as const, label: "Listings", icon: List },
        { id: "services" as const, label: "Services", icon: Wrench },
        { id: "modifiers" as const, label: "Modifiers", icon: Settings },
        { id: "discounts" as const, label: "Discounts", icon: Percent },
        { id: "attributes" as const, label: "Attributes", icon: Tags },
      ]
    },
    { id: "orders" as const, label: "Orders", icon: ShoppingCart },
    { id: "inventory" as const, label: "Inventory", icon: Package },
    { id: "food-qr" as const, label: "Food QR", icon: QrCode },
    { id: "tables" as const, label: "Tables", icon: Users },
    { id: "working-hours" as const, label: "Working Hours", icon: Clock },
    { id: "floorplans" as const, label: "Floor Plans", icon: Map },
    { id: "kitchen" as const, label: "Kitchen", icon: Monitor },
    { id: "kds" as const, label: "KDS", icon: ChefHat },
    { 
      id: "customers" as const, 
      label: "Customers", 
      icon: Users,
      hasSubItems: true,
      subItems: [
        { id: "directory" as const, label: "Directory", icon: UserCheck },
        { id: "feedback" as const, label: "Feedback", icon: MessageCircle },
      ]
    },
    { id: "payments" as const, label: "Payments", icon: CreditCard },
  ]

  const quickActions = [
    { label: "Add New Menu Item", icon: Plus, action: () => setActiveSection("menu-upload-qr") },
    { label: "Add New Category", icon: Plus, action: () => setActiveSection("category-upload-qr") },
    { label: "Add Inventory Item", icon: Package, action: () => setActiveSection("inventory-upload-qr") },
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
      <div className="flex-1 px-4 overflow-hidden flex flex-col">
        <nav className="space-y-1 flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style jsx>{`
            nav::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {mainNavItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => {
                  if (item.hasSubItems) {
                    toggleSection(item.id)
                  } else {
                    setActiveSection(item.id)
                  }
                }}
                className={`w-full flex items-center justify-between px-4 py-3 text-left transition-all duration-200 rounded-lg ${
                  activeSection === item.id
                    ? isDark 
                      ? 'bg-[#2a2a2a] text-white'
                      : 'bg-gray-100 text-gray-900'
                    : isDark
                      ? 'text-gray-400 hover:text-white hover:bg-[#222222]'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
                {item.hasSubItems && (
                  expandedSections.includes(item.id) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )
                )}
              </button>
              
              {/* Sub-items */}
              {item.hasSubItems && expandedSections.includes(item.id) && (
                <div className="ml-4 mt-1 space-y-1">
                  {item.subItems?.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => setActiveSection(subItem.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-2 text-left transition-all duration-200 rounded-lg ${
                        activeSection === subItem.id
                          ? isDark 
                            ? 'bg-[#2a2a2a] text-white'
                            : 'bg-gray-100 text-gray-900'
                          : isDark
                            ? 'text-gray-400 hover:text-white hover:bg-[#222222]'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <subItem.icon className="h-4 w-4" />
                      <span className="font-medium text-sm">{subItem.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Quick Actions Section - Fixed at bottom */}
        <div className="mt-4 pb-4 border-t border-opacity-20 pt-4" style={{ borderColor: isDark ? '#2a2a2a' : '#e5e7eb' }}>
          <h3 className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'} mb-3 px-4 uppercase tracking-wider`}>
            Quick Actions
          </h3>
          <nav className="space-y-1">
            {quickActions.map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className={`w-full flex items-center space-x-3 px-4 py-2 text-left transition-all duration-200 rounded-lg group ${
                  isDark 
                    ? 'text-gray-400 hover:text-white hover:bg-[#222222]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span className="font-medium text-xs">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}