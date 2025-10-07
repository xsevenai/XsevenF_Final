"use client"

import { useTheme } from "@/hooks/useTheme"
import { useState } from "react"
import { ShoppingCart, Grid, Clock, Plus } from "lucide-react"
import ProductCatalog from "./ProductCatalog"

interface Order {
  id: string
  tableNumber: string
  total: number
  status: "pending" | "completed" | "cancelled"
  orderTime: string
}

export default function PosInitial() {
  const { isDark } = useTheme()
  const [showCatalog, setShowCatalog] = useState(false)

  // Mock recent orders
  const [recentOrders] = useState<Order[]>([
    { id: "O001", tableNumber: "Table 5", total: 45.32, status: "pending", orderTime: "2025-10-07 14:30" },
    { id: "O002", tableNumber: "Table 12", total: 47.48, status: "completed", orderTime: "2025-10-07 13:45" },
    { id: "O003", tableNumber: "Table 3", total: 31.28, status: "completed", orderTime: "2025-10-07 13:15" },
  ])

  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const innerCardBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'

  const handleStartNewOrder = () => setShowCatalog(true)

  if (showCatalog) {
    return <ProductCatalog onBack={() => setShowCatalog(false)} />
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className={`${cardBg} p-8 border shadow-lg flex items-center justify-between`} style={{ borderRadius: '1.5rem' }}>
        <div>
          <h1 className={`text-4xl font-bold ${textPrimary} mb-2`}>Point of Sale</h1>
          <p className={`${textSecondary}`}>Quickly create orders and manage sales</p>
        </div>
        <button 
          onClick={handleStartNewOrder}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Start New Order
        </button>
      </div>

      {/* Quick Access Categories */}
      <div className={`${cardBg} p-6 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
        <h2 className={`${textPrimary} text-2xl font-semibold mb-4 flex items-center gap-2`}>
          <Grid className="h-5 w-5" />
          Quick Access Categories
        </h2>
        <div className="flex gap-3 flex-wrap">
          {["Burgers", "Pizza", "Salads", "Drinks", "Desserts"].map(cat => (
            <button
              key={cat}
              className={`${innerCardBg} border px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-500 hover:text-white transition-colors`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className={`${cardBg} p-6 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
        <h2 className={`${textPrimary} text-2xl font-semibold mb-4 flex items-center gap-2`}>
          <Clock className="h-5 w-5" />
          Recent Orders
        </h2>
        <div className="space-y-3">
          {recentOrders.map(order => (
            <div
              key={order.id}
              className={`${innerCardBg} p-4 border rounded-xl flex justify-between items-center hover:scale-[1.01] transition-all duration-200 cursor-pointer`}
            >
              <div>
                <h3 className={`${textPrimary} font-medium`}>{order.tableNumber}</h3>
                <p className={`${textSecondary} text-sm`}>
                  Order ID: {order.id} • {new Date(order.orderTime).toLocaleTimeString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
                <span className={`${textPrimary} font-bold`}>${order.total.toFixed(2)}</span>
              </div>
            </div>
          ))}
          {recentOrders.length === 0 && (
            <p className={`${textSecondary} text-center py-12`}>No recent orders found</p>
          )}
        </div>
      </div>

    </div>
  )
}
