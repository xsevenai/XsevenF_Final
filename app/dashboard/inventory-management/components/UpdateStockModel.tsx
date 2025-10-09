// app/dashboard/inventory-management/components/UpdateStockModal.tsx

"use client"

import React, { useState, useEffect } from 'react'
import { X, Save, Loader2, Package, AlertTriangle } from 'lucide-react'
import { useTheme } from "@/hooks/useTheme"
import type { InventoryItemWithMetrics } from '@/src/api/generated/models/InventoryItemWithMetrics'

interface UpdateStockModalProps {
  item: InventoryItemWithMetrics
  onClose: () => void
  onSubmit: (itemId: string, stockQuantity: number, minThreshold?: number) => Promise<void>
  loading?: boolean
}

export default function UpdateStockModal({ 
  item, 
  onClose, 
  onSubmit, 
  loading = false 
}: UpdateStockModalProps) {
  const [stockQuantity, setStockQuantity] = useState(parseFloat(item.current_stock || '0'))
  const [minThreshold, setMinThreshold] = useState(parseFloat(item.min_stock || '0'))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [mounted, setMounted] = useState(false)
  const { theme, isLoaded: themeLoaded, isDark, currentTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!themeLoaded || !mounted) return null

  // Theme-based styling variables
  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const inputBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'
  const buttonHoverBg = isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-100'
  const innerCardBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'
  const overlayBg = isDark ? 'bg-[#0f0f0f]/80' : 'bg-black/50'
  const progressBg = isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (stockQuantity < 0) {
      newErrors.stockQuantity = 'Stock quantity cannot be negative'
    }
    
    if (minThreshold < 0) {
      newErrors.minThreshold = 'Minimum threshold cannot be negative'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      await onSubmit(item.id, stockQuantity, minThreshold)
    } catch (error) {
      console.error('Error updating stock:', error)
      setErrors({ submit: 'Failed to update stock. Please try again.' })
    }
  }

  const getNewStatus = () => {
    if (stockQuantity === 0) return 'out-of-stock'
    if (stockQuantity <= minThreshold) return 'low-stock'
    return 'in-stock'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock': return 'text-green-500'
      case 'low-stock': return 'text-yellow-500'
      case 'out-of-stock': return 'text-red-500'
      default: return textSecondary
    }
  }

  const newStatus = getNewStatus()
  const currentStatus = parseFloat(item.current_stock || '0') === 0 ? 'out-of-stock' :
                       parseFloat(item.current_stock || '0') <= parseFloat(item.min_stock || '0') ? 'low-stock' : 'in-stock'
  const isStatusChanging = newStatus !== currentStatus

  return (
    <div className={`fixed inset-0 ${overlayBg} backdrop-blur-sm flex items-center justify-center z-50 p-4`}>
      <div className={`${cardBg} border shadow-2xl w-full max-w-md`}
        style={{ borderRadius: '1.5rem' }}>
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`p-3 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-2xl`}>
                <Package className="h-6 w-6 text-purple-500" />
              </div>
              <h2 className={`text-2xl font-bold ${textPrimary}`}>Update Stock</h2>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className={`p-3 ${textSecondary} ${buttonHoverBg} rounded-xl transition-all duration-200 hover:scale-110 disabled:opacity-50`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Item Info */}
          <div className={`mb-6 p-4 ${innerCardBg} border rounded-xl`}>
            <h3 className={`${textPrimary} font-semibold`}>{item.name}</h3>
            {item.category && (
              <p className={`${textSecondary} text-sm`}>{item.category}</p>
            )}
            <div className="mt-2 flex items-center gap-2">
              <span className={`${textSecondary} text-sm`}>Current Status:</span>
              <span className={`text-sm font-medium ${getStatusColor(
                parseFloat(item.current_stock || '0') === 0 ? 'out-of-stock' :
                parseFloat(item.current_stock || '0') <= parseFloat(item.min_stock || '0') ? 'low-stock' : 'in-stock'
              )}`}>
                {parseFloat(item.current_stock || '0') === 0 ? 'OUT OF STOCK' :
                 parseFloat(item.current_stock || '0') <= parseFloat(item.min_stock || '0') ? 'LOW STOCK' : 'IN STOCK'}
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${textPrimary} mb-2`}>
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={stockQuantity}
                onChange={(e) => {
                  setStockQuantity(parseInt(e.target.value) || 0)
                  if (errors.stockQuantity) {
                    setErrors(prev => ({ ...prev, stockQuantity: '' }))
                  }
                }}
                className={`w-full px-4 py-3 ${inputBg} ${textPrimary} border rounded-xl placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all duration-200 ${
                  errors.stockQuantity ? 'border-red-500' : ''
                }`}
                placeholder="Enter stock quantity"
              />
              {errors.stockQuantity && (
                <p className="text-red-500 text-sm mt-1">{errors.stockQuantity}</p>
              )}
            </div>

            <div>
              <label className={`block text-sm font-medium ${textPrimary} mb-2`}>
                Minimum Threshold <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={minThreshold}
                onChange={(e) => {
                  setMinThreshold(parseInt(e.target.value) || 0)
                  if (errors.minThreshold) {
                    setErrors(prev => ({ ...prev, minThreshold: '' }))
                  }
                }}
                className={`w-full px-4 py-3 ${inputBg} ${textPrimary} border rounded-xl placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all duration-200 ${
                  errors.minThreshold ? 'border-red-500' : ''
                }`}
                placeholder="Enter minimum threshold"
              />
              {errors.minThreshold && (
                <p className="text-red-500 text-sm mt-1">{errors.minThreshold}</p>
              )}
            </div>

            {/* Status Preview */}
            {isStatusChanging && (
              <div className={`p-4 ${isDark ? 'bg-blue-900/20 border-blue-500/30' : 'bg-blue-50 border-blue-300'} border rounded-xl`}>
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-4 w-4 text-blue-500" />
                  <span className="text-blue-500 font-medium text-sm">Status will change</span>
                </div>
                <div className={`text-sm ${textPrimary}`}>
                  From <span className={getStatusColor(currentStatus)}>{currentStatus.replace('-', ' ')}</span> to{' '}
                  <span className={getStatusColor(newStatus)}>{newStatus.replace('-', ' ')}</span>
                </div>
              </div>
            )}

            {/* Stock Level Indicator */}
            <div className={`p-4 ${innerCardBg} border rounded-xl`}>
              <div className="flex justify-between text-sm mb-3">
                <span className={`${textSecondary}`}>Stock Level Preview</span>
                <span className={`${textSecondary}`}>
                  {minThreshold > 0 ? Math.round((stockQuantity / minThreshold) * 100) : 100}%
                </span>
              </div>
              <div className={`w-full ${progressBg} rounded-full h-2`}>
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    stockQuantity === 0
                      ? 'bg-red-500'
                      : stockQuantity <= minThreshold
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{ 
                    width: `${minThreshold > 0 ? 
                      Math.min((stockQuantity / minThreshold) * 100, 100) : 
                      100}%` 
                  }}
                ></div>
              </div>
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className={`p-4 ${isDark ? 'bg-red-900/20 border-red-500/30' : 'bg-red-50 border-red-300'} border rounded-xl`}>
                <p className="text-red-500 text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className={`px-6 py-3 ${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535] border-[#3a3a3a]' : 'bg-gray-100 hover:bg-gray-200 border-gray-300'} ${textPrimary} rounded-xl font-medium transition-all duration-300 border shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex items-center gap-2 px-6 py-3 ${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535] border-[#3a3a3a]' : 'bg-gray-100 hover:bg-gray-200 border-gray-300'} ${textPrimary} rounded-xl font-medium transition-all duration-300 border shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {loading ? 'Updating...' : 'Update Stock'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}