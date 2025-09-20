// app/dashboard/order-component/OrdersList.tsx

"use client"

import { useState } from "react"
import { Eye, Edit, Trash2, Clock, CheckCircle, XCircle, Filter, Search, ArrowLeft, AlertTriangle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useOrders } from "@/hooks/use-orders"
import { Order, OrderStatus, PaymentStatus, OrderFilters, UpdateOrderData } from "@/lib/order-api"

interface OrdersListProps {
  onBack: () => void
  onViewOrder: (order: Order) => void
  onEditOrder?: (order: Order) => void
  hideHeader?: boolean
}

export default function OrdersList({ onBack, onViewOrder, onEditOrder, hideHeader = false }: OrdersListProps) {
  const [filters, setFilters] = useState<OrderFilters>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null)
  const { orders, loading, error, refresh, updateOrder, cancelOrder } = useOrders(filters)

  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig = {
      [OrderStatus.PENDING]: { color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/20", label: "Pending" },
      [OrderStatus.CONFIRMED]: { color: "bg-blue-500/20 text-blue-400 border-blue-500/20", label: "Confirmed" },
      [OrderStatus.PREPARING]: { color: "bg-orange-500/20 text-orange-400 border-orange-500/20", label: "Preparing" },
      [OrderStatus.READY]: { color: "bg-green-500/20 text-green-400 border-green-500/20", label: "Ready" },
      [OrderStatus.COMPLETED]: { color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20", label: "Completed" },
      [OrderStatus.CANCELLED]: { color: "bg-red-500/20 text-red-400 border-red-500/20", label: "Cancelled" }
    }
    
    const config = statusConfig[status]
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const getPaymentBadge = (paymentStatus: PaymentStatus) => {
    const paymentConfig = {
      [PaymentStatus.PENDING]: { color: "bg-gray-500/20 text-gray-400 border-gray-500/20", label: "Pending" },
      [PaymentStatus.COMPLETED]: { color: "bg-green-500/20 text-green-400 border-green-500/20", label: "Paid" },
      [PaymentStatus.FAILED]: { color: "bg-red-500/20 text-red-400 border-red-500/20", label: "Failed" },
      [PaymentStatus.REFUNDED]: { color: "bg-purple-500/20 text-purple-400 border-purple-500/20", label: "Refunded" }
    }
    
    const config = paymentConfig[paymentStatus]
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrder(orderId, { status: newStatus })
      refresh()
    } catch (error) {
      console.error('Failed to update order status:', error)
    }
  }

  const handleEditOrder = (order: Order) => {
    console.log('Edit order:', order)
    if (onEditOrder) {
      onEditOrder(order)
    }
  }

  const handleDeleteOrder = async (orderId: string) => {
    // Use a more user-friendly prompt
    const reason = prompt('Please provide a reason for cancelling this order (optional):')
    if (reason === null) return // User cancelled the prompt
    
    // Provide a default reason if empty
    const cancellationReason = reason.trim() || 'Cancelled by staff'
    
    try {
      setDeletingOrderId(orderId)
      console.log('Cancelling order:', { orderId, reason: cancellationReason })
      
      await cancelOrder(orderId, cancellationReason)
      
      // Show success message
      console.log('Order cancelled successfully')
      refresh()
    } catch (error) {
      console.error('Failed to cancel order:', error)
      
      // Better error message extraction
      let errorMessage = 'Failed to cancel order'
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      } else if (error && typeof error === 'object') {
        // Handle cases where error might be an object with error details
        const errorObj = error as any
        errorMessage = errorObj.message || errorObj.error || errorObj.detail || 'Failed to cancel order'
      }
      
      // Show user-friendly error message
      alert(`Failed to cancel order: ${errorMessage}`)
    } finally {
      setDeletingOrderId(null)
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = !searchTerm || 
      order.id.toString().includes(searchTerm) ||
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_phone?.includes(searchTerm)
    
    return matchesSearch
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-gray-400">
          <Clock className="h-6 w-6 animate-spin" />
          <span>Loading orders...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
        {/* Header - only show if hideHeader is false */}
        {!hideHeader && (
          <div className="mb-8">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg text-gray-300 hover:text-white transition-all duration-200 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Orders
            </button>
            
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                  All Orders
                </h2>
                <p className="text-gray-400">View and manage all customer orders</p>
              </div>
              <button
                onClick={refresh}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filters.status || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as OrderStatus || undefined }))}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value={OrderStatus.PENDING}>Pending</option>
              <option value={OrderStatus.CONFIRMED}>Confirmed</option>
              <option value={OrderStatus.PREPARING}>Preparing</option>
              <option value={OrderStatus.READY}>Ready</option>
              <option value={OrderStatus.COMPLETED}>Completed</option>
              <option value={OrderStatus.CANCELLED}>Cancelled</option>
            </select>

            {/* Order Type Filter */}
            <select
              value={filters.order_type || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, order_type: e.target.value as 'dine-in' | 'takeout' | 'delivery' || undefined }))}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
            >
              <option value="">All Types</option>
              <option value="dine-in">Dine In</option>
              <option value="takeout">Takeout</option>
              <option value="delivery">Delivery</option>
            </select>

            {/* Limit */}
            <select
              value={filters.limit || 50}
              onChange={(e) => setFilters(prev => ({ ...prev, limit: parseInt(e.target.value) }))}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
            >
              <option value={25}>25 orders</option>
              <option value={50}>50 orders</option>
              <option value={100}>100 orders</option>
            </select>
          </div>
        </Card>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-8 text-center">
              <p className="text-gray-400">No orders found</p>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id} className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6 hover:border-purple-500/30 transition-all duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                  {/* Order Info */}
                  <div className="lg:col-span-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className="text-white font-semibold">Order #{order.id}</h3>
                        <p className="text-gray-400 text-sm">{formatDate(order.created_at)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="lg:col-span-2">
                    <div>
                      {order.customer_name ? (
                        <>
                          <p className="text-white font-medium">{order.customer_name}</p>
                          <p className="text-gray-400 text-sm">{order.customer_phone}</p>
                        </>
                      ) : (
                        <p className="text-gray-400 text-sm">Table {order.table_id}</p>
                      )}
                    </div>
                  </div>

                  {/* Order Type */}
                  <div className="lg:col-span-1">
                    <span className="px-2 py-1 bg-gray-600/30 text-gray-300 rounded text-xs font-medium capitalize">
                      {order.order_type}
                    </span>
                  </div>

                  {/* Items Count */}
                  <div className="lg:col-span-1">
                    <p className="text-gray-400 text-sm">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="lg:col-span-1">
                    {getStatusBadge(order.status)}
                  </div>

                  {/* Payment */}
                  <div className="lg:col-span-1">
                    {getPaymentBadge(order.payment_status)}
                  </div>

                  {/* Total */}
                  <div className="lg:col-span-1">
                    <p className="text-green-400 font-semibold">
                      ${Number(order.total_amount).toFixed(2)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewOrder(order)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-600/50 rounded-lg transition-colors"
                        title="View Order"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      
                      {order.status !== OrderStatus.COMPLETED && order.status !== OrderStatus.CANCELLED && (
                        <>
                          <button
                            onClick={() => handleEditOrder(order)}
                            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                            title="Edit Order"
                          >
                            <Edit className="h-4 w-4" />
                          </button>

                          <select
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order.id.toString(), e.target.value as OrderStatus)}
                            className="bg-gray-700 text-white px-2 py-1 rounded text-xs border border-gray-600 hover:border-purple-500 focus:border-purple-500 focus:outline-none"
                          >
                            <option value={OrderStatus.PENDING}>Pending</option>
                            <option value={OrderStatus.CONFIRMED}>Confirmed</option>
                            <option value={OrderStatus.PREPARING}>Preparing</option>
                            <option value={OrderStatus.READY}>Ready</option>
                            <option value={OrderStatus.COMPLETED}>Completed</option>
                          </select>

                          <button
                            onClick={() => handleDeleteOrder(order.id.toString())}
                            disabled={deletingOrderId === order.id.toString()}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Cancel Order"
                          >
                            {deletingOrderId === order.id.toString() ? (
                              <Clock className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </>
                      )}
                      
                      {order.status === OrderStatus.CANCELLED && (
                        <span className="text-xs text-red-400 px-2 py-1 bg-red-500/10 rounded">
                          Cancelled
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="mt-4 pt-4 border-t border-gray-600/50">
                  <div className="flex flex-wrap gap-2">
                    {order.items.slice(0, 3).map((item, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-600/30 text-gray-300 rounded text-xs">
                        {item.quantity}x {item.name}
                      </span>
                    ))}
                    {order.items.length > 3 && (
                      <span className="px-2 py-1 bg-gray-600/30 text-gray-400 rounded text-xs">
                        +{order.items.length - 3} more
                      </span>
                    )}
                  </div>
                  {order.special_instructions && (
                    <p className="text-gray-400 text-sm mt-2">
                      <strong>Instructions:</strong> {order.special_instructions}
                    </p>
                  )}
                  {order.cancellation_reason && (
                    <p className="text-red-400 text-sm mt-2">
                      <strong>Cancellation Reason:</strong> {order.cancellation_reason}
                    </p>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Summary Stats */}
        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{filteredOrders.length}</p>
              <p className="text-gray-400 text-sm">Total Orders</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">
                ${filteredOrders.reduce((sum, order) => sum + Number(order.total_amount), 0).toFixed(2)}
              </p>
              <p className="text-gray-400 text-sm">Total Revenue</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">
                {filteredOrders.filter(order => order.status === OrderStatus.PENDING || order.status === OrderStatus.CONFIRMED || order.status === OrderStatus.PREPARING).length}
              </p>
              <p className="text-gray-400 text-sm">Active Orders</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-400">
                {filteredOrders.filter(order => order.status === OrderStatus.COMPLETED).length}
              </p>
              <p className="text-gray-400 text-sm">Completed</p>
            </div>
          </div>
        </Card>
      </div>
    
  )
}