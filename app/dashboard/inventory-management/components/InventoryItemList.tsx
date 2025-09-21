// app/dashboard/inventory-management/components/InventoryItemsList.tsx

"use client"

import React, { useState } from 'react'
import { Card } from "@/components/ui/card"
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
  ArrowLeft
} from "lucide-react"
import type { ExtendedInventoryItem, InventoryUpdate } from '@/app/api/inventory'
import UpdateStockModal from './UpdateStockModel'

interface InventoryItemsListProps {
  items: ExtendedInventoryItem[]
  loading: boolean
  error: string | null
  onRefresh: () => void
  onUpdateItem: (itemId: number, data: InventoryUpdate) => Promise<ExtendedInventoryItem>
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
  const [updatingStock, setUpdatingStock] = useState<number | null>(null)

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
      case 'in-stock': return 'bg-green-400/10 text-green-400 border-green-400/20'
      case 'low-stock': return 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20'
      case 'out-of-stock': return 'bg-red-400/10 text-red-400 border-red-400/20'
      default: return 'bg-gray-400/10 text-gray-400 border-gray-400/20'
    }
  }

  const handleUpdateStock = async (itemId: number, stockQuantity: number, minThreshold?: number) => {
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">Error Loading Items</h3>
        <p className="text-gray-400 mb-4">{error}</p>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg text-gray-300 hover:text-white transition-all duration-200 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Overview
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              All Inventory Items
            </h2>
            <p className="text-gray-400">View and manage all inventory items</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="px-6">
        <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search items by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none"
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Status' : status.replace('-', ' ').toUpperCase()}
              </option>
            ))}
          </select>
          
          <button
            onClick={onRefresh}
            className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-purple-500 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Items Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-400">
          Showing {filteredItems.length} of {items.length} items
        </p>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6 hover:border-purple-500/30 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-white font-semibold text-lg mb-1">{item.name}</h3>
                {item.category && (
                  <p className="text-gray-400 text-sm">{item.category}</p>
                )}
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                {item.status.replace('-', ' ')}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Current Stock:</span>
                <span className={`font-medium ${
                  item.is_out_of_stock ? 'text-red-400' : 
                  item.is_low_stock ? 'text-yellow-400' : 'text-white'
                }`}>
                  {item.current_stock} {item.unit || 'units'}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Min Threshold:</span>
                <span className="text-yellow-400">{item.min_threshold} {item.unit || 'units'}</span>
              </div>
              
              {item.last_updated && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar className="h-3 w-3" />
                  <span>Updated: {new Date(item.last_updated).toLocaleDateString()}</span>
                </div>
              )}

              {item.location && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <MapPin className="h-3 w-3" />
                  <span>{item.location}</span>
                </div>
              )}
            </div>

            {/* Stock Level Indicator */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Stock Level</span>
                <span className="text-gray-400">
                  {item.min_threshold > 0 ? Math.round((item.current_stock / item.min_threshold) * 100) : 100}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
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
                  className="p-2 hover:bg-gray-700 rounded text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50"
                  title="Update Stock"
                >
                  {updatingStock === item.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                  ) : (
                    <Edit3 className="h-4 w-4" />
                  )}
                </button>
              </div>
              
              <p className="text-xs text-gray-500">
                ID: {item.id}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No Items Found</h3>
          <p className="text-gray-400 mb-4">
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
