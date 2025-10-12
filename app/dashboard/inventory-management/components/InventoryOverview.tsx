"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import CountUp from "react-countup"
import {
  Package,
  AlertTriangle,
  Scale,
  DollarSign,
  Loader2,
  Users,
  FileText,
} from "lucide-react"
import { useTheme } from "@/hooks/useTheme"
import type { InventoryItemWithMetrics } from "@/src/api/generated/models"

interface InventoryOverviewProps {
  stats: any
  loading: boolean
  error: string | null
  onRefresh: () => void
  inventoryItems: InventoryItemWithMetrics[]
  lowStockItems: InventoryItemWithMetrics[]
  activeAlerts: any[]
  onViewItems?: () => void
  onViewLowStock?: () => void
  onViewSuppliers?: () => void
  onViewPurchaseOrders?: () => void
}

export default function InventoryOverview({
  stats,
  loading,
  error,
  onRefresh,
  inventoryItems,
  lowStockItems,
  activeAlerts,
  onViewItems,
  onViewLowStock,
  onViewSuppliers,
  onViewPurchaseOrders,
}: InventoryOverviewProps) {
  const [mounted, setMounted] = useState(false)
  const { isLoaded: themeLoaded, isDark } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const metrics = React.useMemo(() => {
    const totalItems = inventoryItems.length
    const lowStockCount = lowStockItems.length
    const outOfStockCount = inventoryItems.filter(
      (item) => parseFloat(item.current_stock || "0") <= 0
    ).length
    const inStockCount = totalItems - lowStockCount - outOfStockCount
    const totalValue = inventoryItems.reduce((sum, item) => {
      const currentStock = parseFloat(item.current_stock || "0")
      const unitCost = parseFloat(item.unit_cost || "0")
      return sum + currentStock * unitCost
    }, 0)
    return {
      totalItems,
      inStockCount,
      lowStockCount,
      totalValue,
    }
  }, [inventoryItems, lowStockItems])

  if (!themeLoaded || !mounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  // Theme-aware styling
  const cardBase = isDark 
    ? "border border-gray-800 bg-[#121212]/80 backdrop-blur-lg shadow-[0_0_20px_rgba(0,0,0,0.3)] rounded-2xl transition-all duration-300"
    : "border border-gray-200 bg-white/80 backdrop-blur-lg shadow-[0_0_20px_rgba(0,0,0,0.1)] rounded-2xl transition-all duration-300"

  const textPrimary = isDark ? "text-white" : "text-gray-900"
  const textSecondary = isDark ? "text-gray-400" : "text-gray-600"
  const textTertiary = isDark ? "text-gray-500" : "text-gray-400"
  
  const actionCardBg = isDark 
    ? "bg-[#1a1a1a]/80 border border-gray-700 hover:border-gray-500" 
    : "bg-gray-50/80 border border-gray-200 hover:border-gray-400"
  
  const alertBg = isDark 
    ? "bg-red-900/20 border border-red-800" 
    : "bg-red-50 border border-red-200"
  
  const alertText = isDark ? "text-red-400" : "text-red-600"
  const alertContentBg = isDark 
    ? "bg-[#1a1a1a]/70 border border-gray-700" 
    : "bg-white border border-gray-200"

  const metricCard = (title: string, value: number, icon: JSX.Element, color: string) => (
    <motion.div
      whileHover={{ scale: 1.05, boxShadow: isDark ? `0 0 20px ${color}55` : `0 0 20px ${color}33` }}
      className={`${cardBase} p-6`}
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className={`text-sm font-medium ${textSecondary} mb-1`}>{title}</h3>
          <div className={`text-3xl font-bold ${textPrimary}`}>
            <CountUp end={value} duration={1.5} separator="," />
          </div>
        </div>
        <div 
          className="p-3 rounded-xl" 
          style={{ 
            backgroundColor: isDark ? `${color}22` : `${color}11`,
            border: isDark ? `1px solid ${color}33` : `1px solid ${color}22`
          }}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className={`h-6 w-6 animate-spin ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className={`text-lg font-medium ${textPrimary} mb-2`}>Error Loading Overview</h3>
        <p className={`${textSecondary} mb-4`}>{error}</p>
        <button
          onClick={onRefresh}
          className={`px-6 py-3 ${
            isDark 
              ? 'bg-gray-800 hover:bg-gray-700 text-white' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
          } rounded-xl font-medium transition-all duration-300`}
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-8"
    >
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCard("Total Items", metrics.totalItems, <Package className="text-blue-500" />, "#3b82f6")}
        {metricCard("In Stock", metrics.inStockCount, <Scale className="text-green-500" />, "#22c55e")}
        {metricCard("Low Stock", metrics.lowStockCount, <AlertTriangle className="text-yellow-500" />, "#eab308")}
        {metricCard("Total Value ($)", metrics.totalValue, <DollarSign className="text-purple-500" />, "#a855f7")}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className={`${cardBase} p-6`}
      >
        <h3 className={`text-lg font-semibold ${textPrimary} mb-4`}>Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "All Items", icon: <Package className="text-blue-500" />, action: onViewItems },
            { label: "Low Stock", icon: <AlertTriangle className="text-yellow-500" />, action: onViewLowStock },
            { label: "Suppliers", icon: <Users className="text-green-500" />, action: onViewSuppliers },
            { label: "Purchase Orders", icon: <FileText className="text-purple-500" />, action: onViewPurchaseOrders },
          ].map((a, i) => (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              key={i}
              onClick={a.action}
              className={`cursor-pointer ${actionCardBg} p-4 rounded-xl flex items-center gap-3 transition-colors`}
            >
              {a.icon}
              <span className={`${textPrimary} font-medium`}>{a.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Low Stock Alert */}
      {metrics.lowStockCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`${alertBg} shadow-lg p-6 rounded-2xl`}
        >
          <div className="flex items-start gap-4">
            <AlertTriangle className={`h-6 w-6 ${alertText} mt-1`} />
            <div className="flex-1">
              <h3 className={`${alertText} font-semibold mb-2`}>Low Stock Alert</h3>
              <p className={`${textPrimary} mb-3`}>
                {metrics.lowStockCount} item(s) are below their minimum stock levels.
              </p>
              <div className="space-y-2">
                {lowStockItems.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className={`flex justify-between items-center p-3 ${alertContentBg} rounded-xl`}
                  >
                    <span className={`${textPrimary} font-medium`}>{item.name}</span>
                    <span className={`${alertText} text-sm font-semibold`}>
                      {item.current_stock}/{item.min_stock} units
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}