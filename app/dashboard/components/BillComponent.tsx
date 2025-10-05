"use client"

import { useTheme } from "@/hooks/useTheme"
import { 
  Printer, 
  Download, 
  Eye, 
  RefreshCw, 
  Settings, 
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Calendar,
  DollarSign
} from "lucide-react"
import { useState } from "react"

interface Bill {
  id: string
  tableNumber: string
  customerName?: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  subtotal: number
  tax: number
  total: number
  status: "pending" | "printed" | "failed"
  orderTime: string
  printedAt?: string
  paymentMethod?: string
}

export default function BillComponent() {
  const { isDark } = useTheme()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedBills, setSelectedBills] = useState<string[]>([])

  // Mock data - replace with actual API calls
  const [bills] = useState<Bill[]>([
    {
      id: "B001",
      tableNumber: "Table 5",
      customerName: "John Smith",
      items: [
        { name: "Chicken Burger", quantity: 2, price: 12.99 },
        { name: "French Fries", quantity: 2, price: 4.99 },
        { name: "Coca Cola", quantity: 2, price: 2.99 }
      ],
      subtotal: 41.96,
      tax: 3.36,
      total: 45.32,
      status: "pending",
      orderTime: "2024-01-15 14:30:00",
      paymentMethod: "Credit Card"
    },
    {
      id: "B002",
      tableNumber: "Table 12",
      customerName: "Sarah Johnson",
      items: [
        { name: "Caesar Salad", quantity: 1, price: 8.99 },
        { name: "Grilled Salmon", quantity: 1, price: 18.99 },
        { name: "Wine", quantity: 2, price: 7.99 }
      ],
      subtotal: 43.96,
      tax: 3.52,
      total: 47.48,
      status: "printed",
      orderTime: "2024-01-15 14:15:00",
      printedAt: "2024-01-15 14:45:00",
      paymentMethod: "Cash"
    },
    {
      id: "B003",
      tableNumber: "Table 3",
      customerName: "Mike Wilson",
      items: [
        { name: "Pizza Margherita", quantity: 1, price: 14.99 },
        { name: "Garlic Bread", quantity: 1, price: 3.99 },
        { name: "Beer", quantity: 2, price: 4.99 }
      ],
      subtotal: 28.96,
      tax: 2.32,
      total: 31.28,
      status: "failed",
      orderTime: "2024-01-15 13:45:00",
      paymentMethod: "Credit Card"
    },
    {
      id: "B004",
      tableNumber: "Table 8",
      customerName: "Emma Davis",
      items: [
        { name: "Steak", quantity: 1, price: 24.99 },
        { name: "Mashed Potatoes", quantity: 1, price: 5.99 },
        { name: "Red Wine", quantity: 1, price: 9.99 }
      ],
      subtotal: 40.97,
      tax: 3.28,
      total: 44.25,
      status: "printed",
      orderTime: "2024-01-15 13:30:00",
      printedAt: "2024-01-15 14:10:00",
      paymentMethod: "Credit Card"
    }
  ])

  const [printerStats] = useState({
    online: true,
    paperLevel: 85,
    lastMaintenance: "2024-01-10",
    totalPrintedToday: 47,
    failedPrintsToday: 1
  })

  // Theme-aware colors
  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const innerCardBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'
  const inputBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-white border-gray-300'

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.tableNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || bill.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "printed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-orange-500" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "printed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-orange-100 text-orange-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handlePrintBill = (billId: string) => {
    console.log(`Printing bill ${billId}`)
    // Add print logic here
  }

  const handlePrintAll = () => {
    const pendingBills = bills.filter(bill => bill.status === "pending")
    console.log(`Printing ${pendingBills.length} pending bills`)
    // Add bulk print logic here
  }

  const handleViewBill = (bill: Bill) => {
    console.log(`Viewing bill ${bill.id}`)
    // Add bill preview logic here
  }

  const toggleBillSelection = (billId: string) => {
    setSelectedBills(prev => 
      prev.includes(billId) 
        ? prev.filter(id => id !== billId)
        : [...prev, billId]
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className={`${cardBg} p-8 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-4xl font-bold ${textPrimary} mb-2`}>Bill Management</h1>
            <p className={`${textSecondary}`}>Manage bill printing, receipts, and transaction records</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handlePrintAll}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors"
            >
              <Printer className="h-5 w-5" />
              Print All Pending
            </button>
            <button className={`${innerCardBg} border px-4 py-3 rounded-xl ${textPrimary} hover:scale-105 transition-transform`}>
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Printer Status Dashboard */}
      <div className="grid grid-cols-4 gap-4">
        <div className={`${cardBg} p-6 border shadow-lg hover:shadow-xl transition-all duration-300`}
          style={{ borderRadius: '1.5rem' }}>
          <div className="flex items-center justify-between mb-4">
            <Printer className={`h-8 w-8 ${textSecondary}`} />
            <div className={`w-3 h-3 rounded-full ${printerStats.online ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
          </div>
          <h3 className={`${textSecondary} text-sm font-medium uppercase tracking-wider mb-2`}>Printer Status</h3>
          <div className={`${textPrimary} text-2xl font-bold`}>
            {printerStats.online ? 'Online' : 'Offline'}
          </div>
        </div>

        <div className={`${cardBg} p-6 border shadow-lg hover:shadow-xl transition-all duration-300`}
          style={{ borderRadius: '1.5rem' }}>
          <div className="flex items-center justify-between mb-4">
            <FileText className={`h-8 w-8 ${textSecondary}`} />
            <span className="text-green-500 text-sm font-semibold">{printerStats.paperLevel}%</span>
          </div>
          <h3 className={`${textSecondary} text-sm font-medium uppercase tracking-wider mb-2`}>Paper Level</h3>
          <div className={`${textPrimary} text-2xl font-bold`}>{printerStats.paperLevel}%</div>
        </div>

        <div className={`${cardBg} p-6 border shadow-lg hover:shadow-xl transition-all duration-300`}
          style={{ borderRadius: '1.5rem' }}>
          <div className="flex items-center justify-between mb-4">
            <Calendar className={`h-8 w-8 ${textSecondary}`} />
            <span className="text-blue-500 text-sm font-semibold">+{printerStats.totalPrintedToday}</span>
          </div>
          <h3 className={`${textSecondary} text-sm font-medium uppercase tracking-wider mb-2`}>Today's Prints</h3>
          <div className={`${textPrimary} text-2xl font-bold`}>{printerStats.totalPrintedToday}</div>
        </div>

        <div className={`${cardBg} p-6 border shadow-lg hover:shadow-xl transition-all duration-300`}
          style={{ borderRadius: '1.5rem' }}>
          <div className="flex items-center justify-between mb-4">
            <AlertCircle className={`h-8 w-8 ${textSecondary}`} />
            <span className="text-red-500 text-sm font-semibold">{printerStats.failedPrintsToday}</span>
          </div>
          <h3 className={`${textSecondary} text-sm font-medium uppercase tracking-wider mb-2`}>Failed Prints</h3>
          <div className={`${textPrimary} text-2xl font-bold`}>{printerStats.failedPrintsToday}</div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className={`${cardBg} p-6 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${textSecondary}`} />
            <input
              type="text"
              placeholder="Search bills by ID, table, or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border ${inputBg} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className={`h-5 w-5 ${textSecondary}`} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`px-4 py-3 rounded-xl border ${inputBg} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="printed">Printed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Bills List */}
        <div className="space-y-4">
          {filteredBills.map((bill) => (
            <div
              key={bill.id}
              className={`${innerCardBg} p-6 border hover:scale-[1.01] transition-all duration-200 cursor-pointer`}
              style={{ borderRadius: '1rem' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selectedBills.includes(bill.id)}
                    onChange={() => toggleBillSelection(bill.id)}
                    className="w-4 h-4 rounded"
                  />
                  <div className={`w-16 h-16 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-xl flex items-center justify-center`}>
                    <span className={`${textPrimary} font-bold`}>{bill.id}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`${textPrimary} font-semibold text-lg`}>{bill.tableNumber}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(bill.status)}`}>
                        {bill.status}
                      </span>
                    </div>
                    <p className={`${textSecondary} text-sm mb-1`}>
                      Customer: {bill.customerName || "Walk-in"}
                    </p>
                    <p className={`${textSecondary} text-sm`}>
                      {bill.items.length} items • Order: {new Date(bill.orderTime).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span className={`${textPrimary} text-2xl font-bold`}>${bill.total.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleViewBill(bill)
                      }}
                      className="p-2 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
                      title="View Bill"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePrintBill(bill.id)
                      }}
                      className="p-2 rounded-lg hover:bg-green-500 hover:text-white transition-colors"
                      title="Print Bill"
                      disabled={bill.status === "printed"}
                    >
                      <Printer className="h-4 w-4" />
                    </button>
                    <button
                      className="p-2 rounded-lg hover:bg-gray-500 hover:text-white transition-colors"
                      title="More Options"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Bill Items Details */}
              <div className="mt-4 pt-4 border-t border-opacity-20" style={{ borderColor: isDark ? '#2a2a2a' : '#e5e7eb' }}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className={`${textSecondary} text-xs font-medium uppercase tracking-wider mb-2`}>Items</h4>
                    <div className="space-y-1">
                      {bill.items.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <span className={`${textPrimary} text-sm`}>
                            {item.quantity}x {item.name}
                          </span>
                          <span className={`${textSecondary} text-sm`}>
                            ${(item.quantity * item.price).toFixed(2)}
                          </span>
                        </div>
                      ))}
                      {bill.items.length > 3 && (
                        <span className={`${textSecondary} text-xs`}>
                          +{bill.items.length - 3} more items
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className={`${textSecondary} text-xs font-medium uppercase tracking-wider mb-2`}>Payment</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className={`${textPrimary} text-sm`}>Subtotal:</span>
                        <span className={`${textSecondary} text-sm`}>${bill.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`${textPrimary} text-sm`}>Tax:</span>
                        <span className={`${textSecondary} text-sm`}>${bill.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span className={`${textPrimary} text-sm`}>Total:</span>
                        <span className="text-green-500 text-sm">${bill.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredBills.length === 0 && (
          <div className="text-center py-12">
            <FileText className={`h-16 w-16 ${textSecondary} mx-auto mb-4`} />
            <h3 className={`${textPrimary} text-lg font-semibold mb-2`}>No bills found</h3>
            <p className={`${textSecondary}`}>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Selected Bills Actions */}
      {selectedBills.length > 0 && (
        <div className={`${cardBg} p-4 border shadow-lg fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50`}
          style={{ borderRadius: '1rem' }}>
          <div className="flex items-center gap-4">
            <span className={`${textPrimary} font-medium`}>
              {selectedBills.length} bill(s) selected
            </span>
            <div className="flex gap-2">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                <Printer className="h-4 w-4" />
                Print Selected
              </button>
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download
              </button>
              <button 
                onClick={() => setSelectedBills([])}
                className={`${innerCardBg} border px-4 py-2 rounded-lg ${textPrimary} hover:bg-red-500 hover:text-white transition-colors`}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}