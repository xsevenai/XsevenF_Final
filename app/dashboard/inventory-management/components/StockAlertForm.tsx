// app/dashboard/inventory-management/components/StockAlertForm.tsx

"use client"

import React, { useState, useEffect } from 'react'
import { ArrowLeft, Loader2, Bell, AlertTriangle, Package } from "lucide-react"
import { useTheme } from "@/hooks/useTheme"
import type { StockAlertCreate } from '@/src/api/generated/models/StockAlertCreate'
import { AlertType } from '@/src/api/generated/models/AlertType'

interface StockAlertFormProps {
  onSubmit: (alertData: StockAlertCreate) => Promise<void>
  onCancel: () => void
  loading: boolean
  inventoryItems: any[]
  initialData?: any
  isEdit?: boolean
}

export default function StockAlertForm({
  onSubmit,
  onCancel,
  loading,
  inventoryItems,
  initialData,
  isEdit = false
}: StockAlertFormProps) {
  const [mounted, setMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const { theme, isLoaded: themeLoaded, isDark, currentTheme } = useTheme()

  const [formData, setFormData] = useState({
    inventory_item_id: '',
    alert_type: 'low_stock' as AlertType,
    threshold: '',
    is_active: true,
    business_id: ''
  })

  useEffect(() => {
    setMounted(true)
    // Get business ID from localStorage
    const storedBusinessId = localStorage.getItem('businessId')
    if (storedBusinessId) {
      setFormData(prev => ({ ...prev, business_id: storedBusinessId }))
    }
  }, [])

  // Initialize form with edit data
  useEffect(() => {
    if (isEdit && initialData) {
      setFormData({
        inventory_item_id: initialData.inventory_item_id || '',
        alert_type: initialData.alert_type || 'low_stock',
        threshold: initialData.threshold || '',
        is_active: initialData.is_active !== undefined ? initialData.is_active : true,
        business_id: initialData.business_id || ''
      })
    }
  }, [isEdit, initialData])

  // Simulate loading state
  const [localLoading, setLocalLoading] = useState(true)

  useEffect(() => {
    if (themeLoaded && mounted) {
      setLocalLoading(false)
    }
  }, [themeLoaded, mounted])

  if (localLoading) {
    return (
      <div className={`flex-1 flex items-center justify-center min-h-screen ${isDark ? "bg-[#111]" : "bg-gray-50"}`}>
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  // Theme-based styling variables
  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const innerCardBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'
  const inputBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'

  // Button styles
  const primaryButtonBg = isDark
    ? 'bg-white text-gray-900 hover:bg-gray-100 border-gray-300'
    : 'bg-gray-900 text-white hover:bg-gray-800 border-gray-700'

  const secondaryButtonBg = isDark
    ? 'bg-[#1f1f1f] text-gray-400 border-[#2a2a2a] hover:bg-[#2a2a2a]'
    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)

    try {
      // Validate required fields
      if (!formData.inventory_item_id) {
        throw new Error('Please select an inventory item')
      }
      if (!formData.alert_type) {
        throw new Error('Please select an alert type')
      }
      if (!formData.threshold) {
        throw new Error('Please enter a threshold value')
      }
      if (!formData.business_id) {
        throw new Error('Business ID is required')
      }

      const alertData: StockAlertCreate = {
        inventory_item_id: formData.inventory_item_id,
        alert_type: formData.alert_type,
        threshold: parseFloat(formData.threshold),
        is_active: formData.is_active,
        business_id: formData.business_id
      }

      await onSubmit(alertData)
      setSubmitSuccess(true)
      
      setTimeout(() => {
        onCancel()
      }, 1500)
      
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : `Failed to ${isEdit ? 'update' : 'create'} stock alert`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getAlertTypeLabel = (alertType: AlertType) => {
    switch (alertType) {
      case 'low_stock': return 'Low Stock'
      case 'out_of_stock': return 'Out of Stock'
      case 'expiring': return 'Expiring'
      case 'overstocked': return 'Overstocked'
      default: return alertType
    }
  }

  const getAlertTypeDescription = (alertType: AlertType) => {
    switch (alertType) {
      case 'low_stock': return 'Alert when stock falls below threshold'
      case 'out_of_stock': return 'Alert when item is completely out of stock'
      case 'expiring': return 'Alert when items are approaching expiration'
      case 'overstocked': return 'Alert when stock exceeds maximum threshold'
      default: return ''
    }
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
        <div className={`${cardBg} p-8 border shadow-lg transition-colors duration-300`} style={{ borderRadius: '1.5rem' }}>
          <div className="flex items-center gap-4">
            <button
              onClick={onCancel}
              className={`${textSecondary} ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-200'} p-2 rounded-xl transition-all duration-200 hover:scale-110`}
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className={`text-4xl font-bold ${textPrimary} mb-2 transition-colors duration-300`}>
                {isEdit ? 'Edit Stock Alert' : 'Create New Stock Alert'}
              </h1>
              <p className={`${textSecondary} transition-colors duration-300`}>
                {isEdit ? 'Update stock alert settings' : 'Set up automated alerts for inventory management'}
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className={`${cardBg} border shadow-lg transition-colors duration-300`} style={{ borderRadius: '1.5rem' }}>
          <div className="p-8">
            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                <p className="text-green-500 font-medium">
                  Stock alert {isEdit ? 'updated' : 'created'} successfully!
                </p>
              </div>
            )}
            
            {submitError && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-red-500 font-medium">{submitError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Inventory Item Selection */}
              <div>
                <label className={`block ${textPrimary} font-medium mb-3 transition-colors duration-300`}>
                  Inventory Item <span className="text-red-500">*</span>
                </label>
                {isEdit ? (
                  <div className={`${innerCardBg} p-4 border rounded-xl transition-colors duration-300`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-full flex items-center justify-center`}>
                        <Package className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <div className={`${textPrimary} font-semibold text-sm`}>
                          {(() => {
                            const item = inventoryItems.find(item => item.id === formData.inventory_item_id)
                            return item ? `${item.name} (${item.category})` : `Item ID: ${formData.inventory_item_id?.substring(0, 8)}...`
                          })()}
                        </div>
                        <div className={`${textSecondary} text-xs mt-1`}>
                          Current Stock: {(() => {
                            const item = inventoryItems.find(item => item.id === formData.inventory_item_id)
                            return item ? `${item.current_stock} ${item.unit}` : 'N/A'
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <select
                    value={formData.inventory_item_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, inventory_item_id: e.target.value }))}
                    className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none transition-all duration-200 transition-colors duration-300`}
                    required
                  >
                    <option value="">Select an inventory item</option>
                    {inventoryItems.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} ({item.category}) - Current: {item.current_stock} {item.unit}
                      </option>
                    ))}
                  </select>
                )}
                {inventoryItems.length === 0 && !isEdit && (
                  <p className={`${textSecondary} text-sm mt-2`}>
                    No inventory items available. Please create inventory items first.
                  </p>
                )}
              </div>

              {/* Alert Type */}
              <div>
                <label className={`block ${textPrimary} font-medium mb-3 transition-colors duration-300`}>
                  Alert Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(['low_stock', 'out_of_stock', 'expiring', 'overstocked'] as AlertType[]).map((alertType) => (
                    <div
                      key={alertType}
                      className={`${innerCardBg} p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                        formData.alert_type === alertType 
                          ? 'border-blue-500 bg-blue-500/10' 
                          : 'hover:border-gray-400'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, alert_type: alertType }))}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          formData.alert_type === alertType ? 'bg-blue-500' : 'bg-gray-500'
                        }`}>
                          <Bell className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className={`${textPrimary} font-medium transition-colors duration-300`}>
                            {getAlertTypeLabel(alertType)}
                          </h3>
                          <p className={`${textSecondary} text-sm transition-colors duration-300`}>
                            {getAlertTypeDescription(alertType)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Threshold */}
              <div>
                <label className={`block ${textPrimary} font-medium mb-3 transition-colors duration-300`}>
                  Threshold Value <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.threshold}
                    onChange={(e) => setFormData(prev => ({ ...prev, threshold: e.target.value }))}
                    className={`flex-1 ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none transition-all duration-200 transition-colors duration-300`}
                    placeholder="Enter threshold value"
                    required
                  />
                  <div className={`${innerCardBg} px-4 py-3 rounded-xl border transition-colors duration-300`}>
                    <span className={`${textSecondary} text-sm transition-colors duration-300`}>
                      {formData.alert_type === 'low_stock' ? 'units' : 
                       formData.alert_type === 'out_of_stock' ? 'units' :
                       formData.alert_type === 'expiring' ? 'days' : 'units'}
                    </span>
                  </div>
                </div>
                <p className={`${textSecondary} text-sm mt-2 transition-colors duration-300`}>
                  {formData.alert_type === 'low_stock' && 'Alert will trigger when stock falls below this value'}
                  {formData.alert_type === 'out_of_stock' && 'Alert will trigger when stock reaches 0'}
                  {formData.alert_type === 'expiring' && 'Alert will trigger when items expire within this many days'}
                  {formData.alert_type === 'overstocked' && 'Alert will trigger when stock exceeds this value'}
                </p>
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="is_active" className={`${textPrimary} font-medium transition-colors duration-300`}>
                  Alert is active (will send notifications)
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className={`${primaryButtonBg} px-8 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 border shadow-lg hover:shadow-xl hover:scale-105`}
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isSubmitting ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Alert' : 'Create Alert')}
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isSubmitting}
                  className={`${secondaryButtonBg} px-8 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl hover:scale-105`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
