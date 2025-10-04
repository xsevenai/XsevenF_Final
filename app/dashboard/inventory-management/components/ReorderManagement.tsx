// app/dashboard/inventory-management/components/ReorderManagement.tsx

"use client"

import React, { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { useTheme } from "@/hooks/useTheme"
import { 
  ArrowLeft,
  Plus, 
  RefreshCw, 
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2
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
  const [selectedItem, setSelectedItem] = useState('')
  const [quantity, setQuantity] = useState(0)
  const [supplier, setSupplier] = useState('')
  const [notes, setNotes] = useState('')
  const [creating, setCreating] = useState(false)
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

  const handleCreateReorder = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedItem || quantity <= 0) return

    try {
      setCreating(true)
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
        <div className={`flex items-center gap-3 ${textSecondary}`}>
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading reorder data...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className={`text-lg font-medium ${textPrimary} mb-2`}>Error Loading Reorders</h3>
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
            <h1 className={`text-4xl font-bold ${textPrimary} mb-2`}>Reorder Management</h1>
            <p className={`${textSecondary}`}>Manage purchase orders and supplier requests</p>
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className={`px-6 py-3 ${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535] border-[#3a3a3a]' : 'bg-gray-100 hover:bg-gray-200 border-gray-300'} ${textPrimary} rounded-xl font-medium transition-all duration-300 border shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2`}
          >
            <Plus className="h-4 w-4" />
            New Reorder
          </button>
          <button
            onClick={onRefresh}
            className={`p-3 ${textSecondary} ${buttonHoverBg} rounded-xl transition-all duration-200 hover:scale-110`}
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Create Reorder Form */}
      {showCreateForm && (
        <div className={`${cardBg} border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
          <div className="p-6">
            <h3 className={`text-xl font-semibold ${textPrimary} mb-4`}>Create New Reorder Request</h3>
            <form onSubmit={handleCreateReorder} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${textPrimary} mb-2`}>
                  Item <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedItem}
                  onChange={(e) => setSelectedItem(e.target.value)}
                  required
                  className={`w-full px-4 py-3 ${inputBg} ${textPrimary} border rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200`}
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
                <label className={`block text-sm font-medium ${textPrimary} mb-2`}>
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                  required
                  className={`w-full px-4 py-3 ${inputBg} ${textPrimary} border rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200`}
                  placeholder="Enter quantity"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${textPrimary} mb-2`}>
                  Supplier
                </label>
                <input
                  type="text"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className={`w-full px-4 py-3 ${inputBg} ${textPrimary} border rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200`}
                  placeholder="Supplier name"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${textPrimary} mb-2`}>
                  Notes
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className={`w-full px-4 py-3 ${inputBg} ${textPrimary} border rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200`}
                  placeholder="Additional notes"
                />
              </div>

              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  disabled={!selectedItem || quantity <= 0 || creating}
                  className={`px-6 py-3 ${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535] border-[#3a3a3a]' : 'bg-gray-100 hover:bg-gray-200 border-gray-300'} ${textPrimary} rounded-xl font-medium transition-all duration-300 border shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
                >
                  {creating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
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
                  className={`px-6 py-3 ${textSecondary} ${buttonHoverBg} rounded-xl transition-all duration-300 hover:scale-105`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reorder History */}
      <div className={`${cardBg} border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
        <div className="p-6">
          <h3 className={`text-xl font-semibold ${textPrimary} mb-4`}>Recent Reorder Requests</h3>
          
          {reorders.length === 0 ? (
            <div className="text-center py-12">
              <Truck className={`h-12 w-12 ${textSecondary} mx-auto mb-4`} />
              <h3 className={`text-lg font-medium ${textPrimary} mb-2`}>No Reorder Requests</h3>
              <p className={`${textSecondary}`}>Create your first reorder request to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {reorders.map((reorder, index) => (
                <div key={index} className={`${cardBg} border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}
                  style={{ 
                    borderRadius: index % 2 === 0 ? '1.5rem' : '2rem'
                  }}>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className={`${textPrimary} font-semibold`}>{reorder.item_name}</h4>
                        <p className={`${textSecondary} text-sm`}>Requested: {reorder.requested_quantity} units</p>
                      </div>
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className={`${textSecondary}`}>Status:</span>
                        <span className="text-green-500 font-medium">Requested</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`${textSecondary}`}>Item ID:</span>
                        <span className={`${textPrimary}`}>#{reorder.item_id}</span>
                      </div>
                    </div>
                    
                    <p className={`${textPrimary} text-sm mt-3`}>{reorder.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}