// app/dashboard/inventory-management/components/forms/InventoryItemUpdateForm.tsx

"use client"

import React, { useState } from 'react'
import { ArrowLeft, Loader2 } from "lucide-react"
import { useTheme } from "@/hooks/useTheme"
import { useMenuCategories } from "@/hooks/use-menu"
import type { InventoryItemWithMetrics } from '@/src/api/generated/models/InventoryItemWithMetrics'
import type { InventoryItemUpdate } from '@/src/api/generated/models/InventoryItemUpdate'

interface InventoryItemUpdateFormProps {
  item: InventoryItemWithMetrics
  onSubmit: (itemId: string, data: InventoryItemUpdate) => Promise<any>
  onCancel: () => void
  loading: boolean
}

export default function InventoryItemUpdateForm({ 
  item, 
  onSubmit, 
  onCancel, 
  loading
}: InventoryItemUpdateFormProps) {
  const [formData, setFormData] = useState<InventoryItemUpdate>({
    name: item.name || '',
    description: item.description || '',
    category: item.category || '',
    sku: item.sku || '',
    current_stock: item.current_stock || '',
    min_stock: item.min_stock || '',
    unit: item.unit || '',
    cost_per_unit: item.cost_per_unit || '',
    supplier: item.supplier || '',
    location: item.location || '',
    notes: item.notes || ''
  })
  const { isDark } = useTheme()
  const businessId = typeof window !== "undefined" ? localStorage.getItem("businessId") || "" : ""
  const { categories: menuCategories, loading: categoriesLoading } = useMenuCategories(businessId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.name) {
      alert('Please enter item name')
      return
    }
    
    if (!formData.current_stock || Number(formData.current_stock) < 0) {
      alert('Please enter a valid current stock amount')
      return
    }
    
    if (!formData.min_stock || Number(formData.min_stock) < 0) {
      alert('Please enter a valid minimum stock threshold')
      return
    }
    
    await onSubmit(item.id, formData)
  }

  const cardBg = isDark ? "bg-[#171717] border-[#2a2a2a]" : "bg-white border-gray-200"
  const textPrimary = isDark ? "text-white" : "text-gray-900"
  const textSecondary = isDark ? "text-gray-400" : "text-gray-600"
  const inputBg = isDark ? "bg-[#2a2a2a] border-[#3a3a3a]" : "bg-gray-50 border-gray-300"
  const buttonHoverBg = isDark ? "hover:bg-[#2a2a2a]" : "hover:bg-gray-100"

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
                Update Inventory Item
              </h1>
              <p className={`${textSecondary} transition-colors duration-300`}>
                Modify inventory item details and stock levels
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className={`${cardBg} p-6 border shadow-lg transition-colors duration-300`} style={{ borderRadius: "1.5rem" }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className={`text-lg font-semibold ${textPrimary} mb-4`}>Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${textPrimary}`}>
                    Item Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${textPrimary}`}>
                    Category
                  </label>
                  <div className="space-y-2">
                    <div className={`text-xs ${textSecondary}`}>
                      Current: <span className={`${textPrimary} font-medium`}>{item.category || 'No category'}</span>
                    </div>
                    {categoriesLoading ? (
                      <div className={`w-full px-3 py-2 ${inputBg} ${textSecondary} border rounded-lg flex items-center gap-2`}>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading categories...
                      </div>
                    ) : (
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                      >
                        <option value="">Select category...</option>
                        {menuCategories.map(category => (
                          <option key={category.id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${textPrimary}`}>
                    SKU
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                    className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                    placeholder="Stock Keeping Unit"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${textPrimary}`}>
                    Unit
                  </label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                    className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                    placeholder="e.g., pieces, kg, liters"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className={`block text-sm font-medium mb-2 ${textPrimary}`}>
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                  rows={3}
                  placeholder="Item description..."
                />
              </div>
            </div>

            {/* Stock Information */}
            <div>
              <h3 className={`text-lg font-semibold ${textPrimary} mb-4`}>Stock Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${textPrimary}`}>
                    Current Stock *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.current_stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, current_stock: e.target.value }))}
                    className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${textPrimary}`}>
                    Minimum Stock Threshold *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.min_stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, min_stock: e.target.value }))}
                    className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${textPrimary}`}>
                    Cost Per Unit
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.cost_per_unit}
                    onChange={(e) => setFormData(prev => ({ ...prev, cost_per_unit: e.target.value }))}
                    className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${textPrimary}`}>
                    Supplier
                  </label>
                  <input
                    type="text"
                    value={formData.supplier}
                    onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                    className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                    placeholder="Supplier name"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h3 className={`text-lg font-semibold ${textPrimary} mb-4`}>Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${textPrimary}`}>
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                    placeholder="Storage location"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className={`block text-sm font-medium mb-2 ${textPrimary}`}>
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                  rows={3}
                  placeholder="Additional notes..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onCancel}
                className={`px-6 py-2 ${isDark ? 'bg-[#1f1f1f] text-gray-400 border-[#2a2a2a] hover:bg-[#2a2a2a]' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'} border rounded-lg font-medium transition-all duration-200`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 ${isDark ? 'bg-white hover:bg-gray-100 text-gray-900' : 'bg-gray-900 hover:bg-gray-800 text-white'} rounded-lg font-medium transition-all duration-200 disabled:opacity-50 flex items-center gap-2`}
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? 'Updating...' : 'Update Item'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
