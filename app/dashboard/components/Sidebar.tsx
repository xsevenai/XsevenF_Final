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
  Wrench,
  Settings,
  Percent,
  ChefHat,
  UserCog,
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
    { id: "ai-chat" as const, label: "AI-Copilot", icon: MessageSquare },
    { id: "xseven-deck" as const, label: "XSevenDeck", icon: Monitor },
    { 
      id: "catalog" as const, 
      label: "Catalog", 
      icon: MenuIcon,
      hasSubItems: true,
      subItems: [
        { id: "menu-management" as const, label: "Menu & Categories", icon: MenuIcon },
        { id: "services" as const, label: "Services", icon: Wrench },
        { id: "modifiers" as const, label: "Modifiers", icon: Settings },
        { id: "discounts" as const, label: "Discounts", icon: Percent },
      ]
    },
    { id: "inventory" as const, label: "Inventory", icon: Package },
    { id: "food-qr" as const, label: "Food QR", icon: QrCode },
    { id: "tables" as const, label: "Tables", icon: Users },
    { id: "floorplans" as const, label: "Floor Plans", icon: Map },
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
    { id: "staff" as const, label: "Staff", icon: UserCog },
    { id: "time-clock" as const, label: "Time Clock", icon: Clock },
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
          <div className="w-8 h-8 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <mask id="mask0_7_182" style={{maskType:"alpha"}} maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
                <rect width="100" height="100" fill="#D9D9D9"/>
              </mask>
              <g mask="url(#mask0_7_182)">
                <path d="M199.939 7.77539C199.979 8.80162 200 9.83244 200 10.8672C200 60.0925 155.228 99.998 99.9998 99.998C76.1256 99.998 54.2058 92.54 37.0116 80.0967L56.3123 65.6543C68.6382 73.4766 83.7162 78.0771 99.9998 78.0771C141.645 78.0771 175.406 47.9874 175.407 10.8691H199.939V7.77539ZM24.6014 11.8418C24.7614 21.8758 27.389 31.3777 31.9666 39.8877L12.6707 54.3232C4.60097 41.4676 0.000196561 26.6472 -0.000152588 10.8691V0H24.5936V10.8691L24.6014 11.8418Z" fill="#E3D7D7"/>
                <path d="M99.9998 0.00012207V25.1818L-0.000183105 100L-15.6848 83.3468L66.6639 21.7394H-0.000183105V21.7384H32.1727C31.4657 18.2104 31.0975 14.5775 31.0975 10.8683V0.00012207H99.9998Z" fill="#C1FD3A"/>
              </g>
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-white tracking-wide">
            XsevenAI
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
                      : 'bg-gray-100 text-white'
                    : isDark
                      ? 'text-white hover:text-white hover:bg-[#222222]'
                      : 'text-white hover:text-white hover:bg-gray-50'
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
                            : 'bg-gray-100 text-white'
                          : isDark
                            ? 'text-white hover:text-white hover:bg-[#222222]'
                            : 'text-white hover:text-white hover:bg-gray-50'
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
          <h3 className="text-xs font-medium text-white mb-3 px-4 uppercase tracking-wider">
            Quick Actions
          </h3>
          <nav className="space-y-1">
            {quickActions.map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className={`w-full flex items-center space-x-3 px-4 py-2 text-left transition-all duration-200 rounded-lg group ${
                  isDark 
                    ? 'text-white hover:text-white hover:bg-[#222222]'
                    : 'text-white hover:text-white hover:bg-gray-50'
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