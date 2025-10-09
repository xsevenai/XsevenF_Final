// app/dashboard/inventory-management/components/InventoryReports.tsx

"use client"

import React, { useState } from 'react'
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  DollarSign,
  Package,
  AlertTriangle,
  Loader2,
  RefreshCw
} from "lucide-react"
import { useTheme } from "@/hooks/useTheme"

interface InventoryReportsProps {
  reports: any
  stats: any
  loading: boolean
  error: string | null
  onGetInventorySummary: (locationId?: string) => Promise<any>
  onGetInventoryValuation: (locationId?: string, asOfDate?: string) => Promise<any>
  onGetInventoryTurnover: (periodDays?: number) => Promise<any>
  onGetWasteReport: (startDate: string, endDate: string) => Promise<any>
  onBack: () => void
}

export default function InventoryReports({
  reports,
  stats,
  loading,
  error,
  onGetInventorySummary,
  onGetInventoryValuation,
  onGetInventoryTurnover,
  onGetWasteReport,
  onBack
}: InventoryReportsProps) {
  const { isDark } = useTheme()
  const [activeReport, setActiveReport] = useState<string | null>(null)
  const [reportData, setReportData] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  })

  // Theme-aware styles
  const cardBg = isDark ? "bg-[#171717] border-[#2a2a2a]" : "bg-white border-gray-200"
  const textPrimary = isDark ? "text-white" : "text-gray-900"
  const textSecondary = isDark ? "text-gray-400" : "text-gray-600"
  const inputBg = isDark ? "bg-[#1f1f1f] border-[#2a2a2a]" : "bg-gray-50 border-gray-200"
  const buttonHoverBg = isDark ? "hover:bg-[#2a2a2a]" : "hover:bg-gray-100"

  const reportTypes = [
    {
      id: 'summary',
      title: 'Inventory Summary',
      description: 'Overview of total items, value, and alerts',
      icon: BarChart3,
      color: 'bg-blue-500'
    },
    {
      id: 'valuation',
      title: 'Inventory Valuation',
      description: 'Current inventory value and breakdown',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      id: 'turnover',
      title: 'Inventory Turnover',
      description: 'Analyze how quickly inventory moves',
      icon: TrendingUp,
      color: 'bg-purple-500'
    },
    {
      id: 'waste',
      title: 'Waste Report',
      description: 'Track waste and its cost impact',
      icon: AlertTriangle,
      color: 'bg-red-500'
    }
  ]

  const handleGenerateReport = async (reportType: string) => {
    setIsGenerating(true)
    setActiveReport(reportType)
    
    try {
      let data
      switch (reportType) {
        case 'summary':
          data = await onGetInventorySummary()
          break
        case 'valuation':
          data = await onGetInventoryValuation()
          break
        case 'turnover':
          data = await onGetInventoryTurnover(30)
          break
        case 'waste':
          data = await onGetWasteReport(dateRange.startDate, dateRange.endDate)
          break
        default:
          data = null
      }
      setReportData(data)
    } catch (error) {
      console.error('Failed to generate report:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const renderReportContent = () => {
    if (!reportData) return null

    switch (activeReport) {
      case 'summary':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`${isDark ? 'bg-[#1f1f1f]' : 'bg-gray-50'} p-4 rounded-lg`}>
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-5 w-5 text-blue-500" />
                  <span className={`${textSecondary} text-sm`}>Total Items</span>
                </div>
                <div className={`${textPrimary} text-2xl font-bold`}>
                  {reportData.total_items || stats.overview?.totalItems || 0}
                </div>
              </div>
              <div className={`${isDark ? 'bg-[#1f1f1f]' : 'bg-gray-50'} p-4 rounded-lg`}>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  <span className={`${textSecondary} text-sm`}>Total Value</span>
                </div>
                <div className={`${textPrimary} text-2xl font-bold`}>
                  ${(reportData.total_value || stats.overview?.totalValue || 0).toFixed(2)}
                </div>
              </div>
              <div className={`${isDark ? 'bg-[#1f1f1f]' : 'bg-gray-50'} p-4 rounded-lg`}>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <span className={`${textSecondary} text-sm`}>Low Stock Items</span>
                </div>
                <div className={`${textPrimary} text-2xl font-bold`}>
                  {reportData.low_stock_items || stats.overview?.lowStockCount || 0}
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'valuation':
        return (
          <div className="space-y-4">
            <div className={`${isDark ? 'bg-[#1f1f1f]' : 'bg-gray-50'} p-6 rounded-lg`}>
              <h3 className={`${textPrimary} font-semibold mb-4`}>Inventory Valuation</h3>
              <div className="text-center">
                <div className={`${textPrimary} text-4xl font-bold mb-2`}>
                  ${(reportData.total_value || 0).toFixed(2)}
                </div>
                <p className={`${textSecondary}`}>Total inventory value</p>
              </div>
            </div>
          </div>
        )
      
      case 'turnover':
        return (
          <div className="space-y-4">
            <div className={`${isDark ? 'bg-[#1f1f1f]' : 'bg-gray-50'} p-6 rounded-lg`}>
              <h3 className={`${textPrimary} font-semibold mb-4`}>Inventory Turnover Analysis</h3>
              <p className={`${textSecondary}`}>Turnover analysis will be displayed here</p>
            </div>
          </div>
        )
      
      case 'waste':
        return (
          <div className="space-y-4">
            <div className={`${isDark ? 'bg-[#1f1f1f]' : 'bg-gray-50'} p-6 rounded-lg`}>
              <h3 className={`${textPrimary} font-semibold mb-4`}>Waste Report</h3>
              <p className={`${textSecondary}`}>Waste analysis will be displayed here</p>
            </div>
          </div>
        )
      
      default:
        return null
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
              Inventory Reports
            </h1>
            <p className={`${textSecondary} transition-colors duration-300`}>
              Generate comprehensive inventory reports and analytics
            </p>
          </div>
        </div>
      </div>

      {/* Report Types */}
      <div className={`${cardBg} p-6 border shadow-lg transition-colors duration-300`} style={{ borderRadius: "1.5rem" }}>
        <h2 className={`text-xl font-semibold ${textPrimary} mb-4`}>Available Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportTypes.map((report) => (
            <div
              key={report.id}
              className={`${isDark ? 'bg-[#1f1f1f]' : 'bg-gray-50'} p-6 border rounded-xl transition-all duration-300 hover:shadow-lg cursor-pointer`}
              onClick={() => handleGenerateReport(report.id)}
            >
              <div className="flex items-start gap-4">
                <div className={`${report.color} p-3 rounded-lg`}>
                  <report.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className={`${textPrimary} font-semibold mb-2`}>{report.title}</h3>
                  <p className={`${textSecondary} text-sm mb-4`}>{report.description}</p>
                  <button
                    className={`${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535]' : 'bg-gray-200 hover:bg-gray-300'} ${textPrimary} px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2`}
                  >
                    {isGenerating && activeReport === report.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <FileText className="h-4 w-4" />
                    )}
                    Generate Report
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Date Range for Waste Report */}
      {activeReport === 'waste' && (
        <div className={`${cardBg} p-6 border shadow-lg transition-colors duration-300`} style={{ borderRadius: "1.5rem" }}>
          <h3 className={`text-lg font-semibold ${textPrimary} mb-4`}>Date Range</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block ${textPrimary} font-medium mb-2`}>Start Date</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className={`w-full px-3 py-2 ${inputBg} ${textPrimary} rounded-lg border focus:border-blue-500 focus:outline-none transition-all duration-200`}
              />
            </div>
            <div>
              <label className={`block ${textPrimary} font-medium mb-2`}>End Date</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className={`w-full px-3 py-2 ${inputBg} ${textPrimary} rounded-lg border focus:border-blue-500 focus:outline-none transition-all duration-200`}
              />
            </div>
          </div>
        </div>
      )}

      {/* Report Results */}
      {reportData && (
        <div className={`${cardBg} p-6 border shadow-lg transition-colors duration-300`} style={{ borderRadius: "1.5rem" }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-semibold ${textPrimary}`}>
              {reportTypes.find(r => r.id === activeReport)?.title} Results
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => handleGenerateReport(activeReport!)}
                className={`${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535]' : 'bg-gray-200 hover:bg-gray-300'} ${textPrimary} px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2`}
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
              <button
                className={`${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535]' : 'bg-gray-200 hover:bg-gray-300'} ${textPrimary} px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2`}
              >
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>
          
          {renderReportContent()}
        </div>
      )}

      {/* Quick Stats */}
      <div className={`${cardBg} p-6 border shadow-lg transition-colors duration-300`} style={{ borderRadius: "1.5rem" }}>
        <h2 className={`text-xl font-semibold ${textPrimary} mb-4`}>Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className={`${isDark ? 'bg-[#1f1f1f]' : 'bg-gray-50'} p-4 rounded-lg text-center`}>
            <div className={`${textPrimary} text-2xl font-bold mb-1`}>
              {stats.overview?.totalItems || 0}
            </div>
            <div className={`${textSecondary} text-sm`}>Total Items</div>
          </div>
          <div className={`${isDark ? 'bg-[#1f1f1f]' : 'bg-gray-50'} p-4 rounded-lg text-center`}>
            <div className={`${textPrimary} text-2xl font-bold mb-1`}>
              ${(stats.overview?.totalValue || 0).toFixed(2)}
            </div>
            <div className={`${textSecondary} text-sm`}>Total Value</div>
          </div>
          <div className={`${isDark ? 'bg-[#1f1f1f]' : 'bg-gray-50'} p-4 rounded-lg text-center`}>
            <div className={`${textPrimary} text-2xl font-bold mb-1`}>
              {stats.overview?.lowStockCount || 0}
            </div>
            <div className={`${textSecondary} text-sm`}>Low Stock</div>
          </div>
          <div className={`${isDark ? 'bg-[#1f1f1f]' : 'bg-gray-50'} p-4 rounded-lg text-center`}>
            <div className={`${textPrimary} text-2xl font-bold mb-1`}>
              {stats.overview?.activeAlerts || 0}
            </div>
            <div className={`${textSecondary} text-sm`}>Active Alerts</div>
          </div>
        </div>
      </div>
    </div>
  )
}
