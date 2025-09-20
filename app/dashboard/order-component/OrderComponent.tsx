// app/dashboard/order-component/OrderComponent.tsx

"use client"

import { useState } from "react"
import { Plus, BarChart3 } from "lucide-react"
import CreateOrderForm from "./CreateOrderForm"
import OrdersList from "./OrderList"
import OrderEditModal from "./OrderEditModal"
import OrderStatsComponent from "./OrderStatsComponent"
import { Order, UpdateOrderData } from "@/lib/order-api"
import { useOrders } from "@/hooks/use-orders"

interface OrderComponentProps {
  onCreateOrder?: () => void
}

export default function OrderComponent({ onCreateOrder }: OrderComponentProps) {
  const [expandedView, setExpandedView] = useState<'create-order' | 'stats' | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const { updateOrder } = useOrders()

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
      <div className="space-y-6">
        <div className="flex items-center gap-4 p-6 pb-0">
          <button
            onClick={handleCloseExpandedView}
            className="px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white rounded-lg transition-colors"
          >
            ← Back to Orders
          </button>
        </div>
        <OrderStatsComponent />
      </div>
    )
  }

  // Main orders page - use OrdersList component with create button
  return (
    <>
      <div className="p-6 space-y-6">
        {/* Header with Create Order and Stats Buttons */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Order Management
              </h2>
              <p className="text-gray-400">Track and manage all customer orders</p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Stats Button */}
              <button
                onClick={handleShowStats}
                className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] text-white rounded-lg font-medium hover:from-[#2563eb] hover:to-[#1e40af] transition-all duration-300"
              >
                <BarChart3 className="h-5 w-5" />
                Stats
              </button>
              
              {/* Create Order Button */}
              <button
                onClick={handleCreateOrder}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] text-white rounded-lg font-medium hover:from-[#6d28d9] hover:to-[#7c3aed] transition-all duration-300"
              >
                <Plus className="h-5 w-5" />
                Create New Order
              </button>
            </div>
          </div>
        </div>

        {/* Use OrdersList component but without the back button and header */}
        <OrdersList
          onBack={() => {}} // No back functionality needed here
          onViewOrder={handleViewOrder}
          onEditOrder={handleEditOrder} // Pass the edit handler
          hideHeader={true} // Hide the OrdersList header
        />
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
    </>
  )
}