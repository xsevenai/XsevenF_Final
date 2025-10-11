// app/dashboard/kds-component/components/KDSOrderModal.tsx

"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { 
  Clock, 
  Users, 
  ChefHat, 
  CheckCircle, 
  AlertCircle,
  X,
  User,
  Timer,
  Target
} from "lucide-react"
import type { KDSOrderWithMetrics, KDSStatus } from "@/src/api/generated/models/KDSOrderWithMetrics"

interface KDSOrderModalProps {
  order: KDSOrderWithMetrics | null
  isOpen: boolean
  onClose: () => void
  onUpdateStatus?: (orderId: string, status: KDSStatus) => void
  onAssignStaff?: (orderId: string, staffId: string) => void
  isDark?: boolean
}

export default function KDSOrderModal({ 
  order, 
  isOpen, 
  onClose, 
  onUpdateStatus,
  onAssignStaff,
  isDark = false 
}: KDSOrderModalProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const innerCardBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'

  if (!order) return null

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
      case 'pending': return <Clock className="h-5 w-5" />
      case 'preparing': return <ChefHat className="h-5 w-5" />
      case 'ready': return <CheckCircle className="h-5 w-5" />
      case 'served': return <Users className="h-5 w-5" />
      case 'cancelled': return <AlertCircle className="h-5 w-5" />
      default: return <Clock className="h-5 w-5" />
    }
  }

  const formatTime = (timeString?: string | null) => {
    if (!timeString) return 'N/A'
    return new Date(timeString).toLocaleString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      month: 'short',
      day: 'numeric'
    })
  }

  const calculatePrepTime = (order: KDSOrderWithMetrics) => {
    if (!order.prep_start_time) return 'Not started'
    const start = new Date(order.prep_start_time)
    const end = order.prep_end_time ? new Date(order.prep_end_time) : new Date()
    const diffMs = end.getTime() - start.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    return `${diffMins} minutes`
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-2xl ${isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'}`}>
        <DialogHeader>
          <DialogTitle className={`${textPrimary} text-2xl font-bold flex items-center gap-3`}>
            <div className={`${getStatusColor(order.status)} p-2 rounded-lg`}>
              {getStatusIcon(order.status)}
            </div>
            Order #{order.order_id}
            <Badge className={getStatusColor(order.status)}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Information */}
          <div className="grid grid-cols-2 gap-4">
            <Card className={`${innerCardBg} p-4`}>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-gray-500" />
                  <span className={`${textSecondary} text-sm`}>Station</span>
                </div>
                <p className={`${textPrimary} font-semibold`}>{order.station}</p>
              </div>
            </Card>

            <Card className={`${innerCardBg} p-4`}>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-gray-500" />
                  <span className={`${textSecondary} text-sm`}>Prep Time</span>
                </div>
                <p className={`${textPrimary} font-semibold`}>{calculatePrepTime(order)}</p>
              </div>
            </Card>
          </div>

          {/* Order Items */}
          <div>
            <h3 className={`${textPrimary} text-lg font-semibold mb-4`}>Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item, itemIndex) => (
                <Card key={itemIndex} className={`${innerCardBg} p-4`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className={`${textPrimary} font-semibold`}>{item.name}</h4>
                      <p className={`${textSecondary} text-sm`}>Quantity: {item.quantity}</p>
                      
                      {item.special_instructions && (
                        <div className="mt-2">
                          <p className={`${textSecondary} text-sm font-medium`}>Special Instructions:</p>
                          <p className={`${textSecondary} text-sm italic`}>{item.special_instructions}</p>
                        </div>
                      )}

                      {item.modifiers && item.modifiers.length > 0 && (
                        <div className="mt-2">
                          <p className={`${textSecondary} text-sm font-medium`}>Modifiers:</p>
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
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Order Timeline */}
          <div>
            <h3 className={`${textPrimary} text-lg font-semibold mb-4`}>Order Timeline</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`${textSecondary}`}>Created:</span>
                <span className={`${textPrimary} font-medium`}>{formatTime(order.created_at)}</span>
              </div>
              
              {order.prep_start_time && (
                <div className="flex items-center justify-between">
                  <span className={`${textSecondary}`}>Prep Started:</span>
                  <span className={`${textPrimary} font-medium`}>{formatTime(order.prep_start_time)}</span>
                </div>
              )}

              {order.prep_end_time && (
                <div className="flex items-center justify-between">
                  <span className={`${textSecondary}`}>Prep Completed:</span>
                  <span className={`${textPrimary} font-medium`}>{formatTime(order.prep_end_time)}</span>
                </div>
              )}

              {order.target_time && (
                <div className="flex items-center justify-between">
                  <span className={`${textSecondary}`}>Target Time:</span>
                  <span className={`${textPrimary} font-medium`}>{formatTime(order.target_time)}</span>
                </div>
              )}

              {order.assigned_to && (
                <div className="flex items-center justify-between">
                  <span className={`${textSecondary}`}>Assigned To:</span>
                  <span className={`${textPrimary} font-medium`}>{order.assigned_to}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className={`${textSecondary}`}>Last Updated:</span>
                <span className={`${textPrimary} font-medium`}>{formatTime(order.updated_at)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={onClose} className="flex-1">
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
            
            {nextStatus && (
              <Button 
                onClick={() => handleStatusUpdate(nextStatus)}
                disabled={isUpdating}
                className="flex-1"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as {nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
