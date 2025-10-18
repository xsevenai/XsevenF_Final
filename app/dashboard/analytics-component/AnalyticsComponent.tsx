"use client"

import { useState, useEffect, useMemo, useCallback, Suspense, lazy, useRef } from 'react'
import { useTheme } from '@/hooks/useTheme'
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  MessageSquare, 
  ShoppingCart,
  Utensils,
  RefreshCw,
  Loader2,
  AlertCircle,
  ChevronDown
} from 'lucide-react'

// Lazy load components for better performance
const OverviewAnalytics = lazy(() => import('./OverviewAnalytics'))
const OrdersAnalytics = lazy(() => import('./OrdersAnalytics'))
const MenuAnalytics = lazy(() => import('./MenuAnalytics'))
const MessagesAnalytics = lazy(() => import('./MessagesAnalytics'))
const RevenueAnalytics = lazy(() => import('./RevenueAnalytics'))

interface AnalyticsComponentProps {
  businessId: string
}

export default function AnalyticsComponent({ businessId }: AnalyticsComponentProps) {
  const { theme, isLoaded: themeLoaded, isDark, currentTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'menu' | 'messages' | 'revenue'>('overview')
  const [timeRange, setTimeRange] = useState<'1d' | '7d' | '30d' | '90d'>('7d')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [loading, setLoading] = useState(false)
  const [showTimeDropdown, setShowTimeDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowTimeDropdown(false)
      }
    }

    if (showTimeDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showTimeDropdown])

  useEffect(() => {
    setLastUpdated(new Date())
  }, [activeTab, timeRange])

  const handleRefresh = useCallback(async () => {
    setLoading(true)
    // Reduced refresh delay for better UX
    setTimeout(() => {
      setLoading(false)
      setLastUpdated(new Date())
    }, 300)
  }, [])

  // Memoized theme-based styling variables with white text
  const themeStyles = useMemo(() => ({
    mainPanelBg: isDark ? 'bg-[#111111]' : 'bg-gray-50',
    cardBg: isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200',
    textPrimary: 'text-white',
    textSecondary: 'text-white',
    buttonTheme: isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800',
    activeTabBg: isDark ? 'bg-white text-white' : 'bg-black text-white',
    inactiveTabBg: isDark ? 'bg-[#2a2a2a] text-white hover:bg-[#353535]' : 'bg-gray-100 text-white hover:bg-gray-200'
  }), [isDark])

  const renderActiveTab = useCallback(() => {
    const commonProps = { timeRange }
    
    switch (activeTab) {
      case 'overview':
        return <OverviewAnalytics {...commonProps} />
      case 'orders':
        return <OrdersAnalytics {...commonProps} businessId={businessId} />
      case 'menu':
        return <MenuAnalytics {...commonProps} />
      case 'messages':
        return <MessagesAnalytics {...commonProps} />
      case 'revenue':
        return <RevenueAnalytics {...commonProps} />
      default:
        return <OverviewAnalytics {...commonProps} />
    }
  }, [activeTab, timeRange, businessId])

  if (!themeLoaded || !mounted) {
    return (
      <div className={`flex-1 ${isDark ? 'bg-[#111111]' : 'bg-gray-50'} flex items-center justify-center transition-all duration-300`}>
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  return (
    <div className={`flex-1 ${themeStyles.mainPanelBg} transition-colors duration-300`}>
      <div className="p-6 space-y-4">
        {/* Header with Box */}
        <div className={`${themeStyles.cardBg} border px-8 pt-8 pb-2 mb-4`} style={{ borderRadius: '1.5rem' }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className={`text-3xl font-bold ${themeStyles.textPrimary} mb-1`}>Analytics Dashboard</h1>
              <p className={`${themeStyles.textSecondary} text-sm`}>Comprehensive insights into your business performance</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Time Period Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowTimeDropdown(!showTimeDropdown)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${themeStyles.inactiveTabBg}`}
                >
                  {timeRange === '1d' ? '1 Day' : 
                   timeRange === '7d' ? '7 Days' : 
                   timeRange === '30d' ? '30 Days' : '90 Days'}
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                {showTimeDropdown && (
                  <div className={`absolute top-full left-0 mt-1 w-32 ${themeStyles.cardBg} border rounded-lg shadow-lg z-50`}>
                    {[
                      { value: '1d', label: '1 Day' },
                      { value: '7d', label: '7 Days' },
                      { value: '30d', label: '30 Days' },
                      { value: '90d', label: '90 Days' }
                    ].map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => {
                          setTimeRange(value as any)
                          setShowTimeDropdown(false)
                        }}
                        className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                          timeRange === value
                            ? 'bg-blue-500 text-white'
                            : `${themeStyles.textPrimary} hover:bg-gray-100`
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {lastUpdated && (
                <span className={`${themeStyles.textSecondary} text-xs`}>
                  {lastUpdated.toLocaleTimeString()}
                </span>
              )}
              <button
                onClick={handleRefresh}
                disabled={loading}
                className={`${themeStyles.buttonTheme} px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50`}
              >
                <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          {/* Tab Navigation - Inside Header Box */}
          <div className="flex justify-between mt-4 gap-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`text-base py-4 px-8 font-semibold flex items-center transition-colors ${
                activeTab === 'overview' 
                  ? `${themeStyles.textPrimary} border-b-2 border-blue-500` 
                  : `${themeStyles.textSecondary} hover:${themeStyles.textPrimary}`
              }`}
            >
              <BarChart3 className="h-5 w-5 mr-3" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`text-base py-4 px-8 font-semibold flex items-center transition-colors ${
                activeTab === 'orders' 
                  ? `${themeStyles.textPrimary} border-b-2 border-blue-500` 
                  : `${themeStyles.textSecondary} hover:${themeStyles.textPrimary}`
              }`}
            >
              <ShoppingCart className="h-5 w-5 mr-3" />
              Orders
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`text-base py-4 px-8 font-semibold flex items-center transition-colors ${
                activeTab === 'menu' 
                  ? `${themeStyles.textPrimary} border-b-2 border-blue-500` 
                  : `${themeStyles.textSecondary} hover:${themeStyles.textPrimary}`
              }`}
            >
              <Utensils className="h-5 w-5 mr-3" />
              Menu
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`text-base py-4 px-8 font-semibold flex items-center transition-colors ${
                activeTab === 'messages' 
                  ? `${themeStyles.textPrimary} border-b-2 border-blue-500` 
                  : `${themeStyles.textSecondary} hover:${themeStyles.textPrimary}`
              }`}
            >
              <MessageSquare className="h-5 w-5 mr-3" />
              Messages
            </button>
            <button
              onClick={() => setActiveTab('revenue')}
              className={`text-base py-4 px-8 font-semibold flex items-center transition-colors ${
                activeTab === 'revenue' 
                  ? `${themeStyles.textPrimary} border-b-2 border-blue-500` 
                  : `${themeStyles.textSecondary} hover:${themeStyles.textPrimary}`
              }`}
            >
              <DollarSign className="h-5 w-5 mr-3" />
              Revenue
            </button>
          </div>
        </div>

        {/* Content with Suspense for lazy loading */}
        <Suspense fallback={
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          </div>
        }>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            </div>
          ) : (
            renderActiveTab()
          )}
        </Suspense>
      </div>
    </div>
  )
}
