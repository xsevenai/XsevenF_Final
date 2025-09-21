// app/dashboard/inventory-management/components/UpdateStockModal.tsx

"use client"

import React, { useState } from 'react'
import { X, Save, Loader2, Package, AlertTriangle } from 'lucide-react'
import type { ExtendedInventoryItem } from '@/app/api/inventory/route'

interface UpdateStockModalProps {
  item: ExtendedInventoryItem
  onClose: () => void
  onSubmit: (itemId: string, stockQuantity: number, minThreshold?: number) => Promise<void>  // FIXED: Use string
  loading?: boolean
}

export default function UpdateStockModal({ 
  item, 
  onClose, 
  onSubmit, 
  loading = false 
}: UpdateStockModalProps) {
  const [stockQuantity, setStockQuantity] = useState(item.current_stock)
  const [minThreshold, setMinThreshold] = useState(item.min_threshold)
  const [errors, setErrors] = useState<Record<string, string>>({})

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
      case 'in-stock': return 'text-green-400'
      case 'low-stock': return 'text-yellow-400'
      case 'out-of-stock': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const newStatus = getNewStatus()
  const isStatusChanging = newStatus !== item.status

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border border-gray-700/50 rounded-2xl p-6 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Package className="h-6 w-6 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Update Stock</h2>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 hover:bg-gray-700/50 rounded-lg text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Item Info */}
        <div className="mb-6 p-4 bg-gray-800/30 rounded-lg">
          <h3 className="text-white font-semibold">{item.name}</h3>
          {item.category && (
            <p className="text-gray-400 text-sm">{item.category}</p>
          )}
          <div className="mt-2 flex items-center gap-2">
            <span className="text-gray-400 text-sm">Current Status:</span>
            <span className={`text-sm font-medium ${getStatusColor(item.status)}`}>
              {item.status.replace('-', ' ').toUpperCase()}
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Stock Quantity *
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
              className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.stockQuantity ? 'border-red-500' : 'border-gray-700'
              }`}
              placeholder="Enter stock quantity"
            />
            {errors.stockQuantity && (
              <p className="text-red-400 text-sm mt-1">{errors.stockQuantity}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Minimum Threshold *
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
              className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.minThreshold ? 'border-red-500' : 'border-gray-700'
              }`}
              placeholder="Enter minimum threshold"
            />
            {errors.minThreshold && (
              <p className="text-red-400 text-sm mt-1">{errors.minThreshold}</p>
            )}
          </div>

          {/* Status Preview */}
          {isStatusChanging && (
            <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="h-4 w-4 text-blue-400" />
                <span className="text-blue-400 font-medium text-sm">Status will change</span>
              </div>
              <div className="text-sm text-gray-300">
                From <span className={getStatusColor(item.status)}>{item.status.replace('-', ' ')}</span> to{' '}
                <span className={getStatusColor(newStatus)}>{newStatus.replace('-', ' ')}</span>
              </div>
            </div>
          )}

          {/* Stock Level Indicator */}
          <div className="p-3 bg-gray-800/30 rounded-lg">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Stock Level Preview</span>
              <span className="text-gray-400">
                {minThreshold > 0 ? Math.round((stockQuantity / minThreshold) * 100) : 100}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
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
            <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50"
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
  )
}