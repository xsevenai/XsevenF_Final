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
import type { InventoryItemWithMetrics } from '@/src/api/generated/models/InventoryItemWithMetrics'

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
  onViewReports?: () => void
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
  onViewReports,
}: InventoryOverviewProps) {
  const { isDark } = useTheme()

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

  // Theme-aware styling
  const cardBase = isDark 
    ? "border border-gray-800 bg-gray-900/90 backdrop-blur-lg shadow-lg rounded-xl"
    : "border border-gray-200 bg-white/90 backdrop-blur-lg shadow-lg rounded-xl"

  const textPrimary = isDark ? "text-white" : "text-gray-900"
  const textSecondary = isDark ? "text-gray-400" : "text-gray-600"
  
  const actionCardBg = isDark 
    ? "bg-gray-800/80 border border-gray-700 hover:border-gray-500" 
    : "bg-gray-50/80 border border-gray-200 hover:border-gray-400"
  
  const alertBg = isDark 
    ? "bg-red-900/20 border border-red-800" 
    : "bg-red-50 border border-red-200"
  
  const alertText = isDark ? "text-red-400" : "text-red-600"
  const alertContentBg = isDark 
    ? "bg-gray-800/70 border border-gray-700" 
    : "bg-white border border-gray-200"

  const metricCard = (title: string, value: number, icon: React.ReactElement, color: string) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
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
            backgroundColor: isDark ? `${color}20` : `${color}10`,
            border: isDark ? `1px solid ${color}30` : `1px solid ${color}20`
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
          } rounded-xl font-medium transition-colors`}
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCard("Total Items", metrics.totalItems, <Package className="text-blue-500" />, "#3b82f6")}
        {metricCard("In Stock", metrics.inStockCount, <Scale className="text-green-500" />, "#22c55e")}
        {metricCard("Low Stock", metrics.lowStockCount, <AlertTriangle className="text-yellow-500" />, "#eab308")}
        {metricCard("Total Value ($)", metrics.totalValue, <DollarSign className="text-purple-500" />, "#a855f7")}
      </div>

      {/* Quick Actions */}
      <div className={`${cardBase} p-6`}>
        <h3 className={`text-lg font-semibold ${textPrimary} mb-4`}>Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "All Items", icon: <Package className="text-blue-500" />, action: onViewItems },
            { label: "Low Stock", icon: <AlertTriangle className="text-yellow-500" />, action: onViewLowStock },
            { label: "Suppliers", icon: <Users className="text-green-500" />, action: onViewSuppliers },
            { label: "Purchase Orders", icon: <FileText className="text-purple-500" />, action: onViewPurchaseOrders },
          ].map((a, i) => (
            <div
              key={i}
              onClick={a.action}
              className={`cursor-pointer ${actionCardBg} p-4 rounded-xl flex items-center gap-3 transition-colors hover:scale-105`}
            >
              {a.icon}
              <span className={`${textPrimary} font-medium`}>{a.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Low Stock Alert */}
      {metrics.lowStockCount > 0 && (
        <div className={`${alertBg} p-6 rounded-xl`}>
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
                      {item.current_stock || "0"}/{item.min_stock || "0"} units
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}