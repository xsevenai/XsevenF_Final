// app/dashboard/inventory-management/components/forms/PurchaseOrderForm.tsx

"use client"

import React, { useState } from 'react'
import { ArrowLeft, Plus, Trash2, Loader2 } from "lucide-react"
import { useTheme } from "@/hooks/useTheme"
import type { PurchaseOrderCreate } from '@/src/api/generated/models/PurchaseOrderCreate'
import type { PurchaseOrderUpdate } from '@/src/api/generated/models/PurchaseOrderUpdate'
import type { PurchaseOrder } from '@/src/api/generated/models/PurchaseOrder'
import type { Supplier } from '@/src/api/generated/models/Supplier'

interface PurchaseOrderFormProps {
  suppliers: Supplier[]
  inventoryItems: any[]
  onSubmit: (poData: PurchaseOrderCreate | PurchaseOrderUpdate) => Promise<void>
  onCancel: () => void
  loading: boolean
  isEdit?: boolean
  purchaseOrder?: PurchaseOrder
}

export default function PurchaseOrderForm({ 
  suppliers, 
  inventoryItems, 
  onSubmit, 
  onCancel, 
  loading,
  isEdit = false,
  purchaseOrder
}: PurchaseOrderFormProps) {
  const [formData, setFormData] = useState<PurchaseOrderCreate>(() => {
    if (isEdit && purchaseOrder) {
      return {
        supplier_id: purchaseOrder.supplier_id,
        order_date: purchaseOrder.order_date,
        expected_delivery_date: purchaseOrder.expected_delivery_date,
        items: purchaseOrder.items || [],
        notes: purchaseOrder.notes || null,
        business_id: purchaseOrder.business_id
      }
    }
    return {
      supplier_id: '',
      order_date: new Date().toISOString(),
      expected_delivery_date: null,
      items: [],
      notes: null,
      business_id: typeof window !== "undefined" ? localStorage.getItem("businessId") || "" : ""
    }
  })
  const [newItem, setNewItem] = useState({
    inventory_item_id: '',
    quantity: 1,
    unit_cost: 0
  })
  const { isDark } = useTheme()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.supplier_id) {
      alert('Please select a supplier')
      return
    }
    
    if (formData.items.length === 0) {
      alert('Please add at least one item')
      return
    }
    
    // Validate items
    for (let i = 0; i < formData.items.length; i++) {
      const item = formData.items[i]
      if (!item.inventory_item_id || !item.quantity || !item.unit_cost) {
        alert(`Item ${i + 1} is missing required information`)
        return
      }
    }
    
    // Ensure business_id is set
    if (!formData.business_id) {
      alert('Business ID is required')
      return
    }
    
    console.log('Form data validation passed:', formData)
    await onSubmit(formData)
  }

  const addItem = () => {
    if (newItem.inventory_item_id && newItem.quantity > 0 && newItem.unit_cost > 0) {
      const total = newItem.quantity * newItem.unit_cost
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, { 
          ...newItem, 
          total: total 
        }]
      }))
      setNewItem({
        inventory_item_id: '',
        quantity: 1,
        unit_cost: 0
      })
    }
  }

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
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
                {isEdit ? 'Edit Purchase Order' : 'Create Purchase Order'}
              </h1>
              <p className={`${textSecondary} transition-colors duration-300`}>
                {isEdit ? 'Update purchase order details' : 'Add a new purchase order to your inventory management system'}
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
                  Supplier *
                </label>
                <select
                  value={formData.supplier_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, supplier_id: e.target.value }))}
                  className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                  required
                >
                  <option value="">Select a supplier...</option>
                  {suppliers.map(supplier => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${textPrimary}`}>
                  Order Date *
                </label>
                <input
                  type="date"
                  value={formData.order_date ? new Date(formData.order_date).toISOString().split('T')[0] : ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, order_date: e.target.value ? new Date(e.target.value).toISOString() : '' }))}
                  className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${textPrimary}`}>
                  Expected Delivery Date
                </label>
                <input
                  type="date"
                  value={formData.expected_delivery_date ? new Date(formData.expected_delivery_date).toISOString().split('T')[0] : ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, expected_delivery_date: e.target.value ? new Date(e.target.value).toISOString() : null }))}
                  className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${textPrimary}`}>
                Notes
              </label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                rows={3}
                placeholder="Additional notes..."
              />
            </div>

            {/* Items Section */}
            <div>
              <h4 className={`text-lg font-semibold ${textPrimary} mb-3`}>Items</h4>
              
              {/* Add Item Form */}
              <div className={`${cardBg} p-4 border rounded-lg mb-4`}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${textPrimary}`}>
                      Inventory Item
                    </label>
                    {inventoryItems.length > 0 ? (
                      <select
                        value={newItem.inventory_item_id}
                        onChange={(e) => setNewItem(prev => ({ ...prev, inventory_item_id: e.target.value }))}
                        className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                      >
                        <option value="">Select an item...</option>
                        {inventoryItems.map(item => (
                          <option key={item.id} value={item.id}>
                            {item.name} ({item.category}) - Stock: {item.current_stock} {item.unit}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={newItem.inventory_item_id}
                        onChange={(e) => setNewItem(prev => ({ ...prev, inventory_item_id: e.target.value }))}
                        className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                        placeholder="Enter item name manually..."
                      />
                    )}
                    {inventoryItems.length === 0 && (
                      <p className={`text-xs mt-1 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                        ⚠️ Inventory items could not be loaded. Please enter item name manually.
                      </p>
                    )}
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${textPrimary}`}>
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                      className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${textPrimary}`}>
                      Unit Cost
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newItem.unit_cost}
                      onChange={(e) => setNewItem(prev => ({ ...prev, unit_cost: parseFloat(e.target.value) || 0 }))}
                      className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={addItem}
                      className={`w-full px-4 py-2 ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-lg font-medium transition-all duration-200`}
                    >
                      Add Item
                    </button>
                  </div>
                </div>
              </div>

              {/* Items List */}
              {formData.items.length > 0 && (
                <div className="space-y-2">
                  {formData.items.map((item, index) => {
                    const inventoryItem = inventoryItems.find(inv => inv.id === item.inventory_item_id)
                    const itemName = inventoryItem ? `${inventoryItem.name} (${inventoryItem.category})` : `Item: ${item.inventory_item_id}`
                    
                    return (
                      <div key={index} className={`${cardBg} p-3 border rounded-lg flex justify-between items-center`}>
                        <div>
                          <span className={`${textPrimary} font-medium`}>{itemName}</span>
                          <span className={`${textSecondary} ml-2`}>
                            {item.quantity} × ${Number(item.unit_cost).toFixed(2)} = ${Number(item.total).toFixed(2)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className={`text-red-500 hover:text-red-600 p-1`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
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
                {loading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Purchase Order' : 'Create Purchase Order')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
