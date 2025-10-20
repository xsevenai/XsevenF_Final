"use client"

import { useTheme } from "@/hooks/useTheme"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2, Bell, User, Settings, LogOut, ChevronDown, Moon, Sun, ShoppingCart, ChefHat } from "lucide-react"
import { useState, useRef, useEffect } from "react"

interface RightSidebarProps {
  setActiveSection?: (section: any) => void
}

export default function RightSidebar({ setActiveSection }: RightSidebarProps) {
  const { theme, isLoaded: themeLoaded, isDark, toggleTheme } = useTheme()
  const router = useRouter()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement>(null)

  // Right sidebar simplified to just POS and Kitchen Dashboard

  // Theme-aware colors with white text
  const sidebarBg = isDark ? 'bg-[#171717]' : 'bg-white'
  const borderColor = isDark ? 'border-[#2a2a2a]' : 'border-gray-200'
  const cardBg = isDark ? 'bg-[#171717]' : 'bg-white'
  const innerCardBg = isDark ? 'bg-[#1f1f1f]' : 'bg-gray-50'
  const textPrimary = 'text-white'
  const textSecondary = 'text-white'
  const dropdownBg = isDark ? 'bg-[#1f1f1f]' : 'bg-white'

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false)
      }
    }

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showProfileMenu])

  const handleSignOut = () => {
    window.location.href = "/"
  }

  const handleProfileSettings = () => {
    setShowProfileMenu(false)
    if (setActiveSection) {
      setActiveSection("profile")
    }
  }

  const handleThemeToggle = () => {
    toggleTheme()
    // Keep menu open after theme toggle
  }

  const handlePOSClick = () => {
  if (setActiveSection) {
    setActiveSection("pos") // "pos" is the key you'll use in MainPanel
  }
}


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
            onClick={() => {
              if (setActiveSection) {
                setActiveSection("notifications")
              }
              setShowProfileMenu(false)
            }}
            className={`relative ${innerCardBg} p-2 rounded-lg border ${borderColor} hover:scale-110 transition-transform`}
            aria-label="Notifications"
          >
            <Bell className={`h-5 w-5 ${textPrimary}`} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
              2
            </span>
          </button>
          
          {/* Profile Button with Dropdown */}
          <div className="relative" ref={profileMenuRef}>
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className={`${innerCardBg} px-4 py-2 rounded-full border ${borderColor} hover:scale-105 transition-transform flex items-center gap-2`}
              aria-label="Profile"
            >
              <User className={`h-5 w-5 ${textPrimary}`} />
              <span className={`${textPrimary} text-sm font-medium`}>User</span>
              <ChevronDown className={`h-4 w-4 ${textPrimary} transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <div className={`absolute right-0 mt-2 w-56 ${dropdownBg} rounded-lg border ${borderColor} shadow-lg z-50 overflow-hidden`}>
                <button
                  onClick={handleProfileSettings}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    isDark 
                      ? 'hover:bg-[#2a2a2a] text-white hover:text-white'
                      : 'hover:bg-gray-50 text-white hover:text-white'
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  <span className="font-medium text-sm">Profile Settings</span>
                </button>

                <button
                  onClick={handleThemeToggle}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    isDark 
                      ? 'hover:bg-[#2a2a2a] text-white hover:text-white'
                      : 'hover:bg-gray-50 text-white hover:text-white'
                  }`}
                >
                  {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">
                      {isDark ? 'Light Mode' : 'Dark Mode'}
                    </span>
                    <span className="text-xs text-white">
                      Switch to {isDark ? 'light' : 'dark'} theme
                    </span>
                  </div>
                </button>
                
                <div className={`border-t ${borderColor}`}></div>
                
                <button
                  onClick={handleSignOut}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    isDark 
                      ? 'hover:bg-red-600/10 text-white hover:text-white'
                      : 'hover:bg-red-50 text-white hover:text-white'
                  }`}
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium text-sm">Log Out</span>
                </button>
              </div>
            )}
          </div>
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

        {/* POS */}
        <div
          className={`${cardBg} rounded-xl p-5 border ${borderColor} cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]`}
          onClick={handlePOSClick}
        >
          <h3 className={`text-sm font-medium ${textSecondary} mb-4 uppercase tracking-wider flex items-center gap-2`}>
            <ShoppingCart className="h-4 w-4" />
            POS
          </h3>
          <div className={`${innerCardBg} rounded-lg p-4 border ${borderColor}`}>
            <span className={`${textPrimary} text-sm`}>Open POS Interface</span>
          </div>
        </div>

        {/* Kitchen Dashboard */}
        <div
          onClick={() => router.push('/dashboard/kds')}
          className={`${cardBg} rounded-xl p-5 border ${borderColor} cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]`}
        >
          <h3 className={`text-sm font-medium ${textSecondary} mb-4 uppercase tracking-wider flex items-center gap-2`}>
            <ChefHat className="h-4 w-4" />
            Kitchen Dashboard
          </h3>
          <div className={`${innerCardBg} rounded-lg p-4 border ${borderColor}`}>
            <span className={`${textPrimary} text-sm`}>Open KDS</span>
          </div>
        </div>
      </div>
    </div>
  )
}