// app/dashboard/inventory-management/components/InventoryManagementPanel.tsx

"use client"

import React, { useState } from 'react'
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Filter, 
  Package,
  AlertTriangle,
  Loader2
} from "lucide-react"
import { useTheme } from "@/hooks/useTheme"
import InventoryItemList from './InventoryItemList'
import StockAlertPanel from './StockAlertPanel'
import PurchaseOrderManagement from './PurchaseOrderManagement'

interface InventoryManagementPanelProps {
  // Inventory Items
  items: any[]
  itemsLoading: boolean
  itemsError: string | null
  onRefreshItems: () => void
  onCreateItem: (data: any) => Promise<any>
  onUpdateItem: (itemId: string, data: any) => Promise<any>
  onDeleteItem: (itemId: string) => Promise<void>
  onSearchItems: (searchParams: any) => Promise<any>
  
  // Stock Alerts
  lowStockItems: any[]
  activeAlerts: any[]
  alertsLoading: boolean
  alertsError: string | null
  onRefreshAlerts: () => void
  onCreateStockAlert: (alertData: any) => Promise<any>
  onListStockAlerts: (isActive?: boolean, alertType?: string) => Promise<any>
  onUpdateStockAlert: (alertId: string, isActive: boolean) => Promise<any>
  onDeleteStockAlert: (alertId: string) => Promise<any>
  
  // Purchase Orders
  purchaseOrders: any[]
  suppliers: any[]
  poLoading: boolean
  poError: string | null
  onRefreshPO: () => void
  onRefreshSuppliers?: () => void
  onCreatePurchaseOrder: (data: any, createdBy?: string) => Promise<any>
  onUpdatePurchaseOrder: (poId: string, data: any) => Promise<any>
  onReceivePurchaseOrder: (poId: string, receivedItems: any[]) => Promise<any>
  
  onBack: () => void
}

type ViewType = 'main' | 'items' | 'alerts' | 'purchase-orders'

export default function InventoryManagementPanel({
  items,
  itemsLoading,
  itemsError,
  onRefreshItems,
  onCreateItem,
  onUpdateItem,
  onDeleteItem,
  onSearchItems,
  lowStockItems,
  activeAlerts,
  alertsLoading,
  alertsError,
  onRefreshAlerts,
  onCreateStockAlert,
  onListStockAlerts,
  onUpdateStockAlert,
  onDeleteStockAlert,
  purchaseOrders,
  suppliers,
  poLoading,
  poError,
  onRefreshPO,
  onRefreshSuppliers,
  onCreatePurchaseOrder,
  onUpdatePurchaseOrder,
  onReceivePurchaseOrder,
  onBack
}: InventoryManagementPanelProps) {
  const [currentView, setCurrentView] = useState<ViewType>('main')
  const { isDark } = useTheme()

  // Theme-aware styles
  const cardBg = isDark ? "bg-[#171717] border-[#2a2a2a]" : "bg-white border-gray-200"
  const textPrimary = isDark ? "text-white" : "text-gray-900"
  const textSecondary = isDark ? "text-gray-400" : "text-gray-600"
  const buttonHoverBg = isDark ? "hover:bg-[#2a2a2a]" : "hover:bg-gray-100"

  const handleBackToMain = () => {
    setCurrentView('main')
  }

  const handleBackToParent = () => {
    onBack()
  }

  // Render specific views
  if (currentView === 'items') {
    return (
      <InventoryItemList
        items={items}
        loading={itemsLoading}
        error={itemsError}
        onRefresh={onRefreshItems}
        onCreateItem={onCreateItem}
        onUpdateItem={onUpdateItem}
        onDeleteItem={onDeleteItem}
        onSearchItems={onSearchItems}
        onBack={handleBackToMain}
      />
    )
  }

  if (currentView === 'alerts') {
    return (
      <StockAlertPanel
        lowStockItems={lowStockItems}
        activeAlerts={activeAlerts}
        loading={alertsLoading}
        error={alertsError}
        onRefresh={onRefreshAlerts}
        onCreateStockAlert={onCreateStockAlert}
        onListStockAlerts={onListStockAlerts}
        onUpdateStockAlert={onUpdateStockAlert}
        onDeleteStockAlert={onDeleteStockAlert}
        onBack={handleBackToMain}
      />
    )
  }

  if (currentView === 'purchase-orders') {
    return (
      <PurchaseOrderManagement
        purchaseOrders={purchaseOrders as any}
        suppliers={suppliers}
        inventoryItems={items}
        loading={poLoading}
        error={poError}
        onRefresh={onRefreshPO}
        onRefreshSuppliers={onRefreshSuppliers}
        onCreatePurchaseOrder={onCreatePurchaseOrder}
        onUpdatePurchaseOrder={onUpdatePurchaseOrder}
        onReceivePurchaseOrder={onReceivePurchaseOrder}
        onBack={handleBackToMain}
      />
    )
  }

  // Main dashboard view
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`${cardBg} p-8 border shadow-lg transition-colors duration-300`} style={{ borderRadius: "1.5rem" }}>
        <div className="flex items-center gap-4">
          <button
            onClick={handleBackToParent}
            className={`${textSecondary} ${buttonHoverBg} p-2 rounded-xl transition-all duration-200 hover:scale-110`}
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className={`text-4xl font-bold ${textPrimary} mb-2 transition-colors duration-300`}>
              Inventory Management
            </h1>
            <p className={`${textSecondary} transition-colors duration-300`}>
              Manage inventory items, stock alerts, and purchase orders
            </p>
          </div>
        </div>
      </div>

      {/* Main Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Inventory Items Card */}
        <div 
          className={`${cardBg} p-6 border shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer group`}
          style={{ borderRadius: "1.5rem" }}
          onClick={() => setCurrentView('items')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
              <Package className="h-6 w-6 text-blue-500" />
            </div>
            <div className={`text-right`}>
              <div className={`text-2xl font-bold ${textPrimary}`}>
                {itemsLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  items.length
                )}
              </div>
              <div className={`text-sm ${textSecondary}`}>Items</div>
            </div>
          </div>
          <h3 className={`text-lg font-semibold ${textPrimary} mb-2`}>Inventory Items</h3>
          <p className={`${textSecondary} text-sm`}>
            Manage your inventory items, track stock levels, and update quantities
          </p>
          {itemsError && (
            <div className="mt-3 p-2 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-500 text-xs">Error loading items</p>
            </div>
          )}
        </div>

        {/* Stock Alerts Card */}
        <div 
          className={`${cardBg} p-6 border shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer group`}
          style={{ borderRadius: "1.5rem" }}
          onClick={() => setCurrentView('alerts')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
            </div>
            <div className={`text-right`}>
              <div className={`text-2xl font-bold ${textPrimary}`}>
                {alertsLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  activeAlerts.length
                )}
              </div>
              <div className={`text-sm ${textSecondary}`}>Active Alerts</div>
            </div>
          </div>
          <h3 className={`text-lg font-semibold ${textPrimary} mb-2`}>Stock Alerts</h3>
          <p className={`${textSecondary} text-sm`}>
            Monitor low stock levels and set up automated alerts for inventory management
          </p>
          {alertsError && (
            <div className="mt-3 p-2 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-500 text-xs">Error loading alerts</p>
            </div>
          )}
        </div>

        {/* Purchase Orders Card */}
        <div 
          className={`${cardBg} p-6 border shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer group`}
          style={{ borderRadius: "1.5rem" }}
          onClick={() => setCurrentView('purchase-orders')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
              <Package className="h-6 w-6 text-green-500" />
            </div>
            <div className={`text-right`}>
              <div className={`text-2xl font-bold ${textPrimary}`}>
                {poLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  purchaseOrders.length
                )}
              </div>
              <div className={`text-sm ${textSecondary}`}>Purchase Orders</div>
            </div>
          </div>
          <h3 className={`text-lg font-semibold ${textPrimary} mb-2`}>Purchase Orders</h3>
          <p className={`${textSecondary} text-sm`}>
            Create and manage purchase orders, track deliveries, and update inventory
          </p>
          {poError && (
            <div className="mt-3 p-2 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-500 text-xs">Error loading purchase orders</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className={`${cardBg} p-6 border shadow-lg transition-colors duration-300`} style={{ borderRadius: "1.5rem" }}>
        <h3 className={`text-lg font-semibold ${textPrimary} mb-4`}>Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setCurrentView('items')}
            className={`${isDark ? 'bg-white hover:bg-gray-100 text-gray-900' : 'bg-gray-900 hover:bg-gray-800 text-white'} px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2`}
          >
            <Plus className="h-4 w-4" />
            Add Inventory Item
          </button>
          <button
            onClick={() => setCurrentView('alerts')}
            className={`${isDark ? 'bg-white hover:bg-gray-100 text-gray-900' : 'bg-gray-900 hover:bg-gray-800 text-white'} px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2`}
          >
            <AlertTriangle className="h-4 w-4" />
            Create Stock Alert
          </button>
          <button
            onClick={() => setCurrentView('purchase-orders')}
            className={`${isDark ? 'bg-white hover:bg-gray-100 text-gray-900' : 'bg-gray-900 hover:bg-gray-800 text-white'} px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2`}
          >
            <Package className="h-4 w-4" />
            Create Purchase Order
          </button>
        </div>
      </div>
    </div>
  )
}
