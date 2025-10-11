// app/dashboard/kds-component/components/KDSOrderCard.tsx

"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Clock, 
  Users, 
  ChefHat, 
  CheckCircle, 
  AlertCircle,
  Eye,
  Edit,
  User
} from "lucide-react"
import type { KDSOrderWithMetrics, KDSStatus } from "@/src/api/generated/models/KDSOrderWithMetrics"

interface KDSOrderCardProps {
  order: KDSOrderWithMetrics
  onUpdateStatus?: (orderId: string, status: KDSStatus) => void
  onViewDetails?: (order: KDSOrderWithMetrics) => void
  onAssignStaff?: (orderId: string, staffId: string) => void
  isDark?: boolean
}

export default function KDSOrderCard({ 
  order, 
  onUpdateStatus, 
  onViewDetails, 
  onAssignStaff,
  isDark = false 
}: KDSOrderCardProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const innerCardBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'

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

  const getNextStatus = (currentStatus: KDSStatus): KDSStatus | null => {
    switch (currentStatus) {
      case 'pending': return 'preparing'
      case 'preparing': return 'ready'
      case 'ready': return 'served'
      default: return null
    }
  }

  const handleStatusUpdate = async (newStatus: KDSStatus) => {
    if (!onUpdateStatus) return
    
    setIsUpdating(true)
    try {
      await onUpdateStatus(order.id, newStatus)
    } catch (error) {
      console.error('Failed to update order status:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const nextStatus = getNextStatus(order.status)

  return (
    <Card className={`p-6 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02] ${isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'}`}>
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
        <Button 
          size="sm" 
          variant="outline" 
          className="flex-1"
          onClick={() => onViewDetails?.(order)}
        >
          <Eye className="h-3 w-3 mr-1" />
          View
        </Button>
        
        {nextStatus && (
          <Button 
            size="sm" 
            className="flex-1"
            onClick={() => handleStatusUpdate(nextStatus)}
            disabled={isUpdating}
          >
            <Edit className="h-3 w-3 mr-1" />
            {nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}
          </Button>
        )}
      </div>
    </Card>
  )
}
