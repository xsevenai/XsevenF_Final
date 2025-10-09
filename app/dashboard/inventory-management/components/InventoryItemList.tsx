// app/dashboard/inventory-management/components/InventoryItemsList.tsx

"use client"

import React, { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { useTheme } from "@/hooks/useTheme"
import { 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  AlertTriangle,
  Package,
  Calendar,
  MapPin,
  RefreshCw,
  ArrowLeft,
  Loader2
} from "lucide-react"
import type { InventoryItemWithMetrics } from '@/src/api/generated/models/InventoryItemWithMetrics'
import type { InventoryItemCreate } from '@/src/api/generated/models/InventoryItemCreate'
import type { InventoryItemUpdate } from '@/src/api/generated/models/InventoryItemUpdate'
import type { InventorySearch } from '@/src/api/generated/models/InventorySearch'
import UpdateStockModal from './UpdateStockModel'

interface InventoryItemListProps {
  items: InventoryItemWithMetrics[]
  loading: boolean
  error: string | null
  onRefresh: () => void
  onCreateItem: (data: InventoryItemCreate) => Promise<any>
  onUpdateItem: (itemId: string, data: InventoryItemUpdate) => Promise<any>
  onDeleteItem: (itemId: string) => Promise<void>
  onSearchItems: (searchParams: InventorySearch) => Promise<any>
  onBack: () => void
}

export default function InventoryItemList({
  items,
  loading,
  error,
  onRefresh,
  onCreateItem,
  onUpdateItem,
  onDeleteItem,
  onSearchItems,
  onBack
}: InventoryItemListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [editingItem, setEditingItem] = useState<InventoryItemWithMetrics | null>(null)
  const [updatingStock, setUpdatingStock] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, isLoaded: themeLoaded, isDark, currentTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!themeLoaded || !mounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  // Theme-based styling variables
  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const inputBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'
  const buttonHoverBg = isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-100'
  const innerCardBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'

  const statuses = ['all', 'in-stock', 'low-stock', 'out-of-stock']

  // Filter items based on search and filters
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.category?.toLowerCase().includes(searchTerm.toLowerCase()))
    
    // Determine status based on stock levels
    const currentStock = parseFloat(item.current_stock || '0')
    const minStock = parseFloat(item.min_stock || '0')
    let itemStatus = 'in-stock'
    if (currentStock === 0) itemStatus = 'out-of-stock'
    else if (currentStock <= minStock) itemStatus = 'low-stock'
    
    const matchesStatus = filterStatus === 'all' || itemStatus === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock': return 'bg-green-500/20 text-green-500 border-green-500/30'
      case 'low-stock': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
      case 'out-of-stock': return 'bg-red-500/20 text-red-500 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500/30'
    }
  }

  const handleUpdateStock = async (itemId: string, stockQuantity: number, minThreshold?: number) => {
    try {
      setUpdatingStock(itemId)
      const updateData: InventoryItemUpdate = { current_stock: stockQuantity }
      if (minThreshold !== undefined) {
        updateData.min_stock = minThreshold
      }
      await onUpdateItem(itemId, updateData)
      setEditingItem(null)
    } catch (error) {
      console.error('Error updating stock:', error)
      alert('Failed to update stock')
    } finally {
      setUpdatingStock(null)
    }
  }

  const handleCreateItem = async (formData: FormData) => {
    try {
      setIsCreating(true)
      const itemData: InventoryItemCreate = {
        name: formData.get('name') as string,
        description: formData.get('description') as string || null,
        sku: formData.get('sku') as string || null,
        unit: formData.get('unit') as string,
        current_stock: parseFloat(formData.get('current_stock') as string) || 0,
        min_stock: parseFloat(formData.get('min_stock') as string) || 0,
        max_stock: parseFloat(formData.get('max_stock') as string) || null,
        unit_cost: parseFloat(formData.get('unit_cost') as string) || null,
        supplier_id: formData.get('supplier_id') as string || null,
        location_id: formData.get('location_id') as string || null,
        category: formData.get('category') as string || null,
        is_tracked: formData.get('is_tracked') === 'on',
        business_id: typeof window !== "undefined" ? localStorage.getItem("businessId") || "" : ""
      }
      
      await onCreateItem(itemData)
      setShowCreateForm(false)
      onRefresh()
    } catch (error) {
      console.error('Failed to create item:', error)
      alert('Failed to create inventory item')
    } finally {
      setIsCreating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={`flex items-center gap-3 ${textSecondary}`}>
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading inventory items...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className={`text-lg font-medium ${textPrimary} mb-2`}>Error Loading Items</h3>
        <p className={`${textSecondary} mb-4`}>{error}</p>
        <button
          onClick={onRefresh}
          className={`px-6 py-3 ${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535] border-[#3a3a3a]' : 'bg-gray-100 hover:bg-gray-200 border-gray-300'} ${textPrimary} rounded-xl font-medium transition-all duration-300 border shadow-lg hover:shadow-xl hover:scale-105`}
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`${cardBg} p-8 border shadow-lg relative overflow-hidden`} style={{ borderRadius: '1.5rem' }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className={`${textSecondary} ${buttonHoverBg} p-2 rounded-xl transition-all duration-200 hover:scale-110`}
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className={`text-4xl font-bold ${textPrimary} mb-2`}>All Inventory Items</h1>
              <p className={`${textSecondary}`}>View and manage all inventory items</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className={`${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535]' : 'bg-gray-200 hover:bg-gray-300'} ${textPrimary} px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2`}
          >
            <Plus className="h-4 w-4" />
            Add Item
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={`${cardBg} border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${textSecondary}`} />
              <input
                type="text"
                placeholder="Search items by name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 ${inputBg} ${textPrimary} border rounded-xl placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-all duration-200`}
              />
            </div>
            
            <div className="flex gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`px-4 py-3 ${inputBg} ${textPrimary} border rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200`}
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Status' : status.replace('-', ' ').toUpperCase()}
                  </option>
                ))}
              </select>
              
              <button
                onClick={onRefresh}
                className={`p-3 ${inputBg} ${textSecondary} border rounded-xl ${buttonHoverBg} transition-all duration-200 hover:scale-110`}
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Items Count */}
      <div className={`${cardBg} border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
        <div className="p-6">
          <p className={`${textSecondary}`}>
            Showing {filteredItems.length} of {items.length} items
          </p>
        </div>
      </div>

      {/* Items Grid */}
      <div className="space-y-4">
        {filteredItems.map((item, index) => (
          <div key={item.id} className={`${cardBg} border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}
            style={{ 
              borderRadius: index % 3 === 0 ? '1.5rem' : index % 3 === 1 ? '2rem' : '1rem'
            }}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className={`${textPrimary} font-semibold text-lg mb-1`}>{item.name}</h3>
                  {item.category && (
                    <p className={`${textSecondary} text-sm`}>{item.category}</p>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                  parseFloat(item.current_stock || '0') === 0 ? 'out-of-stock' :
                  parseFloat(item.current_stock || '0') <= parseFloat(item.min_stock || '0') ? 'low-stock' : 'in-stock'
                )}`}>
                  {parseFloat(item.current_stock || '0') === 0 ? 'Out of Stock' :
                   parseFloat(item.current_stock || '0') <= parseFloat(item.min_stock || '0') ? 'Low Stock' : 'In Stock'}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className={`${textSecondary}`}>Current Stock:</span>
                  <span className={`font-medium ${
                    parseFloat(item.current_stock || '0') === 0 ? 'text-red-500' : 
                    parseFloat(item.current_stock || '0') <= parseFloat(item.min_stock || '0') ? 'text-yellow-500' : textPrimary
                  }`}>
                    {item.current_stock} {item.unit || 'units'}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className={`${textSecondary}`}>Min Threshold:</span>
                  <span className="text-yellow-500">{item.min_stock} {item.unit || 'units'}</span>
                </div>
                
                {item.updated_at && (
                  <div className={`flex items-center gap-2 text-sm ${textSecondary}`}>
                    <Calendar className="h-3 w-3" />
                    <span>Updated: {new Date(item.updated_at).toLocaleDateString()}</span>
                  </div>
                )}

                {item.location_id && (
                  <div className={`flex items-center gap-2 text-sm ${textSecondary}`}>
                    <MapPin className="h-3 w-3" />
                    <span>Location: {item.location_id}</span>
                  </div>
                )}
              </div>

              {/* Stock Level Indicator */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className={`${textSecondary}`}>Stock Level</span>
                  <span className={`${textSecondary}`}>
                    {parseFloat(item.min_stock || '0') > 0 ? Math.round((parseFloat(item.current_stock || '0') / parseFloat(item.min_stock || '0')) * 100) : 100}%
                  </span>
                </div>
                <div className={`w-full ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-full h-2`}>
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      parseFloat(item.current_stock || '0') === 0
                        ? 'bg-red-500'
                        : parseFloat(item.current_stock || '0') <= parseFloat(item.min_stock || '0')
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ 
                      width: `${parseFloat(item.min_stock || '0') > 0 ? 
                        Math.min((parseFloat(item.current_stock || '0') / parseFloat(item.min_stock || '0')) * 100, 100) : 
                        100}%` 
                    }}
                  ></div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setEditingItem(item)}
                    disabled={updatingStock === item.id}
                    className={`p-2 ${buttonHoverBg} rounded-xl text-blue-500 transition-all duration-200 hover:scale-110 disabled:opacity-50`}
                    title="Update Stock"
                  >
                    {updatingStock === item.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Edit3 className="h-4 w-4" />
                    )}
                  </button>
                </div>
                
                <p className={`text-xs ${textSecondary}`}>
                  ID: {item.id}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className={`${cardBg} border shadow-lg text-center py-12`} style={{ borderRadius: '1.5rem' }}>
          <Package className={`h-12 w-12 ${textSecondary} mx-auto mb-4`} />
          <h3 className={`text-lg font-medium ${textPrimary} mb-2`}>No Items Found</h3>
          <p className={`${textSecondary} mb-4`}>
            {searchTerm || filterStatus !== 'all'
              ? 'Try adjusting your search or filters'
              : 'No inventory items available'
            }
          </p>
        </div>
      )}

      {/* Update Stock Modal */}
      {editingItem && (
        <UpdateStockModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSubmit={handleUpdateStock}
          loading={updatingStock === editingItem.id}
        />
      )}

      {/* Create Item Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${cardBg} p-6 rounded-xl border shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-xl font-bold ${textPrimary}`}>Create New Inventory Item</h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className={`${textSecondary} hover:text-red-400 p-1 transition-colors duration-300`}
              >
                ×
              </button>
            </div>
            
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                handleCreateItem(formData)
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block ${textPrimary} font-medium mb-2`}>
                    Item Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className={`w-full ${inputBg} ${textPrimary} px-3 py-2 rounded-lg border focus:border-blue-500 focus:outline-none transition-all duration-200`}
                  />
                </div>
                <div>
                  <label className={`block ${textPrimary} font-medium mb-2`}>
                    SKU
                  </label>
                  <input
                    type="text"
                    name="sku"
                    className={`w-full ${inputBg} ${textPrimary} px-3 py-2 rounded-lg border focus:border-blue-500 focus:outline-none transition-all duration-200`}
                  />
                </div>
                <div>
                  <label className={`block ${textPrimary} font-medium mb-2`}>
                    Unit *
                  </label>
                  <input
                    type="text"
                    name="unit"
                    placeholder="e.g., kg, lbs, pieces"
                    required
                    className={`w-full ${inputBg} ${textPrimary} px-3 py-2 rounded-lg border focus:border-blue-500 focus:outline-none transition-all duration-200`}
                  />
                </div>
                <div>
                  <label className={`block ${textPrimary} font-medium mb-2`}>
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    className={`w-full ${inputBg} ${textPrimary} px-3 py-2 rounded-lg border focus:border-blue-500 focus:outline-none transition-all duration-200`}
                  />
                </div>
                <div>
                  <label className={`block ${textPrimary} font-medium mb-2`}>
                    Current Stock *
                  </label>
                  <input
                    type="number"
                    name="current_stock"
                    min="0"
                    step="0.01"
                    defaultValue="0"
                    required
                    className={`w-full ${inputBg} ${textPrimary} px-3 py-2 rounded-lg border focus:border-blue-500 focus:outline-none transition-all duration-200`}
                  />
                </div>
                <div>
                  <label className={`block ${textPrimary} font-medium mb-2`}>
                    Min Stock *
                  </label>
                  <input
                    type="number"
                    name="min_stock"
                    min="0"
                    step="0.01"
                    defaultValue="0"
                    required
                    className={`w-full ${inputBg} ${textPrimary} px-3 py-2 rounded-lg border focus:border-blue-500 focus:outline-none transition-all duration-200`}
                  />
                </div>
                <div>
                  <label className={`block ${textPrimary} font-medium mb-2`}>
                    Max Stock
                  </label>
                  <input
                    type="number"
                    name="max_stock"
                    min="0"
                    step="0.01"
                    className={`w-full ${inputBg} ${textPrimary} px-3 py-2 rounded-lg border focus:border-blue-500 focus:outline-none transition-all duration-200`}
                  />
                </div>
                <div>
                  <label className={`block ${textPrimary} font-medium mb-2`}>
                    Unit Cost
                  </label>
                  <input
                    type="number"
                    name="unit_cost"
                    min="0"
                    step="0.01"
                    className={`w-full ${inputBg} ${textPrimary} px-3 py-2 rounded-lg border focus:border-blue-500 focus:outline-none transition-all duration-200`}
                  />
                </div>
              </div>
              
              <div>
                <label className={`block ${textPrimary} font-medium mb-2`}>
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  className={`w-full ${inputBg} ${textPrimary} px-3 py-2 rounded-lg border focus:border-blue-500 focus:outline-none transition-all duration-200`}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_tracked"
                  defaultChecked={true}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label className={`${textPrimary} font-medium`}>
                  Track this item
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className={`${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535]' : 'bg-gray-200 hover:bg-gray-300'} ${textPrimary} px-4 py-2 rounded-lg font-medium transition-all duration-300`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className={`${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 flex items-center gap-2`}
                >
                  {isCreating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  {isCreating ? 'Creating...' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}