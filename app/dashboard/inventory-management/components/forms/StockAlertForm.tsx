// app/dashboard/inventory-management/components/forms/StockAlertForm.tsx

"use client"

import React, { useState } from 'react'
import { Loader2 } from "lucide-react"
import { useTheme } from "@/hooks/useTheme"
import type { StockAlertCreate } from '@/src/api/generated/models/StockAlertCreate'
import { AlertType } from '@/src/api/generated/models/AlertType'

interface StockAlertFormProps {
  inventoryItems: any[]
  onSubmit: (alertData: StockAlertCreate) => Promise<void>
  onCancel: () => void
  loading: boolean
  initialData?: any
}

export default function StockAlertForm({ 
  inventoryItems, 
  onSubmit, 
  onCancel, 
  loading, 
  initialData 
}: StockAlertFormProps) {
  const [formData, setFormData] = useState<StockAlertCreate>({
    inventory_item_id: initialData?.inventory_item_id || '',
    alert_type: initialData?.alert_type || 'low_stock',
    threshold: initialData?.threshold || 0,
    is_active: initialData?.is_active ?? true,
    business_id: typeof window !== "undefined" ? localStorage.getItem("businessId") || "" : ""
  })
  const { isDark } = useTheme()

  // Theme-based styling variables
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
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
    
    if (!formData.inventory_item_id || !formData.threshold || Number(formData.threshold) <= 0) {
      alert('Please fill in all required fields')
      return
    }
    
    await onSubmit(formData)
  }

  const selectedItem = inventoryItems.find(item => item.id === formData.inventory_item_id)

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${textPrimary} transition-colors duration-300`}>
            Inventory Item *
          </label>
          {inventoryItems.length > 0 ? (
            <select
              value={formData.inventory_item_id}
              onChange={(e) => setFormData(prev => ({ ...prev, inventory_item_id: e.target.value }))}
              className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:border-blue-500 focus:outline-none transition-all duration-200 transition-colors duration-300`}
              required
            >
              <option value="">Select an item...</option>
              {inventoryItems.map(item => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.current_stock} {item.unit})
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={formData.inventory_item_id}
              onChange={(e) => setFormData(prev => ({ ...prev, inventory_item_id: e.target.value }))}
              className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:border-blue-500 focus:outline-none transition-all duration-200 transition-colors duration-300`}
              placeholder="Enter inventory item ID manually..."
              required
            />
          )}
          {inventoryItems.length === 0 && (
            <p className={`text-xs mt-1 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
              ⚠️ Inventory items could not be loaded. Please enter the item ID manually.
            </p>
          )}
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${textPrimary} transition-colors duration-300`}>
            Alert Type *
          </label>
          <select
            value={formData.alert_type}
            onChange={(e) => setFormData(prev => ({ ...prev, alert_type: e.target.value as AlertType }))}
            className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:border-blue-500 focus:outline-none transition-all duration-200 transition-colors duration-300`}
            required
          >
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="expiring">Expiring</option>
            <option value="overstocked">Overstocked</option>
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${textPrimary} transition-colors duration-300`}>
            Threshold *
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.threshold || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, threshold: e.target.value ? parseFloat(e.target.value) : null }))}
            className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:border-blue-500 focus:outline-none transition-all duration-200 transition-colors duration-300`}
            placeholder="Enter threshold value"
            required
          />
          {selectedItem && (
            <p className={`text-xs mt-1 ${textSecondary} transition-colors duration-300`}>
              Current stock: {selectedItem.current_stock} {selectedItem.unit}
            </p>
          )}
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${textPrimary} transition-colors duration-300`}>
            Status
          </label>
          <select
            value={formData.is_active ? 'active' : 'inactive'}
            onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.value === 'active' }))}
            className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:border-blue-500 focus:outline-none transition-all duration-200 transition-colors duration-300`}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className={`${secondaryButtonBg} px-6 py-2 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105`}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`${primaryButtonBg} px-6 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105`}
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? 'Creating...' : 'Create Alert'}
        </button>
      </div>
    </form>
  )
}
