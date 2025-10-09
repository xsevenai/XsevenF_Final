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
  const [showAdjustForm, setShowAdjustForm] = useState(false)
  const [showCountForm, setShowCountForm] = useState(false)
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

  const handleStockAdjustment = async (adjustment: StockAdjustment) => {
    setIsProcessing(true)
    try {
      await onAdjustStock(adjustment)
      setShowAdjustForm(false)
      onRefresh()
    } catch (error) {
      console.error('Failed to adjust stock:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleStockCount = async (counts: any[]) => {
    setIsProcessing(true)
    try {
      const businessId = typeof window !== "undefined" ? localStorage.getItem("businessId") || "" : ""
      await onPerformStockCount(businessId, undefined, counts)
      setShowCountForm(false)
      onRefresh()
    } catch (error) {
      console.error('Failed to perform stock count:', error)
    } finally {
      setIsProcessing(false)
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
              onClick={() => setShowAdjustForm(true)}
              className={`${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535]' : 'bg-gray-200 hover:bg-gray-300'} ${textPrimary} px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2`}
            >
              <Edit className="h-4 w-4" />
              Adjust Stock
            </button>
            <button
              onClick={() => setShowCountForm(true)}
              className={`${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535]' : 'bg-gray-200 hover:bg-gray-300'} ${textPrimary} px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2`}
            >
              <Scale className="h-4 w-4" />
              Stock Count
            </button>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className={`${cardBg} p-6 border shadow-lg transition-colors duration-300`} style={{ borderRadius: "1.5rem" }}>
        <div className="space-y-4">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className={`text-lg font-medium ${textPrimary} mb-2`}>No Transactions</h3>
              <p className={`${textSecondary}`}>Stock adjustments and counts will appear here</p>
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className={`${isDark ? 'bg-[#1f1f1f]' : 'bg-gray-50'} p-6 border rounded-xl transition-all duration-300 hover:shadow-lg`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className={`${textPrimary} font-semibold text-lg`}>
                        {transaction.inventory_item_id}
                      </h3>
                      <p className={`${textSecondary} text-sm`}>
                        {transaction.reason || 'No reason provided'}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getTransactionTypeColor(transaction.transaction_type)}`}>
                      {getTransactionIcon(transaction.transaction_type)}
                      {transaction.transaction_type.charAt(0).toUpperCase() + transaction.transaction_type.slice(1)}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className={`${textPrimary} font-bold text-lg`}>
                        {transaction.quantity_change > 0 ? '+' : ''}{transaction.quantity_change}
                      </div>
                      <div className={`${textSecondary} text-sm`}>
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedTransaction(transaction)}
                      className={`${textSecondary} hover:text-blue-400 p-2 transition-colors duration-300`}
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {transaction.notes && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className={`${textSecondary} text-sm`}>{transaction.notes}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Stock Adjustment Form Modal */}
      {showAdjustForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${cardBg} p-6 rounded-xl border shadow-xl max-w-md w-full mx-4`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-xl font-bold ${textPrimary}`}>Adjust Stock</h3>
              <button
                onClick={() => setShowAdjustForm(false)}
                className={`${textSecondary} hover:text-red-400 p-1 transition-colors duration-300`}
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className={`block ${textPrimary} font-medium mb-2`}>Item ID</label>
                <input
                  type="text"
                  placeholder="Enter item ID"
                  className={`w-full px-3 py-2 ${inputBg} ${textPrimary} rounded-lg border focus:border-blue-500 focus:outline-none transition-all duration-200`}
                />
              </div>
              <div>
                <label className={`block ${textPrimary} font-medium mb-2`}>New Quantity</label>
                <input
                  type="number"
                  placeholder="Enter new quantity"
                  className={`w-full px-3 py-2 ${inputBg} ${textPrimary} rounded-lg border focus:border-blue-500 focus:outline-none transition-all duration-200`}
                />
              </div>
              <div>
                <label className={`block ${textPrimary} font-medium mb-2`}>Reason</label>
                <input
                  type="text"
                  placeholder="Enter reason for adjustment"
                  className={`w-full px-3 py-2 ${inputBg} ${textPrimary} rounded-lg border focus:border-blue-500 focus:outline-none transition-all duration-200`}
                />
              </div>
              <div>
                <label className={`block ${textPrimary} font-medium mb-2`}>Notes (Optional)</label>
                <textarea
                  placeholder="Additional notes"
                  rows={3}
                  className={`w-full px-3 py-2 ${inputBg} ${textPrimary} rounded-lg border focus:border-blue-500 focus:outline-none transition-all duration-200`}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAdjustForm(false)}
                  className={`flex-1 ${isDark ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-300 hover:bg-gray-400'} text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300`}
                >
                  Cancel
                </button>
                <button
                  disabled={isProcessing}
                  className={`flex-1 ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300 disabled:opacity-50`}
                >
                  {isProcessing ? 'Processing...' : 'Adjust Stock'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stock Count Form Modal */}
      {showCountForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${cardBg} p-6 rounded-xl border shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-xl font-bold ${textPrimary}`}>Perform Stock Count</h3>
              <button
                onClick={() => setShowCountForm(false)}
                className={`${textSecondary} hover:text-red-400 p-1 transition-colors duration-300`}
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <p className={`${textSecondary} text-sm`}>
                Stock count form will be implemented here. This will allow you to count multiple items at once.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCountForm(false)}
                  className={`flex-1 ${isDark ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-300 hover:bg-gray-400'} text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300`}
                >
                  Cancel
                </button>
                <button
                  disabled={isProcessing}
                  className={`flex-1 ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300 disabled:opacity-50`}
                >
                  {isProcessing ? 'Processing...' : 'Perform Count'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${cardBg} p-6 rounded-xl border shadow-xl max-w-2xl w-full mx-4`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-xl font-bold ${textPrimary}`}>Transaction Details</h3>
              <button
                onClick={() => setSelectedTransaction(null)}
                className={`${textSecondary} hover:text-red-400 p-1 transition-colors duration-300`}
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className={`${textSecondary} text-sm`}>Item ID:</span>
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
