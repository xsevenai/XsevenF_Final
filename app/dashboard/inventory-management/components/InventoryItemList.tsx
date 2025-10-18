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
  Loader2,
  ChevronDown,
  Users,
  Video,
  Mic,
  Wifi,
  Phone
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
  const [expandedView, setExpandedView] = useState<'create-item' | 'edit-item' | 'update-stock' | null>(null)
  const [editingItem, setEditingItem] = useState<InventoryItemWithMetrics | null>(null)
  const [updatingStock, setUpdatingStock] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [deletingItem, setDeletingItem] = useState<string | null>(null)
  const [itemToDelete, setItemToDelete] = useState<InventoryItemWithMetrics | null>(null)
  const [mounted, setMounted] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<string>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const { theme, isLoaded: themeLoaded, isDark, currentTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleBack = () => {
    setExpandedView(null)
  }

  const handleCreateItem = async (itemData: InventoryItemCreate) => {
    try {
      setIsCreating(true)
      await onCreateItem(itemData)
      setExpandedView(null)
      onRefresh()
    } catch (error) {
      console.error('Failed to create inventory item:', error)
      alert('Failed to create inventory item')
    } finally {
      setIsCreating(false)
    }
  }

  const handleEditItem = (item: InventoryItemWithMetrics) => {
    setEditingItem(item)
    setExpandedView('edit-item')
  }

  const handleUpdateStockClick = (item: InventoryItemWithMetrics) => {
    setEditingItem(item)
    setExpandedView('update-stock')
  }

  // Handle expanded view rendering (like PurchaseOrderManagement does)
  if (expandedView === 'create-item') {
    return (
      <div className="flex-1 min-h-screen overflow-y-auto transition-colors duration-300 bg-gray-50">
        <div className="p-6 space-y-6">
          <div className="bg-white p-8 border shadow-lg rounded-2xl">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="text-gray-600 hover:bg-gray-100 p-2 rounded-xl transition-all duration-200 hover:scale-110"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Inventory Item</h1>
                <p className="text-gray-600">Add a new inventory item to your system</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 border shadow-lg rounded-2xl">
            <p className="text-gray-600">Create item form will be implemented here...</p>
            <button
              onClick={handleBack}
              className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Back to Items
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (expandedView === 'edit-item' && editingItem) {
    return (
      <div className="flex-1 min-h-screen overflow-y-auto transition-colors duration-300 bg-gray-50">
        <div className="p-6 space-y-6">
          <div className="bg-white p-8 border shadow-lg rounded-2xl">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="text-gray-600 hover:bg-gray-100 p-2 rounded-xl transition-all duration-200 hover:scale-110"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Inventory Item</h1>
                <p className="text-gray-600">Update inventory item information</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 border shadow-lg rounded-2xl">
            <p className="text-gray-600">Edit item form will be implemented here...</p>
            <button
              onClick={handleBack}
              className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Back to Items
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (expandedView === 'update-stock' && editingItem) {
    return (
      <div className="flex-1 min-h-screen overflow-y-auto transition-colors duration-300 bg-gray-50">
        <div className="p-6 space-y-6">
          <div className="bg-white p-8 border shadow-lg rounded-2xl">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="text-gray-600 hover:bg-gray-100 p-2 rounded-xl transition-all duration-200 hover:scale-110"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Update Stock</h1>
                <p className="text-gray-600">Update stock levels for inventory item</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 border shadow-lg rounded-2xl">
            <p className="text-gray-600">Update stock form will be implemented here...</p>
            <button
              onClick={handleBack}
              className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Back to Items
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown && !(event.target as Element).closest('.dropdown-container')) {
        setActiveDropdown(null)
      }
    }

    // Prevent body scroll when dropdown is open
    if (activeDropdown) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [activeDropdown])

  if (!themeLoaded || !mounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  // Theme-aware styles
  const cardBg = isDark ? "bg-[#171717] border-[#2a2a2a]" : "bg-white border-gray-200"
  const textPrimary = isDark ? "text-white" : "text-gray-900"
  const textSecondary = isDark ? "text-gray-400" : "text-gray-600"
  const inputBg = isDark ? "bg-[#1f1f1f] border-[#2a2a2a]" : "bg-gray-50 border-gray-200"
  const innerCardBg = isDark ? "bg-[#1f1f1f] border-[#2a2a2a]" : "bg-gray-50 border-gray-200"
  const primaryButtonBg = isDark ? 'bg-white hover:bg-gray-100 text-gray-900' : 'bg-gray-900 hover:bg-gray-800 text-white'
  const secondaryButtonBg = isDark ? 'bg-[#1f1f1f] text-gray-400 border-[#2a2a2a] hover:bg-[#2a2a2a]' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'

  // Filter and sort items
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'in-stock' && parseFloat(item.current_stock || '0') > parseFloat(item.min_stock || '0')) ||
                         (filterStatus === 'low-stock' && parseFloat(item.current_stock || '0') <= parseFloat(item.min_stock || '0') && parseFloat(item.current_stock || '0') > 0) ||
                         (filterStatus === 'out-of-stock' && parseFloat(item.current_stock || '0') === 0)
    return matchesSearch && matchesStatus
  }).sort((a, b) => {
    const aValue = a[sortBy as keyof InventoryItemWithMetrics] || ''
    const bValue = b[sortBy as keyof InventoryItemWithMetrics] || ''
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const handleUpdateStock = async (itemId: string, stockQuantity: number, minThreshold?: number) => {
    try {
      const updateData: InventoryItemUpdate = { current_stock: stockQuantity }
      if (minThreshold !== undefined) {
        updateData.min_stock = minThreshold
      }
      await onUpdateItem(itemId, updateData)
      setEditingItem(null)
      onRefresh()
    } catch (error) {
      console.error('Failed to update stock:', error)
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    try {
      setDeletingItem(itemId)
      await onDeleteItem(itemId)
      setItemToDelete(null)
      onRefresh()
    } catch (error) {
      console.error('Failed to delete item:', error)
    } finally {
      setDeletingItem(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className={`flex items-center gap-3 ${textSecondary} transition-colors duration-300`}>
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
        <h3 className={`text-lg font-medium ${textPrimary} mb-2 transition-colors duration-300`}>Error Loading Items</h3>
        <p className={`${textSecondary} mb-4 transition-colors duration-300`}>{error}</p>
        <button
          onClick={onRefresh}
          className={`${secondaryButtonBg} px-6 py-3 rounded-xl font-medium transition-all duration-300 border shadow-lg hover:shadow-xl hover:scale-105`}
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`${cardBg} p-8 border shadow-lg transition-colors duration-300`} style={{ borderRadius: '1.5rem' }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className={`${textSecondary} ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-200'} p-2 rounded-xl transition-all duration-200 hover:scale-110`}
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className={`text-4xl font-bold ${textPrimary} mb-2 transition-colors duration-300`}>All Inventory Items</h1>
              <p className={`${textSecondary} transition-colors duration-300`}>View and manage all inventory items</p>
            </div>
          </div>
          <button
            onClick={() => setExpandedView('create-item')}
            className={`${primaryButtonBg} px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 border shadow-lg hover:shadow-xl hover:scale-105`}
          >
            <Plus className="h-4 w-4" />
            Add Item
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={`${cardBg} border shadow-lg transition-colors duration-300`} style={{ borderRadius: '1.5rem' }}>
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${textSecondary} transition-colors duration-300`} />
              <input
                type="text"
                placeholder="Search items by name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 ${inputBg} ${textPrimary} rounded-lg border focus:border-blue-500 focus:outline-none transition-all duration-200`}
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`px-4 py-2 ${inputBg} ${textPrimary} rounded-lg border focus:border-blue-500 focus:outline-none transition-all duration-200`}
            >
              <option value="all">All Items</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className={`${cardBg} border transition-colors duration-300 overflow-hidden`} style={{ borderTopLeftRadius: "1.5rem", borderTopRightRadius: "1.5rem" }}>
        {/* Fixed Table Header */}
        <div className={`${isDark ? "bg-[#171717]" : "bg-white"} sticky top-0 z-10`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
              <tr className={`${isDark ? "border-b border-[#2a2a2a]" : "border-b border-gray-200"}`}>
                <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                  Item ID
                </th>
                <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                  Item Name
                </th>
                <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm relative dropdown-container`}>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === 'category' ? null : 'category')}
                      className="flex items-center gap-1 hover:text-white transition-colors"
                    >
                      Category
                      <ChevronDown className={`h-3 w-3 transition-transform ${activeDropdown === 'category' ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                  {activeDropdown === 'category' && (
                    <div className={`absolute top-full left-0 mt-1 ${cardBg} border shadow-lg rounded-lg z-[9999] min-w-[200px]`}>
                      <div className="p-2">
                        <button
                          onClick={() => {
                            setSortBy('category')
                            setSortOrder('asc')
                            setActiveDropdown(null)
                          }}
                          className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-100 ${textPrimary}`}
                        >
                          Sort A-Z
                        </button>
                        <button
                          onClick={() => {
                            setSortBy('category')
                            setSortOrder('desc')
                            setActiveDropdown(null)
                          }}
                          className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-100 ${textPrimary}`}
                        >
                          Sort Z-A
                        </button>
                      </div>
                    </div>
                  )}
                </th>
                <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                  Current Stock
                </th>
                <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                  Min Stock
                </th>
                <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                  Unit Cost
                </th>
                <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                  Status
                </th>
                <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                  Actions
                </th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
        
      {/* Scrollable Table Body */}
      <div 
        className={`overflow-x-auto max-h-[600px] overflow-y-auto ${isDark ? "bg-[#171717]" : "bg-white"} ${isDark ? "dark-scrollbar" : "light-scrollbar"}`}
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: isDark ? '#2a2a2a #171717' : '#d1d5db #f9fafb'
        }}
      >
        <table className="w-full">
          <tbody>
              {filteredItems.map((item, index) => {
                const currentStock = parseFloat(item.current_stock || '0')
                const minStock = parseFloat(item.min_stock || '0')
                const status = currentStock === 0 ? 'out-of-stock' : currentStock <= minStock ? 'low-stock' : 'in-stock'
                
                return (
                  <tr 
                    key={item.id}
                    className={`${isDark ? "border-b border-[#2a2a2a] hover:bg-[#1f1f1f]" : "border-b border-gray-200 hover:bg-gray-50"} transition-colors duration-200`}
                  >
                    {/* Item ID */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-blue-500" />
                        <span className={`${textPrimary} font-medium text-sm`}>
                          {item.id || `item_${String(index + 1).padStart(3, '0')}`}
                        </span>
                      </div>
                    </td>
                    
                    {/* Item Name */}
                    <td className="py-4 px-6">
                      <div>
                        <div className={`${textPrimary} font-semibold text-sm`}>{item.name}</div>
                        <div className={`${textSecondary} text-xs`}>
                          {item.sku ? `SKU: ${item.sku}` : 'No SKU'}
                        </div>
                      </div>
                    </td>
                    
                    {/* Category */}
                    <td className="py-4 px-6">
                      <div className={`${textPrimary} text-sm`}>
                        {item.category || 'Uncategorized'}
                      </div>
                    </td>
                    
                    {/* Current Stock */}
                    <td className="py-4 px-6">
                      <div className={`${textPrimary} text-sm font-medium`}>
                        {item.current_stock} {item.unit}
                      </div>
                    </td>
                    
                    {/* Min Stock */}
                    <td className="py-4 px-6">
                      <div className={`${textPrimary} text-sm`}>
                        {item.min_stock} {item.unit}
                      </div>
                    </td>
                    
                    {/* Unit Cost */}
                    <td className="py-4 px-6">
                      <div className={`${textPrimary} text-sm font-medium`}>
                        ${parseFloat(item.unit_cost || '0').toFixed(2)}
                      </div>
                    </td>
                    
                    {/* Status */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          status === 'in-stock' ? 'bg-green-500' : 
                          status === 'low-stock' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          status === 'in-stock' ? 'bg-green-100 text-green-800' :
                          status === 'low-stock' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {status === 'in-stock' ? 'In Stock' : status === 'low-stock' ? 'Low Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    </td>
                    
                    {/* Actions */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          className={`${textSecondary} hover:text-blue-400 p-1 transition-colors duration-300`}
                          title="Edit Item"
                          onClick={() => handleEditItem(item)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          className={`${textSecondary} hover:text-green-400 p-1 transition-colors duration-300`}
                          title="Update Stock"
                          onClick={() => handleUpdateStockClick(item)}
                          disabled={updatingStock === item.id}
                        >
                          {updatingStock === item.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Package className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          className={`${textSecondary} hover:text-red-400 p-1 transition-colors duration-300`}
                          title="Delete Item"
                          onClick={() => setItemToDelete(item)}
                          disabled={deletingItem === item.id}
                        >
                          {deletingItem === item.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
        
        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className={`${textSecondary} text-lg mb-2`}>No items found</div>
            <div className={`${textSecondary} text-sm`}>
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'No inventory items available'
              }
            </div>
          </div>
        )}
      </div>

      {/* Update Stock Modal */}
      {editingItem && (
        <UpdateStockModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSubmit={handleUpdateStock}
          loading={updatingStock === editingItem.id}
        />
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${cardBg} p-6 rounded-xl border shadow-xl max-w-md w-full mx-4 transition-colors duration-300`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-xl font-bold ${textPrimary} transition-colors duration-300`}>Confirm Deletion</h3>
              <button
                onClick={() => setItemToDelete(null)}
                className={`${isDark ? 'text-white hover:text-red-400' : 'text-gray-600 hover:text-red-400'} p-1 transition-colors duration-300`}
              >
                ×
              </button>
            </div>
            
            <div className="mb-6">
              <p className={`${textSecondary} mb-4 transition-colors duration-300`}>
                Are you sure you want to delete this inventory item? This action cannot be undone.
              </p>
              <div className={`${innerCardBg} p-4 rounded-lg border transition-colors duration-300`}>
                <h4 className={`${textPrimary} font-medium mb-2 transition-colors duration-300`}>{itemToDelete.name}</h4>
                <p className={`${textSecondary} text-sm transition-colors duration-300`}>SKU: {itemToDelete.sku || 'N/A'}</p>
                <p className={`${textSecondary} text-sm transition-colors duration-300`}>Current Stock: {itemToDelete.current_stock} {itemToDelete.unit}</p>
                {itemToDelete.category && (
                  <p className={`${textSecondary} text-sm transition-colors duration-300`}>Category: {itemToDelete.category}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setItemToDelete(null)}
                className={`${secondaryButtonBg} px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105`}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteItem(itemToDelete.id)}
                disabled={deletingItem === itemToDelete.id}
                className={`bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105`}
              >
                {deletingItem === itemToDelete.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                {deletingItem === itemToDelete.id ? 'Deleting...' : 'Delete Item'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}