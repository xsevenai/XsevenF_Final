// app/dashboard/inventory-management/components/StockAlertManagement.tsx

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
  Settings
} from "lucide-react"
import type { StockAlertCreate } from '@/src/api/generated/models/StockAlertCreate'
import { AlertType } from '@/src/api/generated/models/AlertType'

interface StockAlertManagementProps {
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

export default function StockAlertManagement({
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
}: StockAlertManagementProps) {
  const [allAlerts, setAllAlerts] = useState<any[]>([])
  const [filteredAlerts, setFilteredAlerts] = useState<any[]>([])
  const [isCreatingAlert, setIsCreatingAlert] = useState(false)
  const [editingAlert, setEditingAlert] = useState<string | null>(null)
  const [deletingAlert, setDeletingAlert] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<'all' | 'active' | 'inactive'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [mounted, setMounted] = useState(false)
  const { theme, isLoaded: themeLoaded, isDark, currentTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

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

    setFilteredAlerts(filtered)
  }, [allAlerts, filterType, searchTerm])

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
      setShowCreateForm(false)
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
    setShowEditForm(alertId)
  }

  const handleUpdateAlert = async (alertId: string, alertData: StockAlertCreate) => {
    try {
      // For now, we'll delete the old alert and create a new one
      // since the API might not support full updates
      await onDeleteStockAlert(alertId)
      await onCreateStockAlert(alertData)
      await loadAllAlerts()
      setShowEditForm(null)
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


  if (loading && allAlerts.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={`flex items-center gap-3 ${textSecondary}`}>
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
        <h3 className={`text-lg font-medium ${textPrimary} mb-2`}>Error Loading Stock Alerts</h3>
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
            <h1 className={`text-4xl font-bold ${textPrimary} mb-2`}>Stock Alert Management</h1>
            <p className={`${textSecondary}`}>Manage inventory alerts and notifications</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className={`px-6 py-3 ${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535] border-[#3a3a3a]' : 'bg-gray-100 hover:bg-gray-200 border-gray-300'} ${textPrimary} rounded-xl font-medium transition-all duration-300 border shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2`}
            >
              <Plus className="h-4 w-4" />
              Create Alert
            </button>
            <button
              onClick={loadAllAlerts}
              className={`p-3 ${textSecondary} ${buttonHoverBg} rounded-xl transition-all duration-200 hover:scale-110`}
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-100'} rounded-xl p-1`}>
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filterType === 'all' 
                    ? `${isDark ? 'bg-[#3a3a3a]' : 'bg-white'} ${textPrimary} shadow-sm` 
                    : `${textSecondary} hover:${textPrimary}`
                }`}
              >
                All ({allAlerts.length})
              </button>
              <button
                onClick={() => setFilterType('active')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filterType === 'active' 
                    ? `${isDark ? 'bg-[#3a3a3a]' : 'bg-white'} ${textPrimary} shadow-sm` 
                    : `${textSecondary} hover:${textPrimary}`
                }`}
              >
                Active ({allAlerts.filter(a => a.is_active).length})
              </button>
              <button
                onClick={() => setFilterType('inactive')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filterType === 'inactive' 
                    ? `${isDark ? 'bg-[#3a3a3a]' : 'bg-white'} ${textPrimary} shadow-sm` 
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
        <div className={`${cardBg} p-4 border border-yellow-500/30 bg-yellow-500/10 rounded-xl`}>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <p className={`text-yellow-600 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
              Warning: Could not load inventory items. You can still manage existing alerts, but creating new alerts may require manual item ID entry.
            </p>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className={`${cardBg} p-6 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${textSecondary}`} />
            <input
              type="text"
              placeholder="Search alerts by item name, type, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 ${isDark ? 'bg-[#2a2a2a] border-[#3a3a3a]' : 'bg-gray-50 border-gray-300'} ${textPrimary} border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200`}
            />
          </div>
        </div>
      </div>

      {/* Create Alert Form */}
      {showCreateForm && (
        <div className={`${cardBg} p-6 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
          <h3 className={`text-lg font-semibold ${textPrimary} mb-4`}>Create New Stock Alert</h3>
          <StockAlertForm
            inventoryItems={lowStockItems}
            onSubmit={handleCreateAlert}
            onCancel={() => setShowCreateForm(false)}
            loading={isCreatingAlert}
          />
        </div>
      )}

      {/* Edit Alert Form */}
      {showEditForm && (
        <div className={`${cardBg} p-6 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
          <h3 className={`text-lg font-semibold ${textPrimary} mb-4`}>Edit Stock Alert</h3>
          <StockAlertForm
            inventoryItems={lowStockItems}
            onSubmit={(alertData) => handleUpdateAlert(showEditForm, alertData)}
            onCancel={() => setShowEditForm(null)}
            loading={false}
            initialData={allAlerts.find(alert => alert.id === showEditForm)}
          />
        </div>
      )}

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className={`${cardBg} border shadow-lg text-center py-12`} style={{ borderRadius: '1.5rem' }}>
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className={`text-lg font-medium ${textPrimary} mb-2`}>No Alerts Found</h3>
            <p className={`${textSecondary}`}>
              {searchTerm || filterType !== 'all' 
                ? 'No alerts match your current filters.' 
                : 'No stock alerts have been created yet.'}
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert, index) => (
            <div key={alert.id} className={`${cardBg} border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01]`}
              style={{ 
                borderRadius: index % 3 === 0 ? '1.5rem' : index % 3 === 1 ? '2rem' : '1rem'
              }}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className={`${textPrimary} font-semibold text-lg`}>
                        {getItemDisplayName(alert.inventory_item_id)}
                      </h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getAlertTypeColor(alert.alert_type)}`}>
                        {getAlertTypeLabel(alert.alert_type)}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        alert.is_active 
                          ? 'bg-green-500/20 text-green-500 border-green-500/30' 
                          : 'bg-gray-500/20 text-gray-500 border-gray-500/30'
                      }`}>
                        {alert.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-sm">
                        <span className={textSecondary}>Threshold:</span>
                        <span className={`${textPrimary} font-medium`}>{alert.threshold || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className={textSecondary}>Item ID:</span>
                        <span className={`${textPrimary} font-mono text-xs`}>{alert.inventory_item_id.substring(0, 8)}...</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span className={textSecondary}>Created: {formatDate(alert.created_at)}</span>
                      </div>
                      {alert.updated_at && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span className={textSecondary}>Updated: {formatDate(alert.updated_at)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditAlert(alert.id)}
                      className={`p-2 text-blue-500 hover:text-blue-600 ${buttonHoverBg} rounded-lg transition-all duration-200 hover:scale-110`}
                      title="Edit Alert"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => handleToggleAlert(alert.id, !alert.is_active)}
                      disabled={editingAlert === alert.id}
                      className={`p-2 ${alert.is_active ? 'text-green-500 hover:text-green-600' : 'text-gray-500 hover:text-gray-600'} ${buttonHoverBg} rounded-lg transition-all duration-200 hover:scale-110 disabled:opacity-50`}
                      title={alert.is_active ? 'Deactivate Alert' : 'Activate Alert'}
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
                      onClick={() => handleDeleteAlert(alert.id)}
                      disabled={deletingAlert === alert.id}
                      className={`p-2 text-red-500 hover:text-red-600 ${buttonHoverBg} rounded-lg transition-all duration-200 hover:scale-110 disabled:opacity-50`}
                      title="Delete Alert"
                    >
                      {deletingAlert === alert.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// Stock Alert Form Component
interface StockAlertFormProps {
  inventoryItems: any[]
  onSubmit: (alertData: StockAlertCreate) => Promise<void>
  onCancel: () => void
  loading: boolean
  initialData?: any
}

function StockAlertForm({ inventoryItems, onSubmit, onCancel, loading, initialData }: StockAlertFormProps) {
  const [formData, setFormData] = useState<StockAlertCreate>({
    inventory_item_id: initialData?.inventory_item_id || '',
    alert_type: initialData?.alert_type || AlertType.LOW_STOCK,
    threshold: initialData?.threshold || 0,
    is_active: initialData?.is_active ?? true,
    business_id: typeof window !== "undefined" ? localStorage.getItem("businessId") || "" : ""
  })
  const { isDark } = useTheme()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.inventory_item_id || !formData.threshold || Number(formData.threshold) <= 0) {
      alert('Please fill in all required fields')
      return
    }
    
    await onSubmit(formData)
  }

  const selectedItem = inventoryItems.find(item => item.id === formData.inventory_item_id)

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
            Inventory Item *
          </label>
          {inventoryItems.length > 0 ? (
            <select
              value={formData.inventory_item_id}
              onChange={(e) => setFormData(prev => ({ ...prev, inventory_item_id: e.target.value }))}
              className={`w-full px-3 py-2 ${isDark ? 'bg-[#2a2a2a] border-[#3a3a3a]' : 'bg-white border-gray-300'} ${isDark ? 'text-white' : 'text-gray-900'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
              required
            >
              <option value="">Select an item...</option>
              {inventoryItems.map(item => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.current_stock} {item.unit})
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={formData.inventory_item_id}
              onChange={(e) => setFormData(prev => ({ ...prev, inventory_item_id: e.target.value }))}
              className={`w-full px-3 py-2 ${isDark ? 'bg-[#2a2a2a] border-[#3a3a3a]' : 'bg-white border-gray-300'} ${isDark ? 'text-white' : 'text-gray-900'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
              placeholder="Enter inventory item ID manually..."
              required
            />
          )}
          {inventoryItems.length === 0 && (
            <p className={`text-xs mt-1 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
              ⚠️ Inventory items could not be loaded. Please enter the item ID manually.
            </p>
          )}
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
            Alert Type *
          </label>
          <select
            value={formData.alert_type}
            onChange={(e) => setFormData(prev => ({ ...prev, alert_type: e.target.value as AlertType }))}
            className={`w-full px-3 py-2 ${isDark ? 'bg-[#2a2a2a] border-[#3a3a3a]' : 'bg-white border-gray-300'} ${isDark ? 'text-white' : 'text-gray-900'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
            required
          >
            <option value={AlertType.LOW_STOCK}>Low Stock</option>
            <option value={AlertType.OUT_OF_STOCK}>Out of Stock</option>
            <option value={AlertType.EXPIRING}>Expiring</option>
            <option value={AlertType.OVERSTOCKED}>Overstocked</option>
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
            Threshold *
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.threshold || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, threshold: e.target.value ? parseFloat(e.target.value) : null }))}
            className={`w-full px-3 py-2 ${isDark ? 'bg-[#2a2a2a] border-[#3a3a3a]' : 'bg-white border-gray-300'} ${isDark ? 'text-white' : 'text-gray-900'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
            placeholder="Enter threshold value"
            required
          />
          {selectedItem && (
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Current stock: {selectedItem.current_stock} {selectedItem.unit}
            </p>
          )}
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
            Status
          </label>
          <select
            value={formData.is_active ? 'active' : 'inactive'}
            onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.value === 'active' }))}
            className={`w-full px-3 py-2 ${isDark ? 'bg-[#2a2a2a] border-[#3a3a3a]' : 'bg-white border-gray-300'} ${isDark ? 'text-white' : 'text-gray-900'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>


      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className={`px-6 py-2 ${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535] border-[#3a3a3a]' : 'bg-gray-100 hover:bg-gray-200 border-gray-300'} ${isDark ? 'text-white' : 'text-gray-900'} border rounded-lg font-medium transition-all duration-200`}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-2 ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 flex items-center gap-2`}
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? 'Creating...' : 'Create Alert'}
        </button>
      </div>
    </form>
  )
}
