// app/dashboard/kds-component/components/UpdateKDSOrderModal.tsx

"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Save,
  X,
  Clock,
  ChefHat,
  CheckCircle,
  Users,
  AlertCircle,
  Loader2,
  User
} from "lucide-react"
import type { KDSOrderWithMetrics } from "@/src/api/generated/models/KDSOrderWithMetrics"
import type { KDSOrderUpdate } from "@/src/api/generated/models/KDSOrderUpdate"
import type { KDSStatus } from "@/src/api/generated/models/KDSStatus"

interface UpdateKDSOrderModalProps {
  order: KDSOrderWithMetrics | null
  isOpen: boolean
  onClose: () => void
  onUpdateOrder: (orderId: string, updateData: KDSOrderUpdate) => Promise<void>
  isDark?: boolean
}

export default function UpdateKDSOrderModal({ 
  order, 
  isOpen, 
  onClose, 
  onUpdateOrder,
  isDark = false 
}: UpdateKDSOrderModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [updateData, setUpdateData] = useState<Partial<KDSOrderUpdate>>({
    status: undefined,
    assigned_to: undefined,
    prep_start_time: undefined,
    prep_end_time: undefined
  })

  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const innerCardBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen && order) {
      setUpdateData({
        status: order.status,
        assigned_to: order.assigned_to || undefined,
        prep_start_time: order.prep_start_time || undefined,
        prep_end_time: order.prep_end_time || undefined
      })
      setValidationErrors([])
    }
  }, [isOpen, order])

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
    return new Date(timeString).toLocaleString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      month: 'short',
      day: 'numeric'
    })
  }

  const getNextStatus = (currentStatus: KDSStatus): KDSStatus | null => {
    switch (currentStatus) {
      case 'pending': return 'preparing'
      case 'preparing': return 'ready'
      case 'ready': return 'served'
      default: return null
    }
  }

  const handleStatusChange = (newStatus: KDSStatus) => {
    const now = new Date().toISOString()
    
    setUpdateData(prev => {
      const updated = { ...prev, status: newStatus }
      
      // Set timing based on status
      if (newStatus === 'preparing' && !order?.prep_start_time) {
        updated.prep_start_time = now
      } else if (newStatus === 'ready' || newStatus === 'served') {
        updated.prep_end_time = now
      }
      
      return updated
    })
  }

  const handleSubmit = async () => {
    if (!order) return

    const errors: string[] = []
    
    if (!updateData.status) {
      errors.push('Status is required')
    }

    // Validate status transitions
    if (updateData.status && order.status) {
      const validTransitions: Record<KDSStatus, KDSStatus[]> = {
        'pending': ['preparing', 'cancelled'],
        'preparing': ['ready', 'cancelled'],
        'ready': ['served', 'cancelled'],
        'served': [], // No transitions from served
        'cancelled': [] // No transitions from cancelled
      }
      
      const currentStatus = order.status
      const newStatus = updateData.status
      
      if (!validTransitions[currentStatus]?.includes(newStatus)) {
        errors.push(`Invalid status transition from ${currentStatus} to ${newStatus}`)
      }
    }

    if (errors.length > 0) {
      setValidationErrors(errors)
      return
    }

    setValidationErrors([])
    setIsSubmitting(true)
    try {
      // Clean up the update data to match API expectations
      const cleanUpdateData: KDSOrderUpdate = {
        status: updateData.status || null,
        assigned_to: updateData.assigned_to || null,
        prep_start_time: updateData.prep_start_time || null,
        prep_end_time: updateData.prep_end_time || null
      }
      
      await onUpdateOrder(order.id, cleanUpdateData)
      onClose()
    } catch (error) {
      console.error('Failed to update KDS order:', error)
      setValidationErrors(['Failed to update order. Please try again.'])
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleQuickStatusUpdate = async (newStatus: KDSStatus) => {
    if (!order) return
    
    // Validate status transition
    const validTransitions: Record<KDSStatus, KDSStatus[]> = {
      'pending': ['preparing', 'cancelled'],
      'preparing': ['ready', 'cancelled'],
      'ready': ['served', 'cancelled'],
      'served': [], // No transitions from served
      'cancelled': [] // No transitions from cancelled
    }
    
    const currentStatus = order.status
    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      setValidationErrors([`Invalid status transition from ${currentStatus} to ${newStatus}`])
      return
    }
    
    setIsSubmitting(true)
    try {
      const now = new Date().toISOString()
      const quickUpdate: KDSOrderUpdate = { 
        status: newStatus,
        assigned_to: null,
        prep_start_time: null,
        prep_end_time: null
      }
      
      if (newStatus === 'preparing' && !order.prep_start_time) {
        quickUpdate.prep_start_time = now
      } else if (newStatus === 'ready' || newStatus === 'served') {
        quickUpdate.prep_end_time = now
      }
      
      await onUpdateOrder(order.id, quickUpdate)
      onClose()
    } catch (error) {
      console.error('Failed to update KDS order:', error)
      setValidationErrors(['Failed to update order. Please try again.'])
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!order) return null

  const nextStatus = getNextStatus(order.status)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-2xl ${isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'}`}>
        <DialogHeader>
          <DialogTitle className={`${textPrimary} text-2xl font-bold flex items-center gap-3`}>
            <div className={`${getStatusColor(order.status)} p-2 rounded-lg`}>
              {getStatusIcon(order.status)}
            </div>
            Update Order #{order.order_id}
            <Badge className={getStatusColor(order.status)}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className={`${isDark ? 'bg-red-900/20 border-red-500' : 'bg-red-50 border-red-200'} border rounded-lg p-4`}>
              <h4 className={`${isDark ? 'text-red-400' : 'text-red-600'} font-semibold mb-2`}>Please fix the following errors:</h4>
              <ul className={`${isDark ? 'text-red-300' : 'text-red-600'} text-sm space-y-1`}>
                {validationErrors.map((error: string, index: number) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Order Information */}
          <div className="grid grid-cols-2 gap-4">
            <Card className={`${innerCardBg} p-4`}>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ChefHat className="h-4 w-4 text-gray-500" />
                  <span className={`${textSecondary} text-sm`}>Station</span>
                </div>
                <p className={`${textPrimary} font-semibold`}>{order.station}</p>
              </div>
            </Card>

            <Card className={`${innerCardBg} p-4`}>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className={`${textSecondary} text-sm`}>Created</span>
                </div>
                <p className={`${textPrimary} font-semibold`}>{formatTime(order.created_at)}</p>
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

          {/* Update Form */}
          <div>
            <h3 className={`${textPrimary} text-lg font-semibold mb-4`}>Update Order</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label className={textPrimary}>Status *</Label>
                <Select 
                  value={updateData.status} 
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className={innerCardBg}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="preparing">Preparing</SelectItem>
                    <SelectItem value="ready">Ready</SelectItem>
                    <SelectItem value="served">Served</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className={textPrimary}>Assigned To</Label>
                <Input
                  value={updateData.assigned_to || ''}
                  onChange={(e) => setUpdateData(prev => ({ ...prev, assigned_to: e.target.value }))}
                  placeholder="Staff member name..."
                  className={innerCardBg}
                />
              </div>
            </div>

            {/* Quick Status Update Buttons */}
            {nextStatus && (
              <div className="mb-4">
                <Label className={textPrimary}>Quick Actions</Label>
                <div className="flex gap-2 mt-2">
                  <Button 
                    onClick={() => handleQuickStatusUpdate(nextStatus)}
                    disabled={isSubmitting}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Mark as {nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}
                  </Button>
                </div>
              </div>
            )}
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
              Cancel
            </Button>
            
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting || !updateData.status}
              className="flex-1"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Update Order
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
