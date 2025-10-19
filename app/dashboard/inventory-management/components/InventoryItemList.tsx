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
import InventoryItemForm from './InventoryItemForm'
import InventoryItemUpdateForm from './forms/InventoryItemUpdateForm'
import DeleteConfirmationModal from './modals/DeleteConfirmationModal'

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
  const [expandedView, setExpandedView] = useState<'create-item' | 'update-item' | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [deletingItem, setDeletingItem] = useState<string | null>(null)
  const [itemToDelete, setItemToDelete] = useState<InventoryItemWithMetrics | null>(null)
  const [itemToUpdate, setItemToUpdate] = useState<InventoryItemWithMetrics | null>(null)
  const [mounted, setMounted] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<string>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const { theme, isLoaded: themeLoaded, isDark, currentTheme } = useTheme()

  // Add custom scrollbar styles
  React.useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .dark-scrollbar::-webkit-scrollbar {
        width: 8px;
      }
      .dark-scrollbar::-webkit-scrollbar-track {
        background: #171717;
      }
      .dark-scrollbar::-webkit-scrollbar-thumb {
        background: #2a2a2a;
        border-radius: 4px;
      }
      .dark-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #3a3a3a;
      }
      .light-scrollbar::-webkit-scrollbar {
        width: 8px;
      }
      .light-scrollbar::-webkit-scrollbar-track {
        background: #f9fafb;
      }
      .light-scrollbar::-webkit-scrollbar-thumb {
        background: #d1d5db;
        border-radius: 4px;
      }
      .light-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #9ca3af;
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

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
  const buttonHoverBg = isDark ? "hover:bg-[#2a2a2a]" : "hover:bg-gray-100"

  const statuses = ['all', 'in-stock', 'low-stock', 'out-of-stock']

  // Filter and sort items based on search, filters, and sorting
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
  }).sort((a, b) => {
    let aValue: any, bValue: any
    
    switch (sortBy) {
      case 'name':
        aValue = a.name?.toLowerCase() || ''
        bValue = b.name?.toLowerCase() || ''
        break
      case 'category':
        aValue = a.category?.toLowerCase() || ''
        bValue = b.category?.toLowerCase() || ''
        break
      case 'current_stock':
        aValue = parseFloat(a.current_stock || '0')
        bValue = parseFloat(b.current_stock || '0')
        break
      case 'status':
        const aStock = parseFloat(a.current_stock || '0')
        const aMinStock = parseFloat(a.min_stock || '0')
        const bStock = parseFloat(b.current_stock || '0')
        const bMinStock = parseFloat(b.min_stock || '0')
        aValue = aStock === 0 ? 'out-of-stock' : aStock <= aMinStock ? 'low-stock' : 'in-stock'
        bValue = bStock === 0 ? 'out-of-stock' : bStock <= bMinStock ? 'low-stock' : 'in-stock'
        break
      default:
        aValue = a.name?.toLowerCase() || ''
        bValue = b.name?.toLowerCase() || ''
    }
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
    return 0
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

  const handleCreateItem = async (itemData: InventoryItemCreate) => {
    try {
      setIsCreating(true)
      await onCreateItem(itemData)
      setExpandedView(null)
      onRefresh()
    } catch (error) {
      console.error('Failed to create item:', error)
      alert('Failed to create inventory item')
    } finally {
      setIsCreating(false)
    }
  }

  const handleBack = () => {
    setExpandedView(null)
  }

  const handleDeleteItem = async (itemId: string) => {
    try {
      setDeletingItem(itemId)
      await onDeleteItem(itemId)
      setItemToDelete(null)
      onRefresh()
    } catch (error) {
      console.error('Failed to delete item:', error)
      alert('Failed to delete inventory item')
    } finally {
      setDeletingItem(null)
    }
  }

  const handleUpdateItem = async (itemId: string, updateData: InventoryItemUpdate) => {
    try {
      setIsUpdating(true)
      await onUpdateItem(itemId, updateData)
      setExpandedView(null)
      setItemToUpdate(null)
      onRefresh()
    } catch (error) {
      console.error('Failed to update item:', error)
      alert('Failed to update inventory item')
    } finally {
      setIsUpdating(false)
    }
  }

  // Handle expanded view rendering (like PurchaseOrderManagement does)
  if (expandedView === 'create-item') {
    return (
      <InventoryItemForm
        onSubmit={handleCreateItem}
        onCancel={handleBack}
        loading={isCreating}
      />
    )
  }

  if (expandedView === 'update-item' && itemToUpdate) {
    return (
      <InventoryItemUpdateForm
        item={itemToUpdate}
        onSubmit={handleUpdateItem}
        onCancel={handleBack}
        loading={isUpdating}
      />
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`${cardBg} p-8 border shadow-lg transition-colors duration-300`} style={{ borderRadius: "1.5rem" }}>
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className={`${textSecondary} ${buttonHoverBg} p-2 rounded-xl transition-all duration-200 hover:scale-110`}
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className={`text-4xl font-bold ${textPrimary} mb-2 transition-colors duration-300`}>
              Inventory Items
            </h1>
            <p className={`${textSecondary} transition-colors duration-300`}>
              Manage inventory items and track stock levels
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className={`${cardBg} p-6 border shadow-lg transition-colors duration-300`} style={{ borderRadius: "1.5rem" }}>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${textSecondary}`} />
              <input
                type="text"
                placeholder="Search inventory items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 ${inputBg} ${textPrimary} rounded-lg border focus:border-blue-500 focus:outline-none transition-all duration-200`}
              />
            </div>

            {/* Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`px-4 py-2 ${inputBg} ${textPrimary} rounded-lg border focus:border-blue-500 focus:outline-none transition-all duration-200`}
            >
              <option value="all">All Status</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>

          <button
            onClick={() => setExpandedView('create-item')}
            className={`${isDark ? 'bg-white hover:bg-gray-100 text-gray-900' : 'bg-gray-900 hover:bg-gray-800 text-white'} px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2`}
          >
            <Plus className="h-4 w-4" />
            Add Item
          </button>
        </div>
      </div>


      {/* Inventory Items Table */}
      <div className={`${cardBg} border transition-colors duration-300 overflow-hidden`} style={{ borderTopLeftRadius: "1.5rem", borderTopRightRadius: "1.5rem" }}>
        {/* Fixed Table Header */}
        <div className={`${isDark ? "bg-[#171717]" : "bg-white"} sticky top-0 z-10`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`${isDark ? "border-b border-[#2a2a2a]" : "border-b border-gray-200"}`}>
                  <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                    Item Name
                  </th>
                  <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                    Category
                  </th>
                  <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                    SKU
                  </th>
                  <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                    Current Stock
                  </th>
                  <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                    Min Threshold
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
                    {/* Item Name */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-full flex items-center justify-center`}>
                          <Package className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <div className={`${textPrimary} font-semibold text-sm`}>{item.name || "Unnamed Item"}</div>
                          <div className={`${textSecondary} text-xs`}>
                            {item.description ? item.description.substring(0, 30) + '...' : 'No description'}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    {/* Category */}
                    <td className="py-4 px-6">
                      <div className={`${textPrimary} text-sm`}>
                        {item.category || "Uncategorized"}
                      </div>
                    </td>
                    
                    {/* SKU */}
                    <td className="py-4 px-6">
                      <div className={`${textSecondary} text-sm font-mono`}>
                        {item.sku || "N/A"}
                      </div>
                    </td>
                    
                    {/* Current Stock */}
                    <td className="py-4 px-6">
                      <div className={`${textPrimary} text-sm font-medium`}>
                        {item.current_stock} {item.unit || 'units'}
                      </div>
                    </td>
                    
                    {/* Min Threshold */}
                    <td className="py-4 px-6">
                      <div className={`${textPrimary} text-sm`}>
                        {item.min_stock} {item.unit || 'units'}
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
                          status === 'low-stock' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {status === 'in-stock' ? 'In Stock' : 
                           status === 'low-stock' ? 'Low Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    </td>
                    
                    {/* Actions */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setItemToUpdate(item)
                            setExpandedView('update-item')
                          }}
                          className={`${textSecondary} hover:text-blue-400 p-1 transition-colors duration-300`}
                          title="Edit Item"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setItemToDelete(item)}
                          className={`${textSecondary} hover:text-red-400 p-1 transition-colors duration-300`}
                          title="Delete Item"
                        >
                          <Trash2 className="h-4 w-4" />
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
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className={`text-lg font-medium ${textPrimary} mb-2`}>No Inventory Items</h3>
            <p className={`${textSecondary} mb-4`}>Create your first inventory item to get started</p>
            <button
              onClick={() => setExpandedView('create-item')}
              className={`${isDark ? 'bg-white hover:bg-gray-100 text-gray-900' : 'bg-gray-900 hover:bg-gray-800 text-white'} px-6 py-3 rounded-lg font-medium transition-all duration-300`}
            >
              Create Inventory Item
            </button>
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
        <DeleteConfirmationModal
          title="Confirm Deletion"
          message="Are you sure you want to delete this inventory item? This action cannot be undone."
          itemName={itemToDelete.name || "Unnamed Item"}
          itemDetails={[
            `SKU: ${itemToDelete.sku || 'N/A'}`,
            `Current Stock: ${itemToDelete.current_stock} ${itemToDelete.unit}`,
            itemToDelete.category ? `Category: ${itemToDelete.category}` : ''
          ].filter(Boolean)}
          onConfirm={() => handleDeleteItem(itemToDelete.id)}
          onCancel={() => setItemToDelete(null)}
          loading={deletingItem === itemToDelete.id}
          loadingText="Deleting..."
        />
      )}
    </div>
  )
}
