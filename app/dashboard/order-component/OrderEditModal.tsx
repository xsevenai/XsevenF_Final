// app/dashboard/order-component/OrderEditModal.tsx

"use client"

import { useState, useEffect } from "react"
import { X, Plus, Minus, Save, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useTheme } from "@/hooks/useTheme"
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
  const [mounted, setMounted] = useState(false)
  const { theme, isLoaded: themeLoaded, isDark, currentTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

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

  if (!order || !themeLoaded || !mounted) return null

  // Theme-based styling variables
  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const inputBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'
  const buttonHoverBg = isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-100'
  const innerCardBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'
  const overlayBg = isDark ? 'bg-[#0f0f0f]/80' : 'bg-black/50'

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
    <div className={`fixed inset-0 ${overlayBg} backdrop-blur-sm z-50 flex items-center justify-center p-4`}>
      <div className={`${cardBg} border shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto`}
        style={{ borderRadius: '1.5rem', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className={`text-3xl font-bold ${textPrimary} mb-2`}>Edit Order #{order.id}</h2>
              <p className={`${textSecondary}`}>
                {order.customer_name ? `${order.customer_name} - ${order.customer_phone}` : `Table ${order.table_id}`}
              </p>
            </div>
            <button
              onClick={onClose}
              className={`p-3 ${textSecondary} ${buttonHoverBg} rounded-xl transition-all duration-200 hover:scale-110`}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {!canEdit && (
            <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
              <p className="text-yellow-500 text-sm font-medium">
                This order cannot be edited because it is {order.status.toLowerCase()}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Details */}
            <div className="space-y-6">
              {/* Status Updates */}
              <div className={`${innerCardBg} border p-6 space-y-4`} style={{ borderRadius: '1.5rem' }}>
                <h3 className={`text-xl font-semibold ${textPrimary}`}>Order Status</h3>
                
                <div>
                  <label className={`block text-sm font-medium ${textPrimary} mb-3`}>
                    Order Status
                  </label>
                  <select
                    value={formData.status || order.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as OrderStatus }))}
                    disabled={!canEdit}
                    className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none disabled:opacity-50 transition-all duration-200`}
                  >
                    <option value={OrderStatus.PENDING}>Pending</option>
                    <option value={OrderStatus.CONFIRMED}>Confirmed</option>
                    <option value={OrderStatus.PREPARING}>Preparing</option>
                    <option value={OrderStatus.READY}>Ready</option>
                    <option value={OrderStatus.COMPLETED}>Completed</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textPrimary} mb-3`}>
                    Payment Status
                  </label>
                  <select
                    value={formData.payment_status || order.payment_status}
                    onChange={(e) => setFormData(prev => ({ ...prev, payment_status: e.target.value as PaymentStatus }))}
                    disabled={!canEdit}
                    className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none disabled:opacity-50 transition-all duration-200`}
                  >
                    <option value={PaymentStatus.PENDING}>Pending</option>
                    <option value={PaymentStatus.COMPLETED}>Completed</option>
                    <option value={PaymentStatus.FAILED}>Failed</option>
                    <option value={PaymentStatus.REFUNDED}>Refunded</option>
                  </select>
                </div>
              </div>

              {/* Special Instructions */}
              <div className={`${innerCardBg} border p-6`} style={{ borderRadius: '1.5rem' }}>
                <label className={`block text-xl font-semibold ${textPrimary} mb-4`}>
                  Special Instructions
                </label>
                <textarea
                  value={formData.special_instructions || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, special_instructions: e.target.value }))}
                  disabled={!canEdit}
                  rows={4}
                  className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none disabled:opacity-50 transition-all duration-200 resize-none`}
                  placeholder="Add special instructions..."
                />
              </div>

              {/* Order Summary */}
              <div className={`${innerCardBg} border p-6`} style={{ borderRadius: '1.5rem' }}>
                <h4 className={`${textPrimary} text-xl font-semibold mb-4`}>Order Summary</h4>
                <div className="space-y-3">
                  <div className={`flex justify-between ${textSecondary}`}>
                    <span>Subtotal:</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className={`flex justify-between ${textSecondary}`}>
                    <span>Tax:</span>
                    <span>${(calculateSubtotal() * 0.1).toFixed(2)}</span>
                  </div>
                  <div className={`flex justify-between ${textSecondary}`}>
                    <span>Tip:</span>
                    <span>${Number(order.tip_amount).toFixed(2)}</span>
                  </div>
                  <div className={`border-t ${isDark ? 'border-[#2a2a2a]' : 'border-gray-200'} pt-3 flex justify-between ${textPrimary} font-bold text-lg`}>
                    <span>Total:</span>
                    <span className="text-green-500">${(calculateTotal() + Number(order.tip_amount)).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-4">
              <div className={`${innerCardBg} border p-6`} style={{ borderRadius: '1.5rem' }}>
                <h3 className={`text-xl font-semibold ${textPrimary} mb-4`}>Order Items</h3>
                
                <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-hide">
                  
                  {items.map((item, index) => (
                    <div key={index} className={`${cardBg} border p-4 shadow-sm hover:shadow-md transition-all duration-200`}
                      style={{ borderRadius: '1rem' }}>
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className={`${textPrimary} font-medium`}>{item.name}</h4>
                            <p className="text-green-500 text-sm font-medium">${Number(item.price).toFixed(2)} each</p>
                          </div>
                          
                          {canEdit && (
                            <button
                              onClick={() => handleItemRemove(index)}
                              className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all duration-200 hover:scale-110"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleItemQuantityChange(index, item.quantity - 1)}
                              disabled={!canEdit || item.quantity <= 1}
                              className={`p-2 ${textSecondary} ${buttonHoverBg} rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-110`}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            
                            <span className={`${textPrimary} font-semibold text-lg w-8 text-center`}>
                              {item.quantity}
                            </span>
                            
                            <button
                              onClick={() => handleItemQuantityChange(index, item.quantity + 1)}
                              disabled={!canEdit}
                              className={`p-2 ${textSecondary} ${buttonHoverBg} rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-110`}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          <div className={`${textPrimary} font-semibold text-lg`}>
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
                            className={`w-full ${inputBg} ${textPrimary} px-3 py-2 rounded-lg text-sm border focus:border-blue-500 focus:outline-none disabled:opacity-50 transition-all duration-200`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className={`flex items-center justify-end gap-4 mt-8 pt-6 border-t ${isDark ? 'border-[#2a2a2a]' : 'border-gray-200'}`}>
            <button
              onClick={onClose}
              className={`px-6 py-3 ${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535] border-[#3a3a3a]' : 'bg-gray-100 hover:bg-gray-200 border-gray-300'} ${textPrimary} rounded-xl font-medium transition-all duration-300 border shadow-lg hover:shadow-xl hover:scale-105`}
            >
              Cancel
            </button>
            
            {canEdit && (
              <button
                onClick={handleSave}
                disabled={isSaving || loading}
                className={`px-6 py-3 ${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535] border-[#3a3a3a]' : 'bg-gray-100 hover:bg-gray-200 border-gray-300'} ${textPrimary} rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 border shadow-lg hover:shadow-xl hover:scale-105`}
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
      </div>
    </div>
  )
}