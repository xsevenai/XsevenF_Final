// app/dashboard/inventory-management/components/PurchaseOrderManagement.tsx

"use client"

import React, { useState } from 'react'
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Edit, 
  Eye, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Package,
  Loader2
} from "lucide-react"
import { useTheme } from "@/hooks/useTheme"
import type { PurchaseOrder } from '@/src/api/generated/models/PurchaseOrder'
import type { PurchaseOrderCreate } from '@/src/api/generated/models/PurchaseOrderCreate'
import type { PurchaseOrderUpdate } from '@/src/api/generated/models/PurchaseOrderUpdate'
import type { PurchaseOrderStatus } from '@/src/api/generated/models/PurchaseOrderStatus'
import type { Supplier } from '@/src/api/generated/models/Supplier'

// Extended PurchaseOrder type with flattened supplier data
interface PurchaseOrderWithSupplier extends PurchaseOrder {
  supplier_name?: string;
  supplier_email?: string;
  supplier_contact_name?: string;
}
import PurchaseOrderForm from './forms/PurchaseOrderForm'
import PurchaseOrderUpdateForm from './forms/PurchaseOrderUpdateForm'
import PurchaseOrderDetailsModal from './modals/PurchaseOrderDetailsModal'

interface PurchaseOrderManagementProps {
  purchaseOrders: PurchaseOrderWithSupplier[]
  suppliers: Supplier[]
  inventoryItems: any[]
  loading: boolean
  error: string | null
  onRefresh: () => void
  onRefreshSuppliers?: () => void
  onCreatePurchaseOrder: (data: PurchaseOrderCreate, createdBy?: string) => Promise<PurchaseOrderWithSupplier>
  onUpdatePurchaseOrder: (poId: string, data: PurchaseOrderUpdate) => Promise<PurchaseOrderWithSupplier>
  onReceivePurchaseOrder: (poId: string, receivedItems: any[]) => Promise<any>
  onBack: () => void
}

export default function PurchaseOrderManagement({
  purchaseOrders,
  suppliers,
  inventoryItems,
  loading,
  error,
  onRefresh,
  onRefreshSuppliers,
  onCreatePurchaseOrder,
  onUpdatePurchaseOrder,
  onReceivePurchaseOrder,
  onBack
}: PurchaseOrderManagementProps) {
  const { isDark } = useTheme()

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
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [expandedView, setExpandedView] = useState<'create-po' | 'edit-po' | null>(null)
  const [editingPO, setEditingPO] = useState<PurchaseOrderWithSupplier | null>(null)
  const [selectedPO, setSelectedPO] = useState<PurchaseOrderWithSupplier | null>(null)
  const [isReceiving, setIsReceiving] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  // Theme-aware styles
  const cardBg = isDark ? "bg-[#171717] border-[#2a2a2a]" : "bg-white border-gray-200"
  const textPrimary = isDark ? "text-white" : "text-gray-900"
  const textSecondary = isDark ? "text-gray-400" : "text-gray-600"
  const inputBg = isDark ? "bg-[#1f1f1f] border-[#2a2a2a]" : "bg-gray-50 border-gray-200"
  const buttonHoverBg = isDark ? "hover:bg-[#2a2a2a]" : "hover:bg-gray-100"

  const filteredPOs = purchaseOrders.filter(po => {
    const matchesSearch = po.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         po.supplier_id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || po.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-blue-100 text-blue-800'
      case 'ordered': return 'bg-purple-100 text-purple-800'
      case 'received': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'approved': return <CheckCircle className="h-4 w-4" />
      case 'ordered': return <Package className="h-4 w-4" />
      case 'received': return <CheckCircle className="h-4 w-4" />
      case 'cancelled': return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const handleReceivePO = async (poId: string) => {
    setIsReceiving(poId)
    try {
      // For now, we'll receive all items as ordered
      const po = purchaseOrders.find(p => p.id === poId)
      if (po) {
        const receivedItems = po.items.map(item => ({
          item_id: item.inventory_item_id,
          quantity_received: item.quantity
        }))
        await onReceivePurchaseOrder(poId, receivedItems)
      }
    } catch (error) {
      console.error('Failed to receive purchase order:', error)
    } finally {
      setIsReceiving(null)
    }
  }

  const handleCreatePO = async (poData: PurchaseOrderCreate | PurchaseOrderUpdate) => {
    try {
      setIsCreating(true)
      console.log('Creating purchase order with data:', poData)
      
      // Don't pass createdBy if it's empty to avoid validation errors
      const createdBy = typeof window !== "undefined" ? localStorage.getItem("businessId") : null
      console.log('Created by:', createdBy)
      
      if (createdBy) {
        await onCreatePurchaseOrder(poData as PurchaseOrderCreate, createdBy)
      } else {
        await onCreatePurchaseOrder(poData as PurchaseOrderCreate)
      }
      
      setExpandedView(null)
      onRefresh()
    } catch (error) {
      console.error('Failed to create purchase order:', error)
      alert('Failed to create purchase order')
    } finally {
      setIsCreating(false)
    }
  }

  const handleUpdatePO = async (poId: string, updateData: PurchaseOrderUpdate) => {
    try {
      setIsUpdating(true)
      console.log('Updating purchase order:', poId, 'with data:', updateData)
      
      const updatedPO = await onUpdatePurchaseOrder(poId, updateData)
      console.log('Purchase order updated successfully:', updatedPO)
      
      setExpandedView(null)
      setEditingPO(null)
      
      // Show success message (you could use a toast notification here)
      console.log('Purchase order updated successfully!')
      
    } catch (error: any) {
      console.error('Failed to update purchase order:', error)
      
      // Show error message to user
      const errorMessage = error.message || 'Failed to update purchase order'
      alert(`Error: ${errorMessage}`)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleEditPO = (poId: string) => {
    const po = purchaseOrders.find(p => p.id === poId)
    if (po) {
      setEditingPO(po)
      setExpandedView('edit-po')
    }
  }

  const handleBack = () => {
    setExpandedView(null)
    setEditingPO(null)
  }

  // Handle expanded view rendering (like MenuComponent does)
  if (expandedView === 'create-po') {
    return (
      <PurchaseOrderForm
        suppliers={suppliers}
        inventoryItems={inventoryItems}
        onSubmit={handleCreatePO}
        onCancel={handleBack}
        loading={isCreating}
      />
    )
  }

  if (expandedView === 'edit-po' && editingPO) {
    return (
      <PurchaseOrderUpdateForm
        purchaseOrder={editingPO}
        onSubmit={(updateData) => handleUpdatePO(editingPO.id, updateData)}
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
              Purchase Orders
            </h1>
            <p className={`${textSecondary} transition-colors duration-300`}>
              Manage purchase orders and track deliveries
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
                placeholder="Search purchase orders..."
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
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="confirmed">Confirmed</option>
              <option value="received">Received</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <button
            onClick={() => setExpandedView('create-po')}
            className={`${isDark ? 'bg-white hover:bg-gray-100 text-gray-900' : 'bg-gray-900 hover:bg-gray-800 text-white'} px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2`}
          >
            <Plus className="h-4 w-4" />
            Create PO
          </button>
        </div>
      </div>

      {/* Purchase Orders Table */}
      <div className={`${cardBg} border transition-colors duration-300 overflow-hidden`} style={{ borderTopLeftRadius: "1.5rem", borderTopRightRadius: "1.5rem" }}>
        {/* Fixed Table Header */}
        <div className={`${isDark ? "bg-[#171717]" : "bg-white"} sticky top-0 z-10`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`${isDark ? "border-b border-[#2a2a2a]" : "border-b border-gray-200"}`}>
                  <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                    Order Number
                  </th>
                  <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                    Supplier
                  </th>
                  <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                    Order Date
                  </th>
                  <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                    Expected Delivery
                  </th>
                  <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                    Items Count
                  </th>
                  <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                    Total Amount
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
              {filteredPOs.map((po) => (
                <tr 
                  key={po.id}
                  className={`${isDark ? "border-b border-[#2a2a2a] hover:bg-[#1f1f1f]" : "border-b border-gray-200 hover:bg-gray-50"} transition-colors duration-200`}
                >
                  {/* Order Number */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-full flex items-center justify-center`}>
                        <Package className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <div className={`${textPrimary} font-semibold text-sm`}>{po.order_number}</div>
                        <div className={`${textSecondary} text-xs`}>
                          {po.notes ? po.notes.substring(0, 30) + '...' : 'No notes'}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Supplier */}
                  <td className="py-4 px-6">
                    <div>
                      <div className={`${textPrimary} font-semibold text-sm`}>
                        {po.supplier_name || 'Unknown Supplier'}
                      </div>
                      {po.supplier_email && (
                        <div className={`${textSecondary} text-xs`}>
                          {po.supplier_email}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  {/* Order Date */}
                  <td className="py-4 px-6">
                    <div>
                      <div className={`${textPrimary} text-sm font-medium`}>
                        {new Date(po.order_date).toLocaleDateString()}
                      </div>
                      <div className={`${textSecondary} text-xs`}>
                        {new Date(po.order_date).toLocaleTimeString()}
                      </div>
                    </div>
                  </td>
                  
                  {/* Expected Delivery */}
                  <td className="py-4 px-6">
                    <div className={`${textPrimary} text-sm`}>
                      {po.expected_delivery_date 
                        ? new Date(po.expected_delivery_date).toLocaleDateString()
                        : 'Not set'
                      }
                    </div>
                  </td>
                  
                  {/* Items Count */}
                  <td className="py-4 px-6">
                    <div className={`${textPrimary} text-sm font-medium`}>
                      {po.items.length} items
                    </div>
                  </td>
                  
                  {/* Total Amount */}
                  <td className="py-4 px-6">
                    <div className={`${textPrimary} text-sm font-medium`}>
                      ${parseFloat(po.total_amount).toFixed(2)}
                    </div>
                  </td>
                  
                  {/* Status */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        po.status === 'received' ? 'bg-green-500' : 
                        po.status === 'confirmed' ? 'bg-blue-500' : 
                        po.status === 'cancelled' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}></div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(po.status)}`}
                      >
                        {getStatusIcon(po.status)}
                        {po.status.charAt(0).toUpperCase() + po.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  
                  {/* Actions */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditPO(po.id)}
                        className={`${textSecondary} hover:text-blue-400 p-1 transition-colors duration-300`}
                        title="Edit Purchase Order"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setSelectedPO(po)}
                        className={`${textSecondary} hover:text-blue-400 p-1 transition-colors duration-300`}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {po.status === 'confirmed' && (
                        <button
                          onClick={() => handleReceivePO(po.id)}
                          disabled={isReceiving === po.id}
                          className={`text-green-500 hover:text-green-600 p-1 transition-colors duration-300 disabled:opacity-50`}
                          title="Receive Order"
                        >
                          {isReceiving === po.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Empty State */}
        {filteredPOs.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className={`text-lg font-medium ${textPrimary} mb-2`}>No Purchase Orders</h3>
            <p className={`${textSecondary} mb-4`}>Create your first purchase order to get started</p>
            <button
              onClick={() => setExpandedView('create-po')}
              className={`${isDark ? 'bg-white hover:bg-gray-100 text-gray-900' : 'bg-gray-900 hover:bg-gray-800 text-white'} px-6 py-3 rounded-lg font-medium transition-all duration-300`}
            >
              Create Purchase Order
            </button>
          </div>
        )}
      </div>


      {/* PO Details Modal */}
      {selectedPO && (
        <PurchaseOrderDetailsModal
          purchaseOrder={selectedPO}
          inventoryItems={inventoryItems}
          onClose={() => setSelectedPO(null)}
        />
      )}
    </div>
  )
}

