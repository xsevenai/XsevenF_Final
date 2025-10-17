// app/dashboard/inventory-management/components/PurchaseOrderManagement.tsx

"use client"

import React, { useState } from 'react'
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Package,
  Calendar,
  DollarSign,
  Loader2
} from "lucide-react"
import { useTheme } from "@/hooks/useTheme"
import type { PurchaseOrder } from '@/src/api/generated/models/PurchaseOrder'
import type { PurchaseOrderCreate } from '@/src/api/generated/models/PurchaseOrderCreate'
import type { PurchaseOrderUpdate } from '@/src/api/generated/models/PurchaseOrderUpdate'
import type { Supplier } from '@/src/api/generated/models/Supplier'

interface PurchaseOrderManagementProps {
  purchaseOrders: PurchaseOrder[]
  suppliers: Supplier[]
  inventoryItems: any[]
  loading: boolean
  error: string | null
  onRefresh: () => void
  onCreatePurchaseOrder: (data: PurchaseOrderCreate, createdBy?: string) => Promise<PurchaseOrder>
  onUpdatePurchaseOrder: (poId: string, data: PurchaseOrderUpdate) => Promise<PurchaseOrder>
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
  onCreatePurchaseOrder,
  onUpdatePurchaseOrder,
  onReceivePurchaseOrder,
  onBack
}: PurchaseOrderManagementProps) {
  const { isDark } = useTheme()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState<string | null>(null)
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null)
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

  const handleCreatePO = async (poData: PurchaseOrderCreate) => {
    try {
      setIsCreating(true)
      console.log('Creating purchase order with data:', poData)
      
      // Don't pass createdBy if it's empty to avoid validation errors
      const createdBy = typeof window !== "undefined" ? localStorage.getItem("businessId") : null
      console.log('Created by:', createdBy)
      
      if (createdBy) {
        await onCreatePurchaseOrder(poData, createdBy)
      } else {
        await onCreatePurchaseOrder(poData)
      }
      
      setShowCreateForm(false)
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
      await onUpdatePurchaseOrder(poId, updateData)
      setShowEditForm(null)
      onRefresh()
    } catch (error) {
      console.error('Failed to update purchase order:', error)
      alert('Failed to update purchase order')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleEditPO = (poId: string) => {
    setShowEditForm(poId)
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
            onClick={() => setShowCreateForm(true)}
            className={`${isDark ? 'bg-white hover:bg-gray-100 text-gray-900' : 'bg-gray-900 hover:bg-gray-800 text-white'} px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2`}
          >
            <Plus className="h-4 w-4" />
            Create PO
          </button>
        </div>
      </div>

      {/* Purchase Orders Table */}
      <div className={`${cardBg} border transition-colors duration-300 overflow-hidden`} style={{ borderTopLeftRadius: "1.5rem", borderTopRightRadius: "1.5rem" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Table Header */}
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
            
            {/* Table Body */}
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
                    <div className={`${textPrimary} text-sm`}>
                      {suppliers.find(s => s.id === po.supplier_id)?.name || 'Unknown Supplier'}
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
              onClick={() => setShowCreateForm(true)}
              className={`${isDark ? 'bg-white hover:bg-gray-100 text-gray-900' : 'bg-gray-900 hover:bg-gray-800 text-white'} px-6 py-3 rounded-lg font-medium transition-all duration-300`}
            >
              Create Purchase Order
            </button>
          </div>
        )}
      </div>

      {/* Create PO Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${cardBg} p-6 rounded-xl border shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-xl font-bold ${textPrimary}`}>Create Purchase Order</h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className={`${isDark ? 'text-white hover:text-red-400' : 'text-gray-600 hover:text-red-400'} p-1 transition-colors duration-300`}
              >
                ×
              </button>
            </div>
            
            <PurchaseOrderForm
              suppliers={suppliers}
              inventoryItems={inventoryItems}
              onSubmit={handleCreatePO}
              onCancel={() => setShowCreateForm(false)}
              loading={isCreating}
            />
          </div>
        </div>
      )}

      {/* Edit PO Form Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${cardBg} p-6 rounded-xl border shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-xl font-bold ${textPrimary}`}>Edit Purchase Order</h3>
              <button
                onClick={() => setShowEditForm(null)}
                className={`${isDark ? 'text-white hover:text-red-400' : 'text-gray-600 hover:text-red-400'} p-1 transition-colors duration-300`}
              >
                ×
              </button>
            </div>
            
            <PurchaseOrderUpdateForm
              purchaseOrder={purchaseOrders.find(po => po.id === showEditForm)}
              onSubmit={(updateData) => handleUpdatePO(showEditForm, updateData)}
              onCancel={() => setShowEditForm(null)}
              loading={isUpdating}
            />
          </div>
        </div>
      )}

      {/* PO Details Modal */}
      {selectedPO && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${cardBg} p-6 rounded-xl border shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-xl font-bold ${textPrimary}`}>Purchase Order Details</h3>
              <button
                onClick={() => setSelectedPO(null)}
                className={`${isDark ? 'text-white hover:text-red-400' : 'text-gray-600 hover:text-red-400'} p-1 transition-colors duration-300`}
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className={`${textSecondary} text-sm`}>Order Number:</span>
                  <p className={`${textPrimary} font-medium`}>{selectedPO.order_number}</p>
                </div>
                <div>
                  <span className={`${textSecondary} text-sm`}>Status:</span>
                  <p className={`${textPrimary} font-medium`}>{selectedPO.status}</p>
                </div>
                <div>
                  <span className={`${textSecondary} text-sm`}>Total Amount:</span>
                  <p className={`${textPrimary} font-medium`}>${parseFloat(selectedPO.total_amount).toFixed(2)}</p>
                </div>
                <div>
                  <span className={`${textSecondary} text-sm`}>Order Date:</span>
                  <p className={`${textPrimary} font-medium`}>
                    {new Date(selectedPO.order_date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div>
                <h4 className={`${textPrimary} font-semibold mb-2`}>Items</h4>
                <div className="space-y-3">
                  {selectedPO.items.map((item, index) => {
                    const inventoryItem = inventoryItems.find(inv => inv.id === item.inventory_item_id)
                    const itemName = inventoryItem ? `${inventoryItem.name} (${inventoryItem.category})` : `Item: ${item.inventory_item_id}`
                    
                    return (
                      <div key={index} className={`${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-100'} p-4 rounded-lg`}>
                        <div className="space-y-2">
                          <h5 className={`${textPrimary} font-medium`}>
                            {itemName}
                          </h5>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className={`${textSecondary}`}>Quantity:</span>
                              <span className={`${textPrimary}`}>{item.quantity}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className={`${textSecondary}`}>Unit Cost:</span>
                              <span className={`${textPrimary}`}>${parseFloat(item.unit_cost).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm font-medium">
                              <span className={`${textSecondary}`}>Total:</span>
                              <span className={`${textPrimary}`}>${(Number(item.unit_cost) * Number(item.quantity)).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Purchase Order Form Component
interface PurchaseOrderFormProps {
  suppliers: Supplier[]
  inventoryItems: any[]
  onSubmit: (poData: PurchaseOrderCreate) => Promise<void>
  onCancel: () => void
  loading: boolean
}

function PurchaseOrderForm({ suppliers, inventoryItems, onSubmit, onCancel, loading }: PurchaseOrderFormProps) {
  const [formData, setFormData] = useState<PurchaseOrderCreate>({
    supplier_id: '',
    order_date: new Date().toISOString(),
    expected_delivery_date: null,
    items: [],
    notes: null,
    business_id: typeof window !== "undefined" ? localStorage.getItem("businessId") || "" : ""
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

  return (
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
          {loading ? 'Creating...' : 'Create Purchase Order'}
        </button>
      </div>
    </form>
  )
}

// Purchase Order Update Form Component
interface PurchaseOrderUpdateFormProps {
  purchaseOrder: PurchaseOrder | undefined
  onSubmit: (updateData: PurchaseOrderUpdate) => Promise<void>
  onCancel: () => void
  loading: boolean
}

function PurchaseOrderUpdateForm({ purchaseOrder, onSubmit, onCancel, loading }: PurchaseOrderUpdateFormProps) {
  const [formData, setFormData] = useState<PurchaseOrderUpdate>({
    status: purchaseOrder?.status || null,
    expected_delivery_date: purchaseOrder?.expected_delivery_date || null,
    actual_delivery_date: purchaseOrder?.actual_delivery_date || null,
    notes: purchaseOrder?.notes || null
  })
  const { isDark } = useTheme()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const cardBg = isDark ? "bg-[#171717] border-[#2a2a2a]" : "bg-white border-gray-200"
  const textPrimary = isDark ? "text-white" : "text-gray-900"
  const textSecondary = isDark ? "text-gray-400" : "text-gray-600"
  const inputBg = isDark ? "bg-[#2a2a2a] border-[#3a3a3a]" : "bg-gray-50 border-gray-300"

  if (!purchaseOrder) {
    return <div>Purchase order not found</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${textPrimary}`}>
            Status
          </label>
          <select
            value={formData.status || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
            className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
          >
            <option value="">Select status...</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="confirmed">Confirmed</option>
            <option value="received">Received</option>
            <option value="cancelled">Cancelled</option>
          </select>
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

        <div>
          <label className={`block text-sm font-medium mb-2 ${textPrimary}`}>
            Actual Delivery Date
          </label>
          <input
            type="date"
            value={formData.actual_delivery_date ? new Date(formData.actual_delivery_date).toISOString().split('T')[0] : ''}
            onChange={(e) => setFormData(prev => ({ ...prev, actual_delivery_date: e.target.value ? new Date(e.target.value).toISOString() : null }))}
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
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value || null }))}
          className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
          rows={3}
          placeholder="Update notes..."
        />
      </div>

      {/* Current Purchase Order Info */}
      <div className={`${cardBg} p-4 border rounded-lg`}>
        <h4 className={`text-lg font-semibold ${textPrimary} mb-3`}>Current Purchase Order Info</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className={`${textSecondary}`}>Order Number:</span>
            <p className={`${textPrimary} font-medium`}>{purchaseOrder.order_number}</p>
          </div>
          <div>
            <span className={`${textSecondary}`}>Total Amount:</span>
            <p className={`${textPrimary} font-medium`}>${parseFloat(purchaseOrder.total_amount).toFixed(2)}</p>
          </div>
          <div>
            <span className={`${textSecondary}`}>Order Date:</span>
            <p className={`${textPrimary} font-medium`}>
              {new Date(purchaseOrder.order_date).toLocaleDateString()}
            </p>
          </div>
          <div>
            <span className={`${textSecondary}`}>Items Count:</span>
            <p className={`${textPrimary} font-medium`}>{purchaseOrder.items.length} items</p>
          </div>
        </div>
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
          {loading ? 'Updating...' : 'Update Purchase Order'}
        </button>
      </div>
    </form>
  )
}
