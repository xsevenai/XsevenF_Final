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
import type { ExtendedInventoryItem, InventoryUpdate } from '@/app/api/inventory/route'
import UpdateStockModal from './UpdateStockModel'

interface InventoryItemsListProps {
  items: ExtendedInventoryItem[]
  loading: boolean
  error: string | null
  onRefresh: () => void
  onUpdateItem: (itemId: string, data: InventoryUpdate) => Promise<ExtendedInventoryItem>
  onBack: () => void
}

export default function InventoryItemsList({
  items,
  loading,
  error,
  onRefresh,
  onUpdateItem,
  onBack
}: InventoryItemsListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [editingItem, setEditingItem] = useState<ExtendedInventoryItem | null>(null)
  const [updatingStock, setUpdatingStock] = useState<string | null>(null)
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
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus
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
      const updateData: InventoryUpdate = { stock_quantity: stockQuantity }
      if (minThreshold !== undefined) {
        updateData.min_stock_threshold = minThreshold
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
        <div className="flex items-center gap-4 mb-6">
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
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                  {item.status.replace('-', ' ')}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className={`${textSecondary}`}>Current Stock:</span>
                  <span className={`font-medium ${
                    item.is_out_of_stock ? 'text-red-500' : 
                    item.is_low_stock ? 'text-yellow-500' : textPrimary
                  }`}>
                    {item.current_stock} {item.unit || 'units'}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className={`${textSecondary}`}>Min Threshold:</span>
                  <span className="text-yellow-500">{item.min_threshold} {item.unit || 'units'}</span>
                </div>
                
                {item.last_updated && (
                  <div className={`flex items-center gap-2 text-sm ${textSecondary}`}>
                    <Calendar className="h-3 w-3" />
                    <span>Updated: {new Date(item.last_updated).toLocaleDateString()}</span>
                  </div>
                )}

                {item.location && (
                  <div className={`flex items-center gap-2 text-sm ${textSecondary}`}>
                    <MapPin className="h-3 w-3" />
                    <span>{item.location}</span>
                  </div>
                )}
              </div>

              {/* Stock Level Indicator */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className={`${textSecondary}`}>Stock Level</span>
                  <span className={`${textSecondary}`}>
                    {item.min_threshold > 0 ? Math.round((item.current_stock / item.min_threshold) * 100) : 100}%
                  </span>
                </div>
                <div className={`w-full ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-full h-2`}>
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      item.is_out_of_stock
                        ? 'bg-red-500'
                        : item.is_low_stock
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ 
                      width: `${item.min_threshold > 0 ? 
                        Math.min((item.current_stock / item.min_threshold) * 100, 100) : 
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
    </div>
  )
}