// app/dashboard/analytics-component/ExportData.tsx

"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Download, FileText, Database, Calendar, Filter, Loader2 } from "lucide-react"

export default function ExportData() {
  const [exportType, setExportType] = useState("orders")
  const [format, setFormat] = useState("json")
  const [timeRange, setTimeRange] = useState("30d")
  const [isExporting, setIsExporting] = useState(false)

  const exportTypes = [
    { value: "orders", label: "Orders Data", description: "Export all order information and analytics" },
    { value: "messages", label: "Messages Data", description: "Export customer messages and chat analytics" },
    { value: "combined", label: "Combined Data", description: "Export comprehensive analytics data" }
  ]

  const formats = [
    { value: "json", label: "JSON", description: "JavaScript Object Notation" },
    { value: "csv", label: "CSV", description: "Comma Separated Values" },
    { value: "xlsx", label: "Excel", description: "Microsoft Excel format" }
  ]

  const timeRanges = [
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 90 days" },
    { value: "1y", label: "Last year" }
  ]

  const handleExport = async () => {
    setIsExporting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real implementation, you would call your export API here
      const response = await fetch(`/api/analytics/${exportType}/export?period=${timeRange}&format=${format}`)
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `analytics-${exportType}-${timeRange}.${format}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Export Configuration */}
      <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Export Configuration</h3>
        
        {/* Data Type Selection */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-300 mb-3 block">Data Type</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {exportTypes.map((type) => (
              <div
                key={type.value}
                onClick={() => setExportType(type.value)}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                  exportType === type.value
                    ? "border-purple-500 bg-purple-500/10"
                    : "border-gray-600 hover:border-gray-500"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Database className="h-5 w-5 text-purple-400" />
                  <span className="font-medium text-white">{type.label}</span>
                </div>
                <p className="text-sm text-gray-400">{type.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Format Selection */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-300 mb-3 block">Export Format</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {formats.map((fmt) => (
              <div
                key={fmt.value}
                onClick={() => setFormat(fmt.value)}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                  format === fmt.value
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-gray-600 hover:border-gray-500"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="h-5 w-5 text-blue-400" />
                  <span className="font-medium text-white">{fmt.label}</span>
                </div>
                <p className="text-sm text-gray-400">{fmt.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Time Range Selection */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-300 mb-3 block">Time Range</label>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-gray-700/50 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {timeRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="h-5 w-5" />
              Export Data
            </>
          )}
        </button>
      </Card>

      {/* Export History */}
      <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Exports</h3>
        <div className="space-y-3">
          {[
            { type: "Orders", format: "CSV", date: "2024-01-15 14:30", size: "2.4 MB" },
            { type: "Messages", format: "JSON", date: "2024-01-14 09:15", size: "1.8 MB" },
            { type: "Combined", format: "Excel", date: "2024-01-13 16:45", size: "3.2 MB" }
          ].map((export_, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-white font-medium">{export_.type} Data - {export_.format}</p>
                  <p className="text-gray-400 text-sm">{export_.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-300 text-sm">{export_.size}</p>
                <button className="text-purple-400 hover:text-purple-300 text-sm">
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Export Guidelines */}
      <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Export Guidelines</h3>
        <div className="space-y-3 text-gray-300">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
            <p className="text-sm">Exported data includes all relevant analytics within the selected time range</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
            <p className="text-sm">CSV format is recommended for spreadsheet analysis</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
            <p className="text-sm">JSON format preserves complete data structure for programmatic use</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
            <p className="text-sm">Large datasets may take several minutes to generate</p>
          </div>
        </div>
      </Card>
    </div>
  )
}