// app/dashboard/inventory-management/components/ReorderManagement.tsx

"use client"

import React, { useState } from 'react'
import { Card } from "@/components/ui/card"
import { 
  ArrowLeft,
  Plus, 
  RefreshCw, 
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react"
import type { ReorderResponse, ExtendedInventoryItem, ReorderRequest } from '@/app/api/inventory/route'

interface ReorderManagementProps {
  reorders: ReorderResponse[]
  loading: boolean
  error: string | null
  onRefresh: () => void
  onCreateReorder: (data: ReorderRequest) => Promise<ReorderResponse>
  onBack: () => void
  inventoryItems: ExtendedInventoryItem[]
}

export default function ReorderManagement({
  reorders,
  loading,
  error,
  onRefresh,
  onCreateReorder,
  onBack,
  inventoryItems
}: ReorderManagementProps) {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedItem, setSelectedItem] = useState('')  // FIXED: Keep as string
  const [quantity, setQuantity] = useState(0)
  const [supplier, setSupplier] = useState('')
  const [notes, setNotes] = useState('')
  const [creating, setCreating] = useState(false)

  const handleCreateReorder = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedItem || quantity <= 0) return

    try {
      setCreating(true)
      // FIXED: Use selectedItem directly as string (no parseInt)
      await onCreateReorder({
        item_id: selectedItem,
        quantity,
        supplier: supplier || undefined,
        notes: notes || undefined
      })
      
      // Reset form
      setSelectedItem('')
      setQuantity(0)
      setSupplier('')
      setNotes('')
      setShowCreateForm(false)
    } catch (error) {
      console.error('Failed to create reorder:', error)
    } finally {
      setCreating(false)
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
        <h3 className="text-lg font-medium text-white mb-2">Error Loading Reorders</h3>
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
              Reorder Management
            </h2>
            <p className="text-gray-400">Manage purchase orders and supplier requests</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Reorder
            </button>
            <button
              onClick={onRefresh}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Create Reorder Form */}
      {showCreateForm && (
        <div className="p-6 pt-0">
          <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Create New Reorder Request</h3>
            <form onSubmit={handleCreateReorder} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Item *
                </label>
                <select
                  value={selectedItem}
                  onChange={(e) => setSelectedItem(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="">Select an item</option>
                  {inventoryItems.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name} (Current: {item.current_stock})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                  required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                  placeholder="Enter quantity"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Supplier
                </label>
                <input
                  type="text"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                  placeholder="Supplier name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Notes
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                  placeholder="Additional notes"
                />
              </div>

              <div className="md:col-span-2 flex gap-2">
                <button
                  type="submit"
                  disabled={!selectedItem || quantity <= 0 || creating}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
                >
                  {creating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Truck className="h-4 w-4" />
                      Create Reorder
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Reorder History */}
      <div className="p-6 pt-0 space-y-4">
        <h3 className="text-xl font-semibold text-white">Recent Reorder Requests</h3>
        
        {reorders.length === 0 ? (
          <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-8 text-center">
            <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No Reorder Requests</h3>
            <p className="text-gray-400">Create your first reorder request to get started.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reorders.map((reorder, index) => (
              <Card key={index} className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-white font-semibold">{reorder.item_name}</h4>
                    <p className="text-gray-400 text-sm">Requested: {reorder.requested_quantity} units</p>
                  </div>
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className="text-green-400">Requested</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Item ID:</span>
                    <span className="text-white">#{reorder.item_id}</span>
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm mt-3">{reorder.message}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}