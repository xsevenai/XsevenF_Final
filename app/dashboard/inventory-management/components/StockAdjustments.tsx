// app/dashboard/inventory-management/components/StockAdjustments.tsx

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
  Loader2,
  Scale,
  TrendingUp,
  TrendingDown
} from "lucide-react"
import { useTheme } from "@/hooks/useTheme"
import type { InventoryTransaction, StockAdjustment } from '@/src/api/generated/models/InventoryTransaction'

interface StockAdjustmentsProps {
  transactions: InventoryTransaction[]
  loading: boolean
  error: string | null
  onRefresh: () => void
  onAdjustStock: (adjustment: StockAdjustment, performedBy?: string) => Promise<any>
  onPerformStockCount: (businessId: string, locationId?: string, counts?: any[]) => Promise<any>
  onBack: () => void
}

export default function StockAdjustments({
  transactions,
  loading,
  error,
  onRefresh,
  onAdjustStock,
  onPerformStockCount,
  onBack
}: StockAdjustmentsProps) {
  const { isDark } = useTheme()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [expandedView, setExpandedView] = useState<'adjust-stock' | 'stock-count' | null>(null)
  const [selectedTransaction, setSelectedTransaction] = useState<InventoryTransaction | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Theme-aware styles
  const cardBg = isDark ? "bg-[#171717] border-[#2a2a2a]" : "bg-white border-gray-200"
  const textPrimary = isDark ? "text-white" : "text-gray-900"
  const textSecondary = isDark ? "text-gray-400" : "text-gray-600"
  const inputBg = isDark ? "bg-[#1f1f1f] border-[#2a2a2a]" : "bg-gray-50 border-gray-200"
  const buttonHoverBg = isDark ? "hover:bg-[#2a2a2a]" : "hover:bg-gray-100"

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.inventory_item_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reason?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || transaction.transaction_type === filterType
    return matchesSearch && matchesType
  })

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'adjustment': return 'bg-blue-100 text-blue-800'
      case 'count': return 'bg-purple-100 text-purple-800'
      case 'receipt': return 'bg-green-100 text-green-800'
      case 'issue': return 'bg-red-100 text-red-800'
      case 'transfer': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'adjustment': return <Edit className="h-4 w-4" />
      case 'count': return <Scale className="h-4 w-4" />
      case 'receipt': return <TrendingUp className="h-4 w-4" />
      case 'issue': return <TrendingDown className="h-4 w-4" />
      case 'transfer': return <Package className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const handleBack = () => {
    setExpandedView(null)
  }

  const handleStockAdjustment = async (adjustment: StockAdjustment) => {
    setIsProcessing(true)
    try {
      await onAdjustStock(adjustment)
      setExpandedView(null)
      onRefresh()
    } catch (error) {
      console.error('Failed to adjust stock:', error)
      alert('Failed to adjust stock')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleStockCount = async (businessId: string, locationId?: string, counts?: any[]) => {
    setIsProcessing(true)
    try {
      await onPerformStockCount(businessId, locationId, counts)
      setExpandedView(null)
      onRefresh()
    } catch (error) {
      console.error('Failed to perform stock count:', error)
      alert('Failed to perform stock count')
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle expanded view rendering (like PurchaseOrderManagement does)
  if (expandedView === 'adjust-stock') {
    return (
      <StockAdjustmentForm
        onSubmit={handleStockAdjustment}
        onCancel={handleBack}
        loading={isProcessing}
      />
    )
  }

  if (expandedView === 'stock-count') {
    return (
      <StockCountForm
        onSubmit={(businessId, locationId, counts) => handleStockCount(businessId, locationId, counts)}
        onCancel={handleBack}
        loading={isProcessing}
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
              Stock Adjustments
            </h1>
            <p className={`${textSecondary} transition-colors duration-300`}>
              Adjust stock levels and perform physical counts
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
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 ${inputBg} ${textPrimary} rounded-lg border focus:border-blue-500 focus:outline-none transition-all duration-200`}
              />
            </div>

            {/* Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className={`px-4 py-2 ${inputBg} ${textPrimary} rounded-lg border focus:border-blue-500 focus:outline-none transition-all duration-200`}
            >
              <option value="all">All Types</option>
              <option value="adjustment">Adjustments</option>
              <option value="count">Stock Counts</option>
              <option value="receipt">Receipts</option>
              <option value="issue">Issues</option>
              <option value="transfer">Transfers</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setExpandedView('adjust-stock')}
              className={`${isDark ? 'bg-white hover:bg-gray-100 text-gray-900' : 'bg-gray-900 hover:bg-gray-800 text-white'} px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2`}
            >
              <Edit className="h-4 w-4" />
              Adjust Stock
            </button>
            <button
              onClick={() => setExpandedView('stock-count')}
              className={`${isDark ? 'bg-white hover:bg-gray-100 text-gray-900' : 'bg-gray-900 hover:bg-gray-800 text-white'} px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2`}
            >
              <Scale className="h-4 w-4" />
              Stock Count
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className={`${cardBg} border transition-colors duration-300 overflow-hidden`} style={{ borderTopLeftRadius: "1.5rem", borderTopRightRadius: "1.5rem" }}>
        {/* Fixed Table Header */}
        <div className={`${isDark ? "bg-[#171717]" : "bg-white"} sticky top-0 z-10`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
              <tr className={`${isDark ? "border-b border-[#2a2a2a]" : "border-b border-gray-200"}`}>
                <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                  Transaction ID
                </th>
                <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                  Item
                </th>
                <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                  Type
                </th>
                <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                  Quantity Change
                </th>
                <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                  Reason
                </th>
                <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                  Date
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
              {filteredTransactions.map((transaction) => (
                <tr 
                  key={transaction.id}
                  className={`${isDark ? "border-b border-[#2a2a2a] hover:bg-[#1f1f1f]" : "border-b border-gray-200 hover:bg-gray-50"} transition-colors duration-200`}
                >
                  {/* Transaction ID */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-full flex items-center justify-center`}>
                        {getTransactionIcon(transaction.transaction_type)}
                      </div>
                      <div>
                        <div className={`${textPrimary} font-semibold text-sm`}>
                          {transaction.id || `txn_${String(transaction.id).substring(0, 8)}`}
                        </div>
                        <div className={`${textSecondary} text-xs`}>
                          {transaction.notes ? transaction.notes.substring(0, 30) + '...' : 'No notes'}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Item */}
                  <td className="py-4 px-6">
                    <div className={`${textPrimary} text-sm`}>
                      {transaction.inventory_item_id}
                    </div>
                  </td>
                  
                  {/* Type */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        transaction.transaction_type === 'adjustment' ? 'bg-blue-500' : 
                        transaction.transaction_type === 'count' ? 'bg-purple-500' : 
                        transaction.transaction_type === 'receipt' ? 'bg-green-500' : 
                        transaction.transaction_type === 'issue' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}></div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getTransactionTypeColor(transaction.transaction_type)}`}
                      >
                        {transaction.transaction_type.charAt(0).toUpperCase() + transaction.transaction_type.slice(1)}
                      </span>
                    </div>
                  </td>
                  
                  {/* Quantity Change */}
                  <td className="py-4 px-6">
                    <div className={`${textPrimary} text-sm font-medium ${
                      transaction.quantity_change > 0 ? 'text-green-500' : 
                      transaction.quantity_change < 0 ? 'text-red-500' : ''
                    }`}>
                      {transaction.quantity_change > 0 ? '+' : ''}{transaction.quantity_change}
                    </div>
                  </td>
                  
                  {/* Reason */}
                  <td className="py-4 px-6">
                    <div className={`${textSecondary} text-sm`}>
                      {transaction.reason || 'No reason provided'}
                    </div>
                  </td>
                  
                  {/* Date */}
                  <td className="py-4 px-6">
                    <div>
                      <div className={`${textPrimary} text-sm font-medium`}>
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </div>
                      <div className={`${textSecondary} text-xs`}>
                        {new Date(transaction.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                  </td>
                  
                  {/* Actions */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedTransaction(transaction)}
                        className={`${textSecondary} hover:text-blue-400 p-1 transition-colors duration-300`}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
        
        {/* Empty State */}
        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className={`text-lg font-medium ${textPrimary} mb-2`}>No Transactions</h3>
            <p className={`${textSecondary} mb-4`}>Stock adjustments and counts will appear here</p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setExpandedView('adjust-stock')}
                className={`${isDark ? 'bg-white hover:bg-gray-100 text-gray-900' : 'bg-gray-900 hover:bg-gray-800 text-white'} px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2`}
              >
                <Edit className="h-4 w-4" />
                Adjust Stock
              </button>
              <button
                onClick={() => setExpandedView('stock-count')}
                className={`${isDark ? 'bg-white hover:bg-gray-100 text-gray-900' : 'bg-gray-900 hover:bg-gray-800 text-white'} px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2`}
              >
                <Scale className="h-4 w-4" />
                Stock Count
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${cardBg} p-6 rounded-xl border shadow-xl max-w-2xl w-full mx-4`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-xl font-bold ${textPrimary}`}>Transaction Details</h3>
              <button
                onClick={() => setSelectedTransaction(null)}
                className={`${isDark ? 'text-white hover:text-red-400' : 'text-gray-600 hover:text-red-400'} p-1 transition-colors duration-300`}
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className={`${textSecondary} text-sm`}>Item:</span>
                  <p className={`${textPrimary} font-medium`}>{selectedTransaction.inventory_item_id}</p>
                </div>
                <div>
                  <span className={`${textSecondary} text-sm`}>Type:</span>
                  <p className={`${textPrimary} font-medium`}>{selectedTransaction.transaction_type}</p>
                </div>
                <div>
                  <span className={`${textSecondary} text-sm`}>Quantity Change:</span>
                  <p className={`${textPrimary} font-medium`}>
                    {selectedTransaction.quantity_change > 0 ? '+' : ''}{selectedTransaction.quantity_change}
                  </p>
                </div>
                <div>
                  <span className={`${textSecondary} text-sm`}>Date:</span>
                  <p className={`${textPrimary} font-medium`}>
                    {new Date(selectedTransaction.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              {selectedTransaction.reason && (
                <div>
                  <span className={`${textSecondary} text-sm`}>Reason:</span>
                  <p className={`${textPrimary} font-medium`}>{selectedTransaction.reason}</p>
                </div>
              )}

              {selectedTransaction.notes && (
                <div>
                  <span className={`${textSecondary} text-sm`}>Notes:</span>
                  <p className={`${textPrimary} font-medium`}>{selectedTransaction.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Stock Adjustment Form Component
interface StockAdjustmentFormProps {
  onSubmit: (adjustment: StockAdjustment) => Promise<void>
  onCancel: () => void
  loading: boolean
}

function StockAdjustmentForm({ onSubmit, onCancel, loading }: StockAdjustmentFormProps) {
  const { isDark } = useTheme()
  const [formData, setFormData] = useState({
    item_name: '',
    new_quantity: '',
    reason: '',
    notes: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const adjustment: StockAdjustment = {
      item_name: formData.item_name,
      new_quantity: parseFloat(formData.new_quantity),
      reason: formData.reason,
      notes: formData.notes || undefined,
      business_id: typeof window !== "undefined" ? localStorage.getItem("businessId") || "" : ""
    }
    await onSubmit(adjustment)
  }

  const cardBg = isDark ? "bg-[#171717] border-[#2a2a2a]" : "bg-white border-gray-200"
  const textPrimary = isDark ? "text-white" : "text-gray-900"
  const textSecondary = isDark ? "text-gray-400" : "text-gray-600"
  const inputBg = isDark ? "bg-[#1f1f1f] border-[#2a2a2a]" : "bg-gray-50 border-gray-200"

  return (
    <div className="flex-1 min-h-screen overflow-y-auto transition-colors duration-300 bg-gray-50">
      <div className="p-6 space-y-6">
        <div className="bg-white p-8 border shadow-lg rounded-2xl">
          <div className="flex items-center gap-4">
            <button
              onClick={onCancel}
              className="text-gray-600 hover:bg-gray-100 p-2 rounded-xl transition-all duration-200 hover:scale-110"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Adjust Stock</h1>
              <p className="text-gray-600">Adjust stock levels for inventory items</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 border shadow-lg rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-900 font-medium mb-2">Item Name</label>
              <input
                type="text"
                value={formData.item_name}
                onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
                placeholder="Enter item name"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 text-gray-900 rounded-lg focus:border-blue-500 focus:outline-none transition-all duration-200"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-900 font-medium mb-2">New Quantity</label>
              <input
                type="number"
                value={formData.new_quantity}
                onChange={(e) => setFormData({ ...formData, new_quantity: e.target.value })}
                placeholder="Enter new quantity"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 text-gray-900 rounded-lg focus:border-blue-500 focus:outline-none transition-all duration-200"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-900 font-medium mb-2">Reason</label>
              <input
                type="text"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Enter reason for adjustment"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 text-gray-900 rounded-lg focus:border-blue-500 focus:outline-none transition-all duration-200"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-900 font-medium mb-2">Notes (Optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes"
                rows={3}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 text-gray-900 rounded-lg focus:border-blue-500 focus:outline-none transition-all duration-200 resize-none"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Adjust Stock'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// Stock Count Form Component
interface StockCountFormProps {
  onSubmit: (businessId: string, locationId?: string, counts?: any[]) => Promise<void>
  onCancel: () => void
  loading: boolean
}

function StockCountForm({ onSubmit, onCancel, loading }: StockCountFormProps) {
  const { isDark } = useTheme()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const businessId = typeof window !== "undefined" ? localStorage.getItem("businessId") || "" : ""
    await onSubmit(businessId)
  }

  return (
    <div className="flex-1 min-h-screen overflow-y-auto transition-colors duration-300 bg-gray-50">
      <div className="p-6 space-y-6">
        <div className="bg-white p-8 border shadow-lg rounded-2xl">
          <div className="flex items-center gap-4">
            <button
              onClick={onCancel}
              className="text-gray-600 hover:bg-gray-100 p-2 rounded-xl transition-all duration-200 hover:scale-110"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Perform Stock Count</h1>
              <p className="text-gray-600">Count inventory items to verify stock levels</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 border shadow-lg rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <p className="text-gray-600 text-sm mb-4">
                Stock count form will be implemented here. This will allow you to count multiple items at once.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Perform Count'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
