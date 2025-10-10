// app/dashboard/inventory-management/InventoryComponent.tsx

"use client"

import React, { useState, useEffect } from 'react'
import { Package, AlertTriangle, RefreshCw, TrendingDown, Scale, ArrowLeft, BarChart3, Loader2, Users, FileText, Settings } from "lucide-react"
import { useInventoryManagement } from '@/hooks/use-inventory'
import { useTheme } from "@/hooks/useTheme"
import InventoryOverview from './components/InventoryOverview'
import InventoryItemList from './components/InventoryItemList'
import LowStockAlerts from './components/LowStockAlerts'
import SupplierManagement from './components/SupplierManagement'
import PurchaseOrderManagement from './components/PurchaseOrderManagement'
import StockAdjustments from './components/StockAdjustments'
import InventoryReports from './components/InventoryReports'
import AutoReorderManagement from './components/AutoReorderManagement'
import PosSyncManagement from './components/PosSyncManagement'
import TransactionHistory from './components/TransactionHistory'
import AnalyticsDashboard from './components/AnalyticsDashboard'
import StockAlertManagement from './components/StockAlertManagement'

type InventoryView = 'overview' | 'items' | 'low-stock' | 'stock-alerts' | 'suppliers' | 'purchase-orders' | 'adjustments' | 'reports' | 'analytics' | 'auto-reorder' | 'pos-sync' | 'transactions'

export default function InventoryComponent() {
  const [activeView, setActiveView] = useState<InventoryView>('overview')
  const [mounted, setMounted] = useState(false)
  const { theme, isLoaded: themeLoaded, isDark, currentTheme } = useTheme()
  
  // Get businessId from localStorage
  const businessId = typeof window !== "undefined" ? localStorage.getItem("businessId") || "" : ""
  
  const {
    inventoryItems,
    lowStockItems,
    stockAdjustments,
    suppliers,
    purchaseOrders,
    transactions,
    reports,
    stats,
    autoReorder,
    posSync,
    refreshAll,
    loading,
    error
  } = useInventoryManagement(businessId)

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
    { id: 'stock-alerts' as const, label: 'Stock Alerts', icon: AlertTriangle },
    { id: 'suppliers' as const, label: 'Suppliers', icon: Users },
    { id: 'purchase-orders' as const, label: 'Purchase Orders', icon: FileText },
    { id: 'adjustments' as const, label: 'Adjustments', icon: Settings },
    { id: 'reports' as const, label: 'Reports', icon: BarChart3 },
    { id: 'analytics' as const, label: 'Analytics', icon: TrendingDown },
    { id: 'transactions' as const, label: 'Transactions', icon: FileText },
    { id: 'auto-reorder' as const, label: 'Auto-Reorder', icon: RefreshCw },
    { id: 'pos-sync' as const, label: 'POS Sync', icon: RefreshCw }
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
            activeAlerts={lowStockItems.activeAlerts}
            onViewItems={() => setActiveView('items')}
            onViewLowStock={() => setActiveView('low-stock')}
            onViewSuppliers={() => setActiveView('suppliers')}
            onViewPurchaseOrders={() => setActiveView('purchase-orders')}
            onViewReports={() => setActiveView('reports')}
          />
        )
      case 'items':
        return (
          <InventoryItemList
            items={inventoryItems.items}
            loading={inventoryItems.loading}
            error={inventoryItems.error}
            onRefresh={inventoryItems.refresh}
            onCreateItem={inventoryItems.createItem}
            onUpdateItem={inventoryItems.updateItem}
            onDeleteItem={inventoryItems.deleteItem}
            onSearchItems={inventoryItems.searchItems}
            onBack={handleBackToOverview}
          />
        )
      case 'low-stock':
        return (
          <LowStockAlerts
            lowStockItems={lowStockItems.lowStockItems}
            activeAlerts={lowStockItems.activeAlerts}
            loading={lowStockItems.loading}
            error={lowStockItems.error}
            onRefresh={lowStockItems.refresh}
            onCreateStockAlert={lowStockItems.createStockAlert}
            onBack={handleBackToOverview}
          />
        )
      case 'stock-alerts':
        return (
          <StockAlertManagement
            lowStockItems={inventoryItems.items}
            activeAlerts={lowStockItems.activeAlerts}
            loading={lowStockItems.loading}
            error={lowStockItems.error}
            onRefresh={lowStockItems.refresh}
            onCreateStockAlert={lowStockItems.createStockAlert}
            onListStockAlerts={lowStockItems.listStockAlerts}
            onUpdateStockAlert={lowStockItems.updateStockAlert}
            onDeleteStockAlert={lowStockItems.deleteStockAlert}
            onBack={handleBackToOverview}
          />
        )
      case 'suppliers':
        return (
          <SupplierManagement
            suppliers={suppliers.suppliers}
            loading={suppliers.loading}
            error={suppliers.error}
            onRefresh={suppliers.refresh}
            onCreateSupplier={suppliers.createSupplier}
            onUpdateSupplier={suppliers.updateSupplier}
            onDeleteSupplier={suppliers.deleteSupplier}
            onBack={handleBackToOverview}
          />
        )
      case 'purchase-orders':
        return (
          <PurchaseOrderManagement
            purchaseOrders={purchaseOrders.purchaseOrders}
            suppliers={suppliers.suppliers}
            inventoryItems={inventoryItems.items}
            loading={purchaseOrders.loading}
            error={purchaseOrders.error}
            onRefresh={purchaseOrders.refresh}
            onCreatePurchaseOrder={purchaseOrders.createPurchaseOrder}
            onUpdatePurchaseOrder={purchaseOrders.updatePurchaseOrder}
            onReceivePurchaseOrder={purchaseOrders.receivePurchaseOrder}
            onBack={handleBackToOverview}
          />
        )
      case 'adjustments':
        return (
          <StockAdjustments
            transactions={transactions.transactions}
            loading={stockAdjustments.loading || transactions.loading}
            error={stockAdjustments.error || transactions.error}
            onRefresh={transactions.refresh}
            onAdjustStock={stockAdjustments.adjustStock}
            onPerformStockCount={stockAdjustments.performStockCount}
            onBack={handleBackToOverview}
          />
        )
      case 'reports':
        return (
          <InventoryReports
            reports={reports}
            stats={stats.stats}
            loading={reports.loading}
            error={reports.error}
            onGetInventorySummary={reports.getInventorySummary}
            onGetInventoryValuation={reports.getInventoryValuation}
            onGetInventoryTurnover={reports.getInventoryTurnover}
            onGetWasteReport={reports.getWasteReport}
            onBack={handleBackToOverview}
          />
        )
      case 'analytics':
        return (
          <AnalyticsDashboard
            stats={stats.stats}
            loading={stats.loading}
            error={stats.error}
            onRefresh={stats.refresh}
            onBack={handleBackToOverview}
          />
        )
      case 'transactions':
        return (
          <TransactionHistory
            transactions={transactions.transactions}
            loading={transactions.loading}
            error={transactions.error}
            onRefresh={transactions.refresh}
            onBack={handleBackToOverview}
          />
        )
      case 'auto-reorder':
        return (
          <AutoReorderManagement
            loading={autoReorder.loading}
            error={autoReorder.error}
            onTriggerAutoReorder={autoReorder.triggerAutoReorder}
            onBack={handleBackToOverview}
          />
        )
      case 'pos-sync':
        return (
          <PosSyncManagement
            loading={posSync.loading}
            error={posSync.error}
            onSyncFromPos={posSync.syncFromPos}
            onBack={handleBackToOverview}
          />
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
      case 'stock-alerts':
        return 'Stock Alert Management'
      case 'suppliers':
        return 'Supplier Management'
      case 'purchase-orders':
        return 'Purchase Orders'
      case 'adjustments':
        return 'Stock Adjustments'
      case 'reports':
        return 'Inventory Reports'
      case 'analytics':
        return 'Inventory Analytics'
      case 'transactions':
        return 'Transaction History'
      case 'auto-reorder':
        return 'Auto-Reorder Management'
      case 'pos-sync':
        return 'POS Sync Management'
      default:
        return 'Inventory Management'
    }
  }

  const getPageDescription = () => {
    switch (activeView) {
      case 'overview':
        return 'Monitor stock levels, track usage, and manage inventory'
      case 'items':
        return 'View and manage all inventory items'
      case 'low-stock':
        return 'Items that need immediate attention'
      case 'stock-alerts':
        return 'Manage inventory alerts and notifications'
      case 'suppliers':
        return 'Manage supplier relationships and contacts'
      case 'purchase-orders':
        return 'Create and track purchase orders'
      case 'adjustments':
        return 'Adjust stock levels and perform counts'
      case 'reports':
        return 'Generate inventory reports and analytics'
      case 'analytics':
        return 'Advanced analytics and insights'
      case 'transactions':
        return 'View all inventory transactions and movements'
      case 'auto-reorder':
        return 'Automatically manage inventory reordering'
      case 'pos-sync':
        return 'Synchronize with point of sale systems'
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
                  {tab.id === 'stock-alerts' && lowStockItems.activeAlerts.length > 0 && (
                    <span className="ml-1 px-2 py-0.5 bg-orange-500 text-white text-xs rounded-full font-medium">
                      {lowStockItems.activeAlerts.length}
                    </span>
                  )}
                  {tab.id === 'suppliers' && suppliers.suppliers.length > 0 && (
                    <span className="ml-1 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full font-medium">
                      {suppliers.suppliers.length}
                    </span>
                  )}
                  {tab.id === 'purchase-orders' && purchaseOrders.purchaseOrders.length > 0 && (
                    <span className="ml-1 px-2 py-0.5 bg-yellow-500 text-white text-xs rounded-full font-medium">
                      {purchaseOrders.purchaseOrders.length}
                    </span>
                  )}
                  {tab.id === 'adjustments' && transactions.transactions.length > 0 && (
                    <span className="ml-1 px-2 py-0.5 bg-purple-500 text-white text-xs rounded-full font-medium">
                      {transactions.transactions.length}
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