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
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null)
  const [isReceiving, setIsReceiving] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

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
            className={`${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535]' : 'bg-gray-200 hover:bg-gray-300'} ${textPrimary} px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2`}
          >
            <Plus className="h-4 w-4" />
            Create PO
          </button>
        </div>
      </div>

      {/* Purchase Orders List */}
      <div className={`${cardBg} p-6 border shadow-lg transition-colors duration-300`} style={{ borderRadius: "1.5rem" }}>
        <div className="space-y-4">
          {filteredPOs.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className={`text-lg font-medium ${textPrimary} mb-2`}>No Purchase Orders</h3>
              <p className={`${textSecondary}`}>Create your first purchase order to get started</p>
            </div>
          ) : (
            filteredPOs.map((po) => (
              <div
                key={po.id}
                className={`${isDark ? 'bg-[#1f1f1f]' : 'bg-gray-50'} p-6 border rounded-xl transition-all duration-300 hover:shadow-lg`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className={`${textPrimary} font-semibold text-lg`}>{po.order_number}</h3>
                      <p className={`${textSecondary} text-sm`}>
                        Supplier: {suppliers.find(s => s.id === po.supplier_id)?.name || 'Unknown'}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(po.status)}`}>
                      {getStatusIcon(po.status)}
                      {po.status.charAt(0).toUpperCase() + po.status.slice(1)}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`${textPrimary} font-bold text-lg`}>
                      ${parseFloat(po.total_amount).toFixed(2)}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setSelectedPO(po)}
                        className={`${textSecondary} hover:text-blue-400 p-2 transition-colors duration-300`}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {po.status === 'confirmed' && (
                        <button
                          onClick={() => handleReceivePO(po.id)}
                          disabled={isReceiving === po.id}
                          className={`${textSecondary} hover:text-green-400 p-2 transition-colors duration-300 disabled:opacity-50`}
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
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className={`${textSecondary}`}>Order Date:</span>
                    <span className={`${textPrimary} ml-2`}>
                      {new Date(po.order_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className={`${textSecondary}`}>Expected Delivery:</span>
                    <span className={`${textPrimary} ml-2`}>
                      {po.expected_delivery_date 
                        ? new Date(po.expected_delivery_date).toLocaleDateString()
                        : 'Not set'
                      }
                    </span>
                  </div>
                  <div>
                    <span className={`${textSecondary}`}>Items:</span>
                    <span className={`${textPrimary} ml-2`}>{po.items.length}</span>
                  </div>
                </div>

                {po.notes && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className={`${textSecondary} text-sm`}>{po.notes}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create PO Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${cardBg} p-6 rounded-xl border shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-xl font-bold ${textPrimary}`}>Create Purchase Order</h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className={`${textSecondary} hover:text-red-400 p-1 transition-colors duration-300`}
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

      {/* PO Details Modal */}
      {selectedPO && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${cardBg} p-6 rounded-xl border shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-xl font-bold ${textPrimary}`}>Purchase Order Details</h3>
              <button
                onClick={() => setSelectedPO(null)}
                className={`${textSecondary} hover:text-red-400 p-1 transition-colors duration-300`}
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
                <div className="space-y-2">
                  {selectedPO.items.map((item, index) => {
                    const inventoryItem = inventoryItems.find(inv => inv.id === item.inventory_item_id)
                    const itemName = inventoryItem ? `${inventoryItem.name} (${inventoryItem.category})` : `Item ID: ${item.inventory_item_id}`
                    
                    return (
                      <div key={index} className={`${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-100'} p-3 rounded-lg`}>
                        <div className="flex justify-between items-center">
                          <span className={`${textPrimary} font-medium`}>
                            {itemName}
                          </span>
                          <span className={`${textPrimary}`}>
                            {item.quantity} × ${parseFloat(item.unit_cost).toFixed(2)}
                          </span>
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
                  placeholder="Enter item ID manually..."
                />
              )}
              {inventoryItems.length === 0 && (
                <p className={`text-xs mt-1 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                  ⚠️ Inventory items could not be loaded. Please enter item ID manually.
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
              const itemName = inventoryItem ? `${inventoryItem.name} (${inventoryItem.category})` : `Item ID: ${item.inventory_item_id}`
              
              return (
                <div key={index} className={`${cardBg} p-3 border rounded-lg flex justify-between items-center`}>
                  <div>
                    <span className={`${textPrimary} font-medium`}>{itemName}</span>
                    <span className={`${textSecondary} ml-2`}>
                      {item.quantity} × ${item.unit_cost.toFixed(2)} = ${(item.quantity * item.unit_cost).toFixed(2)}
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
          className={`px-6 py-2 ${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535]' : 'bg-gray-200 hover:bg-gray-300'} ${textPrimary} border rounded-lg font-medium transition-all duration-200`}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-2 ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 flex items-center gap-2`}
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? 'Creating...' : 'Create Purchase Order'}
        </button>
      </div>
    </form>
  )
}
