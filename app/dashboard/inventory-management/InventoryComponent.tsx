// app/dashboard/inventory-management/InventoryComponent.tsx

"use client"

import React, { useState } from 'react'
import { Package, AlertTriangle, RefreshCw, TrendingDown, Scale, ArrowLeft, BarChart3 } from "lucide-react"
import { useInventoryManagement } from '@/hooks/use-inventory'
import InventoryOverview from './components/InventoryOverview'
import InventoryItemsList from './components/InventoryItemList'
import LowStockAlerts from './components/LowStockAlerts'
import ReorderManagement from './components/ReorderManagement'
import UsageTracking from './components/UsageTracking'

type InventoryView = 'overview' | 'items' | 'low-stock' | 'reorder' | 'usage' | 'stats'

export default function InventoryComponent() {
  const [activeView, setActiveView] = useState<InventoryView>('overview')
  const {
    inventoryItems,
    lowStockItems,
    reorders,
    usageTracking,
    stats,
    refreshAll
  } = useInventoryManagement()

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
            onRefresh={() => {}} // No specific refresh for reorder history
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
            <div className="flex items-center gap-4 p-6 pb-0">
              <button
                onClick={handleBackToOverview}
                className="px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white rounded-lg transition-colors"
              >
                <ArrowLeft className="h-4 w-4 inline mr-2" />
                Back to Overview
              </button>
            </div>
            <div className="p-6 pt-0">
              <h2 className="text-2xl font-bold text-white mb-4">Inventory Analytics</h2>
              <p className="text-gray-400">Detailed analytics and reporting coming soon...</p>
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
      <div className="space-y-6">
        {renderContent()}
      </div>
    )
  }

  // Main overview page with tab navigation
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              {getPageTitle()}
            </h2>
            <p className="text-gray-400">{getPageDescription()}</p>
          </div>
          <button
            onClick={refreshAll}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh All
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeView === tab.id
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            {tab.id === 'low-stock' && lowStockItems.lowStockItems.length > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {lowStockItems.lowStockItems.length}
              </span>
            )}
            {tab.id === 'reorder' && reorders.reorderHistory.length > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-yellow-500 text-white text-xs rounded-full">
                {reorders.reorderHistory.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {renderContent()}
      </div>
    </div>
  )
}