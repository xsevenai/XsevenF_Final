// app/dashboard/inventory-management/InventoryComponent.tsx

"use client"

import React, { useState, useEffect } from 'react'
import { Package, AlertTriangle, RefreshCw, TrendingDown, Scale, ArrowLeft, BarChart3, Loader2 } from "lucide-react"
import { useInventoryManagement } from '@/hooks/use-inventory'
import { useTheme } from "@/hooks/useTheme"
import InventoryOverview from './components/InventoryOverview'
import InventoryItemsList from './components/InventoryItemList'
import LowStockAlerts from './components/LowStockAlerts'
import ReorderManagement from './components/ReorderManagement'
import UsageTracking from './components/UsageTracking'

type InventoryView = 'overview' | 'items' | 'low-stock' | 'reorder' | 'usage' | 'stats'

export default function InventoryComponent() {
  const [activeView, setActiveView] = useState<InventoryView>('overview')
  const [mounted, setMounted] = useState(false)
  const { theme, isLoaded: themeLoaded, isDark, currentTheme } = useTheme()
  const {
    inventoryItems,
    lowStockItems,
    reorders,
    usageTracking,
    stats,
    refreshAll
  } = useInventoryManagement()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!themeLoaded || !mounted) {
    return (
      <div className={`flex-1 ${isDark ? 'bg-[#111111]' : 'bg-gray-50'} flex items-center justify-center transition-all duration-300`}>
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  // Theme-based styling variables
  const mainPanelBg = isDark ? 'bg-[#111111]' : 'bg-gray-50'
  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const buttonHoverBg = isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-100'
  const tabActiveBg = isDark ? 'bg-[#2a2a2a] border-[#3a3a3a]' : 'bg-gray-100 border-gray-300'
  const tabInactiveBg = isDark ? 'bg-[#1f1f1f] hover:bg-[#2a2a2a]' : 'bg-gray-50 hover:bg-gray-100'

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: Package },
    { id: 'items' as const, label: 'All Items', icon: Scale },
    { id: 'low-stock' as const, label: 'Low Stock', icon: AlertTriangle },
    { id: 'reorder' as const, label: 'Reorders', icon: RefreshCw },
    { id: 'usage' as const, label: 'Usage', icon: TrendingDown },
    { id: 'stats' as const, label: 'Analytics', icon: BarChart3 }
  ]

  const handleTabClick = (tabId: InventoryView) => {
    setActiveView(tabId)
  }

  const handleBackToOverview = () => {
    setActiveView('overview')
  }

  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        return (
          <InventoryOverview
            stats={stats.stats}
            loading={stats.loading}
            error={stats.error}
            onRefresh={stats.refresh}
            inventoryItems={inventoryItems.items}
            lowStockItems={lowStockItems.lowStockItems}
            usageHistory={usageTracking.usageHistory}
            onViewItems={() => setActiveView('items')}
            onViewLowStock={() => setActiveView('low-stock')}
            onViewUsage={() => setActiveView('usage')}
          />
        )
      case 'items':
        return (
          <InventoryItemsList
            items={inventoryItems.items}
            loading={inventoryItems.loading}
            error={inventoryItems.error}
            onRefresh={inventoryItems.refresh}
            onUpdateItem={inventoryItems.updateItem}
            onBack={handleBackToOverview}
          />
        )
      case 'low-stock':
        return (
          <LowStockAlerts
            lowStockItems={lowStockItems.lowStockItems}
            loading={lowStockItems.loading}
            error={lowStockItems.error}
            onRefresh={lowStockItems.refresh}
            onCreateReorder={reorders.createReorder}
            onBack={handleBackToOverview}
          />
        )
      case 'reorder':
        return (
          <ReorderManagement
            reorders={reorders.reorderHistory}
            loading={reorders.loading}
            error={reorders.error}
            onRefresh={() => {}}
            onCreateReorder={reorders.createReorder}
            onBack={handleBackToOverview}
            inventoryItems={inventoryItems.items}
          />
        )
      case 'usage':
        return (
          <UsageTracking
            usageHistory={usageTracking.usageHistory}
            loading={usageTracking.loading}
            error={usageTracking.error}
            onRefresh={usageTracking.refresh}
            onChangePeriod={usageTracking.changePeriod}
            currentPeriod={usageTracking.currentPeriod}
            inventoryItems={inventoryItems.items}
            onBack={handleBackToOverview}
          />
        )
      case 'stats':
        return (
          <div className="space-y-6">
            <div className={`${cardBg} p-8 border shadow-lg relative overflow-hidden`} style={{ borderRadius: '1.5rem' }}>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleBackToOverview}
                  className={`${textSecondary} ${buttonHoverBg} p-2 rounded-xl transition-all duration-200 hover:scale-110`}
                >
                  <ArrowLeft className="h-6 w-6" />
                </button>
                <div>
                  <h1 className={`text-4xl font-bold ${textPrimary} mb-2`}>Inventory Analytics</h1>
                  <p className={`${textSecondary}`}>Detailed analytics and reporting coming soon...</p>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const getPageTitle = () => {
    switch (activeView) {
      case 'overview':
        return 'Inventory Overview'
      case 'items':
        return 'All Inventory Items'
      case 'low-stock':
        return 'Low Stock Alerts'
      case 'reorder':
        return 'Reorder Management'
      case 'usage':
        return 'Usage Tracking'
      case 'stats':
        return 'Inventory Analytics'
      default:
        return 'Inventory Management'
    }
  }

  const getPageDescription = () => {
    switch (activeView) {
      case 'overview':
        return 'Monitor stock levels, track usage, and manage reorders'
      case 'items':
        return 'View and manage all inventory items'
      case 'low-stock':
        return 'Items that need immediate attention'
      case 'reorder':
        return 'Manage purchase orders and supplier requests'
      case 'usage':
        return 'Track ingredient consumption and usage patterns'
      case 'stats':
        return 'Detailed analytics and reporting'
      default:
        return 'Complete inventory management system'
    }
  }

  // If we're in a detailed view, render the specific component
  if (activeView !== 'overview') {
    return (
      <div className={`flex-1 ${mainPanelBg} h-screen overflow-y-auto transition-colors duration-300`} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    )
  }

  // Main overview page with tab navigation
  return (
    <div className={`flex-1 ${mainPanelBg} h-screen overflow-y-auto transition-colors duration-300`} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className={`${cardBg} p-8 border shadow-lg relative overflow-hidden`} style={{ borderRadius: '1.5rem' }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-4xl font-bold ${textPrimary} mb-2`}>{getPageTitle()}</h1>
              <p className={`${textSecondary}`}>{getPageDescription()}</p>
            </div>
            <button
              onClick={refreshAll}
              className={`flex items-center gap-2 px-6 py-3 ${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535] border-[#3a3a3a]' : 'bg-gray-100 hover:bg-gray-200 border-gray-300'} ${textPrimary} rounded-xl font-medium transition-all duration-300 border shadow-lg hover:shadow-xl hover:scale-105`}
            >
              <RefreshCw className="h-4 w-4" />
              Refresh All
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={`${cardBg} border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
          <div className="p-6">
            <div className="flex flex-wrap gap-3">
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
                    activeView === tab.id
                      ? `${tabActiveBg} ${textPrimary} shadow-lg border scale-105`
                      : `${tabInactiveBg} ${textSecondary} border hover:shadow-md hover:scale-105`
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                  {tab.id === 'low-stock' && lowStockItems.lowStockItems.length > 0 && (
                    <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full font-medium">
                      {lowStockItems.lowStockItems.length}
                    </span>
                  )}
                  {tab.id === 'reorder' && reorders.reorderHistory.length > 0 && (
                    <span className="ml-1 px-2 py-0.5 bg-yellow-500 text-white text-xs rounded-full font-medium">
                      {reorders.reorderHistory.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="min-h-[400px]">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}