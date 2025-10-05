// app/dashboard/order-component/OrderComponent.tsx

"use client"

import { useState, useEffect } from "react"
import { Plus, BarChart3, ArrowLeft, Loader2 } from "lucide-react"
import CreateOrderForm from "./CreateOrderForm"
import OrdersList from "./OrderList"
import OrderEditModal from "./OrderEditModal"
import OrderStatsComponent from "./OrderStatsComponent"
import { Order, UpdateOrderData } from "@/lib/order-api"
import { useOrders } from "@/hooks/use-orders"
import { useTheme } from "@/hooks/useTheme"

interface OrderComponentProps {
  onCreateOrder?: () => void
}

export default function OrderComponent({ onCreateOrder }: OrderComponentProps) {
  const [expandedView, setExpandedView] = useState<'create-order' | 'stats' | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [mounted, setMounted] = useState(false)
  const { updateOrder } = useOrders()
  const { theme, isLoaded: themeLoaded, isDark, currentTheme } = useTheme()

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

  const handleCreateOrder = () => {
    setExpandedView('create-order')
    onCreateOrder?.()
  }

  const handleShowStats = () => {
    setExpandedView('stats')
  }

  const handleCloseExpandedView = () => {
    setExpandedView(null)
    setSelectedOrder(null)
  }

  const handleOrderCreated = (order: any) => {
    console.log('Order created:', order)
    setExpandedView(null)
  }

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    // TODO: Implement view order details
    console.log('View order:', order)
  }

  const handleEditOrder = (order: Order) => {
    console.log('Edit order:', order)
    setEditingOrder(order)
  }

  const handleSaveEdit = async (orderId: string, data: UpdateOrderData) => {
    try {
      await updateOrder(orderId, data)
      setEditingOrder(null)
      console.log('Order updated successfully')
    } catch (error) {
      console.error('Failed to update order:', error)
      throw error
    }
  }

  const handleCloseEdit = () => {
    setEditingOrder(null)
  }

  // If create order form is open, show it
  if (expandedView === 'create-order') {
    return (
      <CreateOrderForm
        onBack={handleCloseExpandedView}
        onOrderCreated={handleOrderCreated}
      />
    )
  }

  // If stats view is open, show it
  if (expandedView === 'stats') {
    return (
      <div className={`flex-1 ${mainPanelBg} h-screen overflow-y-auto transition-colors duration-300`} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className={`${cardBg} p-8 border shadow-lg relative overflow-hidden`}
            style={{ borderRadius: '1.5rem' }}>
            <div className="flex items-center gap-4">
              <button
                onClick={handleCloseExpandedView}
                className={`${textSecondary} ${buttonHoverBg} p-2 rounded-xl transition-all duration-200 hover:scale-110`}
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div>
                <h1 className={`text-4xl font-bold ${textPrimary} mb-2`}>Order Statistics</h1>
                <p className={`${textSecondary}`}>Detailed analytics and insights for your orders</p>
              </div>
            </div>
          </div>
          
          <OrderStatsComponent />
        </div>
      </div>
    )
  }

  // Main orders page - use OrdersList component with create button
  return (
    <div className={`flex-1 ${mainPanelBg} h-screen overflow-y-auto transition-colors duration-300`} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className={`${cardBg} p-8 border shadow-lg relative overflow-hidden`}
          style={{ borderRadius: '1.5rem' }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-4xl font-bold ${textPrimary} mb-2`}>Order Management</h1>
              <p className={`${textSecondary}`}>Track and manage all customer orders</p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Stats Button */}
              <button
                onClick={handleShowStats}
                className={`flex items-center gap-2 px-6 py-3 ${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535] border-[#3a3a3a]' : 'bg-gray-100 hover:bg-gray-200 border-gray-300'} ${textPrimary} rounded-xl font-medium transition-all duration-300 border shadow-lg hover:shadow-xl hover:scale-105`}
              >
                <BarChart3 className="h-5 w-5" />
                View Stats
              </button>
              
              {/* Create Order Button */}
              <button
                onClick={handleCreateOrder}
                className={`flex items-center gap-2 px-6 py-3 ${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535] border-[#3a3a3a]' : 'bg-gray-100 hover:bg-gray-200 border-gray-300'} ${textPrimary} rounded-xl font-medium transition-all duration-300 border shadow-lg hover:shadow-xl hover:scale-105`}
              >
                <Plus className="h-5 w-5" />
                Create New Order
              </button>
            </div>
          </div>
        </div>

        {/* Orders List Container */}
        <div className={`${cardBg} border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
          <div className="p-6">
            <OrdersList
              onBack={() => {}} // No back functionality needed here
              onViewOrder={handleViewOrder}
              onEditOrder={handleEditOrder} // Pass the edit handler
              hideHeader={true} // Hide the OrdersList header
            />
          </div>
        </div>
      </div>

      {/* Edit Modal - Managed by OrderComponent */}
      {editingOrder && (
        <OrderEditModal
          order={editingOrder}
          onClose={handleCloseEdit}
          onSave={handleSaveEdit}
          loading={false}
        />
      )}
    </div>
  )
}