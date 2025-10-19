// app/dashboard/inventory-management/components/InventoryItemForm.tsx

"use client"

import React, { useState } from 'react'
import { ArrowLeft, Loader2 } from "lucide-react"
import { useTheme } from "@/hooks/useTheme"
import { useMenuCategories } from "@/hooks/use-menu"
import type { InventoryItemCreate } from '@/src/api/generated/models/InventoryItemCreate'

interface InventoryItemFormProps {
  onSubmit: (itemData: InventoryItemCreate) => Promise<void>
  onCancel: () => void
  loading: boolean
}

export default function InventoryItemForm({ onSubmit, onCancel, loading }: InventoryItemFormProps) {
  const [formData, setFormData] = useState<InventoryItemCreate>({
    name: '',
    description: null,
    sku: null,
    unit: '',
    current_stock: 0,
    min_stock: 0,
    max_stock: null,
    unit_cost: null,
    supplier_id: null,
    location_id: null,
    category: null,
    is_tracked: true,
    business_id: typeof window !== "undefined" ? localStorage.getItem("businessId") || "" : ""
  })
  
  const { isDark } = useTheme()
  const businessId = typeof window !== "undefined" ? localStorage.getItem("businessId") || "" : ""
  const { categories, loading: categoriesLoading } = useMenuCategories(businessId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.name) {
      alert('Please enter item name')
      return
    }
    
    if (!formData.unit) {
      alert('Please enter unit')
      return
    }
    
    // Ensure business_id is set
    if (!formData.business_id) {
      alert('Business ID is required')
      return
    }
    
    console.log('Form data validation passed:', formData)
    await onSubmit(formData)
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
                Create Inventory Item
              </h1>
              <p className={`${textSecondary} transition-colors duration-300`}>
                Add a new inventory item to your management system
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className={`${cardBg} p-6 border shadow-lg transition-colors duration-300`} style={{ borderRadius: "1.5rem" }}>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  SKU
                </label>
                <input
                  type="text"
                  value={formData.sku || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value || null }))}
                  className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${textPrimary}`}>
                  Unit *
                </label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                  placeholder="e.g., kg, lbs, pieces"
                  className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${textPrimary}`}>
                  Category
                </label>
                {categoriesLoading ? (
                  <div className={`w-full px-3 py-2 ${inputBg} ${textSecondary} border rounded-lg flex items-center gap-2`}>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading categories...
                  </div>
                ) : (
                  <select
                    value={formData.category || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value || null }))}
                    className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                  >
                    <option value="">Select a category...</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${textPrimary}`}>
                  Current Stock *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.current_stock}
                  onChange={(e) => setFormData(prev => ({ ...prev, current_stock: parseFloat(e.target.value) || 0 }))}
                  className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${textPrimary}`}>
                  Min Stock *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.min_stock}
                  onChange={(e) => setFormData(prev => ({ ...prev, min_stock: parseFloat(e.target.value) || 0 }))}
                  className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${textPrimary}`}>
                  Max Stock
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.max_stock || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, max_stock: e.target.value ? parseFloat(e.target.value) : null }))}
                  className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${textPrimary}`}>
                  Unit Cost
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.unit_cost || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, unit_cost: e.target.value ? parseFloat(e.target.value) : null }))}
                  className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${textPrimary}`}>
                Description
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value || null }))}
                className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                rows={3}
                placeholder="Item description..."
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_tracked}
                onChange={(e) => setFormData(prev => ({ ...prev, is_tracked: e.target.checked }))}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label className={`${textPrimary} font-medium`}>
                Track this item
              </label>
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
                {loading ? 'Creating...' : 'Create Inventory Item'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
