// app/dashboard/order-component/OrdersList.tsx

"use client"

import { useState, useEffect } from "react"
import { Eye, Edit, Trash2, Clock, CheckCircle, XCircle, Filter, Search, ArrowLeft, AlertTriangle, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useOrders } from "@/hooks/use-orders"
import { useTheme } from "@/hooks/useTheme"
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
  const [mounted, setMounted] = useState(false)
  const { orders, loading, error, refresh, updateOrder, cancelOrder } = useOrders(filters)
  const { theme, isLoaded: themeLoaded, isDark, currentTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!themeLoaded || !mounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  // Theme-based styling variables
  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const inputBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'
  const buttonHoverBg = isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-100'
  const innerCardBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'

  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig = {
      [OrderStatus.PENDING]: { color: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30", label: "Pending" },
      [OrderStatus.CONFIRMED]: { color: "bg-blue-500/20 text-blue-500 border-blue-500/30", label: "Confirmed" },
      [OrderStatus.PREPARING]: { color: "bg-orange-500/20 text-orange-500 border-orange-500/30", label: "Preparing" },
      [OrderStatus.READY]: { color: "bg-green-500/20 text-green-500 border-green-500/30", label: "Ready" },
      [OrderStatus.COMPLETED]: { color: "bg-emerald-500/20 text-emerald-500 border-emerald-500/30", label: "Completed" },
      [OrderStatus.CANCELLED]: { color: "bg-red-500/20 text-red-500 border-red-500/30", label: "Cancelled" }
    }
    
    const config = statusConfig[status]
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const getPaymentBadge = (paymentStatus: PaymentStatus) => {
    const paymentConfig = {
      [PaymentStatus.PENDING]: { color: "bg-gray-500/20 text-gray-500 border-gray-500/30", label: "Pending" },
      [PaymentStatus.COMPLETED]: { color: "bg-green-500/20 text-green-500 border-green-500/30", label: "Paid" },
      [PaymentStatus.FAILED]: { color: "bg-red-500/20 text-red-500 border-red-500/30", label: "Failed" },
      [PaymentStatus.REFUNDED]: { color: "bg-purple-500/20 text-purple-500 border-purple-500/30", label: "Refunded" }
    }
    
    const config = paymentConfig[paymentStatus]
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
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
    const reason = prompt('Please provide a reason for cancelling this order (optional):')
    if (reason === null) return
    
    const cancellationReason = reason.trim() || 'Cancelled by staff'
    
    try {
      setDeletingOrderId(orderId)
      console.log('Cancelling order:', { orderId, reason: cancellationReason })
      
      await cancelOrder(orderId, cancellationReason)
      
      console.log('Order cancelled successfully')
      refresh()
    } catch (error) {
      console.error('Failed to cancel order:', error)
      
      let errorMessage = 'Failed to cancel order'
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      } else if (error && typeof error === 'object') {
        const errorObj = error as any
        errorMessage = errorObj.message || errorObj.error || errorObj.detail || 'Failed to cancel order'
      }
      
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
        <div className={`flex items-center gap-3 ${textSecondary}`}>
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
        <div className={`${cardBg} p-8 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className={`${textSecondary} ${buttonHoverBg} p-2 rounded-xl transition-all duration-200 hover:scale-110`}
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className={`text-4xl font-bold ${textPrimary} mb-2`}>All Orders</h1>
              <p className={`${textSecondary}`}>View and manage all customer orders</p>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={refresh}
              className={`px-6 py-3 ${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535] border-[#3a3a3a]' : 'bg-gray-100 hover:bg-gray-200 border-gray-300'} ${textPrimary} rounded-xl font-medium transition-all duration-300 border shadow-lg hover:shadow-xl hover:scale-105`}
            >
              Refresh
            </button>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className={`${cardBg} border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${textSecondary} h-4 w-4`} />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full ${inputBg} ${textPrimary} pl-10 pr-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none transition-all duration-200`}
              />
            </div>

            {/* Status Filter */}
            <select
              value={filters.status || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as OrderStatus || undefined }))}
              className={`${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none transition-all duration-200`}
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
              className={`${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none transition-all duration-200`}
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
              className={`${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none transition-all duration-200`}
            >
              <option value={25}>25 orders</option>
              <option value={50}>50 orders</option>
              <option value={100}>100 orders</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className={`${cardBg} border shadow-lg p-8 text-center`} style={{ borderRadius: '1.5rem' }}>
            <p className={`${textSecondary}`}>No orders found</p>
          </div>
        ) : (
          filteredOrders.map((order, index) => (
            <div key={order.id} className={`${cardBg} border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}
              style={{ 
                borderRadius: index % 3 === 0 ? '1.5rem' : index % 3 === 1 ? '2rem' : '1rem'
              }}>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                  {/* Order Info */}
                  <div className="lg:col-span-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className={`${textPrimary} font-semibold`}>Order #{order.id}</h3>
                        <p className={`${textSecondary} text-sm`}>{formatDate(order.created_at)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="lg:col-span-2">
                    <div>
                      {order.customer_name ? (
                        <>
                          <p className={`${textPrimary} font-medium`}>{order.customer_name}</p>
                          <p className={`${textSecondary} text-sm`}>{order.customer_phone}</p>
                        </>
                      ) : (
                        <p className={`${textSecondary} text-sm`}>Table {order.table_id}</p>
                      )}
                    </div>
                  </div>

                  {/* Order Type */}
                  <div className="lg:col-span-1">
                    <span className={`px-3 py-1 ${innerCardBg} ${textPrimary} rounded-lg text-xs font-medium capitalize border`}>
                      {order.order_type}
                    </span>
                  </div>

                  {/* Items Count */}
                  <div className="lg:col-span-1">
                    <p className={`${textSecondary} text-sm`}>
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
                    <p className="text-green-500 font-semibold">
                      ${Number(order.total_amount).toFixed(2)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewOrder(order)}
                        className={`p-2 ${textSecondary} ${buttonHoverBg} rounded-lg transition-all duration-200 hover:scale-110`}
                        title="View Order"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      
                      {order.status !== OrderStatus.COMPLETED && order.status !== OrderStatus.CANCELLED && (
                        <>
                          <button
                            onClick={() => handleEditOrder(order)}
                            className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all duration-200 hover:scale-110"
                            title="Edit Order"
                          >
                            <Edit className="h-4 w-4" />
                          </button>

                          <select
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order.id.toString(), e.target.value as OrderStatus)}
                            className={`${inputBg} ${textPrimary} px-2 py-1 rounded-lg text-xs border focus:border-blue-500 focus:outline-none transition-all duration-200`}
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
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        <span className="text-xs text-red-500 px-3 py-1 bg-red-500/10 rounded-lg border border-red-500/20">
                          Cancelled
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className={`mt-4 pt-4 border-t ${isDark ? 'border-[#2a2a2a]' : 'border-gray-200'}`}>
                  <div className="flex flex-wrap gap-2">
                    {order.items.slice(0, 3).map((item, index) => (
                      <span key={index} className={`px-3 py-1 ${innerCardBg} ${textPrimary} rounded-lg text-xs border`}>
                        {item.quantity}x {item.name}
                      </span>
                    ))}
                    {order.items.length > 3 && (
                      <span className={`px-3 py-1 ${innerCardBg} ${textSecondary} rounded-lg text-xs border`}>
                        +{order.items.length - 3} more
                      </span>
                    )}
                  </div>
                  {order.special_instructions && (
                    <p className={`${textSecondary} text-sm mt-2`}>
                      <strong>Instructions:</strong> {order.special_instructions}
                    </p>
                  )}
                  {order.cancellation_reason && (
                    <p className="text-red-500 text-sm mt-2">
                      <strong>Cancellation Reason:</strong> {order.cancellation_reason}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary Stats */}
      <div className={`${cardBg} border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className={`text-2xl font-bold ${textPrimary}`}>{filteredOrders.length}</p>
              <p className={`${textSecondary} text-sm`}>Total Orders</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-500">
                ${filteredOrders.reduce((sum, order) => sum + Number(order.total_amount), 0).toFixed(2)}
              </p>
              <p className={`${textSecondary} text-sm`}>Total Revenue</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-500">
                {filteredOrders.filter(order => order.status === OrderStatus.PENDING || order.status === OrderStatus.CONFIRMED || order.status === OrderStatus.PREPARING).length}
              </p>
              <p className={`${textSecondary} text-sm`}>Active Orders</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-500">
                {filteredOrders.filter(order => order.status === OrderStatus.COMPLETED).length}
              </p>
              <p className={`${textSecondary} text-sm`}>Completed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}