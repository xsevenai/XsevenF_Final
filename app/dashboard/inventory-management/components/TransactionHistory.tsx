// app/dashboard/inventory-management/components/TransactionHistory.tsx

"use client"

import React, { useState, useEffect } from 'react'
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Calendar,
  Package,
  TrendingUp,
  TrendingDown,
  Loader2,
  RefreshCw
} from "lucide-react"
import { useTheme } from "@/hooks/useTheme"
import type { InventoryTransaction } from '@/src/api/generated/models/InventoryTransaction'

interface TransactionHistoryProps {
  transactions: InventoryTransaction[]
  loading: boolean
  error: string | null
  onRefresh: () => void
  onBack: () => void
}

export default function TransactionHistory({
  transactions,
  loading,
  error,
  onRefresh,
  onBack
}: TransactionHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterDateRange, setFilterDateRange] = useState('all')
  const [selectedTransaction, setSelectedTransaction] = useState<InventoryTransaction | null>(null)
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

  const transactionTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'adjustment', label: 'Adjustments' },
    { value: 'count', label: 'Stock Counts' },
    { value: 'receipt', label: 'Receipts' },
    { value: 'issue', label: 'Issues' },
    { value: 'transfer', label: 'Transfers' }
  ]

  const dateRanges = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' }
  ]

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.inventory_item_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.notes?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = filterType === 'all' || transaction.transaction_type === filterType
    
    const matchesDate = (() => {
      if (filterDateRange === 'all') return true
      
      const now = new Date()
      const transactionDate = new Date(transaction.created_at)
      
      switch (filterDateRange) {
        case 'today':
          return transactionDate.toDateString() === now.toDateString()
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          return transactionDate >= weekAgo
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          return transactionDate >= monthAgo
        case 'quarter':
          const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
          return transactionDate >= quarterAgo
        default:
          return true
      }
    })()
    
    return matchesSearch && matchesType && matchesDate
  })

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'adjustment': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
      case 'count': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
      case 'receipt': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      case 'issue': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      case 'transfer': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'adjustment': return <Package className="h-4 w-4" />
      case 'count': return <Package className="h-4 w-4" />
      case 'receipt': return <TrendingUp className="h-4 w-4" />
      case 'issue': return <TrendingDown className="h-4 w-4" />
      case 'transfer': return <Package className="h-4 w-4" />
      default: return <Package className="h-4 w-4" />
    }
  }

  const getQuantityChangeColor = (change: number) => {
    if (change > 0) return 'text-green-500'
    if (change < 0) return 'text-red-500'
    return textPrimary
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={`flex items-center gap-3 ${textSecondary}`}>
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading transaction history...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className={`text-lg font-medium ${textPrimary} mb-2`}>Error Loading Transactions</h3>
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
            <h1 className={`text-4xl font-bold ${textPrimary} mb-2`}>Transaction History</h1>
            <p className={`${textSecondary}`}>View all inventory transactions and movements</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={`${cardBg} border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${textSecondary}`} />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 ${inputBg} ${textPrimary} border rounded-xl placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-all duration-200`}
              />
            </div>
            
            <div className="flex gap-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className={`px-4 py-3 ${inputBg} ${textPrimary} border rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200`}
              >
                {transactionTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              
              <select
                value={filterDateRange}
                onChange={(e) => setFilterDateRange(e.target.value)}
                className={`px-4 py-3 ${inputBg} ${textPrimary} border rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200`}
              >
                {dateRanges.map(range => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
              
              <button
                onClick={onRefresh}
                className={`p-3 ${textSecondary} ${buttonHoverBg} border rounded-xl transition-all duration-200 hover:scale-110`}
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`${cardBg} border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`} style={{ borderRadius: '2.5rem' }}>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-blue-500 font-semibold mb-2">Total Transactions</h3>
                <div className={`text-2xl font-bold ${textPrimary}`}>{filteredTransactions.length}</div>
                <p className={`${textSecondary} text-sm mt-1`}>Filtered results</p>
              </div>
              <div className={`p-3 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-2xl`}>
                <Package className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </div>
        </div>
        
        <div className={`${cardBg} border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`} style={{ borderRadius: '1.5rem' }}>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-green-500 font-semibold mb-2">Receipts</h3>
                <div className={`text-2xl font-bold ${textPrimary}`}>
                  {filteredTransactions.filter(t => t.transaction_type === 'receipt').length}
                </div>
                <p className={`${textSecondary} text-sm mt-1`}>Stock increases</p>
              </div>
              <div className={`p-3 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-2xl`}>
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </div>
        </div>
        
        <div className={`${cardBg} border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`} style={{ borderRadius: '1rem' }}>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-red-500 font-semibold mb-2">Issues</h3>
                <div className={`text-2xl font-bold ${textPrimary}`}>
                  {filteredTransactions.filter(t => t.transaction_type === 'issue').length}
                </div>
                <p className={`${textSecondary} text-sm mt-1`}>Stock decreases</p>
              </div>
              <div className={`p-3 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-2xl`}>
                <TrendingDown className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </div>
        </div>
        
        <div className={`${cardBg} border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`} style={{ borderRadius: '2rem' }}>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-purple-500 font-semibold mb-2">Adjustments</h3>
                <div className={`text-2xl font-bold ${textPrimary}`}>
                  {filteredTransactions.filter(t => t.transaction_type === 'adjustment').length}
                </div>
                <p className={`${textSecondary} text-sm mt-1`}>Manual changes</p>
              </div>
              <div className={`p-3 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-2xl`}>
                <Package className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className={`${cardBg} border transition-colors duration-300 overflow-hidden`} style={{ borderTopLeftRadius: "1.5rem", borderTopRightRadius: "1.5rem" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Table Header */}
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
            
            {/* Table Body */}
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
                    <div className={`${textPrimary} text-sm font-medium ${getQuantityChangeColor(transaction.quantity_change)}`}>
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
            <h3 className={`text-lg font-medium ${textPrimary} mb-2`}>No Transactions Found</h3>
            <p className={`${textSecondary} mb-4`}>
              {searchTerm || filterType !== 'all' || filterDateRange !== 'all'
                ? 'Try adjusting your search or filters'
                : 'No transactions available'
              }
            </p>
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
