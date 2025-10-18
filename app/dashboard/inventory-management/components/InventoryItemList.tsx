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
  const [editingItem, setEditingItem] = useState<InventoryItemWithMetrics | null>(null)
  const [updatingStock, setUpdatingStock] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
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

  // Theme-based styling variables - matching other components
  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const innerCardBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'
  const inputBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'

  // Button styles matching other components
  const primaryButtonBg = isDark
    ? 'bg-white text-gray-900 hover:bg-gray-100 border-gray-300'
    : 'bg-gray-900 text-white hover:bg-gray-800 border-gray-700'

  const secondaryButtonBg = isDark
    ? 'bg-[#1f1f1f] text-gray-400 border-[#2a2a2a] hover:bg-[#2a2a2a]'
    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
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
            onClick={() => setShowCreateForm(true)}
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
                className={`w-full pl-10 pr-4 py-3 ${inputBg} ${textPrimary} border rounded-xl placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-all duration-200 transition-colors duration-300`}
              />
            </div>
            
            <div className="flex gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`px-4 py-3 ${inputBg} ${textPrimary} border rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 transition-colors duration-300`}
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Status' : status.replace('-', ' ').toUpperCase()}
                  </option>
                ))}
              </select>
              
              <button
                onClick={onRefresh}
                className={`${secondaryButtonBg} p-3 rounded-xl transition-all duration-200 hover:scale-110`}
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* Items Table */}
      <div className={`${cardBg} border transition-colors duration-300 overflow-hidden`} style={{ borderTopLeftRadius: "1.5rem", borderTopRightRadius: "1.5rem" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Table Header */}
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
                  SKU
                </th>
                <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm relative dropdown-container`}>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === 'current_stock' ? null : 'current_stock')}
                      className="flex items-center gap-1 hover:text-white transition-colors"
                    >
                      Current Stock
                      <ChevronDown className={`h-3 w-3 transition-transform ${activeDropdown === 'current_stock' ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                  {activeDropdown === 'current_stock' && (
                    <div className={`absolute top-full left-0 mt-1 ${cardBg} border shadow-lg rounded-lg z-[9999] min-w-[200px]`}>
                      <div className="p-2">
                        <button
                          onClick={() => {
                            setSortBy('current_stock')
                            setSortOrder('desc')
                            setActiveDropdown(null)
                          }}
                          className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-100 ${textPrimary}`}
                        >
                          Sort High to Low
                        </button>
                        <button
                          onClick={() => {
                            setSortBy('current_stock')
                            setSortOrder('asc')
                            setActiveDropdown(null)
                          }}
                          className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-100 ${textPrimary}`}
                        >
                          Sort Low to High
                        </button>
                      </div>
                    </div>
                  )}
                </th>
                <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                  Min Threshold
                </th>
                <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm relative dropdown-container`}>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === 'status' ? null : 'status')}
                      className="flex items-center gap-1 hover:text-white transition-colors"
                    >
                      Status
                      <ChevronDown className={`h-3 w-3 transition-transform ${activeDropdown === 'status' ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                  {activeDropdown === 'status' && (
                    <div className={`absolute top-full left-0 mt-1 ${cardBg} border shadow-lg rounded-lg z-[9999] min-w-[200px]`}>
                      <div className="p-2">
                        <button
                          onClick={() => {
                            setFilterStatus('in-stock')
                            setActiveDropdown(null)
                          }}
                          className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-100 ${textPrimary}`}
                        >
                          In Stock
                        </button>
                        <button
                          onClick={() => {
                            setFilterStatus('low-stock')
                            setActiveDropdown(null)
                          }}
                          className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-100 ${textPrimary}`}
                        >
                          Low Stock
                        </button>
                        <button
                          onClick={() => {
                            setFilterStatus('out-of-stock')
                            setActiveDropdown(null)
                          }}
                          className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-100 ${textPrimary}`}
                        >
                          Out of Stock
                        </button>
                      </div>
                    </div>
                  )}
                </th>
                <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                  Actions
                </th>
              </tr>
            </thead>
            
            {/* Table Body */}
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
                        <div className={`${textPrimary} font-semibold text-sm`}>{item.name || "Unnamed Item"}</div>
                        <div className={`${textSecondary} text-xs mt-1`}>{item.description || "No description"}</div>
                      </div>
                    </td>
                    
                    {/* Category */}
                    <td className="py-4 px-6">
                      <span className={`${textPrimary} text-sm`}>
                        {item.category || "Uncategorized"}
                      </span>
                    </td>
                    
                    {/* SKU */}
                    <td className="py-4 px-6">
                      <span className={`${textSecondary} text-sm font-mono`}>
                        {item.sku || "N/A"}
                      </span>
                    </td>
                    
                    {/* Current Stock */}
                    <td className="py-4 px-6">
                      <span className={`${textPrimary} text-sm font-medium ${
                        status === 'out-of-stock' ? 'text-red-500' : 
                        status === 'low-stock' ? 'text-yellow-500' : 'text-green-500'
                      }`}>
                        {item.current_stock} {item.unit || 'units'}
                      </span>
                    </td>
                    
                    {/* Min Threshold */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className={`${textPrimary} text-sm`}>
                          {item.min_stock} {item.unit || 'units'}
                        </span>
                      </div>
                    </td>
                    
                    {/* Status */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          status === 'in-stock' ? 'bg-green-500' : 
                          status === 'low-stock' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <span className={`${textPrimary} text-sm`}>
                          {status === 'in-stock' ? 'In Stock' : 
                           status === 'low-stock' ? 'Low Stock' : 'Out of Stock'}
                        </span>
                        <ChevronDown className="h-3 w-3 text-gray-400" />
                      </div>
                    </td>
                    
                    {/* Actions */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          className={`${textSecondary} hover:text-blue-400 p-1 transition-colors duration-300`}
                          title="Update Stock"
                          onClick={() => setEditingItem(item)}
                          disabled={updatingStock === item.id}
                        >
                          {updatingStock === item.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Edit3 className="h-4 w-4" />
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

      {/* Create Item Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${cardBg} p-6 rounded-xl border shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto transition-colors duration-300`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-xl font-bold ${textPrimary} transition-colors duration-300`}>Create New Inventory Item</h3>
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
                  <label className={`block ${textPrimary} font-medium mb-2 transition-colors duration-300`}>
                    Item Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className={`w-full ${inputBg} ${textPrimary} px-3 py-2 rounded-lg border focus:border-blue-500 focus:outline-none transition-all duration-200 transition-colors duration-300`}
                  />
                </div>
                <div>
                  <label className={`block ${textPrimary} font-medium mb-2 transition-colors duration-300`}>
                    SKU
                  </label>
                  <input
                    type="text"
                    name="sku"
                    className={`w-full ${inputBg} ${textPrimary} px-3 py-2 rounded-lg border focus:border-blue-500 focus:outline-none transition-all duration-200 transition-colors duration-300`}
                  />
                </div>
                <div>
                  <label className={`block ${textPrimary} font-medium mb-2 transition-colors duration-300`}>
                    Unit *
                  </label>
                  <input
                    type="text"
                    name="unit"
                    placeholder="e.g., kg, lbs, pieces"
                    required
                    className={`w-full ${inputBg} ${textPrimary} px-3 py-2 rounded-lg border focus:border-blue-500 focus:outline-none transition-all duration-200 transition-colors duration-300`}
                  />
                </div>
                <div>
                  <label className={`block ${textPrimary} font-medium mb-2 transition-colors duration-300`}>
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    className={`w-full ${inputBg} ${textPrimary} px-3 py-2 rounded-lg border focus:border-blue-500 focus:outline-none transition-all duration-200 transition-colors duration-300`}
                  />
                </div>
                <div>
                  <label className={`block ${textPrimary} font-medium mb-2 transition-colors duration-300`}>
                    Current Stock *
                  </label>
                  <input
                    type="number"
                    name="current_stock"
                    min="0"
                    step="0.01"
                    defaultValue="0"
                    required
                    className={`w-full ${inputBg} ${textPrimary} px-3 py-2 rounded-lg border focus:border-blue-500 focus:outline-none transition-all duration-200 transition-colors duration-300`}
                  />
                </div>
                <div>
                  <label className={`block ${textPrimary} font-medium mb-2 transition-colors duration-300`}>
                    Min Stock *
                  </label>
                  <input
                    type="number"
                    name="min_stock"
                    min="0"
                    step="0.01"
                    defaultValue="0"
                    required
                    className={`w-full ${inputBg} ${textPrimary} px-3 py-2 rounded-lg border focus:border-blue-500 focus:outline-none transition-all duration-200 transition-colors duration-300`}
                  />
                </div>
              </div>
              
              <div>
                <label className={`block ${textPrimary} font-medium mb-2 transition-colors duration-300`}>
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  className={`w-full ${inputBg} ${textPrimary} px-3 py-2 rounded-lg border focus:border-blue-500 focus:outline-none transition-all duration-200 transition-colors duration-300`}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_tracked"
                  defaultChecked={true}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label className={`${textPrimary} font-medium transition-colors duration-300`}>
                  Track this item
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className={`${secondaryButtonBg} px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className={`${primaryButtonBg} px-4 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105`}
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

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${cardBg} p-6 rounded-xl border shadow-xl max-w-md w-full mx-4 transition-colors duration-300`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-xl font-bold ${textPrimary} transition-colors duration-300`}>Confirm Deletion</h3>
              <button
                onClick={() => setItemToDelete(null)}
                className={`${textSecondary} hover:text-red-400 p-1 transition-colors duration-300`}
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