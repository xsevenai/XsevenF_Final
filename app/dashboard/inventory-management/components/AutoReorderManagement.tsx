// app/dashboard/inventory-management/components/AutoReorderManagement.tsx

"use client"

import React, { useState, useEffect } from 'react'
import { 
  ArrowLeft, 
  Settings, 
  RefreshCw, 
  Play, 
  Pause, 
  AlertTriangle,
  Package,
  Loader2,
  CheckCircle,
  Clock
} from "lucide-react"
import { useTheme } from "@/hooks/useTheme"

interface AutoReorderManagementProps {
  loading: boolean
  error: string | null
  onTriggerAutoReorder: (dryRun?: boolean) => Promise<any>
  onBack: () => void
}

export default function AutoReorderManagement({
  loading,
  error,
  onTriggerAutoReorder,
  onBack
}: AutoReorderManagementProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [lastRun, setLastRun] = useState<Date | null>(null)
  const [dryRunResults, setDryRunResults] = useState<any>(null)
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
  const buttonHoverBg = isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-100'
  const innerCardBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'

  const handleDryRun = async () => {
    setIsProcessing(true)
    try {
      const results = await onTriggerAutoReorder(true)
      setDryRunResults(results)
    } catch (error) {
      console.error('Dry run failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleExecuteReorder = async () => {
    setIsProcessing(true)
    try {
      await onTriggerAutoReorder(false)
      setLastRun(new Date())
      setDryRunResults(null)
    } catch (error) {
      console.error('Auto-reorder failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={`flex items-center gap-3 ${textSecondary}`}>
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading auto-reorder settings...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className={`text-lg font-medium ${textPrimary} mb-2`}>Error Loading Auto-Reorder</h3>
        <p className={`${textSecondary} mb-4`}>{error}</p>
        <button
          onClick={onBack}
          className={`px-6 py-3 ${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535] border-[#3a3a3a]' : 'bg-gray-100 hover:bg-gray-200 border-gray-300'} ${textPrimary} rounded-xl font-medium transition-all duration-300 border shadow-lg hover:shadow-xl hover:scale-105`}
        >
          Go Back
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
            <h1 className={`text-4xl font-bold ${textPrimary} mb-2`}>Auto-Reorder Management</h1>
            <p className={`${textSecondary}`}>Automatically manage inventory reordering based on stock levels</p>
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`${cardBg} border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`} style={{ borderRadius: '2.5rem' }}>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-blue-500 font-semibold mb-2">Auto-Reorder Status</h3>
                <div className={`text-2xl font-bold ${textPrimary}`}>Active</div>
                <p className={`${textSecondary} text-sm mt-1`}>System is monitoring</p>
              </div>
              <div className={`p-3 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-2xl`}>
                <Settings className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </div>
        </div>
        
        <div className={`${cardBg} border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`} style={{ borderRadius: '1.5rem' }}>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-green-500 font-semibold mb-2">Last Run</h3>
                <div className={`text-2xl font-bold ${textPrimary}`}>
                  {lastRun ? lastRun.toLocaleTimeString() : 'Never'}
                </div>
                <p className={`${textSecondary} text-sm mt-1`}>Most recent execution</p>
              </div>
              <div className={`p-3 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-2xl`}>
                <Clock className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </div>
        </div>
        
        <div className={`${cardBg} border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`} style={{ borderRadius: '1rem' }}>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-purple-500 font-semibold mb-2">Items Monitored</h3>
                <div className={`text-2xl font-bold ${textPrimary}`}>All</div>
                <p className={`${textSecondary} text-sm mt-1`}>Tracked items</p>
              </div>
              <div className={`p-3 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-2xl`}>
                <Package className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className={`${cardBg} border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
        <div className="p-6">
          <h3 className={`text-xl font-semibold ${textPrimary} mb-4`}>Auto-Reorder Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleDryRun}
              disabled={isProcessing}
              className={`${innerCardBg} border p-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-lg`}>
                  <Play className="h-5 w-5 text-blue-500" />
                </div>
                <h4 className={`${textPrimary} font-semibold`}>Test Run (Dry Run)</h4>
              </div>
              <p className={`${textSecondary} text-sm mb-4`}>
                Simulate auto-reorder without making actual changes
              </p>
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className={`${textSecondary} text-sm`}>Running...</span>
                </div>
              ) : (
                <span className="text-blue-500 text-sm font-medium">Run Test</span>
              )}
            </button>

            <button
              onClick={handleExecuteReorder}
              disabled={isProcessing}
              className={`${innerCardBg} border p-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-lg`}>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <h4 className={`${textPrimary} font-semibold`}>Execute Auto-Reorder</h4>
              </div>
              <p className={`${textSecondary} text-sm mb-4`}>
                Run auto-reorder and create purchase orders
              </p>
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className={`${textSecondary} text-sm`}>Processing...</span>
                </div>
              ) : (
                <span className="text-green-500 text-sm font-medium">Execute Now</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Dry Run Results */}
      {dryRunResults && (
        <div className={`${cardBg} border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
          <div className="p-6">
            <h3 className={`text-xl font-semibold ${textPrimary} mb-4`}>Dry Run Results</h3>
            <div className={`${innerCardBg} border rounded-xl p-4`}>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className={`${textSecondary}`}>Items to Reorder:</span>
                  <span className={`${textPrimary} font-medium`}>
                    {dryRunResults.items_to_reorder || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={`${textSecondary}`}>Estimated Cost:</span>
                  <span className="text-green-500 font-medium">
                    ${dryRunResults.estimated_cost || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={`${textSecondary}`}>Purchase Orders:</span>
                  <span className={`${textPrimary} font-medium`}>
                    {dryRunResults.purchase_orders || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings */}
      <div className={`${cardBg} border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
        <div className="p-6">
          <h3 className={`text-xl font-semibold ${textPrimary} mb-4`}>Auto-Reorder Settings</h3>
          <div className="space-y-4">
            <div className={`${innerCardBg} border rounded-xl p-4`}>
              <h4 className={`${textPrimary} font-medium mb-2`}>Threshold Settings</h4>
              <p className={`${textSecondary} text-sm`}>
                Items are automatically reordered when stock falls below minimum threshold
              </p>
            </div>
            <div className={`${innerCardBg} border rounded-xl p-4`}>
              <h4 className={`${textPrimary} font-medium mb-2`}>Frequency</h4>
              <p className={`${textSecondary} text-sm`}>
                Auto-reorder runs daily at 6:00 AM
              </p>
            </div>
            <div className={`${innerCardBg} border rounded-xl p-4`}>
              <h4 className={`${textPrimary} font-medium mb-2`}>Notifications</h4>
              <p className={`${textSecondary} text-sm`}>
                Email notifications sent for all auto-reorder actions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
