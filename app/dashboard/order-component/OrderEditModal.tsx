// app/dashboard/order-component/OrderEditModal.tsx

"use client"

import { useState, useEffect } from "react"
import { X, Plus, Minus, Save, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Order, OrderStatus, PaymentStatus, PaymentMethod, UpdateOrderData } from "@/lib/types/order"

interface OrderEditModalProps {
  order: Order | null
  onClose: () => void
  onSave: (orderId: string, data: UpdateOrderData) => Promise<void>
  loading?: boolean
}

export default function OrderEditModal({ order, onClose, onSave, loading = false }: OrderEditModalProps) {
  const [formData, setFormData] = useState<UpdateOrderData>({})
  const [items, setItems] = useState(order?.items || [])
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (order) {
      setFormData({
        status: order.status,
        payment_status: order.payment_status,
        special_instructions: order.special_instructions || ''
      })
      setItems([...order.items])
    }
  }, [order])

  if (!order) return null

  const handleItemQuantityChange = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return
    
    const updatedItems = [...items]
    updatedItems[index] = {
      ...updatedItems[index],
      quantity: newQuantity
    }
    setItems(updatedItems)
  }

  const handleItemRemove = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index)
    setItems(updatedItems)
  }

  const handleItemInstructionsChange = (index: number, instructions: string) => {
    const updatedItems = [...items]
    updatedItems[index] = {
      ...updatedItems[index],
      special_instructions: instructions
    }
    setItems(updatedItems)
  }

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0)
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const tax = subtotal * 0.1 // Assuming 10% tax
    return subtotal + tax
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      
      const updateData: UpdateOrderData = {
        ...formData,
        items: items
      }

      await onSave(order.id.toString(), updateData)
      onClose()
    } catch (error) {
      console.error('Failed to save order:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const canEdit = order.status !== OrderStatus.COMPLETED && order.status !== OrderStatus.CANCELLED

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Edit Order #{order.id}</h2>
              <p className="text-gray-400">
                {order.customer_name ? `${order.customer_name} - ${order.customer_phone}` : `Table ${order.table_id}`}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-600/50 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {!canEdit && (
            <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-yellow-400 text-sm">
                This order cannot be edited because it is {order.status}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Details */}
            <div className="space-y-6">
              {/* Status Updates */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Order Status</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Order Status
                  </label>
                  <select
                    value={formData.status || order.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as OrderStatus }))}
                    disabled={!canEdit}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none disabled:opacity-50"
                  >
                    <option value={OrderStatus.PENDING}>Pending</option>
                    <option value={OrderStatus.CONFIRMED}>Confirmed</option>
                    <option value={OrderStatus.PREPARING}>Preparing</option>
                    <option value={OrderStatus.READY}>Ready</option>
                    <option value={OrderStatus.COMPLETED}>Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Payment Status
                  </label>
                  <select
                    value={formData.payment_status || order.payment_status}
                    onChange={(e) => setFormData(prev => ({ ...prev, payment_status: e.target.value as PaymentStatus }))}
                    disabled={!canEdit}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none disabled:opacity-50"
                  >
                    <option value={PaymentStatus.PENDING}>Pending</option>
                    <option value={PaymentStatus.COMPLETED}>Completed</option>
                    <option value={PaymentStatus.FAILED}>Failed</option>
                    <option value={PaymentStatus.REFUNDED}>Refunded</option>
                  </select>
                </div>
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Special Instructions
                </label>
                <textarea
                  value={formData.special_instructions || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, special_instructions: e.target.value }))}
                  disabled={!canEdit}
                  rows={3}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none disabled:opacity-50"
                  placeholder="Add special instructions..."
                />
              </div>

              {/* Order Summary */}
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3">Order Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal:</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Tax:</span>
                    <span>${(calculateSubtotal() * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Tip:</span>
                    <span>${Number(order.tip_amount).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-600 pt-2 flex justify-between text-white font-semibold">
                    <span>Total:</span>
                    <span>${(calculateTotal() + Number(order.tip_amount)).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Order Items</h3>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {items.map((item, index) => (
                  <Card key={index} className="bg-gray-800/50 border-gray-600/50 p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-white font-medium">{item.name}</h4>
                          <p className="text-green-400 text-sm">${Number(item.price).toFixed(2)} each</p>
                        </div>
                        
                        {canEdit && (
                          <button
                            onClick={() => handleItemRemove(index)}
                            className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleItemQuantityChange(index, item.quantity - 1)}
                            disabled={!canEdit || item.quantity <= 1}
                            className="p-1 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          
                          <span className="text-white font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => handleItemQuantityChange(index, item.quantity + 1)}
                            disabled={!canEdit}
                            className="p-1 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="text-white font-medium">
                          ${(Number(item.price) * item.quantity).toFixed(2)}
                        </div>
                      </div>

                      {/* Item Special Instructions */}
                      <div>
                        <input
                          type="text"
                          value={item.special_instructions || ''}
                          onChange={(e) => handleItemInstructionsChange(index, e.target.value)}
                          disabled={!canEdit}
                          placeholder="Item special instructions..."
                          className="w-full bg-gray-700 text-white px-3 py-1 rounded text-sm border border-gray-600 focus:border-purple-500 focus:outline-none disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-600">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            
            {canEdit && (
              <button
                onClick={handleSave}
                disabled={isSaving || loading}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}