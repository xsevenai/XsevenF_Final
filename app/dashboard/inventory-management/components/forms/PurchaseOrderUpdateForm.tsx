// app/dashboard/inventory-management/components/forms/PurchaseOrderUpdateForm.tsx

"use client"

import React, { useState, useEffect } from 'react'
import { Loader2, Calendar, FileText, AlertCircle, ArrowLeft } from "lucide-react"
import { useTheme } from "@/hooks/useTheme"
import type { PurchaseOrder } from '@/src/api/generated/models/PurchaseOrder'
import type { PurchaseOrderUpdate } from '@/src/api/generated/models/PurchaseOrderUpdate'
import type { PurchaseOrderStatus } from '@/src/api/generated/models/PurchaseOrderStatus'

// Extended PurchaseOrder type with flattened supplier data
interface PurchaseOrderWithSupplier extends PurchaseOrder {
  supplier_name?: string;
  supplier_email?: string;
  supplier_contact_name?: string;
}

interface PurchaseOrderUpdateFormProps {
  purchaseOrder: PurchaseOrderWithSupplier | undefined
  onSubmit: (updateData: PurchaseOrderUpdate) => Promise<void>
  onCancel: () => void
  loading: boolean
}

export default function PurchaseOrderUpdateForm({ 
  purchaseOrder, 
  onSubmit, 
  onCancel, 
  loading 
}: PurchaseOrderUpdateFormProps) {
  const { isDark } = useTheme()
  
  const [formData, setFormData] = useState<PurchaseOrderUpdate>({
    status: null,
    expected_delivery_date: null,
    actual_delivery_date: null,
    notes: null
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Initialize form data when purchase order changes
  useEffect(() => {
    if (purchaseOrder) {
      setFormData({
        status: purchaseOrder.status || null,
        expected_delivery_date: purchaseOrder.expected_delivery_date || null,
        actual_delivery_date: purchaseOrder.actual_delivery_date || null,
        notes: purchaseOrder.notes || null
      })
    }
  }, [purchaseOrder])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    // Validate status
    if (!formData.status) {
      newErrors.status = 'Status is required'
    }
    
    // Validate dates if provided
    if (formData.expected_delivery_date && formData.actual_delivery_date) {
      const expectedDate = new Date(formData.expected_delivery_date)
      const actualDate = new Date(formData.actual_delivery_date)
      
      if (actualDate < expectedDate) {
        newErrors.actual_delivery_date = 'Actual delivery date cannot be before expected delivery date'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Failed to update purchase order:', error)
    }
  }

  const handleInputChange = (field: keyof PurchaseOrderUpdate, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const cardBg = isDark ? "bg-[#171717] border-[#2a2a2a]" : "bg-white border-gray-200"
  const textPrimary = isDark ? "text-white" : "text-gray-900"
  const textSecondary = isDark ? "text-gray-400" : "text-gray-600"
  const inputBg = isDark ? "bg-[#1f1f1f] border-[#2a2a2a]" : "bg-gray-50 border-gray-200"
  const inputFocus = isDark ? "focus:border-blue-400 focus:ring-blue-400/20" : "focus:border-blue-500 focus:ring-blue-500/20"
  const errorBorder = "border-red-500 focus:border-red-500 focus:ring-red-500/20"
  const buttonHoverBg = isDark ? "hover:bg-[#2a2a2a]" : "hover:bg-gray-100"

  if (!purchaseOrder) {
    return (
      <div className={`flex-1 min-h-screen overflow-y-auto transition-colors duration-300 ${isDark ? "bg-[#111]" : "bg-gray-50"}`} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <div className="p-6">
          <div className={`${cardBg} p-8 border rounded-lg text-center`} style={{ borderRadius: "1.5rem" }}>
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className={`text-lg font-medium ${textPrimary} mb-2`}>Purchase Order Not Found</h3>
            <p className={`${textSecondary}`}>The purchase order you're trying to edit could not be found.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex-1 min-h-screen overflow-y-auto transition-colors duration-300 ${isDark ? "bg-[#111]" : "bg-gray-50"}`} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className={`${cardBg} p-8 border shadow-lg transition-colors duration-300`} style={{ borderRadius: "1.5rem" }}>
          <div className="flex items-center gap-4">
            <button
              onClick={onCancel}
              className={`${textSecondary} ${buttonHoverBg} p-2 rounded-xl transition-all duration-200 hover:scale-110`}
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className={`text-4xl font-bold ${textPrimary} mb-2 transition-colors duration-300`}>
                Edit Purchase Order
              </h1>
              <p className={`${textSecondary} transition-colors duration-300`}>
                Update purchase order details and status
              </p>
            </div>
          </div>
        </div>

        {/* Current PO Info */}
        <div className={`${cardBg} p-6 border shadow-lg transition-colors duration-300`} style={{ borderRadius: "1.5rem" }}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-full flex items-center justify-center`}>
              <FileText className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h4 className={`text-lg font-semibold ${textPrimary}`}>Purchase Order Information</h4>
              <p className={`${textSecondary} text-sm`}>Current details for {purchaseOrder.order_number}</p>
            </div>
          </div>
          
          <div className={`${isDark ? 'bg-[#1f1f1f]' : 'bg-gray-50'} p-4 rounded-lg`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className={`${textSecondary}`}>Order Number:</span>
                <p className={`${textPrimary} font-medium`}>{purchaseOrder.order_number}</p>
              </div>
              <div>
                <span className={`${textSecondary}`}>Supplier:</span>
                <p className={`${textPrimary} font-medium`}>{purchaseOrder.supplier_name || 'Unknown'}</p>
              </div>
              <div>
                <span className={`${textSecondary}`}>Total Amount:</span>
                <p className={`${textPrimary} font-medium`}>${parseFloat(purchaseOrder.total_amount).toFixed(2)}</p>
              </div>
              <div>
                <span className={`${textSecondary}`}>Items:</span>
                <p className={`${textPrimary} font-medium`}>{purchaseOrder.items.length} items</p>
              </div>
            </div>
          </div>
        </div>

        {/* Update Form */}
        <form onSubmit={handleSubmit} className={`${cardBg} p-6 border shadow-lg transition-colors duration-300 space-y-6`} style={{ borderRadius: "1.5rem" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${textPrimary}`}>
              Status <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.status || ''}
              onChange={(e) => handleInputChange('status', e.target.value as PurchaseOrderStatus || null)}
              className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:outline-none focus:ring-2 ${inputFocus} ${errors.status ? errorBorder : ''}`}
            >
              <option value="">Select status...</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="confirmed">Confirmed</option>
              <option value="received">Received</option>
              <option value="cancelled">Cancelled</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-xs mt-1">{errors.status}</p>
            )}
          </div>

          {/* Expected Delivery Date */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${textPrimary}`}>
              <Calendar className="inline h-4 w-4 mr-1" />
              Expected Delivery Date
            </label>
            <input
              type="date"
              value={formData.expected_delivery_date ? new Date(formData.expected_delivery_date).toISOString().split('T')[0] : ''}
              onChange={(e) => handleInputChange('expected_delivery_date', e.target.value ? new Date(e.target.value).toISOString() : null)}
              className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:outline-none focus:ring-2 ${inputFocus}`}
            />
          </div>

          {/* Actual Delivery Date */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${textPrimary}`}>
              <Calendar className="inline h-4 w-4 mr-1" />
              Actual Delivery Date
            </label>
            <input
              type="date"
              value={formData.actual_delivery_date ? new Date(formData.actual_delivery_date).toISOString().split('T')[0] : ''}
              onChange={(e) => handleInputChange('actual_delivery_date', e.target.value ? new Date(e.target.value).toISOString() : null)}
              className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:outline-none focus:ring-2 ${inputFocus} ${errors.actual_delivery_date ? errorBorder : ''}`}
            />
            {errors.actual_delivery_date && (
              <p className="text-red-500 text-xs mt-1">{errors.actual_delivery_date}</p>
            )}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${textPrimary}`}>
            <FileText className="inline h-4 w-4 mr-1" />
            Notes
          </label>
          <textarea
            value={formData.notes || ''}
            onChange={(e) => handleInputChange('notes', e.target.value || null)}
            className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:outline-none focus:ring-2 ${inputFocus}`}
            rows={4}
            placeholder="Add or update notes about this purchase order..."
          />
        </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className={`px-6 py-2 ${isDark ? 'bg-[#1f1f1f] text-gray-400 border-[#2a2a2a] hover:bg-[#2a2a2a] hover:text-gray-300' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'} border rounded-lg font-medium transition-all duration-200 disabled:opacity-50`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 ${isDark ? 'bg-white hover:bg-gray-100 text-gray-900' : 'bg-gray-900 hover:bg-gray-800 text-white'} rounded-lg font-medium transition-all duration-200 disabled:opacity-50 flex items-center gap-2`}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? 'Updating...' : 'Update Purchase Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}