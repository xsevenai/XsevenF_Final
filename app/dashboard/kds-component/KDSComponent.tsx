// app/dashboard/kds-component/KDSComponent.tsx

"use client"

import { useState, useEffect } from "react"
import { useTheme } from "@/hooks/useTheme"
import { useKDSManagement } from "@/hooks/use-kds"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Clock, 
  Users, 
  ChefHat, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  RefreshCw,
  Filter,
  Plus,
  Eye,
  Edit,
  BarChart3
} from "lucide-react"
import type { KDSOrderWithMetrics, KDSStatus } from "@/src/api/generated/models/KDSOrderWithMetrics"
import type { KDSOrderCreate } from "@/src/api/generated/models/KDSOrderCreate"
import type { KDSOrderUpdate } from "@/src/api/generated/models/KDSOrderUpdate"
import CreateKDSOrderModal from "./components/CreateKDSOrderModal"
import UpdateKDSOrderModal from "./components/UpdateKDSOrderModal"
import KDSPerformanceDashboard from "./components/KDSPerformanceDashboard"

interface KDSComponentProps {
  businessId?: string
}

export default function KDSComponent({ businessId }: KDSComponentProps) {
  const { theme, isLoaded: themeLoaded, isDark, currentTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [selectedStation, setSelectedStation] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<KDSOrderWithMetrics | null>(null)
  const [activeTab, setActiveTab] = useState<"orders" | "performance">("orders")
  
  // Get businessId from localStorage if not provided
  const [currentBusinessId, setCurrentBusinessId] = useState<string>(businessId || "")
  
  useEffect(() => {
    if (!businessId) {
      const storedBusinessId = localStorage.getItem('businessId')
      if (storedBusinessId) {
        setCurrentBusinessId(storedBusinessId)
      }
    }
  }, [businessId])

  const { 
    orders, 
    performance, 
    refreshAll, 
    loading, 
    error 
  } = useKDSManagement(currentBusinessId)

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

  const mainPanelBg = isDark ? 'bg-[#111111]' : 'bg-gray-50'
  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const innerCardBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'

  // Filter orders based on selected filters
  const filteredOrders = orders.orders.filter(order => {
    const stationMatch = selectedStation === "all" || order.station === selectedStation
    const statusMatch = selectedStatus === "all" || order.status === selectedStatus
    return stationMatch && statusMatch
  })

  // Get unique stations
  const stations = Array.from(new Set(orders.orders.map(order => order.station)))

  // Get status counts
  const statusCounts = {
    pending: orders.orders.filter(o => o.status === 'pending').length,
    preparing: orders.orders.filter(o => o.status === 'preparing').length,
    ready: orders.orders.filter(o => o.status === 'ready').length,
    served: orders.orders.filter(o => o.status === 'served').length,
    cancelled: orders.orders.filter(o => o.status === 'cancelled').length,
  }

  const getStatusColor = (status: KDSStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500'
      case 'preparing': return 'bg-blue-500'
      case 'ready': return 'bg-green-500'
      case 'served': return 'bg-gray-500'
      case 'cancelled': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: KDSStatus) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'preparing': return <ChefHat className="h-4 w-4" />
      case 'ready': return <CheckCircle className="h-4 w-4" />
      case 'served': return <Users className="h-4 w-4" />
      case 'cancelled': return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const formatTime = (timeString?: string | null) => {
    if (!timeString) return 'N/A'
    return new Date(timeString).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const calculatePrepTime = (order: KDSOrderWithMetrics) => {
    if (!order.prep_start_time) return 'Not started'
    const start = new Date(order.prep_start_time)
    const end = order.prep_end_time ? new Date(order.prep_end_time) : new Date()
    const diffMs = end.getTime() - start.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    return `${diffMins}m`
  }

  const handleCreateOrder = async (orderData: KDSOrderCreate) => {
    try {
      await orders.createOrder(orderData)
      // Refresh the orders list
      await refreshAll()
    } catch (error) {
      console.error('Failed to create KDS order:', error)
      throw error
    }
  }

  const handleUpdateOrder = async (orderId: string, updateData: KDSOrderUpdate) => {
    try {
      await orders.updateOrder(orderId, updateData)
      // Refresh the orders list
      await refreshAll()
    } catch (error) {
      console.error('Failed to update KDS order:', error)
      throw error
    }
  }

  const handleViewOrder = (order: KDSOrderWithMetrics) => {
    setSelectedOrder(order)
    setIsUpdateModalOpen(true)
  }

  return (
    <div className={`flex-1 ${mainPanelBg} h-screen overflow-y-auto transition-colors duration-300`} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className={`${cardBg} p-8 border shadow-lg relative overflow-hidden`} style={{ borderRadius: '1.5rem' }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-4xl font-bold ${textPrimary} mb-2`}>Kitchen Display System</h1>
              <p className={`${textSecondary}`}>Monitor and manage kitchen orders in real-time</p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Order
              </Button>
              <Button 
                onClick={refreshAll}
                disabled={loading}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mt-6">
            <Button
              variant={activeTab === "orders" ? "default" : "outline"}
              onClick={() => setActiveTab("orders")}
              className="flex items-center gap-2"
            >
              <ChefHat className="h-4 w-4" />
              Orders
            </Button>
            <Button
              variant={activeTab === "performance" ? "default" : "outline"}
              onClick={() => setActiveTab("performance")}
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Performance
            </Button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "orders" && (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-5 gap-4">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div 
                  key={status}
                  className={`${cardBg} p-5 border shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105`}
                  style={{ borderRadius: '1.5rem' }}
                  onClick={() => setSelectedStatus(status === selectedStatus ? "all" : status)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`${getStatusColor(status as KDSStatus)} p-2 rounded-lg`}>
                      {getStatusIcon(status as KDSStatus)}
                    </div>
                    <Badge variant={selectedStatus === status ? "default" : "secondary"}>
                      {count}
                    </Badge>
                  </div>
                  <h3 className={`${textSecondary} text-xs font-medium uppercase tracking-wider mb-1`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </h3>
                  <div className={`${textPrimary} text-2xl font-bold`}>{count}</div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className={`${cardBg} p-6 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
              <div className="flex items-center gap-4">
                <Filter className="h-5 w-5 text-gray-500" />
                <h3 className={`${textPrimary} font-semibold`}>Filters</h3>
                
                <div className="flex items-center gap-2">
                  <label className={`${textSecondary} text-sm`}>Station:</label>
                  <select 
                    value={selectedStation}
                    onChange={(e) => setSelectedStation(e.target.value)}
                    className={`${innerCardBg} ${textPrimary} px-3 py-2 rounded-lg text-sm border`}
                  >
                    <option value="all">All Stations</option>
                    {stations.map(station => (
                      <option key={station} value={station}>{station}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className={`${textSecondary} text-sm`}>Status:</label>
                  <select 
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className={`${innerCardBg} ${textPrimary} px-3 py-2 rounded-lg text-sm border`}
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="served">Served</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Orders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrders.map((order, index) => (
                <div
                  key={order.id}
                  className={`${cardBg} p-6 border shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02]`}
                  style={{ 
                    borderRadius: index % 3 === 0 ? '1.5rem' : index % 3 === 1 ? '2rem' : '1rem'
                  }}
                  onClick={() => handleViewOrder(order)}
                >
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`${getStatusColor(order.status)} p-2 rounded-lg`}>
                        {getStatusIcon(order.status)}
                      </div>
                      <div>
                        <h3 className={`${textPrimary} font-semibold`}>Order #{order.order_id}</h3>
                        <p className={`${textSecondary} text-sm`}>Station: {order.station}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-2 mb-4">
                    {order.items.map((item, itemIndex) => (
                      <div key={itemIndex} className={`${innerCardBg} p-3 rounded-lg`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`${textPrimary} font-medium text-sm`}>{item.name}</p>
                            <p className={`${textSecondary} text-xs`}>Qty: {item.quantity}</p>
                            {item.special_instructions && (
                              <p className={`${textSecondary} text-xs italic`}>
                                Note: {item.special_instructions}
                              </p>
                            )}
                          </div>
                        </div>
                        {item.modifiers && item.modifiers.length > 0 && (
                          <div className="mt-2">
                            <p className={`${textSecondary} text-xs`}>Modifiers:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.modifiers.map((modifier, modIndex) => (
                                <Badge key={modIndex} variant="outline" className="text-xs">
                                  {modifier}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Order Details */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className={`${textSecondary}`}>Prep Time:</span>
                      <span className={`${textPrimary} font-medium`}>{calculatePrepTime(order)}</span>
                    </div>
                    
                    {order.target_time && (
                      <div className="flex items-center justify-between text-sm">
                        <span className={`${textSecondary}`}>Target:</span>
                        <span className={`${textPrimary} font-medium`}>{formatTime(order.target_time)}</span>
                      </div>
                    )}

                    {order.assigned_to && (
                      <div className="flex items-center justify-between text-sm">
                        <span className={`${textSecondary}`}>Assigned:</span>
                        <span className={`${textPrimary} font-medium`}>{order.assigned_to}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <span className={`${textSecondary}`}>Created:</span>
                      <span className={`${textPrimary} font-medium`}>{formatTime(order.created_at)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="h-3 w-3 mr-1" />
                      Update
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredOrders.length === 0 && !loading && (
              <div className={`${cardBg} p-12 border shadow-lg text-center`} style={{ borderRadius: '1.5rem' }}>
                <ChefHat className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className={`${textPrimary} text-xl font-semibold mb-2`}>No Orders Found</h3>
                <p className={`${textSecondary}`}>
                  {selectedStation !== "all" || selectedStatus !== "all" 
                    ? "No orders match your current filters. Try adjusting your filter settings."
                    : "No orders are currently active. New orders will appear here when they come in."
                  }
                </p>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className={`${cardBg} p-12 border shadow-lg text-center`} style={{ borderRadius: '1.5rem' }}>
                <Loader2 className="h-16 w-16 text-gray-400 mx-auto mb-4 animate-spin" />
                <h3 className={`${textPrimary} text-xl font-semibold mb-2`}>Loading Orders...</h3>
                <p className={`${textSecondary}`}>Please wait while we fetch the latest orders.</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className={`${cardBg} p-12 border shadow-lg text-center`} style={{ borderRadius: '1.5rem' }}>
                <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                <h3 className={`${textPrimary} text-xl font-semibold mb-2`}>Error Loading Orders</h3>
                <p className={`${textSecondary} mb-4`}>{error}</p>
                <Button onClick={refreshAll} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </div>
            )}
          </>
        )}

        {/* Performance Tab */}
        {activeTab === "performance" && (
          <KDSPerformanceDashboard 
            businessId={currentBusinessId}
            isDark={isDark}
          />
        )}
      </div>

      {/* Create Order Modal */}
      <CreateKDSOrderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateOrder={handleCreateOrder}
        businessId={currentBusinessId}
        isDark={isDark}
      />

      {/* Update Order Modal */}
      <UpdateKDSOrderModal
        order={selectedOrder}
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false)
          setSelectedOrder(null)
        }}
        onUpdateOrder={handleUpdateOrder}
        isDark={isDark}
      />
    </div>
  )
}
