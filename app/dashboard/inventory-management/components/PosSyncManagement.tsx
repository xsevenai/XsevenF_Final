// app/dashboard/inventory-management/components/PosSyncManagement.tsx

"use client"

import React, { useState, useEffect } from 'react'
import { 
  ArrowLeft, 
  RefreshCw, 
  Upload, 
  Download, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Loader2,
  Settings,
  Database
} from "lucide-react"
import { useTheme } from "@/hooks/useTheme"

interface PosSyncManagementProps {
  loading: boolean
  error: string | null
  onSyncFromPos: (posSystem: string) => Promise<any>
  onBack: () => void
}

export default function PosSyncManagement({
  loading,
  error,
  onSyncFromPos,
  onBack
}: PosSyncManagementProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedPosSystem, setSelectedPosSystem] = useState('')
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const [syncResults, setSyncResults] = useState<any>(null)
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
  const inputBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'

  const posSystems = [
    { id: 'square', name: 'Square POS', description: 'Sync with Square point of sale system' },
    { id: 'toast', name: 'Toast POS', description: 'Sync with Toast restaurant management system' },
    { id: 'clover', name: 'Clover POS', description: 'Sync with Clover point of sale system' },
    { id: 'lightspeed', name: 'Lightspeed', description: 'Sync with Lightspeed retail POS' },
    { id: 'shopify', name: 'Shopify POS', description: 'Sync with Shopify point of sale' },
    { id: 'custom', name: 'Custom Integration', description: 'Sync with custom POS system' }
  ]

  const handleSync = async () => {
    if (!selectedPosSystem) return
    
    setIsProcessing(true)
    try {
      const results = await onSyncFromPos(selectedPosSystem)
      setSyncResults(results)
      setLastSync(new Date())
    } catch (error) {
      console.error('POS sync failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={`flex items-center gap-3 ${textSecondary}`}>
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading POS sync settings...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className={`text-lg font-medium ${textPrimary} mb-2`}>Error Loading POS Sync</h3>
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
            <h1 className={`text-4xl font-bold ${textPrimary} mb-2`}>POS Sync Management</h1>
            <p className={`${textSecondary}`}>Synchronize inventory data with your point of sale system</p>
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`${cardBg} border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`} style={{ borderRadius: '2.5rem' }}>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-blue-500 font-semibold mb-2">Sync Status</h3>
                <div className={`text-2xl font-bold ${textPrimary}`}>Ready</div>
                <p className={`${textSecondary} text-sm mt-1`}>System is available</p>
              </div>
              <div className={`p-3 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-2xl`}>
                <Database className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </div>
        </div>
        
        <div className={`${cardBg} border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`} style={{ borderRadius: '1.5rem' }}>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-green-500 font-semibold mb-2">Last Sync</h3>
                <div className={`text-2xl font-bold ${textPrimary}`}>
                  {lastSync ? lastSync.toLocaleTimeString() : 'Never'}
                </div>
                <p className={`${textSecondary} text-sm mt-1`}>Most recent sync</p>
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
                <h3 className="text-purple-500 font-semibold mb-2">POS Systems</h3>
                <div className={`text-2xl font-bold ${textPrimary}`}>{posSystems.length}</div>
                <p className={`${textSecondary} text-sm mt-1`}>Supported systems</p>
              </div>
              <div className={`p-3 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-2xl`}>
                <Settings className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* POS System Selection */}
      <div className={`${cardBg} border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
        <div className="p-6">
          <h3 className={`text-xl font-semibold ${textPrimary} mb-4`}>Select POS System</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {posSystems.map((system) => (
              <div
                key={system.id}
                className={`${innerCardBg} border rounded-xl p-4 transition-all duration-300 hover:shadow-lg cursor-pointer ${
                  selectedPosSystem === system.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
                onClick={() => setSelectedPosSystem(system.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-lg`}>
                    <Database className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className={`${textPrimary} font-semibold`}>{system.name}</h4>
                    <p className={`${textSecondary} text-sm`}>{system.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <select
                value={selectedPosSystem}
                onChange={(e) => setSelectedPosSystem(e.target.value)}
                className={`px-4 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:border-blue-500 focus:outline-none transition-all duration-200`}
              >
                <option value="">Select a POS system</option>
                {posSystems.map((system) => (
                  <option key={system.id} value={system.id}>
                    {system.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleSync}
              disabled={!selectedPosSystem || isProcessing}
              className={`px-6 py-3 ${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535] border-[#3a3a3a]' : 'bg-gray-100 hover:bg-gray-200 border-gray-300'} ${textPrimary} rounded-xl font-medium transition-all duration-300 border shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {isProcessing ? 'Syncing...' : 'Sync Now'}
            </button>
          </div>
        </div>
      </div>

      {/* Sync Results */}
      {syncResults && (
        <div className={`${cardBg} border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
          <div className="p-6">
            <h3 className={`text-xl font-semibold ${textPrimary} mb-4`}>Sync Results</h3>
            <div className={`${innerCardBg} border rounded-xl p-4`}>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className={`${textSecondary}`}>Items Synced:</span>
                  <span className={`${textPrimary} font-medium`}>
                    {syncResults.items_synced || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={`${textSecondary}`}>New Items:</span>
                  <span className="text-green-500 font-medium">
                    {syncResults.new_items || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={`${textSecondary}`}>Updated Items:</span>
                  <span className="text-blue-500 font-medium">
                    {syncResults.updated_items || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={`${textSecondary}`}>Sync Duration:</span>
                  <span className={`${textPrimary} font-medium`}>
                    {syncResults.duration || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sync Information */}
      <div className={`${cardBg} border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
        <div className="p-6">
          <h3 className={`text-xl font-semibold ${textPrimary} mb-4`}>Sync Information</h3>
          <div className="space-y-4">
            <div className={`${innerCardBg} border rounded-xl p-4`}>
              <h4 className={`${textPrimary} font-medium mb-2`}>What Gets Synced</h4>
              <ul className={`${textSecondary} text-sm space-y-1`}>
                <li>• Inventory item quantities</li>
                <li>• Product information and pricing</li>
                <li>• Sales data and usage tracking</li>
                <li>• Stock adjustments and movements</li>
              </ul>
            </div>
            <div className={`${innerCardBg} border rounded-xl p-4`}>
              <h4 className={`${textPrimary} font-medium mb-2`}>Sync Frequency</h4>
              <p className={`${textSecondary} text-sm`}>
                Manual sync is available on-demand. Automatic sync can be configured for real-time updates.
              </p>
            </div>
            <div className={`${innerCardBg} border rounded-xl p-4`}>
              <h4 className={`${textPrimary} font-medium mb-2`}>Data Safety</h4>
              <p className={`${textSecondary} text-sm`}>
                All sync operations are logged and can be rolled back if needed. Your data is always backed up.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
