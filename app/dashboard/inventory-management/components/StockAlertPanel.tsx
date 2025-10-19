// app/dashboard/inventory-management/components/StockAlertPanel.tsx

"use client"

import React, { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { useTheme } from "@/hooks/useTheme"
import { 
  AlertTriangle, 
  RefreshCw, 
  Plus, 
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Filter,
  Search,
  ArrowLeft,
  Loader2,
  Calendar,
  Clock,
  Bell,
  BellOff,
  Settings,
  ChevronDown,
  Users,
  Video,
  Mic,
  Wifi,
  Phone
} from "lucide-react"
import type { StockAlertCreate } from '@/src/api/generated/models/StockAlertCreate'
import { AlertType } from '@/src/api/generated/models/AlertType'
import StockAlertForm from './StockAlertForm'

interface StockAlertPanelProps {
  lowStockItems: any[]
  activeAlerts: any[]
  loading: boolean
  error: string | null
  onRefresh: () => void
  onCreateStockAlert: (alertData: StockAlertCreate) => Promise<any>
  onListStockAlerts: (isActive?: boolean, alertType?: string) => Promise<any>
  onUpdateStockAlert: (alertId: string, isActive: boolean) => Promise<any>
  onDeleteStockAlert: (alertId: string) => Promise<any>
  onBack: () => void
}

export default function StockAlertPanel({
  lowStockItems,
  activeAlerts,
  loading,
  error,
  onRefresh,
  onCreateStockAlert,
  onListStockAlerts,
  onUpdateStockAlert,
  onDeleteStockAlert,
  onBack
}: StockAlertPanelProps) {
  const [allAlerts, setAllAlerts] = useState<any[]>([])
  const [filteredAlerts, setFilteredAlerts] = useState<any[]>([])
  const [isCreatingAlert, setIsCreatingAlert] = useState(false)
  const [editingAlert, setEditingAlert] = useState<string | null>(null)
  const [deletingAlert, setDeletingAlert] = useState<string | null>(null)
  const [expandedView, setExpandedView] = useState<'create-alert' | 'edit-alert' | null>(null)
  const [alertToEdit, setAlertToEdit] = useState<any>(null)
  const [filterType, setFilterType] = useState<'all' | 'active' | 'inactive'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [mounted, setMounted] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<string>('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const { theme, isLoaded: themeLoaded, isDark, currentTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown && !(event.target as Element).closest('.dropdown-container')) {
        setActiveDropdown(null)
      }
    }

    // Prevent body scroll when dropdown is open
    if (activeDropdown) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [activeDropdown])

  useEffect(() => {
    if (businessId) {
    loadAllAlerts()
    }
  }, [])

  const businessId = typeof window !== "undefined" ? localStorage.getItem("businessId") || "" : ""

  const loadAllAlerts = async () => {
    try {
      const alerts = await onListStockAlerts()
      setAllAlerts(alerts || [])
      setFilteredAlerts(alerts || [])
    } catch (error) {
      console.error('Error loading alerts:', error)
    }
  }

  useEffect(() => {
    let filtered = allAlerts

    // Filter by type
    if (filterType === 'active') {
      filtered = filtered.filter(alert => alert.is_active)
    } else if (filterType === 'inactive') {
      filtered = filtered.filter(alert => !alert.is_active)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(alert => {
        const itemName = getItemDisplayName(alert.inventory_item_id).toLowerCase()
        const alertType = getAlertTypeLabel(alert.alert_type).toLowerCase()
        const searchLower = searchTerm.toLowerCase()
        
        return itemName.includes(searchLower) ||
               alertType.includes(searchLower) ||
               alert.inventory_item_id?.toLowerCase().includes(searchLower)
      })
    }

    // Sort the filtered results
    filtered = filtered.sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (sortBy) {
        case 'alert_type':
          aValue = getAlertTypeLabel(a.alert_type).toLowerCase()
          bValue = getAlertTypeLabel(b.alert_type).toLowerCase()
          break
        case 'threshold':
          aValue = parseFloat(a.threshold || '0')
          bValue = parseFloat(b.threshold || '0')
          break
        case 'status':
          aValue = a.is_active ? 'active' : 'inactive'
          bValue = b.is_active ? 'active' : 'inactive'
          break
        case 'created_at':
          aValue = new Date(a.created_at).getTime()
          bValue = new Date(b.created_at).getTime()
          break
        default:
          aValue = new Date(a.created_at).getTime()
          bValue = new Date(b.created_at).getTime()
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    setFilteredAlerts(filtered)
  }, [allAlerts, filterType, searchTerm, sortBy, sortOrder])

  if (!themeLoaded || !mounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  // Theme-based styling variables - matching other components
  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const innerCardBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'
  const inputBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'

  // Button styles matching other components
  const primaryButtonBg = isDark
    ? 'bg-white text-gray-900 hover:bg-gray-100 border-gray-300'
    : 'bg-gray-900 text-white hover:bg-gray-800 border-gray-700'

  const secondaryButtonBg = isDark
    ? 'bg-[#1f1f1f] text-gray-400 border-[#2a2a2a] hover:bg-[#2a2a2a]'
    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'

  const getAlertTypeColor = (alertType: string) => {
    switch (alertType) {
      case 'low_stock': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
      case 'out_of_stock': return 'bg-red-500/20 text-red-500 border-red-500/30'
      case 'expiring': return 'bg-orange-500/20 text-orange-500 border-orange-500/30'
      case 'overstocked': return 'bg-blue-500/20 text-blue-500 border-blue-500/30'
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500/30'
    }
  }

  const getAlertTypeLabel = (alertType: string) => {
    switch (alertType) {
      case 'low_stock': return 'Low Stock'
      case 'out_of_stock': return 'Out of Stock'
      case 'expiring': return 'Expiring'
      case 'overstocked': return 'Overstocked'
      default: return alertType
    }
  }

  const handleCreateAlert = async (alertData: StockAlertCreate) => {
    try {
      // Validate required fields
      if (!alertData.business_id) {
        throw new Error('Business ID is required')
      }
      if (!alertData.inventory_item_id) {
        throw new Error('Inventory item ID is required')
      }
      if (!alertData.alert_type) {
        throw new Error('Alert type is required')
      }
      
      setIsCreatingAlert(true)
      await onCreateStockAlert(alertData)
      await loadAllAlerts()
      setExpandedView(null)
    } catch (error) {
      console.error('Error creating alert:', error)
      alert(`Failed to create stock alert: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsCreatingAlert(false)
    }
  }

  const handleToggleAlert = async (alertId: string, isActive: boolean) => {
    try {
      setEditingAlert(alertId)
      await onUpdateStockAlert(alertId, isActive)
      await loadAllAlerts()
    } catch (error) {
      console.error('Error updating alert:', error)
      alert(`Failed to update stock alert: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setEditingAlert(null)
    }
  }

  const handleEditAlert = (alertId: string) => {
    const alert = allAlerts.find(a => a.id === alertId)
    if (alert) {
      setAlertToEdit(alert)
      setExpandedView('edit-alert')
    }
  }

  const handleUpdateAlert = async (alertId: string, alertData: StockAlertCreate) => {
    try {
      // For now, we'll delete the old alert and create a new one
      // since the API might not support full updates
      await onDeleteStockAlert(alertId)
      await onCreateStockAlert(alertData)
      await loadAllAlerts()
      setExpandedView(null)
      setAlertToEdit(null)
    } catch (error) {
      console.error('Error updating alert:', error)
      alert(`Failed to update stock alert: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleDeleteAlert = async (alertId: string) => {
    if (!confirm('Are you sure you want to delete this alert?')) return
    
    try {
      setDeletingAlert(alertId)
      await onDeleteStockAlert(alertId)
      await loadAllAlerts()
    } catch (error) {
      console.error('Error deleting alert:', error)
      alert(`Failed to delete stock alert: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setDeletingAlert(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getItemDisplayName = (itemId: string) => {
    // Try to find the item in the inventory items list
    const item = lowStockItems.find(item => item.id === itemId)
    if (item) {
      return `${item.name} (${item.category})`
    }
    
    // If not found, show a shortened ID with category hint
    const shortId = itemId.substring(0, 8) + '...'
    return `Inventory Item ${shortId}`
  }

  const handleBack = () => {
    setExpandedView(null)
    setAlertToEdit(null)
  }

  // Handle expanded view rendering (like InventoryItemList does)
  if (expandedView === 'create-alert') {
    return (
      <StockAlertForm
        onSubmit={handleCreateAlert}
        onCancel={handleBack}
        loading={isCreatingAlert}
        inventoryItems={lowStockItems}
      />
    )
  }

  if (expandedView === 'edit-alert' && alertToEdit) {
    return (
          <StockAlertForm
        onSubmit={(alertData) => handleUpdateAlert(alertToEdit.id, alertData)}
        onCancel={handleBack}
        loading={false}
            inventoryItems={lowStockItems}
        initialData={alertToEdit}
        isEdit={true}
      />
    )
  }

  if (loading && allAlerts.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={`flex items-center gap-3 ${textSecondary} transition-colors duration-300`}>
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading stock alerts...</span>
        </div>
      </div>
    )
  }

  // Don't show error if we have alerts loaded - the error might be from inventory items
  if (error && allAlerts.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className={`text-lg font-medium ${textPrimary} mb-2 transition-colors duration-300`}>Error Loading Stock Alerts</h3>
        <p className={`${textSecondary} mb-4 transition-colors duration-300`}>{error}</p>
            <button
          onClick={onRefresh}
          className={`${secondaryButtonBg} px-6 py-3 rounded-xl font-medium transition-all duration-300 border shadow-lg hover:shadow-xl hover:scale-105`}
            >
          Try Again
            </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`${cardBg} p-8 border shadow-lg transition-colors duration-300`} style={{ borderRadius: '1.5rem' }}>
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className={`${textSecondary} ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-200'} p-2 rounded-xl transition-all duration-200 hover:scale-110`}
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className={`text-4xl font-bold ${textPrimary} mb-2 transition-colors duration-300`}>Stock Alert Management</h1>
            <p className={`${textSecondary} transition-colors duration-300`}>Manage inventory alerts and notifications</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <button
              onClick={() => setExpandedView('create-alert')}
              className={`${primaryButtonBg} px-6 py-3 rounded-xl font-medium transition-all duration-300 border shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2`}
            >
              <Plus className="h-4 w-4" />
              Create Alert
            </button>
            <button
              onClick={loadAllAlerts}
              className={`${secondaryButtonBg} p-3 rounded-xl transition-all duration-200 hover:scale-110`}
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`${innerCardBg} rounded-xl p-1 transition-colors duration-300`}>
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filterType === 'all' 
                    ? `${isDark ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'} shadow-sm` 
                    : `${textSecondary} hover:${textPrimary}`
                }`}
              >
                All ({allAlerts.length})
              </button>
              <button
                onClick={() => setFilterType('active')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filterType === 'active' 
                    ? `${isDark ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'} shadow-sm` 
                    : `${textSecondary} hover:${textPrimary}`
                }`}
              >
                Active ({allAlerts.filter(a => a.is_active).length})
              </button>
              <button
                onClick={() => setFilterType('inactive')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filterType === 'inactive' 
                    ? `${isDark ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'} shadow-sm` 
                    : `${textSecondary} hover:${textPrimary}`
                }`}
              >
                Inactive ({allAlerts.filter(a => !a.is_active).length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Warning if inventory items failed to load */}
      {error && (
        <div className={`${cardBg} p-4 border border-yellow-500/30 bg-yellow-500/10 rounded-xl transition-colors duration-300`}>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <p className={`text-yellow-600 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
              Warning: Could not load inventory items. You can still manage existing alerts, but creating new alerts may require manual item ID entry.
            </p>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className={`${cardBg} p-6 border shadow-lg transition-colors duration-300`} style={{ borderRadius: '1.5rem' }}>
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${textSecondary} transition-colors duration-300`} />
              <input
                type="text"
              placeholder="Search alerts by item name, type, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 ${inputBg} ${textPrimary} border rounded-xl placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-all duration-200 transition-colors duration-300`}
              />
            </div>
        </div>
      </div>

      {/* Alerts Table */}
      {filteredAlerts.length === 0 ? (
        <div className={`${cardBg} border shadow-lg text-center py-12 transition-colors duration-300`} style={{ borderRadius: '1.5rem' }}>
          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className={`text-lg font-medium ${textPrimary} mb-2 transition-colors duration-300`}>No Alerts Found</h3>
          <p className={`${textSecondary} transition-colors duration-300`}>
            {searchTerm || filterType !== 'all' 
              ? 'No alerts match your current filters.' 
              : 'No stock alerts have been created yet.'}
          </p>
        </div>
      ) : (
      <div className={`${cardBg} border transition-colors duration-300 overflow-hidden`} style={{ borderTopLeftRadius: "1.5rem", borderTopRightRadius: "1.5rem" }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Table Header */}
              <thead>
                <tr className={`${isDark ? "border-b border-[#2a2a2a]" : "border-b border-gray-200"}`}>
                  <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                    Alert ID
                  </th>
                  <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                    Item Name
                  </th>
                  <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm relative dropdown-container`}>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === 'alert_type' ? null : 'alert_type')}
                        className="flex items-center gap-1 hover:text-white transition-colors"
                      >
                    Alert Type
                        <ChevronDown className={`h-3 w-3 transition-transform ${activeDropdown === 'alert_type' ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                    {activeDropdown === 'alert_type' && (
                      <div className={`absolute top-full left-0 mt-1 ${cardBg} border shadow-lg rounded-lg z-[9999] min-w-[200px]`}>
                        <div className="p-2">
                          <button
                            onClick={() => {
                              setSortBy('alert_type')
                              setSortOrder('asc')
                              setActiveDropdown(null)
                            }}
                            className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-100 ${textPrimary}`}
                          >
                            Sort A-Z
                          </button>
                          <button
                            onClick={() => {
                              setSortBy('alert_type')
                              setSortOrder('desc')
                              setActiveDropdown(null)
                            }}
                            className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-100 ${textPrimary}`}
                          >
                            Sort Z-A
                          </button>
                        </div>
                      </div>
                    )}
                  </th>
                  <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                    Threshold
                  </th>
                  <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                    Created
                  </th>
                  <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                    Actions
                  </th>
                </tr>
              </thead>
              
              {/* Table Body */}
            <tbody>
              {filteredAlerts.map((alert, index) => (
                <tr 
                  key={alert.id}
                  className={`${isDark ? "border-b border-[#2a2a2a] hover:bg-[#1f1f1f]" : "border-b border-gray-200 hover:bg-gray-50"} transition-colors duration-200`}
                >
                  {/* Alert ID */}
                  <td className="py-4 px-6">
                      <span className={`${textPrimary} font-medium text-sm`}>
                        {alert.id || `alert_${String(index + 1).padStart(3, '0')}`}
                      </span>
                  </td>
                  
                  {/* Item Name */}
                  <td className="py-4 px-6">
                    <div>
                      <div className={`${textPrimary} font-semibold text-sm`}>
                        {getItemDisplayName(alert.inventory_item_id)}
                      </div>
                      <div className={`${textSecondary} text-xs mt-1`}>
                        ID: {alert.inventory_item_id?.substring(0, 8)}...
                      </div>
                    </div>
                  </td>
                  
                  {/* Alert Type */}
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAlertTypeColor(alert.alert_type)}`}>
                      {getAlertTypeLabel(alert.alert_type)}
                    </span>
                  </td>
                  
                  {/* Threshold */}
                  <td className="py-4 px-6">
                    <span className={`${textPrimary} text-sm font-medium`}>
                      {alert.threshold || 'N/A'}
                    </span>
                  </td>
                  
                  {/* Created */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className={`${textSecondary} text-sm`}>
                        {formatDate(alert.created_at)}
                      </span>
                    </div>
                  </td>
                  
                  {/* Actions */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        className={`${textSecondary} hover:text-blue-400 p-1 transition-colors duration-300`}
                        title="Edit Alert"
                          onClick={() => handleEditAlert(alert.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        className={`${textSecondary} ${alert.is_active ? 'hover:text-green-400' : 'hover:text-gray-600'} p-1 transition-colors duration-300`}
                        title={alert.is_active ? 'Deactivate Alert' : 'Activate Alert'}
                        onClick={() => handleToggleAlert(alert.id, !alert.is_active)}
                        disabled={editingAlert === alert.id}
                      >
                        {editingAlert === alert.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : alert.is_active ? (
                          <Bell className="h-4 w-4" />
                        ) : (
                          <BellOff className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        className={`${textSecondary} hover:text-red-400 p-1 transition-colors duration-300`}
                        title="Delete Alert"
                          onClick={() => handleDeleteAlert(alert.id)}
                        disabled={deletingAlert === alert.id}
                      >
                        {deletingAlert === alert.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
          </div>
      )}
    </div>
  )
}
